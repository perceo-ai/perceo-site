import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const requiredFiles = [
  "app/components/ArchductorHome.tsx",
  "app/components/HeroSection.tsx",
  "app/components/FeaturesSection.tsx",
  "app/components/VideoPlaceholderSection.tsx",
  "app/products/page.tsx",
  "app/products/archductor/page.tsx",
  "app/docs/page.tsx",
  "app/docs/archductor/page.tsx",
  "app/data/products.ts",
];

const requiredPhrases = [
  "Archductor",
  "Linux Conductor",
  "Screen Studio video placeholder",
  "Run Conductor-style coding agents in isolated Git worktree workspaces on Linux.",
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
