package controller

import (
	"net/http"
	"pc-builder/backend/db"
	"pc-builder/backend/models"

	"github.com/gin-gonic/gin"
)

func CreateComponent(c *gin.Context) {
	var component models.Component

	if err := c.ShouldBindJSON(&component); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"status":  http.StatusBadRequest,
			"message": "Invalid request body",
			"error":   err.Error(), // Remove this in production
		})
		return
	}

	// Validate required fields
	if component.Name == "" || component.Category == "" || component.Brand == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"status":  http.StatusBadRequest,
			"message": "Missing required fields: name, category, and brand are required",
		})
		return
	}

	result := db.DB.Create(&component)
	if result.Error != nil {
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
