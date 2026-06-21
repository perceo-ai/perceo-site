import Link from "next/link";
import type { ReactNode } from "react";
import ProductTopNav from "../../components/ProductTopNav";
import { linuxConductor } from "../../data/products";

export const metadata = {
  title: "Archductor Docs",
  description: "Install, verify, build, and test Archductor for Linux.",
};

function CodeBlock({ children }: { children: string }) {
  return (
    <pre className="max-w-full overflow-x-auto rounded-lg border border-white/10 bg-black/35 p-4 text-sm leading-6 text-zinc-200">
      <code>{children}</code>
    </pre>
  );
}

function DocSection({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 border-t border-white/10 py-12">
      <h2 className="font-serif text-3xl font-bold italic tracking-tight text-white">{title}</h2>
      <div className="mt-6 max-w-4xl space-y-5 text-sm leading-6 text-zinc-300">{children}</div>
    </section>
  );
}

const localBuildDeps = `# Ubuntu / Debian
sudo apt update
sudo apt install -y git gh sqlite3 openssh-client pkg-config libgtk-4-dev libadwaita-1-dev

# Fedora
sudo dnf install -y git gh sqlite openssh-clients pkgconf-pkg-config gtk4-devel libadwaita-devel

# Arch
sudo pacman -S --needed git github-cli sqlite openssh pkgconf gtk4 libadwaita`;

const buildAndRun = `git clone https://github.com/pranavkannepalli/conductor-arch
cd conductor-arch
cargo fmt --all -- --check
cargo test -p linux-conductor-core -p linux-conductor -p linux-conductor-gtk
cargo build --workspace --release --locked
./target/release/linux-conductor-gtk`;

const sourceSettings = `# .conductor/settings.toml
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
default_visible_tab = "changes"`;

export default function ArchductorDocsPage() {
  return (
    <div className="min-h-screen bg-[#312F2F] text-white grid-lines">
      <div className="dot-pattern dot-pattern-fade z-0" aria-hidden="true" />
      <ProductTopNav />
      <main className="relative z-10 mx-auto grid max-w-7xl gap-12 px-5! py-28 md:grid-cols-[240px_minmax(0,1fr)] md:px-12.5!">
        <aside className="md:sticky md:top-24 md:h-[calc(100vh-120px)]">
          <Link href="/products/archductor" className="text-sm text-zinc-500 hover:text-white">
            Back to Archductor
          </Link>
          <nav className="mt-8 flex flex-col gap-3 text-sm text-zinc-400">
            <a href="#overview" className="hover:text-white">Overview</a>
            <a href="#install" className="hover:text-white">Install</a>
            <a href="#requirements" className="hover:text-white">Requirements</a>
            <a href="#verify" className="hover:text-white">Verify Downloads</a>
            <a href="#build" className="hover:text-white">Build From Source</a>
            <a href="#settings" className="hover:text-white">Repository Settings</a>
            <a href="#limits" className="hover:text-white">Known Limits</a>
            <a href="#release" className="hover:text-white">Release Readiness</a>
          </nav>
        </aside>

        <article className="min-w-0">
          <div className="max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-zinc-500">
              {linuxConductor.technicalName} docs
            </p>
            <h1 className="mt-5 text-5xl font-bold leading-none tracking-normal md:text-7xl">
              Archductor Docs
            </h1>
            <p className="mt-6 text-lg leading-8 text-zinc-400">
              Install, verify, build, and smoke test the Linux-native Conductor MVP.
            </p>
          </div>

          <DocSection id="overview" title="Overview">
            <p>{linuxConductor.shortDescription}</p>
            <p>
              The app flow is repository first: add a repo, create a workspace, run one or
              more agents, review the diff and checks, create or merge a GitHub PR, then archive
              or restore the workspace when needed.
            </p>
          </DocSection>

          <DocSection id="install" title="Install">
            {linuxConductor.installTargets.map((target) => (
              <div key={target.name} className="glass rounded-lg p-4">
                <h3 className="font-semibold text-white">{target.name}</h3>
                <p className="mt-2 text-zinc-400">{target.note}</p>
                <div className="mt-4">
                  <CodeBlock>{target.command}</CodeBlock>
                </div>
              </div>
            ))}
            <p>
              AppImage and native packages are preferred. Flatpak is experimental because arbitrary
              repository paths may require broad filesystem access.
            </p>
          </DocSection>

          <DocSection id="requirements" title="Requirements">
            <ul className="space-y-2">
              {linuxConductor.requirements.map((item) => (
                <li key={item}>- {item}</li>
              ))}
            </ul>
            <CodeBlock>{"gh auth status\ncodex --version\nclaude --version"}</CodeBlock>
          </DocSection>

          <DocSection id="verify" title="Verify Downloads">
            <p>
              Public release artifacts should ship with <span className="font-semibold text-white">SHA256SUMS</span>.
              Verify checksums before installing. If the GitHub release includes provenance or
              attestations, verify them before trusting the artifact.
            </p>
            <CodeBlock>{"sha256sum -c SHA256SUMS\ngh release view --repo pranavkannepalli/conductor-arch --web"}</CodeBlock>
            <p>
              Download links currently point to GitHub releases. Replace latest-release placeholders
              with exact tag URLs when the public release is cut.
            </p>
          </DocSection>

          <DocSection id="build" title="Build From Source">
            <CodeBlock>{localBuildDeps}</CodeBlock>
            <CodeBlock>{buildAndRun}</CodeBlock>
          </DocSection>

          <DocSection id="settings" title="Repository Settings">
            <p>
              Shared project settings live in <span className="font-semibold text-white">.conductor/settings.toml</span>.
              Commit shared setup. Keep secrets and machine-local overrides in
              <span className="font-semibold text-white"> .conductor/settings.local.toml</span>.
            </p>
            <CodeBlock>{sourceSettings}</CodeBlock>
          </DocSection>

          <DocSection id="limits" title="Known Limits">
            <ul className="space-y-2">
              {linuxConductor.knownLimits.map((item) => (
                <li key={item}>- {item}</li>
              ))}
            </ul>
          </DocSection>

          <DocSection id="release" title="Release Readiness">
            <p>
              Packaging alone is not the readiness gate. Validate repository onboarding, workspace
              creation, embedded agent sessions, terminal/runtime, diffs, review comments, todos,
              PR checks, merge/archive, history, provider status, customization settings, and known
              gaps before cutting a public artifact.
            </p>
            <div className="grid gap-3 md:grid-cols-2">
              <a className="glass rounded-lg p-4 hover:border-white/25" href={linuxConductor.deployDocsUrl}>
                docs/deploy-and-local-test.md
              </a>
              <a className="glass rounded-lg p-4 hover:border-white/25" href={linuxConductor.manualChecklistUrl}>
                docs/manual-testing-checklist.md
              </a>
            </div>
          </DocSection>
        </article>
      </main>
    </div>
  );
}
