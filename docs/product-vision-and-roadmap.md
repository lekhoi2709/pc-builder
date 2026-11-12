# PC Builder: product vision and roadmap

**Status:** Working direction, captured 2026-11-12  
**Purpose:** Keep the product's long-term intent visible while delivering it in small, coherent steps.

## Product vision

PC Builder aims to help people who want to build a PC but feel uncertain about parts, prices, quality, and performance. The long-term experience should let them explore parts, assemble a configuration, understand trade-offs, and make a more informed buying decision.

The creator's original vision includes:

- Finding component prices that reflect current market data.
- Building a PC configuration from selected components.
- Viewing a 3D representation of the configuration.
- Getting AI-assisted guidance.
- Seeing approximate frame rates (FPS) for selected games.

This is an aspirational direction, not a claim that these capabilities exist today or a commitment to implement all of them. The product should earn each promise through a working, explainable feature and trustworthy data.

## What the product supports today

The current repository primarily supports discovering PC components through a catalog. Users can search and filter components, including by category, brand, price, and available specifications, and open component detail pages. The current product review and backlog are in [`tickets/00-product-review.md`](../tickets/00-product-review.md) and [`tickets/README.md`](../tickets/README.md).

The repository does not currently establish that PC Builder provides live price or stock updates, a working PC build planner, compatibility validation, 3D configuration previews, evaluated AI recommendations, or game-specific FPS estimates. Do not present these as available until implementation and data support them.

## Product principles

1. **Be accurate about today's capability.** Distinguish working features from experiments and future plans.
2. **Build a complete user journey in slices.** Each slice should have a clear entry point, useful result, recovery path, and consistent behavior across the relevant pages.
3. **Make recommendations explainable.** Show the data, assumptions, and unknowns behind prices, compatibility, AI advice, and performance estimates.
4. **Treat data freshness as a product feature.** Identify the source and last confirmation time when users rely on changing prices or availability.
5. **Keep the core journey coherent.** Shared component data, currency/market context, locale, build state, and warnings should behave consistently across catalog, planner, recommendations, and shared builds.
6. **Prefer a small useful release over a broad unfinished promise.** Validate a feature with users before expanding its scope.

## Suggested delivery path

This sequence is a planning aid. Reorder it when repository evidence, learning goals, or user feedback justify a change.

### 0. Make the current product understandable

- Align the homepage, About page, metadata, and README with the catalog that works today.
- Make primary actions lead to existing destinations.
- Record the product's chosen positioning and keep future capabilities clearly identified as future work.

Related backlog: [PC-001](../tickets/PC-001-product-positioning.md), [PC-002](../tickets/PC-002-home-entry-points.md).

### 1. Make component information useful for a buying decision

- Establish who owns component data and where prices and stock information come from.
- Show source, currency/market, freshness, and unknown or stale states where available.
- Improve specification completeness and consistency before relying on it for compatibility or performance advice.

Related backlog: [PC-006](../tickets/PC-006-price-and-stock-transparency.md), [PC-008](../tickets/PC-008-localization-accessibility.md).

### 2. Let users assemble and share a configuration

- Create a build from catalog components and show a transparent estimate.
- Preserve incomplete builds and clearly label missing or unknown information.
- Add deterministic compatibility checks only for rules backed by validated specifications.
- Allow a build to be saved or shared with its selections, market context, and warnings.

Related backlog: [PC-004](../tickets/PC-004-build-planner.md), [PC-005](../tickets/PC-005-compatibility-checks.md), [PC-007](../tickets/PC-007-save-and-share-build.md).

### 3. Guide users from needs and budget

- Start with curated, reviewed configurations for supported use cases and budgets.
- Explain why parts were selected, what assumptions were made, and when the system cannot make a recommendation.
- Consider AI assistance only after reliable data and evaluation criteria exist; identify generated advice and its limits.

Related backlog: [PC-003](../tickets/PC-003-guided-build-recommendations.md).

### 4. Explore advanced differentiating features

Evaluate each capability as a separate product and technical decision, with a small prototype and a measurable quality bar before making it part of the main journey:

- **Live prices:** identify supported retailers/markets, permitted data sources, update frequency, attribution, and stale-data behavior.
- **3D builds:** determine whether component models and dimensions are available, what the visualization must help users decide, and how missing models are represented.
- **AI guidance:** define supported questions, evidence sources, safe handling of unknown data, evaluation examples, and a non-AI fallback.
- **Game FPS estimates:** select a limited set of games and hardware, obtain a trustworthy benchmark source, state resolution/quality assumptions, and show estimates as ranges rather than guarantees.

Do not bundle these into one large release. Each may be deferred, replaced, or dropped if it cannot provide dependable user value at a reasonable learning and maintenance cost.

### 5. Improve discovery and comparison after the core journey works

- Add comparison for a small shortlist with missing specifications shown explicitly.
- Publish localized buying guidance only where the advice can be kept accurate and sourced.

Related backlog: [PC-009](../tickets/PC-009-compare-components.md), [PC-010](../tickets/PC-010-organic-discovery.md).

## How to use this roadmap

- Keep tickets as the unit of implementation; this document records intent and sequencing across tickets.
- Before starting a capability, write down its user outcome, required data, dependencies, unknowns, and acceptance criteria.
- Finish and review one coherent slice before adding dependent marketing claims or starting several advanced features at once.
- Update this document when the product direction changes or a capability is validated, deferred, or ruled out. Do not treat an old roadmap item as an automatic commitment.
