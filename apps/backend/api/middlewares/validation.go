package middlewares

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

func ValidateComponentInput() gin.HandlerFunc {
	return func(c *gin.Context) {
		contentType := c.GetHeader("Content-Type")

		if !strings.Contains(contentType, "application/json") {
			c.JSON(http.StatusBadRequest, gin.H{
				"status":  http.StatusBadRequest,
				"message": "Content-Type must be application/json",
			})
			c.Abort()
			return
		}

		c.Next()
	}
}

func ValidateQueryParams() gin.HandlerFunc {
	return func(c *gin.Context) {
		if page := c.Query("page"); page != "" {
			if len(page) > 10 {
				c.JSON(http.StatusBadRequest, gin.H{
					"status":  http.StatusBadRequest,
					"message": "Invalid page parameter",
				})
				c.Abort()
				return
			}
		}

		if pageSize := c.Query("page_size"); pageSize != "" {
			if len(pageSize) > 3 {
				c.JSON(http.StatusBadRequest, gin.H{
					"status":  http.StatusBadRequest,
					"message": "Invalid page_size parameter",
				})
				c.Abort()
				return
			}
		}

		if search := c.Query("search"); search != "" {
			if len(search) > 250 {
				c.JSON(http.StatusBadRequest, gin.H{
					"status":  http.StatusBadRequest,
					"message": "Search query too long (max 250 characters)",
				})
				c.Abort()
				return
			}
		}

		c.Next()
	}
}
