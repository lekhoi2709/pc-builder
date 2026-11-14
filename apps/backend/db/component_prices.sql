ALTER TABLE components
    ADD COLUMN IF NOT EXISTS price_vnd numeric GENERATED ALWAYS AS (
        (jsonb_path_query_first(price, 'lax $[*] ? (@.currency == "VND")')->>'amount')::numeric
    ) STORED,
    ADD COLUMN IF NOT EXISTS price_usd numeric GENERATED ALWAYS AS (
        (jsonb_path_query_first(price, 'lax $[*] ? (@.currency == "USD")')->>'amount')::numeric
    ) STORED;
