# PC-004 — Create a PC build from the component catalog

- **Priority:** P1 · **Status:** Backlog · **Epic:** Guided planning · **Depends on:** PC-001, PC-006

## User story

As a PC buyer, I want to add one component for each important part category and see the estimated total, so that I can assemble a complete shortlist before deciding where to buy.

## Acceptance criteria

- **Given** I open the builder, **when** it loads, **then** it shows supported slots (at minimum CPU, motherboard, memory, graphics card, storage, case, power supply, and cooling) and how many are filled.
- **Given** I choose a slot, **when** I select a catalog item, **then** that item appears in the build with its name, price status, and a way to replace or remove it.
- **Given** I add, replace, or remove an item with a known price in the selected currency, **when** the build changes, **then** the estimate updates; unknown prices are excluded and called out instead of treated as zero.
- **Given** one slot is empty, **when** I view the build, **then** it is distinguished as incomplete and is not presented as ready to purchase.
- **Given** the catalog request fails or has no candidates, **when** I select a slot, **then** I receive a recovery action and my existing selections remain intact.

## Out of scope

Checkout, order placement, assembly fulfillment, retailer inventory guarantees, and automatic compatibility claims are separate capabilities.
