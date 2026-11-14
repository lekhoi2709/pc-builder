package db

import (
	_ "embed"
	"fmt"
	"log"
	"pc-builder/backend/api/models"
	"pc-builder/backend/config"
	"time"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

//go:embed component_prices.sql
var componentPricesSQL string

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
	// Schema changes can invalidate prepared SELECT * statements on reused connections.
	DB, err = gorm.Open(postgres.New(postgres.Config{
		DSN:                  dsn,
		PreferSimpleProtocol: true,
	}), &gorm.Config{
		SkipDefaultTransaction: true,
	})
	if err != nil {
		log.Fatalf("❌ Failed to connect to database: %v", err)
	}

	if err := migrateComponentSpecs(DB); err != nil {
		log.Fatalf("❌ Component specs migration failed: %v", err)
	}

	if err := DB.AutoMigrate(
		&models.Category{},
		&models.Brand{},
		&models.Component{},
		&models.ComponentBrands{},
		&models.User{},
	); err != nil {

		log.Fatalf("❌ AutoMigrate failed: %v", err)
	}

	if err := DB.Exec(componentPricesSQL).Error; err != nil {
		log.Fatalf("❌ Component price migration failed: %v", err)
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

func migrateComponentSpecs(db *gorm.DB) error {
	return db.Exec(`
		DO $$
		DECLARE
			legacy_constraint name;
		BEGIN
			IF to_regclass('components') IS NULL OR EXISTS (
				SELECT 1 FROM pg_attribute
				WHERE attrelid = to_regclass('components')
				AND attname = 'specs_jsonb' AND NOT attisdropped
			) THEN
				RETURN;
			END IF;

			ALTER TABLE components ADD COLUMN IF NOT EXISTS specs_jsonb jsonb;

			IF to_regclass('component_specs') IS NOT NULL THEN
				UPDATE components AS component
				SET specs_jsonb = legacy.specs
				FROM (
					SELECT component_id, jsonb_agg(
						jsonb_build_object(
							'key', spec_key,
							'value', spec_value,
							'is_filterable', is_filterable,
							'type', spec_type
						) ORDER BY id
					) AS specs
					FROM component_specs
					GROUP BY component_id
				) AS legacy
				WHERE component.id = legacy.component_id AND component.specs_jsonb IS NULL;

				-- Keep the old rows as a snapshot without restricting component deletes.
				FOR legacy_constraint IN
					SELECT conname FROM pg_constraint
					WHERE conrelid = to_regclass('component_specs')
					AND confrelid = to_regclass('components') AND contype = 'f'
				LOOP
					EXECUTE format('ALTER TABLE component_specs DROP CONSTRAINT %I', legacy_constraint);
				END LOOP;
			END IF;

			UPDATE components SET specs_jsonb = '[]'::jsonb WHERE specs_jsonb IS NULL;
			ALTER TABLE components ALTER COLUMN specs_jsonb SET DEFAULT '[]'::jsonb,
				ALTER COLUMN specs_jsonb SET NOT NULL;
		END $$;
	`).Error
}

func createIndexes(db *gorm.DB) error {
	log.Println("🔄 Creating database indexes...")

	// Create indexes using GORM's raw SQL execution
	indexes := []string{
		// Component indexes
		"CREATE INDEX IF NOT EXISTS idx_components_category_id ON components(category_id)",
		"CREATE INDEX IF NOT EXISTS idx_components_created_at ON components(created_at)",
		"CREATE INDEX IF NOT EXISTS idx_components_is_active ON components(is_active)",
		"CREATE INDEX IF NOT EXISTS idx_components_active_category ON components(is_active, category_id) WHERE is_active = true",
		"CREATE INDEX IF NOT EXISTS idx_components_active_name_id ON components(name, id) WHERE is_active = true",
		"CREATE INDEX IF NOT EXISTS idx_components_active_vnd_id ON components (COALESCE(price_vnd, 'Infinity'::numeric), id) WHERE is_active = true",
		"CREATE INDEX IF NOT EXISTS idx_components_active_usd_id ON components (COALESCE(price_usd, 'Infinity'::numeric), id) WHERE is_active = true",

		// JSONB indexes for price filtering
		"CREATE INDEX IF NOT EXISTS idx_components_price_gin ON components USING gin(price)",
		"CREATE INDEX IF NOT EXISTS idx_components_image_gin ON components USING gin(image_url)",

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
