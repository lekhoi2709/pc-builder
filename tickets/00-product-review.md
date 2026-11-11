# BA review: current product and recommended purpose

**Review date:** 2026-11-11
**Scope:** repository source, product copy and routes, the public deployment URL in the repository README, and publicly available competitor pages.
**Audience:** product owner / project team.

## Executive assessment

The project has a useful foundation: a bilingual Vietnamese/English component catalog, searchable and filterable by category, brand, and price, with product detail and specifications. The backend also exposes authentication and catalog-management APIs.

The clearest purpose supported by the working product is currently **browse and filter PC components**. The homepage instead describes a premium custom-workstation shop and promises a full PC builder, real-time compatibility, assembly, stress testing, AI advice, support, warranty, and international shipping. Several calls to action and footer destinations have no working destination or implementation. That mismatch makes it difficult for a new visitor to know what the site actually offers and weakens trust.

### Recommended purpose (hypothesis to validate)

> Help people in Vietnam choose a PC configuration that fits their needs and budget, understand why its parts work together, and share the configuration before buying.

This is a stronger direction than presenting the project as a retailer without an order, fulfillment, merchant-price, or support system. It uses existing Vietnamese language, VND display, catalog, filter, specification, and backend foundations. Keep checkout, assembly, and vendor-neutral price comparison out of scope until the business model and reliable product data are established.

## Current user and value

### Primary audience recommendation

First-time or occasional PC buyers in Vietnam who know what they want to do (gaming, study/office, creation) and their rough budget, but are unsure which parts to select or whether they are compatible.

### Secondary audience

Experienced DIY builders who want to search the catalog, narrow parts by specifications, and compare a shortlist.

These are hypotheses; no interview, survey, conversion analytics, or customer-support data was available in the repository.

## Current product evidence

### Implemented or represented in source

- Home, component listing, component details, and About routes with /vn and /en locale prefixes.
- Component search, pagination, category/brand/price filters, sorting, specification fields, and URL-backed filters.
- Component detail pages with images, price, in-stock flag, and specification map.
- Price display maps Vietnamese locale to VND and English locale to USD.
- Backend public catalog/filter/health endpoints, authentication endpoints, and protected admin/vendor catalog-management endpoints.

### Promise gaps and friction visible in source

- Home CTAs “Enter the Studio” and “Open The Builder” are buttons without actions. The home search writes URL filters but does not navigate to the component results page.
- Component details show “Add to Build” and a heart button without behavior. There is no build/configuration route or compatibility engine in the current route list.
- Home copy claims live compatibility, AI bottleneck checks, cooling optimization, bespoke assembly, 24-hour testing, global shipping, support and warranty claims. The catalog/application code does not implement these services.
- Navigation links to /auth/signup, but no auth page is registered in the frontend routes. Backend auth endpoints exist; this does not make sign-up usable from the site.
- Footer links such as Contact, Blog, Privacy, Terms, Help, FAQ, and Community point to routes that are not registered. The newsletter form has no submission behavior.
- Home, About, and several shared sections are hard-coded in English despite the vn locale. Stats in the Vietnamese home translation also retain English labels.
- Product detail error handling is generic, and catalog errors expose technical messages. There is little buyer guidance for empty results, unclear data freshness, or what to do next.
- There is no in-repo source for inventory sync, merchant attribution, price timestamp, warranty policy, purchase flow, or user interviews. Do not infer these exist from marketing copy.

## Customer reach and convenience

- **Reach:** Vietnamese and English locale support and VND/USD formatting provide a start, but language coverage is incomplete. Search-engine discovery, educational buying guides, accurate product data, and clear trust/support information need work. This review did not have Vercel Analytics access, so actual traffic and acquisition channels are unknown.
- **First-use clarity:** low. The site looks like a boutique builder/store but behaves like a component directory. It does not make its value proposition or next action obvious.
- **Catalog convenience:** a moderate foundation. URL-backed filters, filter counts, pagination, and product details help people who already know part names. New buyers still have to understand categories and specifications themselves.
- **Purchase confidence:** low until the product states where prices/stock come from and when they were last updated, and either validates a configuration or clearly says compatibility has not been checked.
- **Mobile/accessibility:** responsive layouts exist in code, but keyboard/screen-reader behavior and a rendered mobile session were not verified. Treat accessibility findings as an audit ticket, not as a completed WCAG assessment.

## Competitor comparison

This is a feature comparison from public product pages, not a quality or conversion benchmark.

| Competitor | Publicly visible value | Implication for PC Builder |
|---|---|---|
| [GEARVN Build PC](https://buildpc.gearvn.com/) | Selectable hardware categories, a running subtotal, and a path to talk to an advisor. | A parts list plus price total is already expected in the local market. |
| [PingZone Build PC](https://www.pingzone.vn/build-pc) | Available item counts, progress through nine categories, socket/DDR compatibility filtering, total price, Zalo sharing, and image saving. | PC Builder needs a tangible build workflow and explainable compatibility; sharing is useful for local shopping conversations. |
| [Tanomi Build PC](https://tanomi.vn/build-pc/) | Two entry paths: start from use/budget or choose components directly; sample builds and compatibility prompts. | First-time buyers need a guided path, while experts need direct catalog control. |
| [PCPartPicker](https://pcpartpicker.com/) | A global reference point for system building, compatibility feedback, and part lists. | A catalog alone is not differentiated; local data, language, and decision guidance must carry the value. |

## Positioning recommendation

Position first around **guided, understandable PC planning for Vietnamese buyers**, not “elite workstation fabrication.” The initial differentiation should be:

1. Start from the user's purpose and budget, or let experienced users jump straight into parts.
2. Build a complete parts list and show its running VND total.
3. Explain compatibility warnings and unknowns in plain language.
4. Show data source, availability, and freshness before users rely on the estimate.
5. Share a build with a friend or seller without requiring registration.

Only claim live compatibility, current stock, best/lowest price, assembly, warranty, or support once those capabilities and operational commitments are actually in place.

## Product success measures to add after validation

- Home visit → catalog/builder start rate.
- Search/filter → product detail rate and empty-search rate.
- Builder completion rate; number of known compatibility issues per build.
- Share/export rate and return visits to a saved build.
- Price/stock freshness coverage and unavailable-product rate.
- Organic visits to useful localized guides, then progression to a catalog or build action.

No targets are set because there is no baseline analytics data.

## Review limitations

The live Vercel URL could not be rendered in the available browser session, and direct web-page extraction was unavailable. Therefore, visual layout, actual responsive behavior, loaded catalog data, live navigation, and runtime errors are not confirmed here. The review uses repository source and the public competitor pages linked above. Do a browser walkthrough with the product owner or a real buyer before locking the product direction.
