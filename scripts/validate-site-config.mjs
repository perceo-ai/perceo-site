import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const readJson = (file) => JSON.parse(readFileSync(path.join(root, file), "utf8"));
const siteConfig = readJson("content/site.json");
const docsIndex = readJson("content/docs/index.json");

const failures = [];
const requiredProductStatuses = new Set(["in-development", "concept"]);
const requiredDocSections = new Set(["Get started", "Concepts", "Guides", "Reference"]);
const requiredVisuals = new Set(["archivum", "archgraph", "archductor", "testing"]);

const requireString = (value, label) => {
  if (typeof value !== "string" || value.trim().length === 0) {
    failures.push(`${label} must be a non-empty string`);
  }
};

const requireArray = (value, label) => {
  if (!Array.isArray(value) || value.length === 0) {
    failures.push(`${label} must be a non-empty array`);
    return [];
  }

  return value;
};

requireString(siteConfig.site?.name, "site.name");
requireString(siteConfig.site?.baseUrl, "site.baseUrl");
requireString(siteConfig.site?.metadata?.title, "site.metadata.title");
requireString(siteConfig.site?.metadata?.description, "site.metadata.description");

for (const [index, link] of requireArray(siteConfig.site?.nav?.links, "site.nav.links").entries()) {
  requireString(link.label, `site.nav.links[${index}].label`);
  requireString(link.href, `site.nav.links[${index}].href`);
}

for (const [index, feature] of requireArray(siteConfig.homePage?.features, "homePage.features").entries()) {
  if (!requiredVisuals.has(feature.visual)) {
    failures.push(`homePage.features[${index}].visual must be one of ${Array.from(requiredVisuals).join(", ")}`);
  }
  requireString(feature.title, `homePage.features[${index}].title`);
  requireString(feature.description, `homePage.features[${index}].description`);
}

for (const [index, product] of requireArray(siteConfig.products, "products").entries()) {
  requireString(product.slug, `products[${index}].slug`);
  requireString(product.name, `products[${index}].name`);
  if (!requiredProductStatuses.has(product.status)) {
    failures.push(`products[${index}].status must be one of ${Array.from(requiredProductStatuses).join(", ")}`);
  }
  requireString(product.href, `products[${index}].href`);
  requireString(product.docsHref, `products[${index}].docsHref`);
}

const productSlugs = new Set(siteConfig.products.map((product) => product.slug));

for (const [productIndex, product] of requireArray(docsIndex.products, "docs.products").entries()) {
  requireString(product.slug, `docs.products[${productIndex}].slug`);
  if (!productSlugs.has(product.slug)) {
    failures.push(`docs.products[${productIndex}].slug "${product.slug}" has no matching product in content/site.json`);
  }

  const seenPageSlugs = new Set();
  for (const [pageIndex, page] of requireArray(product.pages, `docs.products[${productIndex}].pages`).entries()) {
    const slug = Array.isArray(page.slug) ? page.slug.join("/") : "";
    if (seenPageSlugs.has(slug)) {
      failures.push(`docs product "${product.slug}" has duplicate page slug "${slug || "overview"}"`);
    }
    seenPageSlugs.add(slug);

    requireString(page.title, `docs.products[${productIndex}].pages[${pageIndex}].title`);
    requireString(page.description, `docs.products[${productIndex}].pages[${pageIndex}].description`);
    requireString(page.file, `docs.products[${productIndex}].pages[${pageIndex}].file`);

    if (!requiredDocSections.has(page.section)) {
      failures.push(`docs.products[${productIndex}].pages[${pageIndex}].section must be one of ${Array.from(requiredDocSections).join(", ")}`);
    }

    const markdownPath = path.join(root, "content", "docs", product.slug, page.file ?? "");
    if (!existsSync(markdownPath)) {
      failures.push(`missing markdown file for docs page: content/docs/${product.slug}/${page.file}`);
    }
  }
}

if (failures.length) {
  console.error("Site config validation failed:");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log("Site config validation passed.");
