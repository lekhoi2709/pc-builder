package utils

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type APIResponse struct {
	Status   int         `json:"status"`
	Message  string      `json:"message"`
	Response interface{} `json:"response,omitempty"`
	Meta     interface{} `json:"meta,omitempty"`
}

// 200 OK
func SuccessResponse(c *gin.Context, message string, response interface{}) {
	c.JSON(http.StatusOK, APIResponse{
		Status:   http.StatusOK,
		Message:  message,
		Response: response,
	})
}

// 201 Created
func CreatedResponse(c *gin.Context, message string, response interface{}) {
	c.JSON(http.StatusCreated, APIResponse{
		Status:   http.StatusCreated,
		Message:  message,
		Response: response,
	})
}

// 204 No Content
func NoContentResponse(c *gin.Context) {
	c.JSON(http.StatusNoContent, nil)
}
