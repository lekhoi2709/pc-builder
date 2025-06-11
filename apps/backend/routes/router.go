package routes

import (
	"pc-builder/backend/controller"

	"github.com/gin-gonic/gin"
)

func RegisterRoutes(router *gin.Engine) {
	// Health check route
	router.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok"})
	})

	api := router.Group("/api")

	api.GET("/components", controller.GetAllComponents)
	api.POST("/components", controller.CreateComponent)
}