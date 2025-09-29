package repositories

import (
	"fmt"
	"pc-builder/backend/api/models"
	"strings"

	"gorm.io/gorm"
)

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
