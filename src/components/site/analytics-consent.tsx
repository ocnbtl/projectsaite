"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { analyticsActive, internalVisitor, privacySignal, readConsent, saveConsent, stopAnalytics, syncAnalytics, track } from "@/lib/analytics";
import { CONSENT_KEY, INTERNAL_KEY, publicPath, type AnalyticsConsent } from "@/lib/analytics-policy";

export function AnalyticsConsent({ environment }: { environment: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [signal, setSignal] = useState(false);
  const [internal, setInternal] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const configured = Boolean(process.env.NEXT_PUBLIC_POSTHOG_KEY);

  useEffect(() => {
    const refresh = () => {
      setSignal(privacySignal());
      setInternal(internalVisitor());
      setOpen(configured && !readConsent() && !privacySignal() && !internalVisitor());
      void syncAnalytics(environment);
    };
    refresh();
    const storage = (event: StorageEvent) => { if (event.key === CONSENT_KEY || event.key === INTERNAL_KEY || event.key === null) refresh(); };
    window.addEventListener("storage", storage);
    return () => { window.removeEventListener("storage", storage); stopAnalytics(); };
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
    saveConsent(value, environment);
    setOpen(false);
    toggle.current?.focus();
  }

  function toggleInternal() {
    try { localStorage.setItem(INTERNAL_KEY, internal ? "false" : "true"); } catch { return; }
    setInternal(!internal);
    void syncAnalytics(environment);
  }

  if (!configured) return null;
  return (
    <div className="analytics-preferences" data-analytics-private>
      <button ref={toggle} className="analytics-preferences__open" type="button" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="analytics-preferences-panel">Privacy choices</button>
      {open && (
        <section id="analytics-preferences-panel" className="analytics-preferences__panel" role="region" aria-labelledby="analytics-preferences-title">
          <div className="analytics-preferences__heading">
            <h2 id="analytics-preferences-title">Your privacy choices</h2>
            <button type="button" onClick={() => { setOpen(false); toggle.current?.focus(); }} aria-label="Close privacy choices">×</button>
          </div>
          <p>Optional analytics help Sage understand which pages are useful. You can also allow masked recordings of page interactions. Contact forms and admin pages are never recorded.</p>
          {signal && <p role="status">Your browser’s privacy signal is respected. Optional tracking is off.</p>}
          {internal && <p role="status">This browser is excluded as an internal visit.</p>}
          <div className="analytics-preferences__actions">
            <button type="button" onClick={() => choose("denied")}>Decline optional tracking</button>
            <button type="button" disabled={signal || internal} onClick={() => choose("analytics")}>Allow analytics only</button>
            <button type="button" disabled={signal || internal} onClick={() => choose("recordings")}>Allow analytics + recordings</button>
          </div>
          <div className="analytics-preferences__details"><Link href="/privacy">Read the privacy policy</Link><button type="button" onClick={toggleInternal}>{internal ? "Include this browser again" : "Exclude this browser (site owner/testing)"}</button></div>
        </section>
      )}
    </div>
  );
}
