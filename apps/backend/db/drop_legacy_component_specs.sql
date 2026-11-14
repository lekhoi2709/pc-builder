BEGIN;

DO $$
BEGIN
    IF to_regclass('component_specs') IS NULL THEN
        RETURN;
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM pg_attribute
        WHERE attrelid = to_regclass('components')
          AND attname = 'specs_jsonb'
          AND atttypid = 'jsonb'::regtype
          AND attnotnull
          AND NOT attisdropped
    ) THEN
        RAISE EXCEPTION 'Run the component specs migration before dropping component_specs';
    END IF;
END $$;

DROP TABLE IF EXISTS component_specs RESTRICT;

COMMIT;
