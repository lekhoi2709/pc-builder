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

func SuccessResponse(c *gin.Context, message string, response interface{}) {
	c.JSON(http.StatusOK, APIResponse{
		Status:   http.StatusOK,
		Message:  message,
		Response: response,
	})
}
