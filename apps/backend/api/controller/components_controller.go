package controller

import (
	"encoding/json"
	"fmt"
	"net/http"
	"pc-builder/backend/api/models"
	"pc-builder/backend/db"
	"pc-builder/backend/utils"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
)

type PaginatedComponentResponse struct {
	Components []models.Component     `json:"components"`
	Pagination utils.PaginationMeta   `json:"pagination"`
	Filters    utils.ComponentFilter  `json:"filters"`
	Summary    utils.ComponentSummary `json:"summary"`
}

type ComponentRequest struct {
	ID       string                 `json:"id" binding:"required"`
	Name     string                 `json:"name" binding:"required"`
	Category string                 `json:"category" binding:"required"`
	Brand    string                 `json:"brand" binding:"required"`
	Models   string                 `json:"models"`
	Specs    map[string]interface{} `json:"specs"`
	Price    models.Price           `json:"price"`
	ImageURL models.ImageURL        `json:"image_url"`
}

type BulkComponentRequest struct {
	Components []ComponentRequest `json:"components" binding:"required,min=1,max=100"`
}

type ComponentResult struct {
	ID      string `json:"id"`
	Success bool   `json:"success"`
	Message string `json:"message"`
	Error   string `json:"error,omitempty"`
}

type BulkCreateResponse struct {
	TotalRequested int               `json:"total_requested"`
	TotalCreated   int               `json:"total_created"`
	TotalFailed    int               `json:"total_failed"`
	Results        []ComponentResult `json:"results"`
}

func validateComponentRequest(request ComponentRequest) error {
	category := strings.ToUpper(strings.TrimSpace(request.Category))

	validCategories := map[string]bool{
		"CPU":       true,
		"GPU":       true,
		"MAINBOARD": true,
		"RAM":       true,
		"STORAGE":   true,
		"PSU":       true,
	}

	if !validCategories[category] {
		return fmt.Errorf("invalid category. Must be one of: CPU, GPU, Mainboard, RAM, Storage, PSU")
	}

	if err := utils.ValidatePrice(request.Price); err != nil {
		return fmt.Errorf("invalid price information: %v", err)
	}

	return nil
}

func createComponentFromRequest(request ComponentRequest) (*models.Component, error) {
	category := strings.ToUpper(strings.TrimSpace(request.Category))

	var specsRaw json.RawMessage
	if request.Specs != nil {
		typedSpecs, err := utils.ValidateSpecsByCategory(category, request.Specs)
		if err != nil {
			return nil, fmt.Errorf("invalid specifications for category %s: %v", category, err)
		}

		if err := typedSpecs.Validate(); err != nil {
			return nil, fmt.Errorf("specification validation failed: %v", err)
		}

		specsRaw, err = json.Marshal(request.Specs)
		if err != nil {
			return nil, fmt.Errorf("failed to process specifications: %v", err)
		}
	}

	component := &models.Component{
		ID:        strings.TrimSpace(request.ID),
		Name:      strings.TrimSpace(request.Name),
		Category:  category,
		Brand:     strings.TrimSpace(request.Brand),
		Models:    strings.TrimSpace(request.Models),
		Specs:     specsRaw,
		Price:     request.Price,
		ImageURL:  request.ImageURL,
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}

	return component, nil
}

func CreateComponent(c *gin.Context) {
	var request ComponentRequest

	if err := c.ShouldBindJSON(&request); err != nil {
		utils.BadRequestError(c, "Invalid request body", err)
		return
	}

	if err := validateComponentRequest(request); err != nil {
		utils.BadRequestError(c, "Validation failed", err)
		return
	}

	component, err := createComponentFromRequest(request)
	if err != nil {
		utils.BadRequestError(c, "Failed to create component", err)
		return
	}

	result := db.DB.Create(&component)
	if result.Error != nil {
		if strings.Contains(result.Error.Error(), "duplicate key") {
			utils.ConflictError(c, "Component with this ID already exists")
			return
		}

		utils.InternalServerError(c, "Failed to create component", result.Error)
		return
	}

	utils.SuccessResponse(c, "Component created successfully", component)
}

func BulkCreateComponents(c *gin.Context) {
	var request BulkComponentRequest

	if err := c.ShouldBindJSON(&request); err != nil {
		utils.BadRequestError(c, "Invalid request body", err)
		return
	}

	// Limit components amount
	if len(request.Components) == 0 {
		utils.BadRequestError(c, "At least one component is required", nil)
		return
	}

	if len(request.Components) > 100 {
		utils.BadRequestError(c, "Maximum 100 components can be created at once", nil)
		return
	}

	var results []ComponentResult
	var componentsToCreate []*models.Component
	totalRequested := len(request.Components)
	totalCreated := 0
	totalFailed := 0

	for _, componentReq := range request.Components {
		result := ComponentResult{
			ID:      componentReq.ID,
			Success: false,
		}

		if err := validateComponentRequest(componentReq); err != nil {
			result.Error = err.Error()
			result.Message = "Validation failed"
			results = append(results, result)
			totalFailed++
			continue
		}

		component, err := createComponentFromRequest(componentReq)
		if err != nil {
			result.Error = err.Error()
			result.Message = "Failed to process component"
			results = append(results, result)
			totalFailed++
			continue
		}

		componentsToCreate = append(componentsToCreate, component)
		results = append(results, result)
	}

	if len(componentsToCreate) > 0 {
		tx := db.DB.Begin()

		for _, component := range componentsToCreate {
			resultIndex := -1
			for j, result := range results {
				if result.ID == component.ID && !result.Success && result.Error == "" {
					resultIndex = j
					break
				}
			}

			if resultIndex == -1 {
				continue
			}

			if err := tx.Create(component).Error; err != nil {
				if strings.Contains(err.Error(), "duplicate key") {
					results[resultIndex].Error = "Component with this ID already exists"
					results[resultIndex].Message = "Duplicate ID"
				} else {
					results[resultIndex].Error = err.Error()
					results[resultIndex].Message = "Database error"
				}
				totalFailed++
			} else {
				results[resultIndex].Success = true
				results[resultIndex].Message = "Created successfully"
				totalCreated++
			}
		}

		if err := tx.Commit().Error; err != nil {
			tx.Rollback()
			for i := range results {
				if results[i].Success {
					results[i].Success = false
					results[i].Message = "Transaction failed"
					results[i].Error = "Failed to commit transaction"
					totalCreated--
					totalFailed++
				}
			}
		}
	}

	response := BulkCreateResponse{
		TotalRequested: totalRequested,
		TotalCreated:   totalCreated,
		TotalFailed:    totalFailed,
		Results:        results,
	}

	status := http.StatusCreated
	if totalCreated == 0 {
		status = http.StatusBadRequest
	} else if totalFailed > 0 {
		status = http.StatusMultiStatus // 207 - some succeeded, some failed
	}

	c.JSON(status, gin.H{
		"status":   status,
		"message":  fmt.Sprintf("Bulk creation completed: %d created, %d failed", totalCreated, totalFailed),
		"response": response,
	})
}

func GetAllComponents(c *gin.Context) {
	var components []models.Component
	query := db.DB.Model(&models.Component{})
	query = query.Select("id, name, category, brand, models, price, image_url, created_at, updated_at")
	err := query.Find(&components).Error
	if err != nil {
		utils.InternalServerError(c, "Failed to fetch components", err)
		return
	}

	utils.SuccessResponse(c, "Components fetched successfully", components)
}

func GetComponentByID(c *gin.Context) {
	id := c.Param("id")
	var component models.Component

	err := db.DB.Where("id = ?", id).First(&component).Error
	if err != nil {
		utils.NotFoundError(c, "Component not found")
		return
	}

	utils.SuccessResponse(c, "Component fetched successfully", component)
}

func GetComponentsWithPagination(c *gin.Context) {
	pagination := utils.PaginationParams{
		Page:     1,
		PageSize: 10,
	}

	if err := c.ShouldBindQuery(&pagination); err != nil {
		utils.BadRequestError(c, "Invalid pagination parameters", err)
		return
	}

	if pagination.Page < 1 {
		pagination.Page = 1
	}
	if pagination.PageSize < 1 || pagination.PageSize > 100 {
		pagination.PageSize = 10
	}

	var filters utils.ComponentFilter
	if err := c.ShouldBindQuery(&filters); err != nil {
		utils.BadRequestError(c, "Invalid filter parameters", err)
		return
	}

	if filters.SortBy == "" {
		filters.SortBy = "created_at"
	}
	if filters.SortOrder == "" {
		filters.SortOrder = "desc"
	}

	query := db.DB.Model(&models.Component{})

	query = utils.ApplyComponentFilters(query, filters)

	var totalRecords int64
	if err := query.Count(&totalRecords).Error; err != nil {
		utils.InternalServerError(c, "Failed to count records", err)
		return
	}

	totalPages := int((totalRecords + int64(pagination.PageSize) - 1) / int64(pagination.PageSize))
	offset := (pagination.Page - 1) * pagination.PageSize

	query = utils.ApplyComponentSorting(query, filters)
	query = query.Offset(int(offset)).Limit(pagination.PageSize)
	query = query.Select("id, name, category, brand, models, price, image_url, created_at, updated_at")

	var components []models.Component
	if err := query.Find(&components).Error; err != nil {
		utils.InternalServerError(c, "Failed to fetch components", err)
		return
	}

	paginationMeta := utils.PaginationMeta{
		CurrentPage:  pagination.Page,
		PageSize:     pagination.PageSize,
		TotalRecords: totalRecords,
		TotalPages:   totalPages,
	}

	summary := utils.GetComponentSummary(filters)

	response := PaginatedComponentResponse{
		Components: components,
		Pagination: paginationMeta,
		Filters:    filters,
		Summary:    summary,
	}

	utils.SuccessResponse(c, "Components fetched successfully", response)
}

func GetAvailableFilters(c *gin.Context) {
	filters := utils.GetAvailableFilterOptions(c.GetHeader("Accept-Language"))
	if filters == nil {
		utils.InternalServerError(c, "Failed to fetch available filters", nil)
		return
	}

	utils.SuccessResponse(c, "Available filters fetched successfully", filters)
}

func UpdateComponent(c *gin.Context) {
	id := c.Param("id")

	var component models.Component
	err := db.DB.Where("id = ?", id).First(&component).Error
	if err != nil {
		utils.NotFoundError(c, "Component not found")
		return
	}

	var updatedComponent models.Component
	if err := c.ShouldBindJSON(&updatedComponent); err != nil {
		utils.BadRequestError(c, "Invalid request body", err)
		return
	}

	result := db.DB.Model(&component).Updates(&updatedComponent)
	if result.Error != nil {
		utils.InternalServerError(c, "Failed to update component", result.Error)
		return
	}

	utils.SuccessResponse(c, "Component updated successfully", component)
}

func DeleteComponent(c *gin.Context) {
	id := c.Param("id")
	var component models.Component

	err := db.DB.Where("id = ?", id).First(&component).Error
	if err != nil {
		utils.NotFoundError(c, "Component not found")
		return
	}

	result := db.DB.Delete(&component)
	if result.Error != nil {
		utils.InternalServerError(c, "Failed to delete component", result.Error)
		return
	}

	utils.SuccessResponse(c, "Component deleted successfully", nil)
}
