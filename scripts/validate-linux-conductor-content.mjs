import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const requiredFiles = [
  "app/components/ArchductorHome.tsx",
  "app/components/DocsProductSwitcher.tsx",
  "app/components/DocsSidebar.tsx",
  "app/components/ProductDocsShell.tsx",
  "app/docs/[product]/[[...slug]]/page.tsx",
  "app/components/HeroSection.tsx",
  "app/components/FeaturesSection.tsx",
  "app/components/VideoPlaceholderSection.tsx",
  "app/products/page.tsx",
  "app/products/archductor/page.tsx",
  "app/docs/page.tsx",
  "app/data/products.ts",
  "lib/docs.ts",
  "content/docs/archductor/overview.md",
  "content/docs/archductor/workflow.md",
  "content/docs/archductor/project-setup.md",
  "content/docs/archductor/install.md",
  "content/docs/archductor/release-readiness.md",
];

const requiredPhrases = [
  "Archductor",
  "Linux Conductor",
  "Archductor Overview",
  "execution surface of the Perceo Suite",
  "Create workspaces from a branch, prompt, GitHub issue, GitHub PR, or Linear issue.",
  "archive the workspace",
  "Product docs",
  "Switch product",
  "Search docs",
  "Core workflow",
  "Conductor parity direction",
  "Screen Studio video placeholder",
  "Linux-native agent execution workbench for the Perceo Suite.",
  "AppImage",
  "Ubuntu / Debian",
  "Fedora / openSUSE",
  "Arch / AUR",
  "Flatpak",
  "experimental",
  "Terminal rendering is not a full terminal emulator.",
  "Visual parity with macOS Conductor is incomplete.",
  "SHA256SUMS",
  "provenance",
  "cargo build --workspace --release --locked",
];

const combined = requiredFiles.map((file) => readFileSync(file, "utf8")).join("\n");

for (const phrase of requiredPhrases) {
  assert.match(combined, new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")), `Missing required phrase: ${phrase}`);
}

assert.match(combined, /github\.com\/pranavkannepalli\/conductor-arch\/releases/);
assert.match(combined, /docs\/manual-testing-checklist\.md/);
assert.match(combined, /docs\/deploy-and-local-test\.md/);
assert.match(combined, /\/products\/archductor/);
assert.match(combined, /\/docs\/archductor/);
assert.doesNotMatch(readFileSync("app/components/ProductDocsShell.tsx", "utf8"), /SwarmingVectors/);
