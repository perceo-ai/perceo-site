import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/perceo-legacy", "/setup", "/setup/complete"],
      },
    ],
    sitemap: "https://perceo.ai/sitemap.xml",
  };
}

