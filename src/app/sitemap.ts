import type { MetadataRoute } from "next";

import { siteUrl } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/services", "/portfolio", "/contact", "/privacy"];
  return pages.map((path) => ({
    url: `${siteUrl}${path}`,
    changeFrequency: "monthly" as const,
  }));
}
