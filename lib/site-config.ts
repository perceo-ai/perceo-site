import siteConfigData from "@/content/site.json";

export type ProductStatus = "available" | "in-development" | "early";

export type NavLink = {
  label: string;
  href: string;
  external?: boolean;
};

export type InstallTarget = {
  name: string;
  command: string;
};

export type ProductDetail = {
  tagline: string;
  intro: string;
  note: string;
  points: string[];
  workflow: string[];
  installTargets?: InstallTarget[];
  requirements: string[];
  docsLinks: NavLink[];
};

export type ProductSummary = {
  slug: string;
  name: string;
  status: ProductStatus;
  role: string;
  summary: string;
  pitch: string;
  href: string;
  docsHref: string;
  repoUrl: string;
  primaryCta: string;
  install?: { label: string; command: string };
  detail: ProductDetail;
};

export type SuiteVisualKind = "archductor" | "archfleet" | "archivum";

export type HeroCard = {
  title: string;
  badge: string;
  tone: "active" | "ready";
  steps: Array<"done" | "active" | "idle">;
  left: string;
  right: string;
};

type JsonConfig = typeof siteConfigData;

/**
 * The JSON widens unions to `string`, so every field whose type matters is
 * re-declared here rather than intersected onto the inferred shape — an
 * intersection would leave `status` as `string` and break exhaustive lookups.
 */
export type SiteConfig = Omit<JsonConfig, "site" | "homePage" | "productsPage" | "products"> & {
  site: Omit<JsonConfig["site"], "nav" | "footer"> & {
    nav: {
      links: NavLink[];
      primaryCta: NavLink;
      secondaryCta: NavLink;
    };
    footer: Omit<JsonConfig["site"]["footer"], "links"> & { links: NavLink[] };
  };
  homePage: Omit<JsonConfig["homePage"], "hero" | "features"> & {
    hero: Omit<JsonConfig["homePage"]["hero"], "cards"> & { cards: HeroCard[] };
    features: Array<{
      visual: SuiteVisualKind;
      title: string;
      description: string;
    }>;
  };
  productsPage: Omit<JsonConfig["productsPage"], "statusLabels"> & {
    statusLabels: Record<ProductStatus, string>;
  };
  products: ProductSummary[];
};

export const siteConfig = siteConfigData as unknown as SiteConfig;
export const products = siteConfig.products;

export function getProduct(slug: string) {
  return products.find((product) => product.slug === slug);
}
