import "server-only";

import { cache } from "react";

import { seedContent, type ContentEditingState, type SiteContent } from "@/lib/content";
import { parseSiteContent } from "@/lib/content-schema";

const CONTENT_PATH = "project-saite/site-content.json";

type ContentReadSource = "blob" | "seed-empty" | "seed-invalid" | "seed-unavailable" | "seed-unconfigured";

export type SiteContentSnapshot = {
  content: SiteContent;
  source: ContentReadSource;
};

export function isPersistentContentConfigured() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

async function loadSiteContentSnapshot(): Promise<SiteContentSnapshot> {
  if (!isPersistentContentConfigured()) return { content: seedContent, source: "seed-unconfigured" };

  try {
    const { list } = await import("@vercel/blob");
    const result = await list({ prefix: CONTENT_PATH, limit: 1 });
    const blob = result.blobs.find((item) => item.pathname === CONTENT_PATH);
    if (!blob) return { content: seedContent, source: "seed-empty" };

    const response = await fetch(blob.downloadUrl || blob.url, { cache: "no-store" });
    if (!response.ok) return { content: seedContent, source: "seed-unavailable" };

    let value: unknown;
    try {
      value = await response.json();
    } catch {
      return { content: seedContent, source: "seed-invalid" };
    }

    const content = parseSiteContent(value);
    return content
      ? { content, source: "blob" }
      : { content: seedContent, source: "seed-invalid" };
  } catch {
    return { content: seedContent, source: "seed-unavailable" };
  }
}

export const getSiteContentSnapshot = cache(loadSiteContentSnapshot);

export async function getSiteContent(): Promise<SiteContent> {
  return (await getSiteContentSnapshot()).content;
}

export function getContentEditingState(source: ContentReadSource): ContentEditingState {
  switch (source) {
    case "blob":
      return {
        canSave: true,
        message: "Persistent content is loaded. Published changes appear across the site immediately.",
      };
    case "seed-empty":
      return {
        canSave: true,
        message: "Persistent storage is ready. Publishing will create the first saved content version.",
      };
    case "seed-invalid":
      return {
        canSave: false,
        message: "Read-only fallback: stored content is invalid and must be inspected before publishing.",
      };
    case "seed-unavailable":
      return {
        canSave: false,
        message: "Read-only fallback: stored content could not be verified. Retry before publishing.",
      };
    default:
      return {
        canSave: false,
        message: "Read-only seed content. Connect persistent Blob storage before publishing.",
      };
  }
}

export async function saveSiteContent(content: SiteContent) {
  if (!isPersistentContentConfigured()) {
    throw new Error("Persistent content storage is not configured.");
  }

  const { put } = await import("@vercel/blob");
  return put(CONTENT_PATH, JSON.stringify(content, null, 2), {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
  });
}
