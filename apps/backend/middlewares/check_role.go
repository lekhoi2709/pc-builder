package middlewares

import (
	"net/http"
	"pc-builder/backend/db"
	"pc-builder/backend/models"

	"github.com/gin-gonic/gin"
)

func RequireRole(roles ...string) gin.HandlerFunc {
	return func(c *gin.Context) {
		userID := c.GetUint("user_id")

		var user models.User

		if err := db.DB.First(&user, userID).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{
				"status":  http.StatusNotFound,
				"message": "User not found",
				"error":   err.Error(), // Remove this in production
			})
		}

		hasRole := false
		for _, role := range roles {
			if user.Role == role {
				hasRole = true
				break
			}
		}

		if !hasRole {
			c.JSON(http.StatusForbidden, gin.H{
				"status":  http.StatusForbidden,
				"message": "You do not have permission to access this resource",
			})
		}

		c.Set("user_role", user.Role)
		c.Next()
	}
}
