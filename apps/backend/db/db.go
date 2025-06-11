package db

import (
	"fmt"
	"log"
	"pc-builder/backend/config"
	"pc-builder/backend/models"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func InitPostgres(cfg *config.Config) *gorm.DB {
	dsn := fmt.Sprintf(
		"host=%s port=%s user=%s password=%s dbname=%s sslmode=%s timezone=UTC",
		cfg.DB.Host,
		cfg.DB.Port,
		cfg.DB.User,
		cfg.DB.Password,
		cfg.DB.DbName,
		cfg.DB.SslMode,
	)

	var err error
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("❌ Failed to connect to database: %v", err)
	}

	// Auto migrate your models
	if err := DB.AutoMigrate(&models.Component{}); err != nil {
		log.Fatalf("❌ AutoMigrate failed: %v", err)
	}

	log.Println("✅ Connected to PostgreSQL")
	return DB
}