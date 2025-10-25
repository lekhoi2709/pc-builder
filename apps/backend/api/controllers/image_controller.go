package controllers

import (
	"pc-builder/backend/services"
	"pc-builder/backend/utils"

	"github.com/gin-gonic/gin"
)

type ImageController struct {
	cloudinaryService *services.CloudinaryService
}

func NewImageController(cloudinaryService *services.CloudinaryService) *ImageController {
	return &ImageController{
		cloudinaryService: cloudinaryService,
	}
}

func (ctrl *ImageController) UploadSingleImage(c *gin.Context) {
	file, header, err := c.Request.FormFile("image")
	if err != nil {
		utils.BadRequestError(c, "No image file provided", err)
		return
	}
	defer file.Close()

	imageURL, err := ctrl.cloudinaryService.UploadImage(c.Request.Context(), file, header)
	if err != nil {
		utils.InternalServerError(c, "Failed to upload image", err)
		return
	}

	utils.SuccessResponse(c, "Image uploaded successfully", gin.H{
		"url":       imageURL,
		"thumbnail": ctrl.cloudinaryService.GetThumbnailURL(imageURL),
	})
}

func (ctrl *ImageController) UploadMultipleImages(c *gin.Context) {
	form, err := c.MultipartForm()
	if err != nil {
		utils.BadRequestError(c, "Invalid form data", err)
		return
	}

	files := form.File["images"]
	if len(files) == 0 {
		utils.BadRequestError(c, "No image files provided", nil)
		return
	}

	if len(files) > 10 {
		utils.BadRequestError(c, "Maximum 10 images allowed", nil)
		return
	}

	imageURLs, err := ctrl.cloudinaryService.UploadMultipleImages(c.Request.Context(), files)
	if err != nil {
		utils.InternalServerError(c, "Failed to upload images", err)
		return
	}

	thumbnails := make([]string, len(imageURLs))
	for i, url := range imageURLs {
		thumbnails[i] = ctrl.cloudinaryService.GetThumbnailURL(url)
	}

	utils.SuccessResponse(c, "Images uploaded successfully", gin.H{
		"urls":       imageURLs,
		"thumbnails": thumbnails,
		"count":      len(imageURLs),
	})
}

func (ctrl *ImageController) DeleteImage(c *gin.Context) {
	var request struct {
		ImageURL string `json:"image_url" binding:"required"`
	}

	if err := c.ShouldBindJSON(&request); err != nil {
		utils.BadRequestError(c, "Invalid request body", err)
		return
	}

	err := ctrl.cloudinaryService.DeleteImage(c.Request.Context(), request.ImageURL)
	if err != nil {
		utils.InternalServerError(c, "Failed to delete image", err)
		return
	}

	utils.NoContentResponse(c)
}
