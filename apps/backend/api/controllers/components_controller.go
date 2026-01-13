package controllers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"pc-builder/backend/api/models"
	"pc-builder/backend/api/repositories"
	"pc-builder/backend/utils"
	"slices"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type ComponentController struct {
	repo *repositories.ComponentRepository
	db   *gorm.DB
}

func NewComponentController(db *gorm.DB) *ComponentController {
	return &ComponentController{
		repo: repositories.NewComponentRepository(db),
		db:   db,
	}
}

func (ctrl *ComponentController) GetComponentsWithPagination(c *gin.Context) {
	var pagination repositories.PaginationParams
	pagination.Page = 1
	pagination.PageSize = 12

	if page, err := strconv.Atoi(c.Query("page")); err == nil && page > 0 {
		pagination.Page = page
	}

	if pageSize, err := strconv.Atoi(c.Query("page_size")); err == nil && pageSize > 0 && pageSize <= 100 {
		pagination.PageSize = pageSize
	}

	var filters repositories.ComponentFilter

	if minPrice, err := strconv.ParseFloat(c.Query("min_price"), 64); err == nil && minPrice >= 0 {
		filters.MinPrice = minPrice
	}

	if maxPrice, err := strconv.ParseFloat(c.Query("max_price"), 64); err == nil && maxPrice >= 0 {
		filters.MaxPrice = maxPrice
	}

	if categoryIDsParam := c.Query("category_id"); categoryIDsParam != "" {
		filters.CategoryIDs = strings.Split(categoryIDsParam, ",")
		for i := range filters.CategoryIDs {
			filters.CategoryIDs[i] = strings.TrimSpace(filters.CategoryIDs[i])
		}
	}

	if brandIDsParam := c.Query("brand_id"); brandIDsParam != "" {
		filters.BrandIDs = strings.Split(brandIDsParam, ",")
		for i := range filters.BrandIDs {
			filters.BrandIDs[i] = strings.TrimSpace(filters.BrandIDs[i])
		}
	}

	filters.PrimaryBrandOnly = c.Query("primary_brand_only") == "true"
	filters.Search = c.Query("search")
	filters.SortBy = c.Query("sort_by")
	filters.SortOrder = c.Query("sort_order")
	filters.Currency = c.Query("currency")

	// Parse spec filters
	filters.Specs = make(map[string]string)
	specKeys := []string{"socket", "form_factor", "memory_type", "storage_type", "interface", "generation", "process_size"}
	for _, key := range specKeys {
		if value := c.Query(key); value != "" {
			filters.Specs[key] = value
		}
	}

	// Set default values
	if filters.SortBy == "" {
		filters.SortBy = "created_at"
	}
	if filters.SortOrder == "" {
		filters.SortOrder = "desc"
	}

	response, err := ctrl.repo.GetComponentsWithFilters(filters, pagination)
	if err != nil {
		utils.InternalServerError(c, "Failed to fetch components", err)
		return
	}

	utils.SuccessResponse(c, "Components fetched successfully", response)
}

func (ctrl *ComponentController) CreateComponent(c *gin.Context) {
	var request struct {
		ID         string                          `json:"id" binding:"required"`
		Name       string                          `json:"name" binding:"required"`
		CategoryID string                          `json:"category_id" binding:"required"`
		BrandIDs   []repositories.BrandAssociation `json:"brand_ids" binding:"required,min=1"`
		Models     string                          `json:"models"`
		Price      models.Price                    `json:"price" binding:"required"`
		ImageURL   models.ImageURL                 `json:"image_url" binding:"required"`
		Specs      map[string]interface{}          `json:"specs"`
	}

	if err := c.ShouldBindJSON(&request); err != nil {
		utils.BadRequestError(c, "Invalid request body", err)
		return
	}

	var category models.Category

	if err := ctrl.db.First(&category, "id = ?", request.CategoryID).Error; err != nil {
		utils.BadRequestError(c, "Invalid category ID", err)
		return
	}

	for _, brandAssoc := range request.BrandIDs {
		var brand models.Brand
		if err := ctrl.db.First(&brand, "id = ?", brandAssoc.BrandID).Error; err != nil {
			utils.BadRequestError(c, fmt.Sprintf("Invalid brand ID: %s", brandAssoc.BrandID), err)
			return
		}
	}

	// Convert price and image_url to JSON
	priceJSON, err := json.Marshal(request.Price)
	if err != nil {
		utils.BadRequestError(c, "Invalid price format", err)
		return
	}

	imageJSON, err := json.Marshal(request.ImageURL)
	if err != nil {
		utils.BadRequestError(c, "Invalid image URL format", err)
		return
	}

	component := &models.Component{
		ID:         request.ID,
		Name:       request.Name,
		CategoryID: request.CategoryID,
		Models:     request.Models,
		Price:      priceJSON,
		ImageURL:   imageJSON,
		IsActive:   true,
	}

	// Convert specs to string map
	specsMap := make(map[string]string)
	for key, value := range request.Specs {
		if str, ok := value.(string); ok {
			specsMap[key] = str
		} else {
			specsMap[key] = fmt.Sprintf("%v", value)
		}
	}

	err = ctrl.repo.CreateComponent(component, request.BrandIDs, specsMap)
	if err != nil {
		if strings.Contains(err.Error(), "duplicate key") {
			utils.ConflictError(c, "Component with this ID already exists")
			return
		}

		utils.InternalServerError(c, "Failed to create component", err)
		return
	}

	utils.CreatedResponse(c, "Component created successfully", component)
}

func (ctrl *ComponentController) GetComponentByID(c *gin.Context) {
	id := c.Param("id")

	component, err := ctrl.repo.GetComponentByID(id)
	if err != nil {
		utils.NotFoundError(c, "Component not found")
		return
	}

	utils.SuccessResponse(c, "Component fetched successfully", component)
}

func (ctrl *ComponentController) UpdateComponent(c *gin.Context) {
	id := c.Param("id")

	var request struct {
		Name       string                          `json:"name"`
		CategoryID string                          `json:"category_id"`
		BrandIDs   []repositories.BrandAssociation `json:"brand_ids"`
		Models     string                          `json:"models"`
		Price      models.Price                    `json:"price"`
		ImageURL   models.ImageURL                 `json:"image_url"`
		Specs      map[string]interface{}          `json:"specs"`
		IsActive   *bool                           `json:"is_active"`
		InStock    *bool                           `json:"in_stock"`
	}

	if err := c.ShouldBindJSON(&request); err != nil {
		utils.BadRequestError(c, "Invalid request body", err)
		return
	}

	// Check if component exists
	var existingComponent models.Component
	err := ctrl.db.Where("id = ?", id).First(&existingComponent).Error
	if err != nil {
		utils.NotFoundError(c, "Component not found")
		return
	}

	err = ctrl.db.Transaction(func(tx *gorm.DB) error {
		updates := make(map[string]interface{})

		if request.Name != "" {
			updates["name"] = request.Name
		}
		if request.CategoryID != "" {
			updates["category_id"] = request.CategoryID
		}
		if request.Models != "" {
			updates["models"] = request.Models
		}
		if request.IsActive != nil {
			updates["is_active"] = *request.IsActive
		}
		if request.InStock != nil {
			updates["in_stock"] = *request.InStock
		}

		if len(request.Price) > 0 {
			priceJSON, err := json.Marshal(request.Price)
			if err != nil {
				return err
			}
			updates["price"] = priceJSON
		}

		if len(request.ImageURL) > 0 {
			imageJSON, err := json.Marshal(request.ImageURL)
			if err != nil {
				return err
			}
			updates["image_url"] = imageJSON
		}

		if len(updates) > 0 {
			err := tx.Model(&existingComponent).Updates(updates).Error
			if err != nil {
				return err
			}
		}

		// Update brands if provided
		if len(request.BrandIDs) > 0 {
			// Delete existing brand associations
			err := tx.Where("component_id = ?", id).Delete(&models.ComponentBrands{}).Error
			if err != nil {
				return err
			}

			// Create new brand associations
			for _, brandAssoc := range request.BrandIDs {
				componentBrand := models.ComponentBrands{
					ComponentID: id,
					BrandID:     brandAssoc.BrandID,
					IsPrimary:   brandAssoc.IsPrimary,
				}
				err := tx.Create(&componentBrand).Error
				if err != nil {
					return err
				}
			}
		}

		// Update specs if provided
		if len(request.Specs) > 0 {
			// Delete existing specs
			err = tx.Where("component_id = ?", id).Delete(&models.ComponentSpec{}).Error
			if err != nil {
				return err
			}

			// Create new specs
			for key, value := range request.Specs {
				spec := models.ComponentSpec{
					ComponentID:  id,
					SpecKey:      key,
					SpecValue:    fmt.Sprintf("%v", value),
					SpecType:     "string",
					IsFilterable: isFilterableSpec(key),
				}
				err = tx.Create(&spec).Error
				if err != nil {
					return err
				}
			}
		}

		return nil
	})

	if err != nil {
		utils.InternalServerError(c, "Failed to update component", err)
		return
	}

	utils.SuccessResponse(c, "Component updated successfully", nil)
}

// DeleteComponent soft deletes a component
func (ctrl *ComponentController) DeleteComponent(c *gin.Context) {
	id := c.Param("id")

	// Soft delete by setting is_active to false
	err := ctrl.db.Delete(models.ComponentSpec{}, "component_id = ?", id).Error
	if err != nil {
		utils.InternalServerError(c, "Failed to delete component specs", err)
		return
	}

	err = ctrl.db.Delete(models.Component{}, "id = ?", id).Error
	if err != nil {
		utils.InternalServerError(c, "Failed to delete component", err)
		return
	}

	utils.NoContentResponse(c)
}

// BulkCreateComponents creates multiple components at once
func (ctrl *ComponentController) BulkCreateComponents(c *gin.Context) {
	var request struct {
		Components []struct {
			ID         string                          `json:"id" binding:"required"`
			Name       string                          `json:"name" binding:"required"`
			CategoryID string                          `json:"category_id" binding:"required"`
			BrandIDs   []repositories.BrandAssociation `json:"brand_ids" binding:"required,min=1"`
			Models     string                          `json:"models"`
			Price      models.Price                    `json:"price" binding:"required"`
			ImageURL   models.ImageURL                 `json:"image_url" binding:"required"`
			Specs      map[string]interface{}          `json:"specs"`
		} `json:"components" binding:"required,min=1,max=100"`
	}

	if err := c.ShouldBindJSON(&request); err != nil {
		utils.BadRequestError(c, "Invalid request body", err)
		return
	}

	var results []struct {
		ID      string `json:"id"`
		Success bool   `json:"success"`
		Message string `json:"message"`
		Error   string `json:"error,omitempty"`
	}

	totalCreated := 0
	totalFailed := 0

	// Process each component
	for _, compReq := range request.Components {
		result := struct {
			ID      string `json:"id"`
			Success bool   `json:"success"`
			Message string `json:"message"`
			Error   string `json:"error,omitempty"`
		}{
			ID: compReq.ID,
		}

		// Convert to component model
		priceJSON, err := json.Marshal(compReq.Price)
		if err != nil {
			result.Error = "Invalid price format"
			result.Message = "Failed to process component"
			results = append(results, result)
			totalFailed++
			continue
		}

		imageJSON, err := json.Marshal(compReq.ImageURL)
		if err != nil {
			result.Error = "Invalid image URL format"
			result.Message = "Failed to process component"
			results = append(results, result)
			totalFailed++
			continue
		}

		component := &models.Component{
			ID:         compReq.ID,
			Name:       compReq.Name,
			CategoryID: compReq.CategoryID,
			Models:     compReq.Models,
			Price:      priceJSON,
			ImageURL:   imageJSON,
			IsActive:   true,
		}

		// Convert specs
		specsMap := make(map[string]string)
		for key, value := range compReq.Specs {
			specsMap[key] = fmt.Sprintf("%v", value)
		}

		// Create component
		err = ctrl.repo.CreateComponent(component, compReq.BrandIDs, specsMap)
		if err != nil {
			if strings.Contains(err.Error(), "duplicate key") {
				result.Error = "Component with this ID already exists"
				result.Message = "Duplicate ID"
			} else {
				result.Error = err.Error()
				result.Message = "Database error"
			}
			results = append(results, result)
			totalFailed++
		} else {
			result.Success = true
			result.Message = "Created successfully"
			results = append(results, result)
			totalCreated++
		}
	}

	status := http.StatusCreated
	if totalCreated == 0 {
		status = http.StatusBadRequest
	} else if totalFailed > 0 {
		status = http.StatusMultiStatus
	}

	c.JSON(status, gin.H{
		"status":  status,
		"message": fmt.Sprintf("Bulk creation completed: %d created, %d failed", totalCreated, totalFailed),
		"response": gin.H{
			"total_requested": len(request.Components),
			"total_created":   totalCreated,
			"total_failed":    totalFailed,
			"results":         results,
		},
	})
}

func (ctrl *ComponentController) GetAllComponents(c *gin.Context) {
	var components []models.Component

	err := ctrl.db.
		Select("*").
		Where("is_active = true").
		Find(&components).Error

	if err != nil {
		utils.InternalServerError(c, "Failed to fetch components", err)
		return
	}

	utils.SuccessResponse(c, "Components fetched successfully", components)
}

// Helper function to determine if a spec is filterable
func isFilterableSpec(key string) bool {
	filterableSpecs := []string{
		"socket", "form_factor", "memory_type", "storage_type",
		"interface", "generation", "process_size", "tdp_range",
		"wattage", "efficiency", "certification",
	}

	return slices.Contains(filterableSpecs, key)
}
