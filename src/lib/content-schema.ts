import { z } from "zod";

import type { SiteContent } from "./content";
import { isAllowedContentImageUrl } from "./content-constraints";

const requiredText = (max: number) => z.string().trim().min(1).max(max);
const httpsUrl = z.url().refine((value) => value.startsWith("https://"), {
  message: "Expected an HTTPS URL",
});
const imageUrl = z.url().refine(isAllowedContentImageUrl, {
  message: "Expected an image URL from an allowed HTTPS host",
});
const slug = z.string().trim().min(1).max(80).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

const serviceSchema = z
  .object({
    slug,
    number: z.string().trim().regex(/^\d{2}$/),
    title: requiredText(120),
    shortTitle: requiredText(40),
    summary: requiredText(600),
    description: requiredText(2400),
    deliverables: z.array(requiredText(180)).min(1).max(12),
    accent: z.enum(["olive", "clay", "blush", "bronze", "cocoa", "sage"]),
  })
  .strict();

const projectSchema = z
  .object({
    slug,
    title: requiredText(160),
    category: requiredText(100),
    year: requiredText(20),
    location: z.string().trim().max(160),
    summary: requiredText(800),
    story: requiredText(6000),
    image: imageUrl,
    alt: requiredText(500),
    tags: z.array(requiredText(80)).min(1).max(20),
    featured: z.boolean(),
  })
  .strict();

const socialLinkSchema = z
  .object({
    label: requiredText(60),
    href: httpsUrl,
    handle: requiredText(100),
  })
  .strict();

function addDuplicateIssues(
  values: Array<{ slug: string }>,
  collection: "services" | "projects",
  context: z.RefinementCtx,
) {
  const seen = new Set<string>();
  values.forEach((value, index) => {
    if (seen.has(value.slug)) {
      context.addIssue({
        code: "custom",
        path: [collection, index, "slug"],
        message: `Duplicate ${collection.slice(0, -1)} slug`,
      });
    }
    seen.add(value.slug);
  });
}

export const siteContentSchema: z.ZodType<SiteContent> = z
  .object({
    hero: z
      .object({
        kicker: requiredText(160),
        title: requiredText(160),
        lead: requiredText(1200),
        image: imageUrl,
        imageAlt: requiredText(500),
      })
      .strict(),
    about: z
      .object({
        title: requiredText(240),
        intro: requiredText(2400),
        story: requiredText(8000),
        image: imageUrl,
        imageAlt: requiredText(500),
      })
      .strict(),
    contact: z
      .object({
        title: requiredText(240),
        intro: requiredText(2400),
        email: z.email().max(254),
      })
      .strict(),
    services: z.array(serviceSchema).min(1).max(12),
    projects: z.array(projectSchema).max(100),
    social: z.array(socialLinkSchema).max(12),
  })
  .strict()
  .superRefine((content, context) => {
    addDuplicateIssues(content.services, "services", context);
    addDuplicateIssues(content.projects, "projects", context);

    const socialLabels = new Set<string>();
    content.social.forEach((item, index) => {
      const label = item.label.toLocaleLowerCase();
      if (socialLabels.has(label)) {
        context.addIssue({
          code: "custom",
          path: ["social", index, "label"],
          message: "Duplicate social label",
        });
      }
      socialLabels.add(label);
    });
  });

export function parseSiteContent(value: unknown): SiteContent | null {
  const result = siteContentSchema.safeParse(value);
  return result.success ? result.data : null;
}

export function isSiteContent(value: unknown): value is SiteContent {
  return siteContentSchema.safeParse(value).success;
}
