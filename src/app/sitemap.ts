import type { MetadataRoute } from "next";

import { siteUrl } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    "",
    "/services/modeling",
    "/services/content-creation",
    "/services/makeup-artist",
    "/services/travel-collaborations",
    "/services/henna",
    "/services/face-painting",
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
