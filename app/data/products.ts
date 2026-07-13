export type ProductStatus = "in-development" | "concept";

export type ProductSummary = {
  slug: string;
  name: string;
  status: ProductStatus;
  role: string;
  summary: string;
  pitch: string;
  href: string;
  docsHref: string;
  primaryCta: string;
};

export const products: ProductSummary[] = [
  {
    slug: "archivum",
    name: "Archivum",
    status: "in-development",
    role: "Knowledge workspace",
    summary: "Server-hosted Obsidian for personal and team knowledge.",
    pitch: "Self-hosted second brain with AI ingest, Markdown wiki, backlinks, semantic search, graph views, and MCP knowledge access.",
    href: "/products#archivum",
    docsHref: "/docs/archivum",
    primaryCta: "Read docs",
  },
  {
    slug: "archgraph",
    name: "Archgraph",
    status: "concept",
    role: "Memory/retrieval infrastructure",
    summary: "Self-hosted GraphRAG infrastructure for projects, products, repos, and agents.",
    pitch: "Typed project graph that tracks products, repositories, branches, commits, issues, docs, source areas, confidence, freshness, and provenance.",
    href: "/products#archgraph",
    docsHref: "/docs/archgraph",
    primaryCta: "View concept",
  },
  {
    slug: "archductor",
    name: "Archductor",
    status: "in-development",
    role: "Agent execution workbench",
    summary: "Linux-native conductor for running coding agents across branches, PTYs, checks, and PRs.",
    pitch: "Create workspaces, launch Codex/Claude/Cursor-style workers, watch PTYs, review diffs, run checks, and move PRs through the loop.",
    href: "/products/archductor",
    docsHref: "/docs/archductor",
    primaryCta: "Download",
  },
  {
    slug: "computer-use-testing",
    name: "Computer-use Testing",
    status: "concept",
    role: "Future QA/eval layer",
    summary: "Autonomous computer-use agents for browser, desktop, mobile, and voice testing.",
    pitch: "A future verification layer that runs flows, evaluates behavior, catches regressions, and feeds evidence back into the Perceo stack.",
    href: "/products#computer-use-testing",
    docsHref: "/docs/computer-use-testing",
    primaryCta: "View concept",
  },
];

export const linuxConductor = {
  name: "Archductor",
  technicalName: "Linux Conductor",
  repoUrl: "https://github.com/pranavkannepalli/conductor-arch",
  releasesUrl: "https://github.com/pranavkannepalli/conductor-arch/releases",
  latestReleaseUrl: "https://github.com/pranavkannepalli/conductor-arch/releases/latest",
  readmeUrl: "https://github.com/pranavkannepalli/conductor-arch/blob/main/README.md",
  deployDocsUrl: "https://github.com/pranavkannepalli/conductor-arch/blob/main/docs/deploy-and-local-test.md",
  manualChecklistUrl: "https://github.com/pranavkannepalli/conductor-arch/blob/main/docs/manual-testing-checklist.md",
  subhead: "Linux-native agent execution workbench for the Perceo Suite.",
  shortDescription: "A Linux-native desktop control plane for running multiple coding agents across isolated workspaces.",
  heroPoints: [
    "Run multiple Shell, Codex, Claude Code, and Cursor sessions in parallel.",
    "Give each task its own Git worktree, branch, .context directory, and port range.",
    "Review diffs, todos, comments, PR checks, and sibling workspace conflicts.",
    "Create, refresh, merge, archive, and restore GitHub PR work from the app.",
  ],
  workflow: [
    "Add or clone a repository.",
    "Configure scripts, prompts, providers, and workspace defaults.",
    "Create a workspace from a branch, prompt, GitHub issue, GitHub PR, or Linear issue.",
    "Start Codex, Claude Code, Cursor, or shell sessions.",
    "Review changes, checks, todos, comments, and conflicts.",
    "Create or merge the PR, archive the workspace, then repeat.",
  ],
  installTargets: [
    {
      name: "AppImage / GitHub release artifact",
      command: "curl -Lo linux-conductor.AppImage https://github.com/pranavkannepalli/conductor-arch/releases/latest/download/linux-conductor-x86_64.AppImage\nchmod +x linux-conductor.AppImage\n./linux-conductor.AppImage",
      note: "Preferred portable artifact. With no arguments it launches the GTK app; with arguments it forwards to the CLI.",
    },
    {
      name: ".deb / Ubuntu-Debian",
      command: "sudo apt install ./linux-conductor_0.1.0_amd64.deb",
      note: "Native package built by the release workflow and local nfpm packaging.",
    },
    {
      name: ".rpm / Fedora / openSUSE",
      command: "sudo dnf install ./linux-conductor-0.1.0-1.x86_64.rpm",
      note: "Use dnf or zypper-compatible RPM installation on supported distributions.",
    },
    {
      name: "Arch / AUR",
      command: "cd packaging/aur\nmakepkg -si",
      note: "AUR packaging is expected for Arch users; update pkgver and sha256sums for local validation.",
    },
    {
      name: "Flatpak (experimental)",
      command: "flatpak run io.github.pranavkannepalli.linux-conductor",
      note: "Experimental. Flatpak may require broad filesystem access for arbitrary repository paths.",
    },
  ],
  requirements: [
    "Linux desktop with GTK app support.",
    "git for worktrees, branches, diffs, and commits.",
    "gh authenticated with gh auth login for GitHub PRs, checks, comments, and merge.",
    "openssh for SSH repository access.",
    "GTK4/libadwaita and Rust for source builds.",
    "Local Codex, Claude Code, Cursor, or shell auth/configuration as applicable.",
  ],
  features: [
    "Multiple isolated Git worktree workspaces per repository.",
    "PTY-backed Shell, Codex, Claude Code, and Cursor sessions.",
    "Workspace terminal, setup/run/stop controls, logs, and process lists.",
    "Diffs, changed files, todos, local review comments, PR checks, and GitHub PR comments.",
    "Context staging from failing checks or review comments into a selected agent session.",
    "GitHub PR create, refresh, merge, archive, restore, and saved session history.",
  ],
  knownLimits: [
    "Terminal rendering is not a full terminal emulator.",
    "Visual parity with macOS Conductor is incomplete.",
    "Project settings/onboarding still need polish.",
    "Advanced prompt packs/hooks/theme/layout customization are not fully surfaced in GUI.",
    "Linux-first; Windows/macOS packages are not current launch targets.",
  ],
  buildCommands: [
    "sudo apt update\nsudo apt install -y git gh sqlite3 openssh-client pkg-config libgtk-4-dev libadwaita-1-dev",
    "git clone https://github.com/pranavkannepalli/conductor-arch\ncd conductor-arch",
    "cargo fmt --all -- --check\ncargo test -p linux-conductor-core -p linux-conductor -p linux-conductor-gtk\ncargo build --workspace --release --locked\n./target/release/linux-conductor-gtk",
  ],
};
