# PC Builder — product backlog

Product tickets written from the 2026-11-11 business analysis review. **PC-001 is Done.** The remaining tickets are in **Backlog**.

## Product direction

Today, PC Builder is a bilingual catalog for people researching PC parts or preparing to buy them. Visitors can search, filter, and open component pages to review listed prices, images, and specifications.

The planned direction is to grow the catalog into a build planner that helps people choose parts for their use and budget, check compatibility, and share a configuration before buying.

## Priority guide

- **P0 — trust and first use:** users must understand what the site does and reach a working catalog flow.
- **P1 — core value:** help users select, validate, price, and share a PC configuration.
- **P2 — growth and retention:** comparison, search discovery, and optional accounts after the core flow is useful.

## Suggested order

1. PC-002 working home calls to action and search.
2. PC-006 trustworthy price and stock information, starting with confirmation of the data source.
3. PC-004 anonymous PC build planner and PC-005 compatibility rules.
4. PC-003 guided recommendations by use and budget, backed by validated builds.
5. PC-007 save/share, then PC-008 localization and accessibility improvements.
6. PC-009 comparison and PC-010 organic discovery.

Do not promise assembly, delivery, support response times, warranty coverage, live availability, AI advice, or live compatibility unless the data and operation actually provide them.

## Tickets

| ID | Priority | Title | Depends on |
|---|---|---|---|
| [PC-001](PC-001-product-positioning.md) | P0 | Make the product promise match the real product | Product-owner decision |
| [PC-002](PC-002-home-entry-points.md) | P0 | Make homepage search and primary actions work | PC-001 |
| [PC-003](PC-003-guided-build-recommendations.md) | P1 | Start with a use case and budget | PC-001, PC-004, PC-005, PC-006 |
| [PC-004](PC-004-build-planner.md) | P1 | Create a PC build from the component catalog | PC-001, PC-006 |
| [PC-005](PC-005-compatibility-checks.md) | P1 | Explain known compatibility issues in a build | PC-004, reliable structured specifications |
| [PC-006](PC-006-price-and-stock-transparency.md) | P0 | Show trustworthy regional prices and availability | Confirm data owner/source |
| [PC-007](PC-007-save-and-share-build.md) | P1 | Save or share a build without an account | PC-004 |
| [PC-008](PC-008-localization-accessibility.md) | P1 | Make the core journey usable in Vietnamese, English, and with assistive input | PC-001, PC-002 |
| [PC-009](PC-009-compare-components.md) | P2 | Compare shortlisted components side by side | PC-006 |
| [PC-010](PC-010-organic-discovery.md) | P2 | Help new buyers discover useful, indexable PC guidance | PC-001, trustworthy data |

## Evidence and limits

See [the product review](00-product-review.md) for the original snapshot, market comparison, assumptions, and limitations. Validate the target buyer and business model with real users before committing to vendor integrations or commerce features.
