# PC-009 — Compare shortlisted components side by side

- **Priority:** P2 · **Status:** Backlog · **Epic:** Buyer confidence · **Depends on:** PC-006

## User story

As a buyer deciding between similar parts, I want to compare a small number of products in the same category, so that I can understand practical differences without opening many tabs.

## Acceptance criteria

- **Given** I browse a category, **when** I add products to comparison, **then** the selection count is visible and capped at a defined small limit (recommended initial limit: four).
- **Given** I open comparison, **when** products load, **then** shared specifications, price status, availability status, and key differences are aligned in a readable table.
- **Given** a specification is missing for one product, **when** comparison renders, **then** it is labeled “not provided” rather than appearing equivalent to zero or false.
- **Given** I remove a product or return to the catalog, **when** I revisit comparison during the same session, **then** my remaining shortlist is preserved.
- **Given** I am on a mobile-width screen, **when** I compare products, **then** I can identify each product and its corresponding values without losing column context.
