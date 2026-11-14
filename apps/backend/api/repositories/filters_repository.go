package repositories

import (
	"pc-builder/backend/api/models"
	"strings"

	"gorm.io/gorm"
)

func (r *ComponentRepository) GetAvailableFilters(lang string) (*AvailableFilters, error) {
	var categories []models.Category
	var brands []models.Brand
	var specs []FilterOption

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
		Select("brands.*, COUNT(DISTINCT components.id) as component_count").
		Table("brands").
		Joins("LEFT JOIN component_brands ON brands.id = component_brands.brand_id").
		Joins("LEFT JOIN components ON components.id = component_brands.component_id AND components.is_active = true").
		Where("brands.is_active = true").
		Group("brands.id").
		Having("COUNT(DISTINCT components.id) > 0").
		Order("brands.display_name").
		Find(&brands).Error
	if err != nil {
		return nil, err
	}

	err = r.db.
		Select("spec->>'key' AS key, spec->>'value' AS value").
		Table("components").
		Joins("CROSS JOIN LATERAL jsonb_array_elements(components.specs_jsonb) AS spec").
		Where("components.is_active = true AND spec->>'is_filterable' = 'true'").
		Group("spec->>'key', spec->>'value'").
		Order("key, COUNT(*) DESC").
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

	specsByKey := make(map[string][]FilterOption)
	for _, spec := range specs {
		specsByKey[spec.Key] = append(specsByKey[spec.Key], spec)
	}

	return &AvailableFilters{
		Categories: categories,
		Brands:     brands,
		Specs:      specsByKey,
		PriceRange: priceRange,
	}, nil
}

func (r *ComponentRepository) applyFilters(query *gorm.DB, filters ComponentFilter) *gorm.DB {
	if len(filters.CategoryIDs) > 0 {
		query = query.Where("components.category_id IN ?", filters.CategoryIDs)
	}

	if len(filters.BrandIDs) > 0 {
		query = query.Where(`
			EXISTS (
				SELECT 1 FROM component_brands
				WHERE component_brands.component_id = components.id
				AND component_brands.brand_id IN ?
			)
		`, filters.BrandIDs)
	}

	if filters.Search != "" {
		searchTerm := "%" + strings.ToLower(filters.Search) + "%"
		query = query.Where(`
			(LOWER(components.name) LIKE ? OR
			LOWER(categories.display_name) LIKE ? OR
			LOWER(components.models) LIKE ? OR
			EXISTS (
				SELECT 1 FROM component_brands
				JOIN brands ON component_brands.brand_id = brands.id
				WHERE component_brands.component_id = components.id
				AND LOWER(brands.display_name) LIKE ?
			))
		`, searchTerm, searchTerm, searchTerm, searchTerm)
	}

	// Price filters
	currency := filters.Currency
	if currency == "" {
		currency = "VND"
	}

	if filters.MinPrice > 0 {
		query = query.Where(
			`jsonb_path_exists(price, ?::jsonpath, jsonb_build_object('currency', ?::text, 'amount', ?::numeric), true)`,
			`lax $[*] ? (@.currency == $currency && @.amount >= $amount)`, currency, filters.MinPrice,
		)
	}

	if filters.MaxPrice > 0 {
		query = query.Where(
			`jsonb_path_exists(price, ?::jsonpath, jsonb_build_object('currency', ?::text, 'amount', ?::numeric), true)`,
			`lax $[*] ? (@.currency == $currency && @.amount <= $amount)`, currency, filters.MaxPrice,
		)
	}

	return applySpecFilters(query, filters.Specs)
}

func applySpecFilters(query *gorm.DB, specs map[string]string) *gorm.DB {
	for key, value := range specs {
		if value != "" {
			query = query.Where(`
				EXISTS (
					SELECT 1 FROM jsonb_array_elements(components.specs_jsonb) AS spec
					WHERE spec->>'key' = ?
					AND LOWER(spec->>'value') LIKE LOWER(?)
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

func (r *ComponentRepository) GetAllBrands(limit int, withLogo bool) ([]models.Brand, error) {
	var brands []models.Brand
	query := r.db.Order("display_name").Order("id")
	if withLogo {
		query = query.Where("is_active = ? AND TRIM(logo_url) <> ''", true)
	}
	if limit > 0 {
		query = query.Limit(limit)
	}
	err := query.Find(&brands).Error
	return brands, err
}

func (r *ComponentRepository) applyFiltersForSummary(query *gorm.DB, filters ComponentFilter) *gorm.DB {
	if len(filters.CategoryIDs) > 0 {
		query = query.Where("components.category_id IN ?", filters.CategoryIDs)
	}

	if len(filters.BrandIDs) > 0 {
		query = query.Where(`
			EXISTS (
				SELECT 1 FROM component_brands
				WHERE component_brands.component_id = components.id
				AND component_brands.brand_id IN ?
			)
		`, filters.BrandIDs)
	}

	if filters.Search != "" {
		searchTerm := "%" + strings.ToLower(filters.Search) + "%"
		query = query.Where(`LOWER(components.name) LIKE ?`, searchTerm)
	}

	return applySpecFilters(query, filters.Specs)
}
