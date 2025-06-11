package controller

import (
	"net/http"
	"pc-builder/backend/db"
	"pc-builder/backend/models"

	"github.com/gin-gonic/gin"
)

func CreateComponent(c *gin.Context) {
	var body struct {
		Name 			string `json:"name" binding:"required"`
		Category 			string `json:"category" binding:"required"`
		Brand 			string `json:"brand" binding:"required"`
		Models 			string `json:"model" binding:"required"`
	}

	c.Bind(&body)

	component := models.Component{
		Name: body.Name,
		Category: body.Category,
		Brand: body.Brand,
		Models: body.Models,
	}

	result := db.DB.Create(&component)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status": http.StatusInternalServerError,
			"message": "Failed to create component",
			"error": result.Error.Error(), // Remove this in production
		})
		return
	}
	c.JSON(http.StatusCreated, gin.H{
		"status": http.StatusCreated,
		"message": "Component created successfully",
		"component": component,
	})
}

func GetAllComponents(c *gin.Context) {
	var components []models.Component
	err := db.DB.Find(&components).Error
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status": http.StatusInternalServerError,
			"message": "Failed to fetch components",
			"error": err.Error(), // Remove this in production
		})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"status": http.StatusOK,
		"components": components,
	})
}