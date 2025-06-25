package controller

import (
	"encoding/json"
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

func CreateComponent(c *gin.Context) {
	var request ComponentRequest

	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"status":  http.StatusBadRequest,
			"message": "Invalid request body",
			"error":   err.Error(), // Remove this in production
		})
		return
	}

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
		c.JSON(http.StatusBadRequest, gin.H{
			"status":  http.StatusBadRequest,
			"message": "Invalid category. Must be one of: CPU, GPU, Mainboard, RAM, Storage, PSU",
		})
		return
	}

	var specsRaw json.RawMessage

	if request.Specs != nil {
		// First, validate the specs by parsing them into the appropriate type
		typedSpecs, err := utils.ValidateSpecsByCategory(category, request.Specs)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"status":  http.StatusBadRequest,
				"message": "Invalid specifications for category " + category,
				"error":   err.Error(),
			})
			return
		}

		// Validate the parsed specs
		if err := typedSpecs.Validate(); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"status":  http.StatusBadRequest,
				"message": "Specification validation failed",
				"error":   err.Error(),
			})
			return
		}

		// Convert the original request specs to json.RawMessage
		specsRaw, err = json.Marshal(request.Specs)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"status":  http.StatusBadRequest,
				"message": "Failed to process specifications",
				"error":   err.Error(),
			})
			return
		}

		// Create the component
		component := models.Component{
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

		// Validate price if provided
		if err := utils.ValidatePrice(component.Price); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"status":  http.StatusBadRequest,
				"message": "Invalid price information",
				"error":   err.Error(),
			})
			return
		}

		// Save to database
		result := db.DB.Create(&component)
		if result.Error != nil {
			// Check for duplicate key error
			if strings.Contains(result.Error.Error(), "duplicate key") {
				c.JSON(http.StatusConflict, gin.H{
					"status":  http.StatusConflict,
					"message": "Component with this ID already exists",
				})
				return
			}

			c.JSON(http.StatusInternalServerError, gin.H{
				"status":  http.StatusInternalServerError,
				"message": "Failed to create component",
				"error":   result.Error.Error(), // Remove this in production
			})
			return
		}

		c.JSON(http.StatusCreated, gin.H{
			"status":    http.StatusCreated,
			"message":   "Component created successfully",
			"component": component,
		})
	}
}

func GetAllComponents(c *gin.Context) {
	var components []models.Component
	err := db.DB.Find(&components).Error
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status":  http.StatusInternalServerError,
			"message": "Failed to fetch components",
			"error":   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status":     http.StatusOK,
		"components": components,
	})
}

func GetComponentByID(c *gin.Context) {
	id := c.Param("id")
	var component models.Component

	err := db.DB.Where("id = ?", id).First(&component).Error
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"status":  http.StatusNotFound,
			"message": "Component not found",
			"error":   err.Error(), // Remove this in production
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status":    http.StatusOK,
		"component": component,
	})
}

func GetComponentsWithPagination(c *gin.Context) {
	pagination := utils.PaginationParams{
		Page:     1,
		PageSize: 10,
	}

	if err := c.ShouldBindQuery(&pagination); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"status":  http.StatusBadRequest,
			"message": "Invalid pagination parameters",
			"error":   err.Error(), // Remove this in production
		})
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
		c.JSON(http.StatusBadRequest, gin.H{
			"status":  http.StatusBadRequest,
			"message": "Invalid filter parameters",
			"error":   err.Error(), // Remove this in production
		})
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
		c.JSON(http.StatusInternalServerError, gin.H{
			"status":  http.StatusInternalServerError,
			"message": "Failed to count records",
			"error":   err.Error(), // Remove this in production
		})
		return
	}

	totalPages := int((totalRecords + int64(pagination.PageSize) - 1) / int64(pagination.PageSize))
	offset := (pagination.Page - 1) * pagination.PageSize

	query = utils.ApplyComponentSorting(query, filters)
	query = query.Offset(int(offset)).Limit(pagination.PageSize)

	var components []models.Component
	if err := query.Find(&components).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status":  http.StatusInternalServerError,
			"message": "Failed to fetch components",
			"error":   err.Error(), // Remove this in production
		})
		return
	}

	paginationMeta := utils.PaginationMeta{
		CurrentPage:     pagination.Page,
		PageSize:        pagination.PageSize,
		TotalRecords:    totalRecords,
		TotalPages:      totalPages,
		HasNextPage:     pagination.Page < totalPages,
		HasPreviousPage: pagination.Page > 1,
	}

	summary := utils.GetComponentSummary(filters)

	response := PaginatedComponentResponse{
		Components: components,
		Pagination: paginationMeta,
		Filters:    filters,
		Summary:    summary,
	}

	c.JSON(http.StatusOK, gin.H{
		"status":   http.StatusOK,
		"response": response,
	})
}

func UpdateComponent(c *gin.Context) {
	id := c.Param("id")

	var component models.Component
	err := db.DB.Where("id = ?", id).First(&component).Error
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"status":  http.StatusNotFound,
			"message": "Component not found",
			"error":   err.Error(), // Remove this in production
		})
		return
	}

	var updatedComponent models.Component
	if err := c.ShouldBindJSON(&updatedComponent); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"status":  http.StatusBadRequest,
			"message": "Invalid request body",
			"error":   err.Error(), // Remove this in production
		})
		return
	}

	result := db.DB.Model(&component).Updates(&updatedComponent)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status":  http.StatusInternalServerError,
			"message": "Failed to update component",
			"error":   result.Error.Error(), // Remove this in production
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status":    http.StatusOK,
		"message":   "Component updated successfully",
		"component": component,
	})
}

func DeleteComponent(c *gin.Context) {
	id := c.Param("id")
	var component models.Component

	err := db.DB.Where("id = ?", id).First(&component).Error
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"status":  http.StatusNotFound,
			"message": "Component not found",
			"error":   err.Error(), // Remove this in production
		})
		return
	}

	result := db.DB.Delete(&component)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status":  http.StatusInternalServerError,
			"message": "Failed to delete component",
			"error":   result.Error.Error(), // Remove this in production
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status":  http.StatusOK,
		"message": "Component deleted successfully",
	})
}
