package models

import (
	"time"

	"github.com/google/uuid"
)

type User struct {
	ID        uuid.UUID `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"user_id"`
	Email     string    `gorm:"type:varchar(255);uniqueIndex" json:"email"`
	Password  string    `gorm:"type:varchar(255)" json:"password"`
	Role      string    `gorm:"type:varchar(50);default:'user'" json:"role"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}
