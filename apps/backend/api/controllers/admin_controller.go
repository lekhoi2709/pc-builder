package controllers

import (
	"pc-builder/backend/api/models"
	"pc-builder/backend/db"
	"pc-builder/backend/utils"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type UserResponse struct {
	ID        uuid.UUID `json:"id"`
	Email     string    `json:"email"`
	Role      string    `json:"role"`
	CreatedAt string    `json:"created_at"`
	UpdatedAt string    `json:"updated_at"`
}

func GetAllUsers(c *gin.Context) {
	var users []models.User

	if err := db.DB.Find(&users).Error; err != nil {
		utils.InternalServerError(c, "Failed to fetch users", err)
		return
	}

	var userResponses []UserResponse
	for _, users := range users {
		userResponses = append(userResponses, UserResponse{
			ID:        users.ID,
			Email:     users.Email,
			Role:      users.Role,
			CreatedAt: users.CreatedAt.Format("2006-01-02 15:04:05"),
			UpdatedAt: users.UpdatedAt.Format("2006-01-02 15:04:05"),
		})
	}

	utils.SuccessResponse(c, "Users fetched successfully", map[string]interface{}{
		"total": len(userResponses),
		"users": userResponses,
	})
}
