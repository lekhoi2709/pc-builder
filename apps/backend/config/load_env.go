package config

import (
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	Environment string
	DB          PostgresConfig
	Port        string
}

type PostgresConfig struct {
	Host     string
	Port     string
	User     string
	Password string
	DbName   string
	SslMode  string
}

func LoadEnv() (*Config, error) {
	godotenv.Load()
	cfg := &Config{
		Environment: os.Getenv("ENVIRONMENT"),
		Port:        os.Getenv("PORT"),
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
