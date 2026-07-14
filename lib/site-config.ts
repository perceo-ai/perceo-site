import siteConfigData from "@/content/site.json";

export type ProductStatus = "in-development" | "concept";

export type ProductSummary = {
  slug: string;
  name: string;
  status: ProductStatus;
  docsVisibility?: "public" | "locked";
  role: string;
  summary: string;
  pitch: string;
  href: string;
  docsHref: string;
  primaryCta: string;
};

export type SuiteVisualKind = "archivum" | "archgraph" | "archductor" | "testing";

export type SiteConfig = typeof siteConfigData & {
  products: ProductSummary[];
  homePage: typeof siteConfigData.homePage & {
    features: Array<{
      visual: SuiteVisualKind;
      title: string;
      description: string;
    }>;
  };
  productsPage: typeof siteConfigData.productsPage & {
    statusLabels: Record<ProductStatus, string>;
  };
};

export const siteConfig = siteConfigData as SiteConfig;
export const products = siteConfig.products as ProductSummary[];
export const linuxConductor = siteConfig.linuxConductor;
