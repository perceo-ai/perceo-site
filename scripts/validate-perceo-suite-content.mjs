import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();

const read = (file) => readFileSync(path.join(root, file), "utf8");

const checks = [
  {
    name: "product data includes all four Perceo Suite products",
    file: "content/site.json",
    needles: ["Archivum", "Archgraph", "Archductor", "Computer-use Testing"],
  },
  {
    name: "home page tells the suite story",
    file: "content/site.json",
    needles: ["Perceo Suite", "capture", "run", "review"],
  },
  {
    name: "homepage feature copy only exposes public products",
    file: "content/site.json",
    needles: ["Archivum", "Archductor"],
  },
  {
    name: "home visuals represent public products",
    file: "app/components/SuiteProductVisual.tsx",
    needles: [
      "Archivum",
      "Archductor",
      "Markdown wiki",
      "PTY agents",
    ],
  },
  {
    name: "docs registry exposes all suite manuals",
    file: "content/docs/index.json",
    needles: ["archivum", "archgraph", "archductor", "computer-use-testing"],
  },
  {
    name: "docs shell has premium docs language",
    file: "app/components/ProductDocsShell.tsx",
    needles: ["Documentation", "Perceo Suite"],
  },
];

const requiredDocs = [
  "content/docs/archivum/overview.md",
  "content/docs/archgraph/overview.md",
  "content/docs/archductor/overview.md",
  "content/docs/computer-use-testing/overview.md",
];

const failures = [];

for (const check of checks) {
  const content = read(check.file);
  for (const needle of check.needles) {
    if (!content.includes(needle)) {
      failures.push(`${check.name}: missing "${needle}" in ${check.file}`);
    }
  }
}

for (const file of requiredDocs) {
  if (!existsSync(path.join(root, file))) {
    failures.push(`missing docs file: ${file}`);
  }
}

const homeOnly = read("content/site.json").match(/"homePage": \{[\s\S]*?\n  \},\n  "productsPage"/)?.[0] ?? "";
for (const forbidden of ["Archgraph", "Computer-use testing", "Computer-use Testing", "GraphRAG"]) {
  if (homeOnly.includes(forbidden)) {
    failures.push(`homepage content leaks locked product: ${forbidden}`);
  }
}

const visuals = read("app/components/SuiteProductVisual.tsx");
for (const forbidden of ["Archgraph", "Computer-use testing", "GraphRAG", "autonomous QA"]) {
  if (visuals.includes(forbidden)) {
    failures.push(`homepage visual leaks locked product: ${forbidden}`);
  }
}

if (failures.length) {
  console.error("Perceo Suite content validation failed:");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log("Perceo Suite content validation passed.");
