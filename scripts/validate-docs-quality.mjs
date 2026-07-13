import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = (file) => readFileSync(file, "utf8");

const required = [
  ["app/docs/page.tsx", ["Start with the suite", "Popular guides", "Reference", "Quickstart"]],
  ["app/components/DocsTopBar.tsx", ["Search documentation", "⌘K", "Perceo Docs"]],
  ["app/components/DocsSidebar.tsx", ["Get started", "Concepts", "Guides", "Reference"]],
  ["app/components/ProductDocsShell.tsx", ["DocsTopBar", "On this page", "Copy page"]],
  ["app/components/DocsPagination.tsx", ["Previous", "Next"]],
  ["app/docs/[product]/[[...slug]]/page.tsx", ["callout", "card-grid", "docs-code-header"]],
  ["lib/docs.ts", ["sections", "getDocsNeighbors", "card", "callout"]],
  ["content/docs/archivum/overview.md", ["::card", "> Info:"]],
  ["content/docs/archgraph/overview.md", ["::card", "> Info:"]],
  ["content/docs/archductor/overview.md", ["::card", "> Info:", "```bash"]],
  ["content/docs/computer-use-testing/overview.md", ["::card", "> Info:"]],
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

if (failures.length) {
  console.error("Docs quality validation failed:");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log("Docs quality validation passed.");
