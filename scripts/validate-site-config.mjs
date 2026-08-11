import { readFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const siteConfig = JSON.parse(readFileSync(path.join(root, "content/site.json"), "utf8"));

const failures = [];
const productStatuses = new Set(["available", "in-development", "early"]);
const visualKinds = new Set(["archductor", "archfleet", "archivum"]);
const stepStates = new Set(["done", "active", "idle"]);
const cardTones = new Set(["active", "ready"]);

const str = (value, label) => {
  if (typeof value !== "string" || value.trim().length === 0) {
    failures.push(`${label} must be a non-empty string`);
  }
};

const arr = (value, label) => {
  if (!Array.isArray(value) || value.length === 0) {
    failures.push(`${label} must be a non-empty array`);
    return [];
  }
  return value;
};

const oneOf = (value, allowed, label) => {
  if (!allowed.has(value)) {
    failures.push(`${label} must be one of ${[...allowed].join(", ")}, got ${JSON.stringify(value)}`);
  }
};

const link = (value, label) => {
  str(value?.label, `${label}.label`);
  str(value?.href, `${label}.href`);
};

// --- site ---------------------------------------------------------------
const site = siteConfig.site ?? {};
str(site.name, "site.name");
str(site.baseUrl, "site.baseUrl");
str(site.docsUrl, "site.docsUrl");
str(site.githubUrl, "site.githubUrl");
str(site.metadata?.title, "site.metadata.title");
str(site.metadata?.description, "site.metadata.description");

for (const [i, item] of arr(site.nav?.links, "site.nav.links").entries()) {
  link(item, `site.nav.links[${i}]`);
}
link(site.nav?.primaryCta, "site.nav.primaryCta");
link(site.nav?.secondaryCta, "site.nav.secondaryCta");

str(site.footer?.headline, "site.footer.headline");
str(site.footer?.description, "site.footer.description");
for (const [i, item] of arr(site.footer?.links, "site.footer.links").entries()) {
  link(item, `site.footer.links[${i}]`);
}

// --- home ---------------------------------------------------------------
const hero = siteConfig.homePage?.hero ?? {};
str(hero.title, "homePage.hero.title");
str(hero.subtitle, "homePage.hero.subtitle");
arr(hero.descriptionLines, "homePage.hero.descriptionLines");

const cards = arr(hero.cards, "homePage.hero.cards");
if (cards.length !== 2) {
  failures.push("homePage.hero.cards must have exactly 2 entries (the hero renders two)");
}
for (const [i, card] of cards.entries()) {
  const label = `homePage.hero.cards[${i}]`;
  str(card.title, `${label}.title`);
  str(card.badge, `${label}.badge`);
  oneOf(card.tone, cardTones, `${label}.tone`);
  str(card.left, `${label}.left`);
  str(card.right, `${label}.right`);
  for (const [j, step] of arr(card.steps, `${label}.steps`).entries()) {
    oneOf(step, stepStates, `${label}.steps[${j}]`);
  }
}

const features = arr(siteConfig.homePage?.features, "homePage.features");
for (const [i, feature] of features.entries()) {
  const label = `homePage.features[${i}]`;
  oneOf(feature.visual, visualKinds, `${label}.visual`);
  str(feature.title, `${label}.title`);
  str(feature.description, `${label}.description`);
}

const video = siteConfig.homePage?.video ?? {};
for (const key of ["headline", "description", "label", "meta", "placeholder"]) {
  str(video[key], `homePage.video.${key}`);
}

// --- products page ------------------------------------------------------
const productsPage = siteConfig.productsPage ?? {};
str(productsPage.metadata?.title, "productsPage.metadata.title");
str(productsPage.metadata?.description, "productsPage.metadata.description");
str(productsPage.eyebrow, "productsPage.eyebrow");
str(productsPage.title, "productsPage.title");
str(productsPage.description, "productsPage.description");

for (const status of productStatuses) {
  str(productsPage.statusLabels?.[status], `productsPage.statusLabels.${status}`);
}

// --- products -----------------------------------------------------------
const products = arr(siteConfig.products, "products");
const slugs = new Set();

for (const [i, product] of products.entries()) {
  const label = `products[${i}]`;
  str(product.slug, `${label}.slug`);
  str(product.name, `${label}.name`);
  str(product.role, `${label}.role`);
  str(product.summary, `${label}.summary`);
  str(product.pitch, `${label}.pitch`);
  str(product.repoUrl, `${label}.repoUrl`);
  str(product.primaryCta, `${label}.primaryCta`);
  oneOf(product.status, productStatuses, `${label}.status`);

  if (slugs.has(product.slug)) {
    failures.push(`${label}.slug is duplicated: ${product.slug}`);
  }
  slugs.add(product.slug);

  if (product.href !== `/products/${product.slug}`) {
    failures.push(`${label}.href must be /products/${product.slug}, got ${product.href}`);
  }

  if (!visualKinds.has(product.slug)) {
    failures.push(`${label}.slug has no matching SuiteProductVisual kind`);
  }

  if (typeof product.docsHref === "string" && !product.docsHref.startsWith(site.docsUrl)) {
    failures.push(`${label}.docsHref must point at ${site.docsUrl}`);
  } else {
    str(product.docsHref, `${label}.docsHref`);
  }

  if (product.install) {
    str(product.install.label, `${label}.install.label`);
    str(product.install.command, `${label}.install.command`);
  }

  const detail = product.detail ?? {};
  str(detail.tagline, `${label}.detail.tagline`);
  str(detail.intro, `${label}.detail.intro`);
  str(detail.note, `${label}.detail.note`);
  arr(detail.points, `${label}.detail.points`);
  arr(detail.workflow, `${label}.detail.workflow`);
  arr(detail.requirements, `${label}.detail.requirements`);

  for (const [j, item] of arr(detail.docsLinks, `${label}.detail.docsLinks`).entries()) {
    link(item, `${label}.detail.docsLinks[${j}]`);
  }

  for (const [j, target] of (detail.installTargets ?? []).entries()) {
    str(target.name, `${label}.detail.installTargets[${j}].name`);
    str(target.command, `${label}.detail.installTargets[${j}].command`);
  }
}

// Every visual kind should be exercised by the home page.
const usedVisuals = new Set(features.map((feature) => feature.visual));
for (const kind of visualKinds) {
  if (!usedVisuals.has(kind)) {
    failures.push(`homePage.features never uses the "${kind}" visual`);
  }
}

// Nothing should still reference the retired products or repo owner.
const raw = JSON.stringify(siteConfig);
for (const stale of ["archgraph", "computer-use-testing", "linux-conductor", "Linux Conductor", "CONDUCTOR_PORT"]) {
  if (raw.includes(stale)) {
    failures.push(`content/site.json still references retired term "${stale}"`);
  }
}
if (/github\.com\/pranavkannepalli\/conductor-arch/.test(raw)) {
  failures.push("conductor-arch links must use the perceo-ai org");
}

if (failures.length > 0) {
  console.error("site config validation failed:");
  for (const failure of failures) {
    console.error(`  - ${failure}`);
  }
  process.exit(1);
}

console.log(`site config OK (${products.length} products, ${features.length} features)`);
