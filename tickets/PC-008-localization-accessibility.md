# PC-008 — Make the core journey usable in Vietnamese, English, and with assistive input

- **Priority:** P1 · **Status:** Backlog · **Epic:** Reach and usability · **Depends on:** PC-001, PC-002

## User story

As a Vietnamese or English-speaking buyer, including someone using a keyboard or assistive technology, I want the catalog and build journey to use consistent language and accessible controls, so that I can complete the same task without relying on sight or a mouse.

## Acceptance criteria

- **Given** I choose Vietnamese or English, **when** I navigate home, catalog, product details, builder, error/empty states, and footer, **then** all user-facing labels and messages use that language.
- **Given** I change language, **when** I move to another route, **then** the selected language and relevant search/build state are preserved.
- **Given** I use keyboard navigation, **when** I search, filter, select components, or dismiss a dialog, **then** every action is reachable, has a visible focus state, and works without a pointer.
- **Given** a control has an icon without visible text, **when** a screen reader encounters it, **then** it has an accessible name and state.
- **Given** a form field or validation message is shown, **when** I use a screen reader, **then** its label, error, and relationship to the field are announced.
- **Given** the layout is viewed at a narrow width or zoomed, **when** I complete the primary task, **then** there is no essential horizontal scrolling or clipped action.

## Notes

Validate with an accessibility audit and keyboard/screen-reader walkthrough. Do not claim WCAG conformance until a full audit supports that claim.
