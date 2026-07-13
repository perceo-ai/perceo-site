import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();

const read = (file) => readFileSync(path.join(root, file), "utf8");

const checks = [
  {
    name: "product data includes all four Perceo Suite products",
    file: "app/data/products.ts",
    needles: ["Archivum", "Archgraph", "Archductor", "Computer-use Testing"],
  },
  {
    name: "home page tells the suite story",
    file: "app/components/HeroSection.tsx",
    needles: ["Perceo Suite", "remember", "structure", "execute", "verify"],
  },
  {
    name: "feature copy explains the stack model",
    file: "app/components/FeaturesSection.tsx",
    needles: ["Archivum", "Archgraph", "Archductor", "Computer-use testing"],
  },
  {
    name: "docs registry exposes all suite manuals",
    file: "lib/docs.ts",
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

if (failures.length) {
  console.error("Perceo Suite content validation failed:");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log("Perceo Suite content validation passed.");
