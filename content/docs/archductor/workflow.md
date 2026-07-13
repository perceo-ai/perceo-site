# Core workflow

The normal path is repository first:

> Tip: Treat each workspace as one shippable unit. If two changes should be reviewed separately, they should usually live in separate workspaces.

::card Install | Get the Linux app running before creating workspaces. | /docs/archductor/install
::card Project setup | Configure shared scripts and defaults. | /docs/archductor/project-setup
::card Release readiness | Verify checks, limits, and packaging status. | /docs/archductor/release-readiness

1. Add or clone a repository.
2. Configure scripts, prompts, providers, and workspace defaults.
3. Create a workspace from a branch, prompt, GitHub issue, GitHub PR, or Linear issue.
4. Start Codex, Claude Code, Cursor, or shell sessions.
5. Review changes, checks, todos, comments, and conflicts.
6. Create or merge the PR, archive the workspace, then repeat.

Normal work should happen in the app. The CLI stays available for automation, debugging, and fallback workflows.

## Workspaces and branches

One workspace is one branch and one Git worktree for one stream of work. That keeps tasks independently reviewable and stops agent sessions from trampling each other.

- Each workspace gets its own Git worktree, branch, and `.context` directory.
- Workspaces for the same repo get separate stable `CONDUCTOR_PORT` ranges.
- You can run multiple workspaces for the same repository in parallel.
- Multiple sessions in one workspace intentionally share branch state.

## Sessions and harnesses

Claude Code, Codex, Cursor, and Shell are harnesses inside the workspace flow. Archductor owns the workspace, branch, terminal, diff, checks, PR state, and archive or history flow around those agents.

- Start multiple Shell, Codex, Claude Code, or Cursor sessions in one workspace.
- Use the embedded terminal, setup or run or stop controls, logs, and process lists.
- Stage review comments, failing checks, or PR comments into an agent session.
- Persist transcript history and restore archived workspace context later.
