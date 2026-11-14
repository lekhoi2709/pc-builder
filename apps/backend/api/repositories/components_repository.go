package repositories

import (
	"context"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"pc-builder/backend/api/models"
	"strings"

	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

type ComponentRepository struct {
	db *gorm.DB
}

func NewComponentRepository(db *gorm.DB) *ComponentRepository {
	return &ComponentRepository{db: db}
}

func (r *ComponentRepository) WithContext(ctx context.Context) *ComponentRepository {
	return NewComponentRepository(r.db.WithContext(ctx))
}

type ComponentFilter struct {
	CategoryIDs      []string          `form:"category_id"`
	BrandIDs         []string          `form:"brand_id"`
	PrimaryBrandOnly bool              `form:"primary_brand_only"`
	MinPrice         float64           `form:"min_price"`
	MaxPrice         float64           `form:"max_price"`
	Search           string            `form:"search"`
	SortBy           string            `form:"sort_by"`
	SortOrder        string            `form:"sort_order"`
	Currency         string            `form:"currency"`
	Specs            map[string]string `form:"-"`
}

type PaginationParams struct {
	Page     int `form:"page"`
	PageSize int `form:"page_size"`
	After    *ComponentCursor
	PageOnly bool
}

type PaginationMeta struct {
	CurrentPage  int    `json:"current_page"`
	PageSize     int    `json:"page_size"`
	TotalPages   int    `json:"total_pages"`
	TotalRecords int64  `json:"total_records"`
	NextCursor   string `json:"next_cursor,omitempty"`
	HasNext      bool   `json:"has_next"`
}

type ComponentResponse struct {
	Components []models.ComponentWithRelations `json:"components"`
	Pagination PaginationMeta                  `json:"pagination"`
	Filters    ComponentFilter                 `json:"filters"`
	Summary    *ComponentStats                 `json:"summary,omitempty"`
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

type BrandAssociation struct {
	BrandID   string `json:"brand_id"`
	IsPrimary bool   `json:"is_primary"`
}

func (r *ComponentRepository) GetComponentsWithFilters(filters ComponentFilter, pagination PaginationParams) (*ComponentResponse, error) {
	priceColumn := indexedPrice(filters)
	fields := `
			components.id,
			components.name,
			components.category_id,
			components.models,
			components.price,
			components.image_url,
			components.specs_jsonb,
			components.is_active,
			components.in_stock,
			components.created_at,
			components.updated_at,
			categories.name as category_name,
			categories.display_name as category_display
		`
	if filters.SortBy != "price" {
		priceColumn = ""
	}
	if priceColumn != "" {
		fields += ", " + priceSortExpression(priceColumn) + "::text AS cursor_price"
	}
	query := r.db.Model(&models.Component{}).Select(fields).
		Joins("JOIN categories ON components.category_id = categories.id").
		Where("components.is_active = true")
	query = r.applySorting(r.applyFilters(query, filters), filters)

	if after := pagination.After; after != nil {
		column, value := "components.name", after.Name
		if filters.SortBy == "price" {
			column, value = priceSortExpression(priceColumn), after.Price
		}
		operator := ">"
		if filters.SortOrder == "desc" {
			operator = "<"
		}
		boundary := "(?, ?)"
		if filters.SortBy == "price" {
			boundary = "(?::numeric, ?)"
		}
		query = query.Where("("+column+", components.id) "+operator+" "+boundary, value, after.ID)
	} else {
		offset := int64(pagination.Page-1) * int64(pagination.PageSize)
		query = query.Offset(int(offset))
	}

	var componentResults []struct {
		models.Component
		CategoryName    string
		CategoryDisplay string
		CursorPrice     string
	}

	if err := query.Limit(pagination.PageSize + 1).Find(&componentResults).Error; err != nil {
		return nil, err
	}
	hasNext := len(componentResults) > pagination.PageSize
	if hasNext {
		componentResults = componentResults[:pagination.PageSize]
	}

	components := make([]models.ComponentWithRelations, len(componentResults))
	pageComponents := make([]*models.ComponentWithRelations, len(componentResults))
	for i, result := range componentResults {
		components[i] = models.ComponentWithRelations{
			Component:       result.Component,
			CategoryName:    result.CategoryName,
			CategoryDisplay: result.CategoryDisplay,
		}

		if err := populateSpecsMap(&components[i]); err != nil {
			return nil, err
		}

		pageComponents[i] = &components[i]
	}
	if err := r.loadComponentBrands(pageComponents...); err != nil {
		return nil, err
	}

	response := &ComponentResponse{
		Components: components,
		Pagination: PaginationMeta{CurrentPage: pagination.Page, PageSize: pagination.PageSize},
		Filters:    filters,
	}
	response.Pagination.HasNext = hasNext
	if hasNext && cursorOrder(filters) {
		last := componentResults[len(componentResults)-1]
		token, err := json.Marshal(ComponentCursor{
			Name: last.Name, ID: last.ID, Order: filters.SortOrder,
			Price: last.CursorPrice, Currency: priceColumn,
		})
		if err != nil {
			return nil, err
		}
		response.Pagination.NextCursor = base64.RawURLEncoding.EncodeToString(token)
	}
	if !pagination.PageOnly {
		stats, err := r.GetCatalogStats(filters)
		if err != nil {
			return nil, err
		}
		response.Summary = &stats.Summary
		response.Pagination.TotalRecords = stats.TotalRecords
		response.Pagination.TotalPages = int((stats.TotalRecords + int64(pagination.PageSize) - 1) / int64(pagination.PageSize))
	}
	return response, nil
}

func (r *ComponentRepository) GetComponentByID(id string) (*models.ComponentWithRelations, error) {
	var component models.ComponentWithRelations
	err := r.db.
		Select(`
			components.id,
			components.name,
			components.category_id,
			components.models,
			components.price,
			components.image_url,
			components.specs_jsonb,
			components.is_active,
			components.in_stock,
			components.created_at,
			components.updated_at,
			categories.name as category_name,
			categories.display_name as category_display
		`).
		Table("components").
		Joins("JOIN categories ON components.category_id = categories.id").
		Where("components.id = ? AND components.is_active = true", id).
		First(&component).Error

	if err != nil {
		return nil, err
	}

	// Load brands
	err = r.loadComponentBrands(&component)
	if err != nil {
		return nil, err
	}

	err = populateSpecsMap(&component)
	if err != nil {
		return nil, err
	}

	return &component, nil
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
		if cursorOrder(filters) {
			query = query.Order("components.id " + sortOrder)
		}
	case "price":
		if column := indexedPrice(filters); column != "" {
			return query.Order(priceSortExpression(column) + " " + sortOrder).Order("components.id " + sortOrder)
		}
		currency := filters.Currency
		if currency == "" {
			currency = "VND"
		}
		query = query.Order(clause.OrderBy{Expression: clause.Expr{SQL: `
			(SELECT (price_item->>'amount')::numeric
			 FROM jsonb_array_elements(components.price) as price_item
			 WHERE price_item->>'currency' = ?
			 LIMIT 1) ` + sortOrder, Vars: []interface{}{currency}}})
	case "brand":
		query = query.Order(fmt.Sprintf(`
			(SELECT brands.display_name
			 FROM component_brands
			 JOIN brands ON component_brands.brand_id = brands.id
			 WHERE component_brands.component_id = components.id
			 AND component_brands.is_primary = true
			 LIMIT 1) %s
		`, sortOrder))
	case "category":
		query = query.Order("categories.display_name " + sortOrder)
	default:
		query = query.Order("components." + sortBy + " " + sortOrder)
	}

	return query
}

func (r *ComponentRepository) loadComponentBrands(components ...*models.ComponentWithRelations) error {
	if len(components) == 0 {
		return nil
	}

	ids := make([]string, 0, len(components))
	byID := make(map[string]*models.ComponentWithRelations, len(components))
	for _, component := range components {
		ids = append(ids, component.ID)
		byID[component.ID] = component
		component.BrandNames = []string{}
		component.BrandDisplays = []string{}
		component.PrimaryBrand = ""
	}

	var brandAssociations []struct {
		ComponentID  string
		BrandName    string
		BrandDisplay string
		IsPrimary    bool
	}

	err := r.db.Table("component_brands").
		Select("component_brands.component_id, brands.name as brand_name, brands.display_name as brand_display, component_brands.is_primary").
		Joins("JOIN brands ON component_brands.brand_id = brands.id").
		Where("component_brands.component_id IN ?", ids).
		Order("component_brands.is_primary DESC, brands.display_name ASC").
		Find(&brandAssociations).Error

	if err != nil {
		return err
	}

	for _, assoc := range brandAssociations {
		component := byID[assoc.ComponentID]
		component.BrandNames = append(component.BrandNames, assoc.BrandName)
		component.BrandDisplays = append(component.BrandDisplays, assoc.BrandDisplay)
		if assoc.IsPrimary && component.PrimaryBrand == "" {
			component.PrimaryBrand = assoc.BrandDisplay
		}
	}

	return nil
}

func populateSpecsMap(component *models.ComponentWithRelations) error {
	var specs []models.ComponentSpec
	if err := json.Unmarshal(component.Specs, &specs); err != nil {
		return err
	}

	component.SpecsMap = make(map[string]string, len(specs))
	for _, spec := range specs {
		component.SpecsMap[spec.Key] = spec.Value
	}
	return nil
}

func (r *ComponentRepository) CreateComponent(component *models.Component, brandAssociations []BrandAssociation) error {
	return r.db.Transaction(func(tx *gorm.DB) error {
		err := tx.Create(component).Error
		if err != nil {
			return err
		}

		for _, brandAssoc := range brandAssociations {
			componentBrand := models.ComponentBrands{
				ComponentID: component.ID,
				BrandID:     brandAssoc.BrandID,
				IsPrimary:   brandAssoc.IsPrimary,
			}
			err := tx.Create(&componentBrand).Error
			if err != nil {
				return err
			}
		}

		return nil
	})
}

type CatalogStats struct {
	TotalRecords int64          `json:"total_records"`
	Summary      ComponentStats `json:"summary"`
}

func (r *ComponentRepository) GetCatalogStats(filters ComponentFilter) (CatalogStats, error) {
	var stats CatalogStats
	query := r.db.Model(&models.Component{}).
		Joins("JOIN categories ON components.category_id = categories.id").
		Where("components.is_active = true")
	if err := r.applyFilters(query, filters).Count(&stats.TotalRecords).Error; err != nil {
		return stats, err
	}
	var err error
	stats.Summary, err = r.getComponentSummary(filters)
	return stats, err
}

func (r *ComponentRepository) getComponentSummary(filters ComponentFilter) (ComponentStats, error) {
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
	if err := categoryQuery.Find(&categoryResults).Error; err != nil {
		return ComponentStats{}, err
	}

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
		Select("brands.display_name as brand_name, COUNT(DISTINCT components.id) as count").
		Joins("JOIN component_brands ON components.id = component_brands.component_id").
		Joins("JOIN brands ON component_brands.brand_id = brands.id").
		Where("components.is_active = true")

	if filters.PrimaryBrandOnly {
		brandQuery = brandQuery.Where("component_brands.is_primary = true")
	}

	brandQuery = brandQuery.Group("brands.display_name")
	brandQuery = r.applyFiltersForSummary(brandQuery, filters)
	if err := brandQuery.Find(&brandResults).Error; err != nil {
		return ComponentStats{}, err
	}

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

	// Create base query with filters applied
	priceQuery := r.db.Table("components").
		Select(`MIN((price_item->>'amount')::numeric) as min_price, MAX((price_item->>'amount')::numeric) as max_price`).
		Joins(`CROSS JOIN LATERAL jsonb_array_elements(price) as price_item`).
		Joins("JOIN categories ON components.category_id = categories.id").
		Where(`price_item->>'currency' = ? AND components.is_active = true`, currency)

	// Apply filters to price query
	priceQuery = r.applyFiltersForPriceRange(priceQuery, filters)
	if err := priceQuery.Scan(&priceResult).Error; err != nil {
		return ComponentStats{}, err
	}

	return ComponentStats{
		TotalComponents: totalComponents,
		ByCategory:      byCategory,
		ByBrand:         byBrand,
		PriceRange: ComponentPriceRange{
			MinPrice: priceResult.MinPrice,
			MaxPrice: priceResult.MaxPrice,
			Currency: currency,
		},
	}, nil
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

func (r *ComponentRepository) applyFiltersForPriceRange(query *gorm.DB, filters ComponentFilter) *gorm.DB {
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
				SELECT 1 FROM component_brands cb
				JOIN brands b ON cb.brand_id = b.id
				WHERE cb.component_id = components.id
				AND LOWER(b.display_name) LIKE ?
			))
		`, searchTerm, searchTerm, searchTerm, searchTerm)
	}

	return applySpecFilters(query, filters.Specs)
}
