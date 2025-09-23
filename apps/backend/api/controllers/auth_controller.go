package controllers

import (
	"pc-builder/backend/api/models"
	"pc-builder/backend/db"
	"pc-builder/backend/utils"

	"github.com/gin-gonic/gin"
)

type AuthRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=6"`
}

func Register(c *gin.Context) {
	var request AuthRequest

	if err := c.ShouldBindJSON(&request); err != nil {
		utils.BadRequestError(c, "Invalid request body", err)
		return
	}

	var existingUser models.User
	if err := db.DB.Where("email = ?", request.Email).First(&existingUser).Error; err == nil {
		utils.ConflictError(c, "Email already exists")
		return
	}

	hashedPassword, err := utils.HashPassword(request.Password)
	if err != nil {
		utils.InternalServerError(c, "Failed to hash password", err)
		return
	}

	newUser := models.User{
		Email:    request.Email,
		Password: hashedPassword,
	}

	if err := db.DB.Create(&newUser).Error; err != nil {
		utils.InternalServerError(c, "Failed to create user", err)
		return
	}

	utils.CreatedResponse(c, "User registered successfully", nil)
}

func Login(c *gin.Context) {
	var request AuthRequest
	if err := c.ShouldBindJSON(&request); err != nil {
		utils.BadRequestError(c, "Invalid request body", err)
		return
	}

	var user models.User
	if err := db.DB.Where("email = ?", request.Email).First(&user).Error; err != nil {
		utils.UnauthorizedError(c, "Invalid email or password")
		return
	}

	if !utils.CheckPasswordHash(request.Password, user.Password) {
		utils.UnauthorizedError(c, "Invalid email or password")
		return
	}

	tokenString, err := utils.GenerateJWT(user.ID, user.Email, user.Role)
	if err != nil {
		utils.InternalServerError(c, "Failed to generate token", err)
		return
	}

	utils.SuccessResponse(c, "Login successful", map[string]string{
		"token": tokenString,
	})
}
