"use client";

import { Analytics } from "@vercel/analytics/next";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { collectionPath, PREFERENCES_EVENT } from "@/lib/analytics-policy";
import { readPreferences, internalVisitor, privacySignal } from "@/lib/analytics";

export function VercelAnalytics({ environment }: { environment: string }) {
  const pathname = usePathname();
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    const refresh = () => setEnabled(environment === "production" && Boolean(collectionPath(location.pathname)) && !location.search && !location.hash && !internalVisitor() && !privacySignal() && readPreferences().analytics);
    refresh();
    window.addEventListener("storage", refresh);
    window.addEventListener(PREFERENCES_EVENT, refresh);
    return () => { window.removeEventListener("storage", refresh); window.removeEventListener(PREFERENCES_EVENT, refresh); };
  }, [environment, pathname]);
  if (!enabled) return null;
  return <Analytics beforeSend={(event) => {
    if (environment !== "production" || !["sageburress.com", "www.sageburress.com"].includes(location.hostname)) return null;
    try {
      if (internalVisitor() || privacySignal() || !readPreferences().analytics || location.search || location.hash) return null;
      const path = collectionPath(location.pathname);
      return path ? { ...event, url: `https://sageburress.com${path}` } : null;
    } catch { return null; }
  }} />;
}
