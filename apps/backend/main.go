package main

import (
	"log"
	"net/http"
	"pc-builder/backend/api/middlewares"
	"pc-builder/backend/api/routes"
	"pc-builder/backend/config"
	"pc-builder/backend/db"
	"pc-builder/backend/services"
	"time"

	"github.com/gin-gonic/gin"
)

var appConfig *config.Config
var cloudinaryService *services.CloudinaryService

func init() {
	var err error
	appConfig, err = config.LoadEnv()
	if err != nil {
		panic("Error loading configuration: " + err.Error())
	}

	db.InitPostgres(appConfig)

	cloudinaryService, err = services.NewCloudinaryService(
		appConfig.Cloudinary.CloudName,
		appConfig.Cloudinary.ApiKey,
		appConfig.Cloudinary.ApiSecret,
		"pc_builder",
	)

	if err != nil {
		log.Printf("⚠️ Warning: Cloudinary service initialization failed: %v", err)
		log.Println("Image upload features will be disabled")
	} else {
		log.Println("✅ Cloudinary service initialized")
	}

}

func main() {
	if appConfig.Environment == "development" {
		gin.SetMode(gin.DebugMode)
		log.Println("🔧 Running in development mode")
	} else {
		gin.SetMode(gin.ReleaseMode)
		log.Println("🚀 Running in production mode")
	}

	router := gin.New()

	middlewares.SetupSecurityMiddleware(router, appConfig.AllowedOrigins)
	middlewares.SetupTrustedProxies(router)

	router.Use(func(c *gin.Context) {
		c.Set("cloudinaryService", cloudinaryService)
		c.Next()
	})

	router.GET("", func(context *gin.Context) {
		context.JSON(http.StatusOK, gin.H{"message": "Welcome to PC Builder API"})
	})

	routes.RegisterRoutes(router, cloudinaryService)

	port := appConfig.Port

	if port == "" {
		port = "8080"
	}

	log.Printf("Starting server on port %s", port)

	server := &http.Server{
		Addr:           ":" + port,
		Handler:        router,
		ReadTimeout:    15 * time.Second,
		WriteTimeout:   15 * time.Second,
		MaxHeaderBytes: 1 << 20, // 1 MB
	}

	if err := server.ListenAndServe(); err != nil {
		log.Fatalf("Error starting server: %v", err)
	}
}
