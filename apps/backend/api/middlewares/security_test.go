package middlewares

import (
	"net/http"
	"net/http/httptest"
	"sync"
	"testing"

	"github.com/gin-gonic/gin"
)

func TestRateLimitMiddleware(t *testing.T) {
	for _, tc := range []struct {
		name       string
		middleware gin.HandlerFunc
		limit      int
	}{
		{"givenParallelRequestsFromOneIP_whenApplyingGlobalLimit_thenRejectsExcess", RateLimitMiddleware(), 100},
		{"givenParallelRequestsFromOneIP_whenApplyingAuthLimit_thenRejectsExcess", AuthRateLimitMiddleware(), 5},
	} {
		t.Run(tc.name, func(t *testing.T) {
			router := gin.New()
			router.SetTrustedProxies(nil)
			router.GET("/", tc.middleware, func(c *gin.Context) {
				c.Status(http.StatusNoContent)
			})
			start := make(chan struct{})
			statuses := make([]int, tc.limit+10)
			var requests sync.WaitGroup

			for i := range statuses {
				requests.Add(1)
				go func() {
					defer requests.Done()
					<-start
					response := httptest.NewRecorder()
					router.ServeHTTP(response, httptest.NewRequest(http.MethodGet, "/", nil))
					statuses[i] = response.Code
				}()
			}
			close(start)
			requests.Wait()

			accepted := 0
			for _, status := range statuses {
				switch status {
				case http.StatusNoContent:
					accepted++
				case http.StatusTooManyRequests:
				default:
					t.Fatalf("unexpected status %d", status)
				}
			}
			if accepted != tc.limit {
				t.Fatalf("accepted %d requests, want %d", accepted, tc.limit)
			}
		})
	}
}
