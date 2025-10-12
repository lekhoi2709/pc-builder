package config

import (
	"os"
	"strings"

	"github.com/joho/godotenv"
)

type Config struct {
	Environment    string
	DB             PostgresConfig
	Port           string
	AllowedOrigins []string
}

type PostgresConfig struct {
	Host           string
	Port           string
	AllowedOrigins []string
	User           string
	Password       string
	DbName         string
	SslMode        string
}

func LoadEnv() (*Config, error) {
	godotenv.Load()

	allowedOrigins := os.Getenv("ALLOWED_ORIGINS")
	origins := []string{"http://localhost:5173"}

	if allowedOrigins != "" {
		origins = strings.Split(allowedOrigins, ",")
	}

	cfg := &Config{
		Environment:    os.Getenv("ENVIRONMENT"),
		Port:           os.Getenv("PORT"),
		AllowedOrigins: origins,
		DB: PostgresConfig{
			Host:     os.Getenv("DB_HOST"),
			Port:     os.Getenv("DB_PORT"),
			User:     os.Getenv("DB_USER"),
			Password: os.Getenv("DB_PASSWORD"),
			DbName:   os.Getenv("DB_NAME"),
			SslMode:  os.Getenv("DB_SSLMODE"),
		},
	}

	return cfg, nil
}
