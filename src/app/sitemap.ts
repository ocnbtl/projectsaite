import type { MetadataRoute } from "next";

import { siteUrl } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    "",
    "/services",
    "/services/modeling",
    "/services/face-painting",
    "/services/henna",
    "/services/makeup-artist",
    "/services/content-creation",
    "/services/travel-collaborations",
    "/portfolio",
    "/links",
    "/contact",
    "/privacy",
  ];
  return pages.map((path) => ({
    url: `${siteUrl}${path}`,
    changeFrequency: "monthly" as const,
  }));
}
