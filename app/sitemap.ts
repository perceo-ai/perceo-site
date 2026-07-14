import type { MetadataRoute } from "next";
import { getDocsProducts } from "@/lib/docs";
import { siteConfig } from "@/lib/site-config";

const baseUrl = siteConfig.site.baseUrl;

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];

  const docsRoutes = getDocsProducts().flatMap((product) =>
    product.pages.map((page) => ({
      url: page.slug.length
        ? `${baseUrl}/docs/${product.slug}/${page.slug.join("/")}`
        : `${baseUrl}/docs/${product.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  );

  return [...staticRoutes, ...docsRoutes];
}
