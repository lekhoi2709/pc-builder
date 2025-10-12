package middlewares

import (
	"fmt"
	"net/http"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func SetupSecurityMiddleware(router *gin.Engine) {
	corsConfig := cors.Config{
		AllowOrigins: []string{
			"http://localhost:5173",
			"https://pc-builder-frontend-odbrf1cg0-lekhoi2709s-projects.vercel.app",
		},
		AllowMethods: []string{
			http.MethodGet,
			http.MethodPost,
			http.MethodPut,
			http.MethodDelete,
		},
		AllowHeaders: []string{
			"Origin", "Content-Type", "X-CSRF-Token", "Authorization",
			"Accept", "Cache-Control", "X-Requested-With",
		},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour, // 12 hours
	}

	router.Use(cors.New(corsConfig))
	router.Use(RateLimitMiddleware())
	router.Use(RequestIDMiddleware())
	router.Use(SecurityLogMiddleware())
}

func RateLimitMiddleware() gin.HandlerFunc {
	clientRequests := make(map[string][]time.Time)

	return func(c *gin.Context) {
		clientIP := c.ClientIP()
		now := time.Now()

		if requests, exists := clientRequests[clientIP]; exists {
			validRequests := []time.Time{}
			for _, requestTime := range requests {
				if now.Sub(requestTime) < time.Minute {
					validRequests = append(validRequests, requestTime)
				}
			}
			clientRequests[clientIP] = validRequests
		}

		if len(clientRequests[clientIP]) >= 100 {
			c.JSON(429, gin.H{
				"error": "Too many requests, please try again later.",
			})
			c.Abort()
			return
		}

		clientRequests[clientIP] = append(clientRequests[clientIP], now)
		c.Next()
	}
}

func RequestIDMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		requestID := fmt.Sprintf("%d", time.Now().UnixNano())
		c.Header("X-Request-ID", requestID)
		c.Set("RequestID", requestID)
		c.Next()
	}
}

func SecurityLogMiddleware() gin.HandlerFunc {
	return gin.LoggerWithFormatter(func(param gin.LogFormatterParams) string {
		var statusColor, methodColor, resetColor string
		if param.IsOutputColor() {
			statusColor = param.StatusCodeColor()
			methodColor = param.MethodColor()
			resetColor = param.ResetColor()
		}

		if param.Latency > time.Minute {
			param.Latency = param.Latency.Truncate(time.Second)
		}

		// Enhanced format with colors and security info
		return fmt.Sprintf("[GIN] %v |%s %3d %s| %12v | %15s |%s %-7s %s %#v | %s\n%s",
			param.TimeStamp.Format("2006/01/02 - 15:04:05"),
			statusColor, param.StatusCode, resetColor,
			param.Latency,
			param.ClientIP,
			methodColor, param.Method, resetColor,
			param.Path,
			param.Request.UserAgent(),
			param.ErrorMessage,
		)
	})
}

func SetupTrustedProxies(router *gin.Engine) {
	trustedProxies := []string{
		"127.0.0.1", // localhost
		"::1",       // IPv6 localhost
	}

	router.SetTrustedProxies(trustedProxies)
}
