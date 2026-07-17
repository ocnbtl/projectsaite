import "server-only";

import { isSiteContent, seedContent, type SiteContent } from "@/lib/content";

// The v2 document keeps the redesigned public-site content separate from the
// previous placeholder-era document without deleting or overwriting owner data.
const CONTENT_PATH = "project-saite/site-content-v2.json";

export function isPersistentContentConfigured() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

export async function getSiteContent(): Promise<SiteContent> {
  if (!isPersistentContentConfigured()) return seedContent;

  try {
    const { list } = await import("@vercel/blob");
    const result = await list({ prefix: CONTENT_PATH, limit: 1 });
    const blob = result.blobs.find((item) => item.pathname === CONTENT_PATH);
    if (!blob) return seedContent;

    const response = await fetch(blob.downloadUrl || blob.url, { cache: "no-store" });
    if (!response.ok) return seedContent;
    const value: unknown = await response.json();
    return isSiteContent(value) ? value : seedContent;
  } catch {
    return seedContent;
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
