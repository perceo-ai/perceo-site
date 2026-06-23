# What is Archductor?

Archductor is the Linux product surface for Linux Conductor: a desktop control plane for running coding agents across isolated Git worktree workspaces.

Use it when one repository has several streams of work in flight and you do not want branch state, terminal state, or review state bleeding together.

## Why it exists

Create a workspace, start Codex or Claude Code, review the diff, open or merge a GitHub pull request, archive the workspace, then move to the next task without leaving the app.

The product target is Conductor parity first. Linux flavor matters, but the repo-to-workspace-to-review loop matters more.

## What works today

- Add an existing repository or clone a Git URL from the Projects page.
- Create workspaces from a branch, prompt, GitHub issue, GitHub PR, or Linear issue.
- Give each workspace its own Git worktree, branch, `.context` directory, and stable `CONDUCTOR_PORT` range.
- Run multiple workspaces for the same repository in parallel.
- Start multiple Shell, Codex, Claude Code, or Cursor sessions inside one workspace.
- Review changed files, todos, local review comments, sibling conflicts, PR checks, and GitHub PR comments.
- Create, refresh, merge, archive, and restore GitHub PR work from the app.

## Conductor parity

Archductor should feel like a Conductor-style control plane on Linux, not a pile of disconnected wrappers around CLIs.

- One workspace is one branch and one Git worktree for one stream of work.
- Multiple workspaces are for independently reviewable work.
- Multiple sessions in one workspace are for shared branch state.
- Review, checks, merge, and archive belong in the same workflow.
