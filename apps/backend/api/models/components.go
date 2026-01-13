package models

import (
	"encoding/json"
	"time"
)

type Category struct {
	ID          string    `json:"id" gorm:"primaryKey;size:50"`
	Name        string    `json:"name" gorm:"size:50;uniqueIndex;not null"`
	DisplayName string    `json:"display_name" gorm:"size:100;not null"`
	Description string    `json:"description" gorm:"type:text"`
	IconURL     string    `json:"icon_url" gorm:"size:255"`
	SortOrder   int       `json:"sort_order" gorm:"default:0"`
	IsActive    bool      `json:"is_active" gorm:"default:true"`
	CreatedAt   time.Time `json:"created_at" gorm:"autoCreateTime"`
	UpdatedAt   time.Time `json:"updated_at" gorm:"autoUpdateTime"`

	Components []Component `json:"components,omitempty" gorm:"foreignKey:CategoryID"`
}

type Brand struct {
	ID          string    `json:"id" gorm:"primaryKey;size:50"`
	Name        string    `json:"name" gorm:"size:100;uniqueIndex;not null"`
	DisplayName string    `json:"display_name" gorm:"size:100;not null"`
	LogoURL     string    `json:"logo_url" gorm:"size:255"`
	Website     string    `json:"website" gorm:"size:255"`
	Country     string    `json:"country" gorm:"size:100"`
	IsActive    bool      `json:"is_active" gorm:"default:true"`
	CreatedAt   time.Time `json:"created_at" gorm:"autoCreateTime"`
	UpdatedAt   time.Time `json:"updated_at" gorm:"autoUpdateTime"`

	Components []Component `json:"components,omitempty" gorm:"many2many:component_brands;"`
}

type Component struct {
	ID         string          `json:"id" gorm:"primaryKey;size:255"`
	Name       string          `json:"name" gorm:"size:255;not null"`
	CategoryID string          `json:"category_id" gorm:"not null"`
	Models     string          `json:"models" gorm:"size:255"`
	Price      json.RawMessage `json:"price" gorm:"type:jsonb;default:'[]'"`
	ImageURL   json.RawMessage `json:"image_url" gorm:"type:jsonb;default:'[]'"`
	IsActive   bool            `json:"is_active" gorm:"default:true"`
	InStock    bool            `json:"in_stock" gorm:"default:true"`
	CreatedAt  time.Time       `json:"created_at" gorm:"autoCreateTime"`
	UpdatedAt  time.Time       `json:"updated_at" gorm:"autoUpdateTime"`

	Category *Category       `json:"category,omitempty" gorm:"foreignKey:CategoryID;constraint:OnUpdate:CASCADE,OnDelete:RESTRICT"`
	Brands   []Brand         `json:"brands,omitempty" gorm:"many2many:component_brands;"`
	Specs    []ComponentSpec `json:"specs,omitempty" gorm:"foreignKey:ComponentID"`
}

type ComponentBrands struct {
	ComponentID string    `json:"component_id" gorm:"primaryKey;size:255"`
	BrandID     string    `json:"brand_id" gorm:"primaryKey;size:50"`
	IsPrimary   bool      `json:"is_primary" gorm:"default:false"` // Mark the main manufacturer
	CreatedAt   time.Time `json:"created_at" gorm:"autoCreateTime"`

	Component *Component `json:"component,omitempty" gorm:"foreignKey:ComponentID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
	Brand     *Brand     `json:"brand,omitempty" gorm:"foreignKey:BrandID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
}

type ComponentSpec struct {
	ID           uint      `json:"id" gorm:"primaryKey;autoIncrement"`
	ComponentID  string    `json:"component_id" gorm:"size:255;not null;index"`
	SpecKey      string    `json:"spec_key" gorm:"size:100;not null;index"`
	SpecValue    string    `json:"spec_value" gorm:"type:text;not null"`
	SpecType     string    `json:"spec_type" gorm:"size:50;not null;default:'string'"`
	IsFilterable bool      `json:"is_filterable" gorm:"default:false;index"`
	CreatedAt    time.Time `json:"created_at" gorm:"autoCreateTime"`

	Component *Component `json:"component,omitempty" gorm:"foreignKey:ComponentID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
}

type ComponentWithRelations struct {
	Component
	CategoryName    string            `json:"category_name"`
	CategoryDisplay string            `json:"category_display"`
	BrandNames      []string          `json:"brand_names"`    // Multiple brand names
	BrandDisplays   []string          `json:"brand_displays"` // Multiple brand display names
	PrimaryBrand    string            `json:"primary_brand"`  // Main manufacturer
	SpecsMap        map[string]string `json:"specs_map"`
}

type PriceItem struct {
	Currency string  `json:"currency"`
	Amount   float64 `json:"amount"`
	Symbol   string  `json:"symbol,omitempty"`
}

type Price []PriceItem
type ImageURL []string
