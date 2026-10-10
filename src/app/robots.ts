import type { MetadataRoute } from "next";

import { siteUrl } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  return {
    // Crawlers must be able to read the login page's noindex directive.
    rules: [{ userAgent: "*", allow: ["/", "/admin/login$"], disallow: ["/admin/", "/api/"] }],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
