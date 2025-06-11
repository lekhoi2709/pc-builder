package models

import (
	"time"

	"gorm.io/gorm"
)

type Component struct {
	gorm.Model
	ID          int       `json:"id"`
	Name        string    `json:"name"`
	Category    string    `json:"category"`
	Brand       string    `json:"brand"`
	Models 		 	string    `json:"models"`
	Specs			 	string    `json:"specs"`
	Price			 	float64   `json:"price"`
	ImageURL    string    `json:"image_url"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}
