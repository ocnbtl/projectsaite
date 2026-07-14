import type { MetadataRoute } from "next";

import { getSiteContent } from "@/lib/content-store";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const content = await getSiteContent();
  const pages = ["", "/about", "/services", "/portfolio", "/contact", "/links", "/privacy"];
  return [
    ...pages.map((path) => ({ url: `https://sageburress.com${path}`, changeFrequency: "monthly" as const })),
    ...content.projects.map((project) => ({
      url: `https://sageburress.com/portfolio/${project.slug}`,
      changeFrequency: "monthly" as const,
    })),
  ];
}
