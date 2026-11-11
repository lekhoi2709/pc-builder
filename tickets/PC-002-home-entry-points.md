# PC-002 — Make homepage search and primary actions work

- **Priority:** P0 · **Status:** Backlog · **Epic:** Trust and first use · **Depends on:** PC-001

## User story

As a visitor who has a part name or knows what I want, I want homepage search and primary buttons to take me to useful results, so that I do not have to guess where to continue.

## Acceptance criteria

- **Given** I type a term into home-page search and submit it, **when** results load, **then** I land on the catalog with the term applied and visible in the URL and input.
- **Given** I click the primary home-page action, **when** the action is activated by mouse, keyboard, or touch, **then** I reach the working catalog or builder route named by the button.
- **Given** a home-page section advertises a capability that is not available, **when** I activate its control, **then** I am not left with no feedback; the control is removed or leads to a clearly labeled alternative.
- **Given** search returns no matches or the catalog request fails, **when** the results view appears, **then** I see a plain-language empty/error message and a working way to edit or clear the search.

## Evidence

The home search currently updates query parameters on the current route; home calls to action are buttons without navigation handlers.
