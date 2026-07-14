import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/perceo-legacy", "/setup", "/setup/complete"],
      },
    ],
    sitemap: `${siteConfig.site.baseUrl}/sitemap.xml`,
  };
}
