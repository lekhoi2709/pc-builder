# PC-006 — Show trustworthy regional prices and availability

- **Priority:** P0 · **Status:** Backlog · **Epic:** Buyer confidence · **Depends on:** confirmation of data owner and source

## User story

As a buyer comparing parts, I want to know the currency, source, and freshness of price and availability information, so that I can tell whether an estimate is useful before contacting a seller.

## Acceptance criteria

- **Given** a product has a price, **when** it is shown in a list, detail page, or build, **then** the currency and price source (or an explicit “reference estimate”) are clear.
- **Given** a price or stock value is imported or edited, **when** the data is saved, **then** the product records when it was last confirmed and by which source/person.
- **Given** a value is stale, missing, or unavailable, **when** a buyer sees it, **then** the UI labels that state and does not present it as current or in stock.
- **Given** more than one market/retailer is supported, **when** I change market, **then** prices and availability are shown for that market and are not silently mixed across sources.
- **Given** a product can be purchased from a supported seller, **when** I choose to buy or check availability, **then** the link opens the correct product page and does not imply PC Builder processes payment.

## Product decision required

Decide whether PC Builder is (a) a reference-price planning tool, (b) a single-store catalog, or (c) a multi-retailer comparison tool. The current schema has price/in-stock fields but no explicit seller, source, or timestamp, so the UI must not claim live multi-store comparison today.
