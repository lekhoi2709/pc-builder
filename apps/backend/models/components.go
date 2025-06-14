package models

import (
	"time"
)

type Specs struct {
	Architecture struct {
		CodeName      string `json:"code_name"`
		Generation    string `json:"generation"`
		MemorySupport string `json:"memory_support"`
	} `json:"architecture"`
	Physical struct {
		Socket      string `json:"socket"`
		Foundry     string `json:"foundry"`
		ProcessSize string `json:"process_size"`
	} `json:"physical"`
	Cache struct {
		L1 string `json:"l1"`
		L2 string `json:"l2"`
		L3 string `json:"l3"`
	} `json:"cache"`
	Performance struct {
		Cores            int    `json:"cores"`
		Threads          int    `json:"threads"`
		IntegredGraphics string `json:"integrated_graphics"`
		Frequency        string `json:"frequency"`
		TurboClock       string `json:"turbo_clock"`
		BaseClock        string `json:"base_clock"`
		TDP              string `json:"tdp"`
	} `json:"performance"`
	Other struct {
		Market      string `json:"market"`
		ReleaseDate string `json:"release_date"`
	} `json:"other"`
}

type PriceItem struct {
	Currency string  `json:"currency"`
	Amount   float64 `json:"amount"`
	Symbol   string  `json:"symbol,omitempty"`
}

type Price []PriceItem
type ImageURL []string

type Component struct {
	ID        string    `json:"id" gorm:"primaryKey;size:255"`
	Name      string    `json:"name" gorm:"primaryKey;size:255"`
	Category  string    `json:"category"`
	Brand     string    `json:"brand"`
	Models    string    `json:"models"`
	Specs     Specs     `json:"specs" gorm:"serializer:json"`
	Price     Price     `json:"price" gorm:"serializer:json"`
	ImageURL  ImageURL  `json:"image_url" gorm:"serializer:json"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}
