# Project setup

Shared project settings live in `.conductor/settings.toml` at the repository root. Commit the shared file when teammates should get the same setup.

Keep secrets and machine-local overrides in `.conductor/settings.local.toml`.

## What setup should cover

The setup expectation is simple: setup, run, archive scripts, copied files, environment variables, prompts, providers, and Git behavior should be visible and editable from the product, not buried in terminal-only steps.

## Example settings

```toml
"$schema" = "https://conductor.build/schemas/settings.repo.schema.json"

[scripts]
setup = "pnpm install"
run = "pnpm dev --port $CONDUCTOR_PORT"
run_mode = "concurrent"

[customization.workspace_defaults]
base_branch = "main"
branch_prefix = "lc"
working_directory = "apps/web"
port_block_size = 10
default_visible_tab = "changes"
```

## Requirements

- Linux desktop with GTK app support.
- `git` for worktrees, branches, diffs, and commits.
- `gh` authenticated with `gh auth login` for GitHub PRs, checks, comments, and merge.
- `openssh` for SSH repository access.
- GTK4 and libadwaita plus Rust for source builds.
- Local Codex, Claude Code, Cursor, or shell auth and configuration as applicable.
