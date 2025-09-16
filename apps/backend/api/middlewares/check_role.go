package middlewares

import (
	"net/http"
	"pc-builder/backend/api/models"
	"pc-builder/backend/db"
	"slices"

	"github.com/gin-gonic/gin"
)

func RequireRole(roles ...string) gin.HandlerFunc {
	return func(c *gin.Context) {
		userID, exists := c.Get("user_id")
		if !exists {
			c.JSON(http.StatusUnauthorized, gin.H{
				"status":  http.StatusUnauthorized,
				"message": "Unauthorized",
			})
			c.Abort()
			return
		}

		var user models.User

		if err := db.DB.First(&user, userID).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{
				"status":  http.StatusNotFound,
				"message": "User not found",
				"error":   err.Error(), // Remove this in production
			})
			c.Abort()
			return
		}

		hasRole := slices.Contains(roles, user.Role)

		if !hasRole {
			c.JSON(http.StatusForbidden, gin.H{
				"status":  http.StatusForbidden,
				"message": "You do not have permission to access this resource",
			})
			c.Abort()
			return
		}

		c.Set("user_role", user.Role)
		c.Next()
	}
}
