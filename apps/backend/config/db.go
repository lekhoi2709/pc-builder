package config

import (
	"fmt"
	"log"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func ConnectDB(pgConfig PostgresConfig) *gorm.DB {
	dsn := fmt.Sprintf(
		"host=%s port=%s user=%s password=%s dbname=%s sslmode=%s timezone=UTC",
		pgConfig.Host,
		pgConfig.Port,
		pgConfig.User,
		pgConfig.Password,
		pgConfig.DbName,
		pgConfig.SslMode,
	)

	db, err := gorm.Open(postgres.New(postgres.Config{
		DSN: dsn,
	}))

	if err != nil {
		log.Fatalf("failed to connect to database: %v", err)
	}

	return db
}