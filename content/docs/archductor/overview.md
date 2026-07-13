# Archductor Overview

Archductor is the execution surface of the Perceo Suite: a Linux-native agent workbench for running coding agents across isolated Git worktree workspaces.

Use it when one repository has several streams of work in flight and you do not want branch state, terminal state, agent logs, or review state bleeding together.

> Info: Archductor is in development. The immediate target is Linux-native Conductor-style execution, not a second-brain app or long-term memory database.

::card Install Archductor | Get the Linux app running from release artifacts or source. | /docs/archductor/install
::card Core workflow | Understand repositories, workspaces, sessions, checks, PRs, and archive flow. | /docs/archductor/workflow
::card Project setup | Configure scripts, prompts, providers, and workspace defaults. | /docs/archductor/project-setup

## Role in the suite

Archductor executes work using knowledge from Archivum and Archgraph.

The killer workflow is simple: start a task, pull context, create an isolated workspace, launch the agent, watch the PTY, review the diff, run checks, open or merge a PR, archive the workspace, and push useful execution facts back into memory.

## What works today

- Add an existing repository or clone a Git URL from the Projects page.
- Create workspaces from a branch, prompt, GitHub issue, GitHub PR, or Linear issue.
- Give each workspace its own Git worktree, branch, `.context` directory, and stable `CONDUCTOR_PORT` range.
- Run multiple workspaces for the same repository in parallel.
- Start multiple Shell, Codex, Claude Code, or Cursor sessions inside one workspace.
- Review changed files, todos, local review comments, sibling conflicts, PR checks, and GitHub PR comments.
- Create, refresh, merge, archive, and restore GitHub PR work from the app.

## What it owns

- Workspace lifecycle.
- Git worktrees and branches.
- PTY-backed agent sessions.
- Setup, run, check, and archive scripts.
- Diffs, todos, comments, PR checks, reviews, and merge flow.
- Execution logs and artifacts that can later become project memory.

## What it does not own

Archductor should not become the long-term memory system. It consumes memory from Archgraph and Archivum, produces execution traces, and sends important artifacts back.

It should not become the QA platform either. Computer-use testing owns end-to-end behavior verification.

## Conductor parity direction

Archductor should feel like a Conductor-style control plane on Linux, not a pile of disconnected wrappers around CLIs.

- One workspace is one branch and one Git worktree for one stream of work.
- Multiple workspaces are for independently reviewable work.
- Multiple sessions in one workspace are for shared branch state.
- Review, checks, merge, and archive belong in the same workflow.

```bash
# source build path
cargo build --workspace --release --locked
./target/release/linux-conductor-gtk
```
