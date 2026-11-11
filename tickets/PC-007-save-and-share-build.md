# PC-007 — Save or share a build without requiring an account

- **Priority:** P1 · **Status:** Backlog · **Epic:** Guided planning · **Depends on:** PC-004

## User story

As a buyer discussing a configuration with a friend or shop, I want to save or share the exact build and its warnings, so that the other person can review the same parts without rebuilding it manually.

## Acceptance criteria

- **Given** I have selected components, **when** I choose “Share build,” **then** the application creates a stable link or export containing component IDs, currency/market context, and compatibility status.
- **Given** another person opens a valid shared build, **when** its data loads, **then** they see the same selections, current price status, and any warnings/unknowns.
- **Given** a component has become unavailable or was removed, **when** the shared build opens, **then** the build is preserved and the changed item is clearly marked.
- **Given** I have not signed in, **when** I save a build on this device, **then** I can return to it later on that device without creating an account.
- **Given** the browser cannot copy to clipboard, **when** I select share, **then** I can still select/copy the URL or use a supported native share option.

## Out of scope

Cross-device cloud synchronization and accounts; build a useful anonymous flow first.
