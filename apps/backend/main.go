package main

import (
	"log"
	"pc-builder/backend/api"
	"pc-builder/backend/config"

	"github.com/gin-gonic/gin"
)

func main() {
	engine := gin.Default()
	engine.SetTrustedProxies(nil) // Disable trusted proxies for local development

appConfig, err := config.LoadEnv()
 	if err != nil {
 		log.Fatalf("Error loading configuration: %v", err)
 	}

	config.ConnectDB(appConfig.DB)

	port := appConfig.Port

	if port == "" {
		port = "8080"
	}

	api.RegisterRoutes(engine)

	log.Printf("Starting server on port %s", port)
 	engine.Run(":" + port)
}