package routes

import (
	controller "pc-builder/backend/api/controllers"
	"pc-builder/backend/api/middlewares"
	"pc-builder/backend/db"
	"pc-builder/backend/services"

	"github.com/gin-gonic/gin"
)

const (
	RoleUser   = "user"
	RoleAdmin  = "admin"
	RoleVendor = "vendor"
)

func RegisterRoutes(router *gin.Engine, cloudinaryService *services.CloudinaryService) {
	componentController := controller.NewComponentController(db.DB)
	imageController := controller.NewImageController(cloudinaryService)

	// Health check route
	router.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok"})
	})

	api := router.Group("/api/v1")

	// Public routes
	auth := api.Group("/auth")
	auth.POST("/register", controller.Register)
	auth.POST("/login", controller.Login)

	// Public component routes
	components := api.Group("/components")
	{
		components.GET("/all", componentController.GetAllComponents)
		components.GET("/:id", componentController.GetComponentByID)
		components.GET("", componentController.GetComponentsWithPagination)
		// Get available filters
		components.GET("/filters", componentController.GetAvailableFilters)
	}

	categories := api.Group("/categories")
	{
		categories.GET("", componentController.GetAllCategories)
	}

	brands := api.Group("/brands")
	{
		brands.GET("", componentController.GetAllBrands)
	}

	// Protected admin routes
	admin := api.Group("/admin")
	admin.Use(middlewares.JWTMiddleware(), middlewares.RequireRole(RoleAdmin))
	{
		admin.GET("/users", controller.GetAllUsers)

		// Admin component management
		adminComponents := admin.Group("/components")
		{
			adminComponents.POST("", componentController.CreateComponent)
			adminComponents.POST("/bulk", componentController.BulkCreateComponents)
			adminComponents.PUT("/:id", componentController.UpdateComponent)
			adminComponents.DELETE("/:id", componentController.DeleteComponent)
		}

		// Admin category management
		adminCategories := admin.Group("/categories")
		{
			adminCategories.POST("", componentController.CreateCategory)
			adminCategories.PATCH("/:id", componentController.UpdateCategory)
		}

		// Admin brand management
		adminBrands := admin.Group("/brands")
		{
			adminBrands.POST("", componentController.CreateBrand)
			adminBrands.PATCH("/:id", componentController.UpdateBrand)
		}

		adminImages := admin.Group("/images")
		{
			adminImages.POST("/upload", imageController.UploadSingleImage)
			adminImages.POST("/upload-multiple", imageController.UploadMultipleImages)
			adminImages.DELETE("", imageController.DeleteImage)
		}
	}

	vendor := api.Group("/vendor")
	vendor.Use(middlewares.JWTMiddleware(), middlewares.RequireRole(RoleVendor))
	{
		vendorComponents := vendor.Group("/components")
		{
			vendorComponents.POST("", componentController.CreateComponent)
			vendorComponents.POST("/bulk", componentController.BulkCreateComponents)
			vendorComponents.PUT("/:id", componentController.UpdateComponent)
			// Vendors can only soft-delete (set inactive), not hard delete
			vendorComponents.PUT("/:id/deactivate", componentController.DeleteComponent)
		}
	}
}
