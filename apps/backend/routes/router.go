package routes

import (
	"pc-builder/backend/controller"
	"pc-builder/backend/middlewares"

	"github.com/gin-gonic/gin"
)

const (
	RoleUser   = "user"
	RoleAdmin  = "admin"
	RoleVendor = "vendor"
)

func RegisterRoutes(router *gin.Engine) {
	// Health check route
	router.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok"})
	})

	api := router.Group("/api")

	// Public routes
	auth := api.Group("/auth")
	auth.POST("/register", controller.Register)
	auth.POST("/login", controller.Login)

	components := api.Group("/components")
	components.GET("/", controller.GetAllComponents)
	components.GET("/:id", controller.GetComponentByID)

	// Protected routes
	admin := api.Group("/admin")
	admin.Use(middlewares.JWTMiddleware(), middlewares.RequireRole(RoleAdmin))
	{
		admin.GET("/users", controller.GetAllUsers)
	}

	components.Use(middlewares.JWTMiddleware(), middlewares.RequireRole(RoleAdmin, RoleVendor))
	{
		components.POST("/", controller.CreateComponent)
		components.PUT("/:id", controller.UpdateComponent)
		components.DELETE("/:id", controller.DeleteComponent)
	}
}
