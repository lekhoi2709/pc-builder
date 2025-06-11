package main

import (
	"log"
	"net/http"
	"pc-builder/backend/config"
	"pc-builder/backend/db"
	"pc-builder/backend/routes"
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
	router := gin.Default()
	router.SetTrustedProxies(nil) // Disable trusted proxies for local development

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
		Addr:    ":" + port,
		Handler: router,
		ReadTimeout: 10 * time.Second,
		WriteTimeout: 10 * time.Second,
		MaxHeaderBytes: 1 << 20, // 1 MB
	}

	if err := server.ListenAndServe(); err != nil {
		log.Fatalf("Error starting server: %v", err)
	}

}