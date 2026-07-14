import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const read = (file) => readFileSync(file, "utf8");

const required = [
  ["app/docs/page.tsx", ["Navbar", "docsPage", "docs-surface", "docs-backdrop", "font-serif"]],
  ["content/site.json", ["Start with the suite", "Popular guides", "Reference", "Quickstart"]],
  ["app/components/DocsSidebar.tsx", ["Get started", "Concepts", "Guides", "Reference"]],
  ["app/components/DocsSidebar.tsx", ["DocsProductSwitcher"]],
  ["app/components/DocsProductSwitcher.tsx", ["docsProducts", "Switch product"]],
  ["app/components/ProductDocsShell.tsx", ["Navbar", "On this page", "Copy page", "bg-[#312F2F]", "docs-surface", "docs-backdrop", "font-serif"]],
  ["app/components/DocsPagination.tsx", ["Previous", "Next"]],
  ["app/docs/[product]/[[...slug]]/page.tsx", ["callout", "card-grid", "docs-code-header"]],
  ["lib/docs.ts", ["sections", "getDocsNeighbors", "card", "callout"]],
  ["content/docs/index.json", ["\"slug\": \"perceo\"", "\"title\": \"Perceo\"", "\"file\": \"products.md\"", "\"file\": \"workflow.md\""]],
  ["content/site.json", ["\"name\": \"Perceo\"", "\"docsHref\": \"/docs/perceo\""]],
  ["content/docs/perceo/overview.md", ["::card", "/docs/archivum", "/docs/archductor", "/products#archivum", "/products/archductor"]],
  ["content/docs/perceo/products.md", ["::card", "/docs/archivum", "/docs/archductor", "/products#archivum", "/products/archductor"]],
  ["content/docs/perceo/workflow.md", ["::card", "/docs/archivum", "/docs/archductor", "/products#archivum", "/products/archductor"]],
  ["content/docs/archivum/overview.md", ["::card", "> Info:"]],
  ["content/docs/archgraph/overview.md", ["::card", "> Info:"]],
  ["content/docs/archductor/overview.md", ["::card", "> Info:", "```bash"]],
  ["content/docs/computer-use-testing/overview.md", ["::card", "> Info:"]],
];

const forbiddenLightTheme = [
  ["app/docs/page.tsx", ["bg-[#fafafa]", "text-zinc-950"]],
  ["app/components/ProductDocsShell.tsx", ["bg-[#fafafa]", "text-zinc-950"]],
  ["app/docs/page.tsx", ["DocsTopBar", "Search documentation"]],
  ["app/components/ProductDocsShell.tsx", ["DocsTopBar", "Search documentation"]],
  ["lib/docs.ts", ["return products;"]],
];

const failures = [];

for (const [file, needles] of required) {
  if (!existsSync(file)) {
    failures.push(`${file} is missing`);
    continue;
  }

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
