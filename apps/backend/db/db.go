package db

import (
	"fmt"
	"log"
	"pc-builder/backend/api/models"
	"pc-builder/backend/config"
	"time"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func InitPostgres(cfg *config.Config) *gorm.DB {
	sslMode := cfg.DB.SslMode

	if cfg.Environment == "production" && sslMode == "disable" {
		sslMode = "require"
	}

	dsn := fmt.Sprintf(
		"host=%s port=%s user=%s password=%s dbname=%s sslmode=%s timezone=UTC",
		cfg.DB.Host,
		cfg.DB.Port,
		cfg.DB.User,
		cfg.DB.Password,
		cfg.DB.DbName,
		cfg.DB.SslMode,
	)

	var err error
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{
		PrepareStmt:            true,
		SkipDefaultTransaction: true,
	})
	if err != nil {
		log.Fatalf("❌ Failed to connect to database: %v", err)
	}

	// Auto migrate your models
	if err := DB.AutoMigrate(
		&models.Category{},
		&models.Brand{},
		&models.Component{},
		&models.ComponentBrands{},
		&models.ComponentSpec{},
		&models.User{},
	); err != nil {

		log.Fatalf("❌ AutoMigrate failed: %v", err)
	}

	log.Println("✅ Connected to PostgreSQL")

	sqlDB, err := DB.DB()
	if err != nil {
		log.Fatalf("Failed to get underlying sql.DB: %v", err)
	}

	// Configure connection pool
	sqlDB.SetMaxIdleConns(25)
	sqlDB.SetMaxOpenConns(100)
	sqlDB.SetConnMaxLifetime(time.Hour)
	sqlDB.SetConnMaxIdleTime(10 * time.Minute)

	err = createIndexes(DB)
	if err != nil {
		log.Fatalf("❌ Index creation failed: %v", err)
	}

	return DB
}

func createIndexes(db *gorm.DB) error {
	log.Println("🔄 Creating database indexes...")

	// Create indexes using GORM's raw SQL execution
	indexes := []string{
		// Component indexes
		"CREATE INDEX IF NOT EXISTS idx_components_category_id ON components(category_id)",
		"CREATE INDEX IF NOT EXISTS idx_components_brand_id ON components(brand_id)",
		"CREATE INDEX IF NOT EXISTS idx_components_created_at ON components(created_at)",
		"CREATE INDEX IF NOT EXISTS idx_components_is_active ON components(is_active)",
		"CREATE INDEX IF NOT EXISTS idx_components_category_brand ON components(category_id, brand_id)",
		"CREATE INDEX IF NOT EXISTS idx_components_active_category ON components(is_active, category_id) WHERE is_active = true",

		// JSONB indexes for price filtering
		"CREATE INDEX IF NOT EXISTS idx_components_price_gin ON components USING gin(price)",
		"CREATE INDEX IF NOT EXISTS idx_components_image_gin ON components USING gin(image_url)",

		// Component specs indexes
		"CREATE INDEX IF NOT EXISTS idx_component_specs_component_id ON component_specs(component_id)",
		"CREATE INDEX IF NOT EXISTS idx_component_specs_key_value ON component_specs(spec_key, spec_value)",
		"CREATE INDEX IF NOT EXISTS idx_component_specs_filterable ON component_specs(spec_key) WHERE is_filterable = true",

		// Full text search index
		"CREATE INDEX IF NOT EXISTS idx_components_search ON components USING gin(to_tsvector('english', name || ' ' || COALESCE(models, '')))",

		// Category and Brand indexes
		"CREATE INDEX IF NOT EXISTS idx_categories_active ON categories(is_active) WHERE is_active = true",
		"CREATE INDEX IF NOT EXISTS idx_categories_sort_order ON categories(sort_order)",
		"CREATE INDEX IF NOT EXISTS idx_brands_active ON brands(is_active) WHERE is_active = true",
		"CREATE INDEX IF NOT EXISTS idx_brands_display_name ON brands(display_name)",

		// User indexes
		"CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)",
		"CREATE INDEX IF NOT EXISTS idx_users_role ON users(role)",
	}

	for _, indexSQL := range indexes {
		err := db.Exec(indexSQL).Error
		if err != nil {
			log.Printf("⚠️ Failed to create index: %s - %v", indexSQL, err)
			// Continue with other indexes rather than failing completely
		}
	}

	log.Println("✅ Database indexes created")
	return nil
}
