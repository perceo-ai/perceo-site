# perceo-site

Marketing site for [Perceo](https://perceo.ai) — the local-first dev suite
(Archductor, Archfleet, Archivum). Next.js 16 App Router, React 19, Tailwind 4.

Documentation lives in a separate Mintlify project published at
**docs.perceo.ai**. This repo redirects `/docs/*` there; it no longer renders any
docs itself.

## Develop

```bash
npm install
npm run dev
```

## Checks

```bash
npm run validate   # content/site.json shape, slugs, and stale-term guard
npm run lint
npm run build
```

`npm run validate` is the one that catches content drift: it enforces the product
status enum, requires every product slug to have a matching `SuiteProductVisual`
kind, requires `docsHref` to point at `site.docsUrl`, and fails on retired terms
(`archgraph`, `linux-conductor`, `CONDUCTOR_PORT`, the old repo owner).

## Content

Everything user-visible comes from `content/site.json`, typed in
`lib/site-config.ts`. Adding or changing a product means editing that file, not
the components.

A new product also needs:

1. A `SuiteVisualKind` entry and a visual in `app/components/SuiteProductVisual.tsx`
   — the slug and the visual kind must match.
2. A `detail` block, which drives the generated page at `/products/<slug>`.
3. A `homePage.features` entry, or the validator fails on an unused visual.

## Routes

| Route | What it is |
| --- | --- |
| `/` | Home — hero, three scrolling product features, video placeholder |
| `/products` | Three-up product grid |
| `/products/[slug]` | Generated product page, one per entry in `content/site.json` |
| `/docs/*` | Permanent redirect to docs.perceo.ai |

Redirects for retired routes live in `next.config.ts`.

## Source of truth

Product copy tracks the org profile README at
[perceo-ai/.github](https://github.com/perceo-ai) and the product repo READMEs.
When install commands, binary names, or config paths change upstream, update
`content/site.json` here and the matching page in the docs repo.
