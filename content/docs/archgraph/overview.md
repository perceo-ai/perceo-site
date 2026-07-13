# Archgraph Overview

Archgraph is the structured project memory layer of the Perceo Suite.

It is planned as self-hosted GraphRAG infrastructure for products, projects, repositories, branches, commits, issues, PRDs, docs, source files, and agent context.

> Info: Archgraph is a concept product. It is documented now because the boundary prevents Archivum and Archductor from absorbing the wrong responsibilities.

::card Archivum | Human-authored notes, wiki pages, backlinks, and team memory. | /docs/archivum
::card Archductor | Workspaces, PTYs, checks, branches, diffs, reviews, and PR flow. | /docs/archductor
::card Workflow | How execution should consume graph context before work starts. | /docs/archductor/workflow

## Role in the suite

Archgraph structures project knowledge.

When an AI agent asks, "what context matters before touching this repo?", Archgraph should answer with scoped, fresh, provenance-backed project context instead of a pile of loosely related documents.

## What it will model

- Products, projects, repositories, branches, commits, issues, docs, PRs, and source areas.
- Typed nodes and relationships with provenance.
- Freshness, confidence, source type, subsystem, ownership, and branch awareness.
- API and MCP access for agents and internal tools.

## What it is not

- It is not the human editor. Archivum owns notes, wiki navigation, backlinks, and personal/team writing.
- It is not the execution workbench. Archductor owns workspaces, PTYs, branches, checks, and PR flow.
- It is not a generic vector database with branding. The value is typed project memory with provenance.

## Concept status

Archgraph is a concept product. It exists in the suite architecture because the boundary matters now: long-term memory should not live inside Archductor, and repo-aware project graph logic should not bloat Archivum.

The first useful version should ingest existing docs and repository metadata, then expose narrow context retrieval for agent tasks.

```bash
# future retrieval shape
archgraph query "what context matters before changing auth?"
```
