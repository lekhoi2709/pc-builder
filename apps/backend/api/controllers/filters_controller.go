package controllers

import (
	"pc-builder/backend/api/models"
	"pc-builder/backend/utils"
	"strings"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func (ctrl *ComponentController) GetAvailableFilters(c *gin.Context) {
	lang := c.GetHeader("Accept-Language")
	if lang == "" {
		lang = "vn"
	}

	filters, err := ctrl.repo.GetAvailableFilters(lang)
	if err != nil {
		utils.InternalServerError(c, "Failed to fetch available filters", err)
		return
	}

	utils.SuccessResponse(c, "Available filters fetched successfully", filters)
}

func (ctrl *ComponentController) CreateCategory(c *gin.Context) {
	var request struct {
		ID          string `json:"id" binding:"required"`
		Name        string `json:"name" binding:"required"`
		DisplayName string `json:"display_name" binding:"required"`
		Description string `json:"description"`
		IconURL     string `json:"icon_url"`
		SortOrder   int    `json:"sort_order"`
	}

	if err := c.ShouldBindJSON(&request); err != nil {
		utils.BadRequestError(c, "Invalid request body", err)
		return
	}

	category := &models.Category{
		ID:          request.ID,
		Name:        request.Name,
		DisplayName: request.DisplayName,
		Description: request.Description,
		IconURL:     request.IconURL,
		SortOrder:   request.SortOrder,
	}

	if err := ctrl.repo.CreateCategory(category); err != nil {
		if strings.Contains(err.Error(), "duplicate key") {
			utils.ConflictError(c, "Category with this ID already exists")
			return
		}

		utils.InternalServerError(c, "Failed to create category", err)
		return
	}

	utils.CreatedResponse(c, "Category created successfully", category)
}

func (ctrl *ComponentController) GetAllCategories(c *gin.Context) {
	categories, err := ctrl.repo.GetAllCategories()
	if err != nil {
		utils.InternalServerError(c, "Failed to fetch categories", err)
		return
	}

	utils.SuccessResponse(c, "Categories fetched successfully", categories)
}

func (ctrl *ComponentController) CreateBrand(c *gin.Context) {
	var request struct {
		ID          string `json:"id" binding:"required"`
		Name        string `json:"name" binding:"required"`
		DisplayName string `json:"display_name" binding:"required"`
		Description string `json:"description"`
		LogoURL     string `json:"logo_url"`
		Website     string `json:"website"`
		Country     string `json:"country"`
	}

	if err := c.ShouldBindJSON(&request); err != nil {
		utils.BadRequestError(c, "Invalid request body", err)
		return
	}

	brand := &models.Brand{
		ID:          request.ID,
		Name:        request.Name,
		DisplayName: request.DisplayName,
		LogoURL:     request.LogoURL,
		Website:     request.Website,
		Country:     request.Country,
	}

	if err := ctrl.repo.CreateBrand(brand); err != nil {
		if strings.Contains(err.Error(), "duplicate key") {
			utils.ConflictError(c, "Brand with this ID already exists")
			return
		}

		utils.InternalServerError(c, "Failed to create brand", err)
		return
	}

	utils.CreatedResponse(c, "Brand created successfully", brand)
}

func (ctrl *ComponentController) GetAllBrands(c *gin.Context) {

	brands, err := ctrl.repo.GetAllBrands()
	if err != nil {
		utils.InternalServerError(c, "Failed to fetch brands", err)
		return
	}

	utils.SuccessResponse(c, "Brands fetched successfully", brands)
}

func (ctrl *ComponentController) UpdateBrand(c *gin.Context) {
	id := c.Param("id")

	var request struct {
		Name        string `json:"name"`
		DisplayName string `json:"display_name"`
		LogoURL     string `json:"logo_url"`
		Website     string `json:"website"`
		Country     string `json:"country"`
	}

	if err := c.ShouldBindBodyWithJSON(&request); err != nil {
		utils.BadRequestError(c, "Invalid Request Body", err)
		return
	}

	var existingBrand models.Brand
	if err := ctrl.db.Where("id = ?", id).First(&existingBrand).Error; err != nil {
		utils.NotFoundError(c, "Brand not found")
		return
	}

	err := ctrl.db.Transaction(func(tx *gorm.DB) error {
		updates := make(map[string]interface{})

		if request.Name != "" {
			updates["name"] = request.Name
		}
		if request.DisplayName != "" {
			updates["display_name"] = request.DisplayName
		}
		if request.LogoURL != "" {
			updates["logo_url"] = request.LogoURL
		}
		if request.Website != "" {
			updates["website"] = request.Website
		}
		if request.Country != "" {
			updates["country"] = request.Country
		}

		if len(updates) > 0 {
			if err := tx.Model(&existingBrand).Updates(updates).Error; err != nil {
				return err
			}
		}
		return nil
	})

	if err != nil {
		utils.InternalServerError(c, "Failed to update brand", err)
		return
	}

	utils.SuccessResponse(c, "Brand updated successfully", nil)
}

func (ctrl *ComponentController) UpdateCategory(c *gin.Context) {
	id := c.Param("id")

	var request struct {
		Name        string `json:"name"`
		DisplayName string `json:"display_name"`
		Description string `json:"description"`
		IconURL     string `json:"icon_url"`
		SortOrder   string `json:"sort_order"`
	}

	if err := c.ShouldBindBodyWithJSON(&request); err != nil {
		utils.BadRequestError(c, "Invalid Request Body", err)
		return
	}

	var existingCategory models.Category
	if err := ctrl.db.Where("id = ?", id).First(&existingCategory).Error; err != nil {
		utils.NotFoundError(c, "Category not found")
		return
	}

	err := ctrl.db.Transaction(func(tx *gorm.DB) error {
		updates := make(map[string]interface{})

		if request.Name != "" {
			updates["name"] = request.Name
		}
		if request.DisplayName != "" {
			updates["display_name"] = request.DisplayName
		}
		if request.Description != "" {
			updates["description"] = request.Description
		}
		if request.IconURL != "" {
			updates["icon_url"] = request.IconURL
		}
		if request.SortOrder != "" {
			updates["sort_order"] = request.SortOrder
		}

		if len(updates) > 0 {
			if err := tx.Model(&existingCategory).Updates(updates).Error; err != nil {
				return err
			}
		}
		return nil
	})

	if err != nil {
		utils.InternalServerError(c, "Failed to update category", err)
		return
	}

	utils.SuccessResponse(c, "Category updated successfully", nil)
}
