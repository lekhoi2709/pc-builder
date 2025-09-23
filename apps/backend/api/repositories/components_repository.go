package repositories

import (
	"fmt"
	"pc-builder/backend/api/models"
	"strings"

	"gorm.io/gorm"
)

type ComponentRepository struct {
	db *gorm.DB
}

func NewComponentRepository(db *gorm.DB) *ComponentRepository {
	return &ComponentRepository{db: db}
}

// ComponentFilter struct for the new structure
type ComponentFilter struct {
	CategoryID string            `form:"category_id"`
	BrandID    string            `form:"brand_id"`
	MinPrice   float64           `form:"min_price"`
	MaxPrice   float64           `form:"max_price"`
	Search     string            `form:"search"`
	SortBy     string            `form:"sort_by"`
	SortOrder  string            `form:"sort_order"`
	Currency   string            `form:"currency"`
	Specs      map[string]string `form:"-"` // Handle specs separately
}

type PaginationParams struct {
	Page     int `form:"page"`
	PageSize int `form:"page_size"`
}

type PaginationMeta struct {
	CurrentPage  int   `json:"current_page"`
	PageSize     int   `json:"page_size"`
	TotalPages   int   `json:"total_pages"`
	TotalRecords int64 `json:"total_records"`
}

type ComponentResponse struct {
	Components []models.ComponentWithRelations `json:"components"`
	Pagination PaginationMeta                  `json:"pagination"`
	Filters    ComponentFilter                 `json:"filters"`
	Summary    ComponentStats                  `json:"summary"`
}

type AvailableFilters struct {
	Categories []models.Category         `json:"categories"`
	Brands     []models.Brand            `json:"brands"`
	Specs      map[string][]FilterOption `json:"specs"`
	PriceRange ComponentPriceRange       `json:"price_range"`
}

type FilterOption struct {
	Key         string `json:"key"`
	Value       string `json:"value"`
	DisplayName string `json:"display_name"`
	Count       int    `json:"count"`
}

type FilterGroup struct {
	Name    string         `json:"name"`
	Options []FilterOption `json:"options"`
}

type ComponentStats struct {
	TotalComponents int                    `json:"total_components"`
	ByCategory      map[string]int         `json:"by_category"`
	ByBrand         map[string]int         `json:"by_brand"`
	PriceRange      ComponentPriceRange    `json:"price_range"`
	TopSpecs        map[string]interface{} `json:"top_specs"`
}

type ComponentPriceRange struct {
	MinPrice float64 `json:"min_price"`
	MaxPrice float64 `json:"max_price"`
	Currency string  `json:"currency"`
}

func groupSpecsByKey(specResults []models.ComponentSpec) map[string][]FilterOption {
	specsMap := make(map[string][]FilterOption)
	for _, spec := range specResults {
		if _, exists := specsMap[spec.SpecKey]; !exists {
			specsMap[spec.SpecKey] = []FilterOption{}
		}

		option := FilterOption{
			Key:   spec.SpecKey,
			Value: spec.SpecValue,
			// Count: spec.Count,
		}
		specsMap[spec.SpecKey] = append(specsMap[spec.SpecKey], option)
	}
	return specsMap
}

func (r *ComponentRepository) GetAvailableFilters(lang string) (*AvailableFilters, error) {
	var categories []models.Category
	var brands []models.Brand
	var specs []models.ComponentSpec

	err := r.db.
		Select("categories.*, COUNT(components.id) as component_count").
		Table("categories").
		Joins("LEFT JOIN components ON categories.id = components.category_id AND components.is_active = true").
		Where("categories.is_active = true").
		Group("categories.id").
		Having("COUNT(components.id) > 0").
		Order("categories.sort_order").
		Find(&categories).Error
	if err != nil {
		return nil, err
	}

	err = r.db.
		Select("brands.*, COUNT(components.id) as component_count").
		Table("brands").
		Joins("LEFT JOIN components ON brands.id = components.brand_id AND components.is_active = true").
		Where("brands.is_active = true").
		Group("brands.id").
		Having("COUNT(components.id) > 0").
		Order("brands.display_name").
		Find(&brands).Error
	if err != nil {
		return nil, err
	}

	err = r.db.
		Select("spec_key, spec_value, COUNT(*) as spec_count").
		Table("component_specs").
		Joins("JOIN components ON component_specs.component_id = components.id").
		Where("component_specs.is_filterable = true AND components.is_active = true").
		Group("spec_key, spec_value").
		Having("COUNT(*) > 0").
		Order("spec_key, spec_count DESC").
		Find(&specs).Error
	if err != nil {
		return nil, err
	}

	var priceRange ComponentPriceRange
	currency := getCurrencyForLang(lang)

	err = r.db.
		Raw(`
			SELECT
				MIN((price_item->>'amount')::numeric) as min_price,
				MAX((price_item->>'amount')::numeric) as max_price
			FROM components
			CROSS JOIN LATERAL jsonb_array_elements(price) as price_item
			WHERE price_item->>'currency' = ? AND is_active = true
		`, currency).
		Scan(&priceRange).Error
	if err != nil {
		return nil, err
	}
	priceRange.Currency = currency

	return &AvailableFilters{
		Categories: categories,
		Brands:     brands,
		Specs:      groupSpecsByKey(specs),
		PriceRange: priceRange,
	}, nil
}

func (r *ComponentRepository) GetComponentsWithFilters(filters ComponentFilter, pagination PaginationParams) (*ComponentResponse, error) {
	query := r.db.Model(&models.Component{}).
		Select(`
			components.id,
			components.name,
			components.category_id,
			components.brand_id,
			components.models,
			components.price,
			components.image_url,
			components.is_active,
			components.created_at,
			components.updated_at,
			categories.name as category_name,
			categories.display_name as category_display,
			brands.name as brand_name,
			brands.display_name as brand_display
		`).
		Joins("JOIN categories ON components.category_id = categories.id").
		Joins("JOIN brands ON components.brand_id = brands.id").
		Where("components.is_active = true")

	query = r.applyFilters(query, filters)

	var totalRecords int64
	countQuery := r.db.Model(&models.Component{}).
		Joins("JOIN categories ON components.category_id = categories.id").
		Joins("JOIN brands ON components.brand_id = brands.id").
		Where("components.is_active = true")
	countQuery = r.applyFilters(countQuery, filters)
	err := countQuery.Count(&totalRecords).Error
	if err != nil {
		return nil, err
	}

	query = r.applySorting(query, filters)

	offset := (pagination.Page - 1) * pagination.PageSize
	query = query.Offset(offset).Limit(pagination.PageSize)

	var componentResults []struct {
		models.Component
		CategoryName    string `json:"category_name"`
		CategoryDisplay string `json:"category_display"`
		BrandName       string `json:"brand_name"`
		BrandDisplay    string `json:"brand_display"`
	}

	err = query.Find(&componentResults).Error
	if err != nil {
		return nil, err
	}

	var components []models.ComponentWithRelations
	for _, result := range componentResults {
		comp := models.ComponentWithRelations{
			Component:       result.Component,
			CategoryName:    result.CategoryName,
			CategoryDisplay: result.CategoryDisplay,
			BrandName:       result.BrandName,
			BrandDisplay:    result.BrandDisplay,
		}

		err = r.loadComponentSpecs(&comp)
		if err != nil {
			return nil, err
		}

		components = append(components, comp)
	}

	totalPages := int((totalRecords + int64(pagination.PageSize) - 1) / int64(pagination.PageSize))

	summary := r.getComponentSummary(filters)

	return &ComponentResponse{
		Components: components,
		Pagination: PaginationMeta{
			CurrentPage:  pagination.Page,
			PageSize:     pagination.PageSize,
			TotalRecords: totalRecords,
			TotalPages:   totalPages,
		},
		Filters: filters,
		Summary: summary,
	}, nil
}

func (r *ComponentRepository) applyFilters(query *gorm.DB, filters ComponentFilter) *gorm.DB {
	if filters.CategoryID != "" {
		query = query.Where("components.category_id = ?", filters.CategoryID)
	}

	if filters.BrandID != "" {
		query = query.Where("components.brand_id = ?", filters.BrandID)
	}

	if filters.Search != "" {
		searchTerm := "%" + strings.ToLower(filters.Search) + "%"
		query = query.Where(`
			LOWER(components.name) LIKE ? OR
			LOWER(brands.display_name) LIKE ? OR
			LOWER(categories.display_name) LIKE ? OR
			LOWER(components.models) LIKE ?
		`, searchTerm, searchTerm, searchTerm, searchTerm)
	}

	// Price filters
	currency := filters.Currency
	if currency == "" {
		currency = "VND"
	}

	if filters.MinPrice > 0 {
		query = query.Where(
			fmt.Sprintf(`price @? 'lax $[*] ? (@.currency == "%s" && @.amount >= %v)'`, currency, filters.MinPrice),
		)
	}

	if filters.MaxPrice > 0 {
		query = query.Where(
			fmt.Sprintf(`price @? 'lax $[*] ? (@.currency == "%s" && @.amount <= %v)'`, currency, filters.MaxPrice),
		)
	}

	// Spec filters
	for key, value := range filters.Specs {
		if value != "" {
			query = query.Where(`
				EXISTS (
					SELECT 1 FROM component_specs cs
					WHERE cs.component_id = components.id
					AND cs.spec_key = ?
					AND LOWER(cs.spec_value) LIKE LOWER(?)
				)
			`, key, "%"+value+"%")
		}
	}

	return query
}

func (r *ComponentRepository) applySorting(query *gorm.DB, filters ComponentFilter) *gorm.DB {
	sortBy := filters.SortBy
	sortOrder := filters.SortOrder

	if sortBy == "" {
		sortBy = "created_at"
	}
	if sortOrder == "" {
		sortOrder = "desc"
	}

	switch sortBy {
	case "name":
		query = query.Order("components.name " + sortOrder)
	case "price":
		currency := filters.Currency
		if currency == "" {
			currency = "VND"
		}
		query = query.Order(fmt.Sprintf(`
			(SELECT (price_item->>'amount')::numeric
			 FROM jsonb_array_elements(components.price) as price_item
			 WHERE price_item->>'currency' = '%s'
			 LIMIT 1) %s
		`, currency, sortOrder))
	case "brand":
		query = query.Order("brands.display_name " + sortOrder)
	case "category":
		query = query.Order("categories.display_name " + sortOrder)
	default:
		query = query.Order("components." + sortBy + " " + sortOrder)
	}

	return query
}

func (r *ComponentRepository) loadComponentSpecs(component *models.ComponentWithRelations) error {
	var specs []models.ComponentSpec
	err := r.db.Where("component_id = ?", component.ID).Find(&specs).Error
	if err != nil {
		return err
	}

	component.SpecsMap = make(map[string]string)
	for _, spec := range specs {
		component.SpecsMap[spec.SpecKey] = spec.SpecValue
	}

	return nil
}

func (r *ComponentRepository) CreateComponent(component *models.Component, specs map[string]string) error {
	return r.db.Transaction(func(tx *gorm.DB) error {
		err := tx.Create(component).Error
		if err != nil {
			return err
		}

		for key, value := range specs {
			spec := models.ComponentSpec{
				ComponentID:  component.ID,
				SpecKey:      key,
				SpecValue:    value,
				SpecType:     "string",
				IsFilterable: isFilterableSpec(key),
			}
			err := tx.Create(&spec).Error
			if err != nil {
				return err
			}
		}

		return nil
	})
}

func (r *ComponentRepository) CreateCategory(category *models.Category) error {
	return r.db.Transaction(func(tx *gorm.DB) error {
		return tx.Create(category).Error
	})
}

func (r *ComponentRepository) GetAllCategories() ([]models.Category, error) {
	var categories []models.Category
	err := r.db.Order("sort_order").Find(&categories).Error
	return categories, err
}

func (r *ComponentRepository) CreateBrand(brand *models.Brand) error {
	return r.db.Transaction(func(tx *gorm.DB) error {
		return tx.Create(brand).Error
	})
}

func (r *ComponentRepository) GetAllBrands() ([]models.Brand, error) {
	var brands []models.Brand
	err := r.db.Order("display_name").Find(&brands).Error
	return brands, err
}

func (r *ComponentRepository) getComponentSummary(filters ComponentFilter) ComponentStats {
	var categoryResults []struct {
		CategoryName string `json:"category_name"`
		Count        int64  `json:"count"`
	}

	categoryQuery := r.db.Table("components").
		Select("categories.display_name as category_name, COUNT(*) as count").
		Joins("JOIN categories ON components.category_id = categories.id").
		Where("components.is_active = true").
		Group("categories.display_name")

	categoryQuery = r.applyFiltersForSummary(categoryQuery, filters)
	categoryQuery.Find(&categoryResults)

	byCategory := make(map[string]int)
	totalComponents := 0
	for _, result := range categoryResults {
		byCategory[result.CategoryName] = int(result.Count)
		totalComponents += int(result.Count)
	}

	// Get brand summary
	var brandResults []struct {
		BrandName string `json:"brand_name"`
		Count     int64  `json:"count"`
	}

	brandQuery := r.db.Table("components").
		Select("brands.display_name as brand_name, COUNT(*) as count").
		Joins("JOIN brands ON components.brand_id = brands.id").
		Where("components.is_active = true").
		Group("brands.display_name")

	brandQuery = r.applyFiltersForSummary(brandQuery, filters)
	brandQuery.Find(&brandResults)

	byBrand := make(map[string]int)
	for _, result := range brandResults {
		byBrand[result.BrandName] = int(result.Count)
	}

	// Get price range
	currency := filters.Currency
	if currency == "" {
		currency = "VND"
	}

	var priceResult struct {
		MinPrice float64 `json:"min_price"`
		MaxPrice float64 `json:"max_price"`
	}

	priceQuery := r.db.Table("components").
		Select(`MIN((price_item->>'amount')::numeric) as min_price, MAX((price_item->>'amount')::numeric) as max_price`).
		Joins(`CROSS JOIN LATERAL jsonb_array_elements(price) as price_item`).
		Where(`price_item->>'currency' = ? AND is_active = true`, currency)

	priceQuery = r.applyFiltersForSummary(priceQuery, filters)
	priceQuery.Scan(&priceResult)

	return ComponentStats{
		TotalComponents: totalComponents,
		ByCategory:      byCategory,
		ByBrand:         byBrand,
		PriceRange: ComponentPriceRange{
			MinPrice: priceResult.MinPrice,
			MaxPrice: priceResult.MaxPrice,
			Currency: currency,
		},
	}
}

// applyFiltersForSummary applies filters for summary queries (slightly different from main query)
func (r *ComponentRepository) applyFiltersForSummary(query *gorm.DB, filters ComponentFilter) *gorm.DB {
	if filters.CategoryID != "" {
		query = query.Where("components.category_id = ?", filters.CategoryID)
	}

	if filters.BrandID != "" {
		query = query.Where("components.brand_id = ?", filters.BrandID)
	}

	if filters.Search != "" {
		searchTerm := "%" + strings.ToLower(filters.Search) + "%"
		query = query.Where(`LOWER(components.name) LIKE ?`, searchTerm)
	}

	// Apply spec filters if any
	for key, value := range filters.Specs {
		if value != "" {
			query = query.Where(`
				EXISTS (
					SELECT 1 FROM component_specs cs
					WHERE cs.component_id = components.id
					AND cs.spec_key = ?
					AND LOWER(cs.spec_value) LIKE LOWER(?)
				)
			`, key, "%"+value+"%")
		}
	}

	return query
}

// Helper functions
func getCurrencyForLang(lang string) string {
	currencies := map[string]string{
		"en": "USD",
		"vn": "VND",
	}
	if currency, exists := currencies[lang]; exists {
		return currency
	}
	return "VND"
}

func isFilterableSpec(key string) bool {
	filterableSpecs := []string{
		"socket", "form_factor", "memory_type", "storage_type",
		"interface", "generation", "process_size", "tdp_range",
		"wattage", "efficiency", "certification",
	}

	for _, filterable := range filterableSpecs {
		if key == filterable {
			return true
		}
	}
	return false
}
