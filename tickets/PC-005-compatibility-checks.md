# PC-005 — Explain known compatibility issues in a build

- **Priority:** P1 · **Status:** Backlog · **Epic:** Guided planning · **Depends on:** PC-004 and reliable structured specifications

## User story

As a PC buyer, I want compatibility warnings to explain which parts may not work together and why, so that I can correct a build before I buy.

## Acceptance criteria

- **Given** I select parts with known socket, memory-generation, board/case-size, or power constraints, **when** the build changes, **then** the system evaluates applicable rules and identifies affected parts.
- **Given** a rule identifies an incompatibility, **when** the warning is shown, **then** it names the conflicting values in plain language and offers a route to replace a part.
- **Given** the catalog lacks data needed to evaluate a rule, **when** the build is shown, **then** the result is “not checked/unknown,” not “compatible.”
- **Given** specifications or rules are corrected, **when** the build is re-evaluated, **then** the warning state and explanation update consistently.
- **Given** a build has warnings, **when** I share or print it, **then** the warnings and unknown states travel with the build.

## Notes

Start with deterministic rules backed by validated data. Wattage estimates and performance/bottleneck advice need separate definitions and should not be advertised as exact predictions.
