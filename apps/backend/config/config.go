package config

import (
	"os"
)
type Config struct {
	DB    PostgresConfig
	Port  string
}

type PostgresConfig struct {
	Host string
	Port string
	User string
	Password string
	DbName string
	SslMode string
}

func LoadEnv() (*Config, error) {
	cfg := &Config{
		Port: os.Getenv("PORT"),
		DB: PostgresConfig{
			Host: os.Getenv("DB_HOST"),
			Port: os.Getenv("DB_PORT"),
			User: os.Getenv("DB_USER"),
			Password: os.Getenv("DB_PASSWORD"),
			DbName: os.Getenv("DB_NAME"),
			SslMode: os.Getenv("DB_SSLMODE"),
		},
	}

	return cfg, nil
}