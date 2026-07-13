# Mintlify-Grade Docs Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the Perceo docs shell, landing page, Markdown primitives, and docs content so the result resembles a real Mintlify-style developer documentation product.

**Architecture:** Keep the current Next.js App Router and custom Markdown renderer. Extend `lib/docs.ts` with sectioned nav and previous/next helpers, add renderer support for callouts/cards/code metadata, replace `/docs` redirect with a docs landing page, and restyle shell/sidebar/content around a dedicated docs UI.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS 4, local Markdown parser, Phosphor icons already installed.

## Global Constraints

- No new docs framework.
- No new runtime dependency.
- Preserve existing docs URLs where possible.
- Use grouped docs IA: Get started, Concepts, Guides, Reference.
- Add callouts, cards, code headers, previous/next links, top search affordance.
- Verify with validators, lint, build, and route smoke checks.

---

### Task 1: Content Contract

**Files:**
- Create: `scripts/validate-docs-quality.mjs`
- Modify: `package.json`

**Interfaces:**
- Produces: `npm run validate:docs`

- [x] Add a validator for docs landing, grouped nav, search affordance, callouts, cards, code headers, and previous/next links.
- [x] Run `npm run validate:docs` and confirm it fails before implementation.

### Task 2: Docs Data Model

**Files:**
- Modify: `lib/docs.ts`

**Interfaces:**
- Produces: `getDocsNavGroups()`, `getDocsNeighbors(productSlug, slugParts)`.

- [ ] Add nav section metadata to docs products.
- [ ] Add previous/next helper.
- [ ] Extend parser with callout/card blocks.

### Task 3: Docs Shell and Renderer

**Files:**
- Create: `app/components/DocsTopBar.tsx`
- Create: `app/components/DocsPagination.tsx`
- Modify: `app/components/ProductDocsShell.tsx`
- Modify: `app/components/DocsSidebar.tsx`
- Modify: `app/docs/[product]/[[...slug]]/page.tsx`
- Modify: `app/globals.css`

**Interfaces:**
- Consumes: docs nav groups, page blocks, previous/next metadata.
- Produces: polished docs shell and primitives.

- [ ] Add docs top bar with search/command trigger.
- [ ] Rebuild sidebar as grouped navigation.
- [ ] Render callouts, cards, code headers, and previous/next links.

### Task 4: Docs Landing and Content

**Files:**
- Modify: `app/docs/page.tsx`
- Modify: docs Markdown under `content/docs/**`.

**Interfaces:**
- Consumes: product docs registry.
- Produces: docs landing and richer page content.

- [ ] Replace docs redirect with index page.
- [ ] Add cards/callouts/code examples to product docs.
- [ ] Keep Archductor validator phrases intact.

### Task 5: Verification and Commit

**Files:**
- All changed files.

- [ ] Run `npm run validate:docs`.
- [ ] Run `npm run validate:suite`.
- [ ] Run `npm run validate:archductor`.
- [ ] Run `npm run lint`.
- [ ] Run `npm run build`.
- [ ] Start dev server and smoke check `/docs`, `/docs/archivum`, `/docs/archductor/workflow`.
- [ ] Commit with `feat: rebuild docs experience`.

## Self-Review

- Spec coverage: covers shell, nav, landing, primitives, content, verification.
- Placeholder scan: no placeholders.
- Type consistency: helpers and scripts have stable names.
