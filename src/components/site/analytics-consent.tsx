"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { analyticsActive, internalVisitor, privacySignal, readConsent, saveConsent, stopAnalytics, syncAnalytics, track } from "@/lib/analytics";
import { CONSENT_KEY, INTERNAL_KEY, PREFERENCES_EVENT, publicPath, type AnalyticsConsent } from "@/lib/analytics-policy";

export function AnalyticsConsent({ environment }: { environment: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const configured = Boolean(process.env.NEXT_PUBLIC_POSTHOG_KEY);

  useEffect(() => {
    const refresh = () => {
      setOpen(configured && !readConsent() && !privacySignal() && !internalVisitor());
      void syncAnalytics(environment);
    };
    refresh();
    const storage = (event: StorageEvent) => { if (event.key === CONSENT_KEY || event.key === INTERNAL_KEY || event.key === null) refresh(); };
    window.addEventListener("storage", storage);
    window.addEventListener(PREFERENCES_EVENT, refresh);
    return () => { window.removeEventListener("storage", storage); window.removeEventListener(PREFERENCES_EVENT, refresh); stopAnalytics(); };
  }, [configured, environment]);

  useEffect(() => {
    void syncAnalytics(environment);
    let visibleSeconds = 0;
    let engaged = false;
    const timer = window.setInterval(() => {
      if (!analyticsActive()) { visibleSeconds = 0; return; }
      if (!document.hidden && !engaged) {
        visibleSeconds++;
        if (visibleSeconds >= 15) engaged = track("page_engaged");
      }
    }, 1000);
    return () => window.clearInterval(timer);
  }, [environment, pathname]);

  useEffect(() => {
    const click = (event: MouseEvent) => {
      const anchor = (event.target as Element)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!anchor) return;
      const url = new URL(anchor.href, location.origin);
      if (url.protocol === "mailto:") track("key_action_clicked", { action: "email" });
      else if (url.origin !== location.origin && ["http:", "https:"].includes(url.protocol)) track("key_action_clicked", { action: "external_link" });
      else if (publicPath(url.pathname)) {
        const action = url.pathname === "/contact" ? "contact" : url.pathname.startsWith("/services/") ? "service" : url.pathname.startsWith("/portfolio") ? "portfolio" : undefined;
        if (action) track("key_action_clicked", { action, destination: url.pathname });
      }
    };
    const error = () => track("site_problem", { reason: "runtime_error" });
    const rejection = () => track("site_problem", { reason: "unhandled_rejection" });
    document.addEventListener("click", click);
    window.addEventListener("error", error);
    window.addEventListener("unhandledrejection", rejection);
    return () => {
      document.removeEventListener("click", click);
      window.removeEventListener("error", error);
      window.removeEventListener("unhandledrejection", rejection);
    };
  }, []);

  function choose(value: AnalyticsConsent) {
    if (!saveConsent(value, environment)) {
      setError("Your browser could not save this choice. Optional tracking stays off.");
      return;
    }
    setOpen(false);
    document.getElementById("main-content")?.focus({ preventScroll: true });
  }

  if (!configured || !open || pathname === "/privacy") return null;
  return (
    <section className="privacy-notice" role="region" aria-labelledby="privacy-notice-title" data-analytics-private>
      <h2 id="privacy-notice-title">Your privacy</h2>
      <p>Optional analytics and masked session recordings help improve this site.</p>
      <div className="privacy-notice__actions">
        <button type="button" onClick={() => choose("recordings")}>Accept</button>
        <button type="button" onClick={() => choose("denied")}>Decline</button>
        <Link href="/privacy#settings">Settings</Link>
      </div>
      {error && <p role="alert">{error}</p>}
    </section>
  );
}
