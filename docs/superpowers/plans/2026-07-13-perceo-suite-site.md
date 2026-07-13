# Perceo Suite Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Update Perceo Site to present the four-part Perceo Suite across homepage, product data, and documentation.

**Architecture:** Keep the existing Next.js App Router structure and custom Markdown docs renderer. Add suite metadata to the existing product data module, expand the docs registry, update homepage sections, and polish docs components/CSS.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS 4, Framer Motion, local Markdown docs.

## Global Constraints

- No docs framework rewrite.
- No new runtime dependency.
- Keep homepage visual styling intact.
- Clearly mark Archivum and Archductor as in development.
- Clearly mark Archgraph and computer-use testing as concepts.

---

### Task 1: Add Content Contract

**Files:**
- Create: `scripts/validate-perceo-suite-content.mjs`
- Modify: `package.json`

**Interfaces:**
- Produces: `npm run validate:suite`

- [x] Add a validator that checks all four suite products, homepage copy, docs registry, and docs files.
- [x] Run `npm run validate:suite`.
- [x] Expected: fail before implementation because the suite content is not present.

### Task 2: Expand Product and Docs Data

**Files:**
- Modify: `app/data/products.ts`
- Modify: `lib/docs.ts`
- Create: `content/docs/archivum/overview.md`
- Create: `content/docs/archgraph/overview.md`
- Create: `content/docs/computer-use-testing/overview.md`
- Modify: `content/docs/archductor/overview.md`

**Interfaces:**
- Consumes: `products` for nav/docs switcher.
- Produces: docs slugs `archivum`, `archgraph`, `archductor`, `computer-use-testing`.

- [ ] Add suite product metadata.
- [ ] Add docs registry entries.
- [ ] Add professional overview docs for the three missing products.
- [ ] Update Archductor overview to fit the suite narrative.

### Task 3: Update Homepage Copy and Suite Sections

**Files:**
- Modify: `app/components/HeroSection.tsx`
- Modify: `app/components/FeaturesSection.tsx`
- Modify: `app/components/Navbar.tsx`
- Modify: `app/components/Footer.tsx`
- Modify: `app/products/page.tsx`

**Interfaces:**
- Consumes: suite product metadata from `app/data/products.ts`.
- Produces: suite-level home page and product overview.

- [ ] Replace Archductor-only hero copy with Perceo Suite.
- [ ] Replace feature copy with remember/structure/execute/verify model.
- [ ] Update nav/footer brand and CTAs.
- [ ] Make `/products` a product overview instead of redirect.

### Task 4: Polish Docs Shell

**Files:**
- Modify: `app/components/ProductDocsShell.tsx`
- Modify: `app/components/DocsSidebar.tsx`
- Modify: `app/components/DocsProductSwitcher.tsx`
- Modify: `app/docs/[product]/[[...slug]]/page.tsx`
- Modify: `app/globals.css`

**Interfaces:**
- Consumes: parsed Markdown blocks from `lib/docs.ts`.
- Produces: Mintlify-grade custom docs presentation.

- [ ] Improve docs surface, sidebar, search, product switcher, prose, list, and code styling.
- [ ] Keep accessibility basics: labeled search/select, visible focus, high contrast.

### Task 5: Verify and Commit

**Files:**
- All changed files.

- [ ] Run `npm run validate:suite`.
- [ ] Run `npm run lint`.
- [ ] Run `npm run build`.
- [ ] Inspect git diff.
- [ ] Commit with `feat: position site around Perceo suite`.

## Self-Review

- Spec coverage: homepage, product boundaries, docs entries, docs visual polish, and verification are covered.
- Placeholder scan: no placeholders.
- Type consistency: product slugs match planned docs paths.
