"use client";

import { Analytics } from "@vercel/analytics/next";
import { INTERNAL_KEY, publicPath } from "@/lib/analytics-policy";

export function VercelAnalytics({ environment }: { environment: string }) {
  if (environment !== "production") return null;
  return <Analytics beforeSend={(event) => {
    if (environment !== "production" || !["sageburress.com", "www.sageburress.com"].includes(location.hostname)) return null;
    try {
      if (localStorage.getItem(INTERNAL_KEY) === "true") return null;
      const path = publicPath(new URL(event.url).pathname);
      return path ? { ...event, url: `https://sageburress.com${path}` } : null;
    } catch { return null; }
  }} />;
}
