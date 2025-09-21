package utils

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type AppError struct {
	Code    int    `json:"code"`
	Message string `json:"message"`
	Type    string `json:"type"`
}

func (e *AppError) Error() string {
	return e.Message
}

func HandleError(c *gin.Context, statusCode int, message string, err error) {
	response := gin.H{
		"status":  statusCode,
		"message": message,
	}

	if gin.Mode() == gin.DebugMode && err != nil {
		response["error"] = err.Error()
	}

	c.JSON(statusCode, response)
}

func HandleAppError(c *gin.Context, appErr *AppError) {
	c.JSON(appErr.Code, gin.H{
		"status":  appErr.Code,
		"message": appErr.Message,
		"type":    appErr.Type,
	})
}

// 400
func BadRequestError(c *gin.Context, message string, err error) {
	HandleError(c, http.StatusBadRequest, message, err)
}

// 401
func UnauthorizedError(c *gin.Context, message string) {
	HandleError(c, http.StatusUnauthorized, message, nil)
}

// 403
func ForbiddenError(c *gin.Context, message string) {
	HandleError(c, http.StatusForbidden, message, nil)
}

// 404
func NotFoundError(c *gin.Context, message string) {
	HandleError(c, http.StatusNotFound, message, nil)
}

// 409
func ConflictError(c *gin.Context, message string) {
	HandleError(c, http.StatusConflict, message, nil)
}

// 500
func InternalServerError(c *gin.Context, message string, err error) {
	HandleError(c, http.StatusInternalServerError, message, err)
}
