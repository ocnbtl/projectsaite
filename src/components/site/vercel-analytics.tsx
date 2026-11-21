"use client";

import { Analytics } from "@vercel/analytics/next";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { usePrivacyRegion } from "./privacy-region";
import { collectionPath, isAnalyticsEnvironment, safeVercelReferrer, PREFERENCES_EVENT } from "@/lib/analytics-policy";
import { readPreferences, internalVisitor, privacySignal } from "@/lib/analytics";

export function VercelAnalytics({ environment }: { environment: string }) {
  const pathname = usePathname();
  const policy = usePrivacyRegion();
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    const refresh = () => setEnabled(isAnalyticsEnvironment(environment, location.hostname, process.env.NEXT_PUBLIC_POSTHOG_TEST_MODE === "true") && Boolean(collectionPath(location.pathname)) && !location.search && !location.hash && !internalVisitor() && !policy.blocked && !privacySignal() && readPreferences(policy.defaultsAllowed).analytics);
    refresh();
    window.addEventListener("storage", refresh);
    window.addEventListener(PREFERENCES_EVENT, refresh);
    return () => { window.removeEventListener("storage", refresh); window.removeEventListener(PREFERENCES_EVENT, refresh); };
  }, [environment, pathname, policy]);
  if (!enabled) return null;
  return <Analytics beforeSend={(event) => {
    // The hosted SDK attaches referrer outside beforeSend's URL override.
    // Drop such visits, not merely their displayed page URL. PostHog still uses
    // a closed categorical source. No custom Vercel payloads are admitted.
    if (event.type !== "pageview" || !safeVercelReferrer(document.referrer, location.origin)) return null;
    if (!isAnalyticsEnvironment(environment, location.hostname, process.env.NEXT_PUBLIC_POSTHOG_TEST_MODE === "true")) return null;
    try {
      if (internalVisitor() || policy.blocked || privacySignal() || !readPreferences(policy.defaultsAllowed).analytics || location.search || location.hash) return null;
      const path = collectionPath(location.pathname);
      return path ? { ...event, url: `https://sageburress.com${path}` } : null;
    } catch { return null; }
  }} />;
}
