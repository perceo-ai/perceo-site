import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = (file) => readFileSync(file, "utf8");

const required = [
  ["app/docs/page.tsx", ["docsPage", "docs-surface", "docs-backdrop", "font-serif"]],
  ["content/site.json", ["Start with the suite", "Popular guides", "Reference", "Quickstart"]],
  ["app/components/DocsTopBar.tsx", ["Search documentation", "⌘K", "Perceo Docs", "bg-[#312F2F]/90", "font-serif"]],
  ["app/components/DocsSidebar.tsx", ["Get started", "Concepts", "Guides", "Reference"]],
  ["app/components/ProductDocsShell.tsx", ["DocsTopBar", "On this page", "Copy page", "bg-[#312F2F]", "docs-surface", "docs-backdrop", "font-serif"]],
  ["app/components/DocsPagination.tsx", ["Previous", "Next"]],
  ["app/docs/[product]/[[...slug]]/page.tsx", ["callout", "card-grid", "docs-code-header"]],
  ["lib/docs.ts", ["sections", "getDocsNeighbors", "card", "callout"]],
  ["content/docs/archivum/overview.md", ["::card", "> Info:"]],
  ["content/docs/archgraph/overview.md", ["::card", "> Info:"]],
  ["content/docs/archductor/overview.md", ["::card", "> Info:", "```bash"]],
  ["content/docs/computer-use-testing/overview.md", ["::card", "> Info:"]],
];

const forbiddenLightTheme = [
  ["app/docs/page.tsx", ["bg-[#fafafa]", "text-zinc-950"]],
  ["app/components/ProductDocsShell.tsx", ["bg-[#fafafa]", "text-zinc-950"]],
  ["app/components/DocsTopBar.tsx", ["bg-white/90", "bg-zinc-50"]],
];

const failures = [];

for (const [file, needles] of required) {
  const content = read(file);
  for (const needle of needles) {
    try {
      assert.match(content, new RegExp(needle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
    } catch {
      failures.push(`${file} missing "${needle}"`);
    }
  }
}

for (const [file, needles] of forbiddenLightTheme) {
  const content = read(file);
  for (const needle of needles) {
    if (content.includes(needle)) {
      failures.push(`${file} still contains light-theme token "${needle}"`);
    }
  }
}

if (failures.length) {
  console.error("Docs quality validation failed:");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log("Docs quality validation passed.");
