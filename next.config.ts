import { readFileSync } from "node:fs";
import path from "node:path";
import type { NextConfig } from "next";

// Read the JSON directly: next.config.ts is compiled outside the tsconfig path
// aliases, so importing lib/site-config.ts here fails to resolve "@/content".
const siteConfig = JSON.parse(
  readFileSync(path.join(process.cwd(), "content/site.json"), "utf8"),
) as { site: { docsUrl: string } };

const docsUrl = siteConfig.site.docsUrl;

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Docs moved to a standalone Mintlify site.
      { source: "/docs", destination: docsUrl, permanent: true },
      {
        source: "/docs/perceo/:path*",
        destination: docsUrl,
        permanent: true,
      },
      // Retired concepts; nearest live equivalent.
      {
        source: "/docs/archgraph/:path*",
        destination: `${docsUrl}/archivum/overview`,
        permanent: true,
      },
      {
        source: "/docs/computer-use-testing/:path*",
        destination: `${docsUrl}/archfleet/overview`,
        permanent: true,
      },
      // Product docs keep their path shape under the new host.
      { source: "/docs/:product/:path*", destination: `${docsUrl}/:product/:path*`, permanent: true },
      { source: "/docs/:product", destination: `${docsUrl}/:product/overview`, permanent: true },

      // Retired routes.
      { source: "/products/linux-conductor", destination: "/products/archductor", permanent: true },
      { source: "/products/archgraph", destination: "/products", permanent: true },
      { source: "/products/computer-use-testing", destination: "/products/archfleet", permanent: true },
      { source: "/perceo-legacy", destination: "/", permanent: true },
      { source: "/setup/:path*", destination: "/", permanent: true },
    ];
  },
};

export default nextConfig;
