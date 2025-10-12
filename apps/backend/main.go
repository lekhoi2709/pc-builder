package main

import (
	"log"
	"net/http"
	"pc-builder/backend/api/middlewares"
	"pc-builder/backend/api/routes"
	"pc-builder/backend/config"
	"pc-builder/backend/db"
	"time"

	"github.com/gin-gonic/gin"
)

var appConfig *config.Config

func init() {
	var err error
	appConfig, err = config.LoadEnv()
	if err != nil {
		panic("Error loading configuration: " + err.Error())
	}

	db.InitPostgres(appConfig)
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

	router.GET("", func(context *gin.Context) {
		context.JSON(http.StatusOK, gin.H{"message": "Welcome to PC Builder API"})
	})

	routes.RegisterRoutes(router)

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
