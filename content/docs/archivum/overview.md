# Archivum Overview

Archivum is the human knowledge layer of the Perceo Suite.

It is a self-hosted second brain for people and teams who want durable Markdown knowledge, calm editing, AI-native ingest, semantic search, graph exploration, and MCP access without giving up control of their data.

> Info: Archivum is in development. The current positioning is intentionally narrow: human knowledge first, repo graph memory elsewhere.

::card Archgraph | See how structured project memory stays separate from the human wiki. | /docs/archgraph
::card Archductor | See how agent execution consumes memory without owning long-term knowledge. | /docs/archductor
::card Computer-use testing | See where future behavioral verification fits in the stack. | /docs/computer-use-testing

## Role in the suite

Archivum stores human knowledge.

Use it for notes, pages, folders, backlinks, daily notes, project notes, public sharing, and long-lived team memory. It is the place a human opens when they need to write, browse, curate, or explain what the team knows.

## What it is

- Server-hosted Obsidian-style workspace.
- Markdown-first wiki with backlinks and graph navigation.
- AI ingest for files, URLs, documents, media transcripts, and code.
- Semantic search and question answering over local knowledge.
- MCP server so agents can read, search, and write knowledge safely.

## What it is not

- It is not the repo, branch, commit, or issue graph. That belongs in Archgraph.
- It is not the agent execution surface. That belongs in Archductor.
- It is not the QA layer. That belongs in computer-use testing.

## Current direction

Archivum is in development. The product priority is a sharp, self-hosted knowledge workspace that feels calm for humans and useful for agents.

The long-term win is compounding memory: every source you ingest becomes structured, searchable, linkable knowledge that future human and agent work can use.

```bash
# planned local-first shape
docker compose up -d
open http://localhost:3000
```
