package utils

import (
	"fmt"
	"pc-builder/backend/api/models"
	"pc-builder/backend/db"
	"strings"

	"gorm.io/gorm"
)

type ComponentFilter struct {
	Category  string  `form:"category"`
	Brand     string  `form:"brand"`
	MinPrice  float64 `form:"min_price"`
	MaxPrice  float64 `form:"max_price"`
	Search    string  `form:"search"`
	SortBy    string  `form:"sort_by"`
	SortOrder string  `form:"sort_order"`

	// Specs
	Socket      string `form:"socket"`       // For CPU, Mainboard
	Memory      string `form:"memory"`       // For RAM, GPU (VRAM), Mainboard
	Storage     string `form:"storage"`      // For Storage, Mainboard
	FormFactor  string `form:"form_factor"`  // For Mainboard, RAM, PSU, Storage
	Interface   string `form:"interface"`    // For Storage, Mainboard
	Wattage     string `form:"wattage"`      // For PSU
	Generation  string `form:"generation"`   // For CPU, GPU
	ProcessSize string `form:"process_size"` // For CPU, GPU
}

type PaginationParams struct {
	Page     int `form:"page"`
	PageSize int `form:"page_size"`
}

type PaginationMeta struct {
	CurrentPage     int   `json:"current_page"`
	PageSize        int   `json:"page_size"`
	TotalPages      int   `json:"total_pages"`
	TotalRecords    int64 `json:"total_records"`
	HasNextPage     bool  `json:"has_next_page"`
	HasPreviousPage bool  `json:"has_previous_page"`
}

type ComponentPriceRange struct {
	MinPrice float64 `json:"min_price"`
	MaxPrice float64 `json:"max_price"`
	Currency string  `json:"currency"`
}

type ComponentSummary struct {
	TotalComponents int                 `json:"total_components"`
	ByCategory      map[string]int      `json:"by_category"`
	ByBrand         map[string]int      `json:"by_brand"`
	PriceRange      ComponentPriceRange `json:"price_range"`
}

func ApplyComponentFilters(query *gorm.DB, filters ComponentFilter) *gorm.DB {
	// Filter by category
	if filters.Category != "" {
		query = query.Where("LOWER(category) = LOWER(?)", filters.Category)
	}

	// Filter by brand
	if filters.Brand != "" {
		query = query.Where("LOWER(brand) = LOWER(?)", filters.Brand)
	}

	// Price filtering - need to extract price from JSON array
	if filters.MinPrice > 0 {
		query = query.Where(fmt.Sprintf(`price @? 'lax $[*] ? (@.currency == "USD" && @.amount >= %v)'`, filters.MinPrice))
	}
	if filters.MaxPrice > 0 {
		query = query.Where(fmt.Sprintf(`price @? 'lax $[*] ? (@.currency == "USD" && @.amount <= %v)'`, filters.MaxPrice))
	}

	// Search in name, brand, category, and models
	if filters.Search != "" {
		searchTerm := "%" + strings.ToLower(filters.Search) + "%"
		query = query.Where(
			"LOWER(name) LIKE ? OR LOWER(brand) LIKE ? OR LOWER(category) LIKE ? OR LOWER(models) LIKE ?",
			searchTerm, searchTerm, searchTerm, searchTerm,
		)
	}

	if filters.Socket != "" {
		query = applySpecFilter(query, filters.Socket)
	}
	if filters.Memory != "" {
		query = applySpecFilter(query, filters.Memory)
	}
	if filters.Storage != "" {
		query = applySpecFilter(query, filters.Storage)
	}
	if filters.FormFactor != "" {
		query = applySpecFilter(query, filters.FormFactor)
	}
	if filters.Interface != "" {
		query = applySpecFilter(query, filters.Interface)
	}
	if filters.Wattage != "" {
		query = applySpecFilter(query, filters.Wattage)
	}
	if filters.Generation != "" {
		query = applySpecFilter(query, filters.Generation)
	}
	if filters.ProcessSize != "" {
		query = applySpecFilter(query, filters.ProcessSize)
	}

	return query
}

// applySpecFilter applies a generic spec filter by searching in the JSON specs
func applySpecFilter(query *gorm.DB, specValue string) *gorm.DB {
	if specValue == "" {
		return query
	}

	searchPattern := fmt.Sprintf("%%%s%%", strings.ToLower(specValue))

	// Use PostgreSQL's jsonb search capabilities
	query = query.Where(
		"LOWER(specs::text) LIKE ?",
		searchPattern,
	)

	return query
}

// ApplyComponentSorting applies sorting to the query
func ApplyComponentSorting(query *gorm.DB, filters ComponentFilter) *gorm.DB {
	validSortFields := map[string]string{
		"name":       "name",
		"price":      `(price->0->>'amount')::numeric`,
		"created_at": "created_at",
		"updated_at": "updated_at",
		"brand":      "brand",
		"category":   "category",
	}

	validSortOrders := map[string]bool{
		"asc":  true,
		"desc": true,
	}

	// Use default values if invalid
	sortBy := strings.ToLower(filters.SortBy)
	sortField, exists := validSortFields[sortBy]
	if !exists {
		sortField = "created_at"
	}

	sortOrder := strings.ToLower(filters.SortOrder)
	if !validSortOrders[sortOrder] {
		sortOrder = "desc"
	}

	return query.Order(sortField + " " + sortOrder)
}

// GetComponentSummary generates summary statistics
func GetComponentSummary(filters ComponentFilter) ComponentSummary {
	var categoryResults []struct {
		Category string
		Count    int64
	}

	categoryQuery := db.DB.Model(&models.Component{}).
		Select("category, COUNT(*) as count").
		Group("category")

	categoryQuery = ApplyComponentFilters(categoryQuery, filters)
	categoryQuery.Scan(&categoryResults)

	byCategory := make(map[string]int)
	totalComponents := 0
	for _, result := range categoryResults {
		byCategory[result.Category] = int(result.Count)
		totalComponents += int(result.Count)
	}

	var brandResults []struct {
		Brand string
		Count int64
	}

	brandQuery := db.DB.Model(&models.Component{}).
		Select("brand, COUNT(*) as count").
		Group("brand")

	brandQuery = ApplyComponentFilters(brandQuery, filters)
	brandQuery.Scan(&brandResults)

	byBrand := make(map[string]int)
	for _, result := range brandResults {
		byBrand[result.Brand] = int(result.Count)
	}

	var priceRange struct {
		MinPrice float64
		MaxPrice float64
	}

	priceQuery := db.DB.Model(&models.Component{}).
		Select(`MIN((price->0->>'amount')::numeric) as min_price, MAX((price->0->>'amount')::numeric) as max_price`)

	priceQuery = ApplyComponentFilters(priceQuery, filters)
	priceQuery.Scan(&priceRange)

	return ComponentSummary{
		TotalComponents: totalComponents,
		ByCategory:      byCategory,
		ByBrand:         byBrand,
		PriceRange: ComponentPriceRange{
			MinPrice: priceRange.MinPrice,
			MaxPrice: priceRange.MaxPrice,
			Currency: "USD",
		},
	}
}

// GetAvailableFilterOptions returns available filter options for the frontend
func GetAvailableFilterOptions() map[string][]string {
	filterOptions := make(map[string][]string)

	// Get unique categories
	var categories []string
	db.DB.Model(&models.Component{}).Distinct("category").Pluck("category", &categories)
	filterOptions["categories"] = categories

	// Get unique brands
	var brands []string
	db.DB.Model(&models.Component{}).Distinct("brand").Pluck("brand", &brands)
	filterOptions["brands"] = brands

	return filterOptions
}
