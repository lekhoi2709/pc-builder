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

	api.POST("/components", controller.CreateComponent)
	api.GET("/components", controller.GetAllComponents)
	api.GET("/components/:id", controller.GetComponentByID)
	api.PUT("/components/:id", controller.UpdateComponent)
	api.DELETE("/components/:id", controller.DeleteComponent)
}