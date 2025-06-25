package routes

import (
	"pc-builder/backend/api/controller"
	"pc-builder/backend/api/middlewares"

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
	{
		// Get all components without filters
		components.GET("/all", controller.GetAllComponents)
		components.GET("/:id", controller.GetComponentByID)

		// Get components with filters and pagination
		components.GET("/", controller.GetComponentsWithPagination)
	}

	// Protected routes
	admin := api.Group("/admin")
	admin.Use(middlewares.JWTMiddleware(), middlewares.RequireRole(RoleAdmin))
	{
		admin.GET("/users", controller.GetAllUsers)
	}

	protectedComponents := api.Group("/components")
	protectedComponents.Use(middlewares.JWTMiddleware(), middlewares.RequireRole(RoleAdmin, RoleVendor))
	{
		protectedComponents.POST("/", controller.CreateComponent)
		protectedComponents.PUT("/:id", controller.UpdateComponent)
		protectedComponents.DELETE("/:id", controller.DeleteComponent)
	}
}
