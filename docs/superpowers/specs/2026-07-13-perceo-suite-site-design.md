# Perceo Suite Site Design

## Goal

Reposition the website from an Archductor-only launch page into a polished Perceo Suite site that sells a four-part AI work stack before every product is ready.

## Customer Impact

Visitors should understand the suite in one pass: Archivum remembers, Archgraph structures, Archductor executes, and computer-use testing verifies. The site should feel credible enough for early customers, collaborators, and investors while staying honest about which products are in development.

## Approach

Keep the current dark animated home page and reuse its visual system. Change the microcopy and product data so the homepage becomes suite-level, then add docs entries for all four suite components. Restyle the docs shell toward a Mintlify-grade product manual without replacing the existing Markdown renderer.

## Product Boundaries

- Archivum: current product, human knowledge workspace, server-hosted Obsidian with AI ingest, wiki, search, graph, and MCP.
- Archgraph: concept product, structured project memory and GraphRAG infrastructure.
- Archductor: current product, Linux-native agent execution workbench.
- Computer-use Testing: concept product, autonomous browser, desktop, mobile, and voice QA/eval layer.

## Design Rules

- Keep the homepage styling: dark background, grid, dot field, animated typography, sticky visuals.
- Replace Archductor-only copy with the suite stack story.
- Keep claims grounded: only Archivum and Archductor are in development; Archgraph and testing are future concepts.
- Make docs look ultra professional: clean sidebar, product switcher, readable prose, cards/callouts, crisp code blocks.
- Do not add a new docs framework or large dependency.

## Verification

- Add a validator that fails until the four products, homepage copy, docs registry, and docs files exist.
- Run lint, validator, and production build before completion.
