# Mintlify-Grade Docs Redesign

## Goal

Rebuild Perceo docs so they feel like a real developer documentation product, closer to Protoface/Mintlify and Conductor docs, not a marketing page with Markdown in a card.

## Reference Patterns

- Protoface: docs landing/index, search + command shortcut affordance, grouped left navigation, right table of contents, card grids for start/reference paths, copy-page affordance, clean code/API presentation.
- Conductor: short task-shaped pages, grouped nav for Get Started/Concepts/Reference/Troubleshooting, breadcrumbs, info callouts, media slots, previous/next links.

## Required Product Behavior

- `/docs` becomes a real docs landing page, not a redirect.
- Docs shell has a dedicated docs top bar, grouped sidebar, content column, and right TOC.
- Sidebar is organized by product and section, not a flat list plus product switcher.
- Content supports Mintlify-like primitives using lightweight Markdown conventions:
  - callouts via `> Info: text`, `> Warning: text`, `> Tip: text`
  - cards via lines like `::card Title | Description | /href`
  - code blocks with language headers and copy buttons
  - previous/next navigation from docs registry order
- Current docs are rewritten into guide-style structure with cards and callouts.
- Keep the implementation custom and dependency-free.

## Visual Direction

- Light docs app surface with white content, subtle borders, dense typography, and dark code blocks.
- 8px radius maximum.
- Search button should look like a command palette trigger even if it only links/filters today.
- Buttons and cards should be crisp, compact, and functional.

## Verification

- Add a docs-quality validator that fails until the required structure and UI primitives exist.
- Run docs-quality validator, suite validator, Archductor validator, lint, build, and route smoke checks.
