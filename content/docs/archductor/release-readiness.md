# Review and release readiness

Review happens in the GUI. Changed files, diffs, local comments, GitHub comments, checks, conflicts, todos, PR state, merge, and archive are one readiness flow, not five separate tools.

## Review flow

- Multiple isolated Git worktree workspaces per repository.
- PTY-backed Shell, Codex, Claude Code, and Cursor sessions.
- Workspace terminal, setup or run or stop controls, logs, and process lists.
- Diffs, changed files, todos, local review comments, PR checks, and GitHub PR comments.
- Context staging from failing checks or review comments into a selected agent session.
- GitHub PR create, refresh, merge, archive, restore, and saved session history.

## Verify downloads

Public release artifacts should ship with `SHA256SUMS`. Verify checksums before installing. If the GitHub release includes provenance or attestations, verify them before trusting the artifact.

```bash
sha256sum -c SHA256SUMS
gh release view --repo pranavkannepalli/conductor-arch --web
```

## Launch gate

Packaging alone is not the readiness gate. The public docs need the real workflow, supported install channels, release links, checksum and provenance verification, and build instructions that point back to the repo.

- [docs/deploy-and-local-test.md](https://github.com/pranavkannepalli/conductor-arch/blob/main/docs/deploy-and-local-test.md)
- [docs/manual-testing-checklist.md](https://github.com/pranavkannepalli/conductor-arch/blob/main/docs/manual-testing-checklist.md)

## Known limits

- Terminal rendering is not a full terminal emulator.
- Visual parity with macOS Conductor is incomplete.
- Project settings or onboarding still need polish.
- Advanced prompt packs, hooks, theme, and layout customization are not fully surfaced in GUI.
- Linux-first; Windows and macOS packages are not current launch targets.
