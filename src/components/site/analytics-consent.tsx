"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { useReportWebVitals } from "next/web-vitals";
import { usePrivacyRegion } from "./privacy-region";
import { analyticsActive, stopAnalytics, syncAnalytics, track } from "@/lib/analytics";
import { CONSENT_KEY, PRIVACY_KEY, INTERNAL_KEY, PREFERENCES_EVENT, publicPath } from "@/lib/analytics-policy";

export function AnalyticsConsent({ environment }: { environment: string }) {
  const pathname = usePathname();
  const policy = usePrivacyRegion();
  const initialPath = useRef(pathname);
  useReportWebVitals(metric => {
    if (location.pathname === initialPath.current) track("web_vital", { metric: metric.name, value: metric.value });
  });
  useEffect(() => {
    const refresh = () => {
      void syncAnalytics(environment, policy);
    };
    refresh();
    const storage = (event: StorageEvent) => { if (event.key === CONSENT_KEY || event.key === PRIVACY_KEY || event.key === INTERNAL_KEY || event.key === null) refresh(); };
    window.addEventListener("storage", storage);
    window.addEventListener(PREFERENCES_EVENT, refresh);
    return () => { window.removeEventListener("storage", storage); window.removeEventListener(PREFERENCES_EVENT, refresh); stopAnalytics(); };
  }, [environment, policy]);

  useEffect(() => {
    void syncAnalytics(environment, policy);
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
  }, [environment, pathname, policy]);

  useEffect(() => {
    const click = (event: MouseEvent) => {
      const anchor = (event.target as Element)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!anchor) return;
      const placement = anchor.closest("nav") ? "navigation" : anchor.closest("footer") ? "footer" : "page";
      const url = new URL(anchor.href, location.origin);
      if (url.protocol === "mailto:") track("key_action_clicked", { action: "email" });
      else if (url.origin !== location.origin && ["http:", "https:"].includes(url.protocol)) track("key_action_clicked", { action: "external_link" });
      else if (publicPath(url.pathname)) {
        const action = url.pathname === "/contact" ? "contact" : url.pathname.startsWith("/services/") ? "service" : url.pathname.startsWith("/portfolio") ? "portfolio" : undefined;
        if (action) track("key_action_clicked", { action, destination: url.pathname, placement });
      }
    };
    const error = () => { track("site_problem", { reason: "runtime_error" }); track("$exception", { reason: "runtime_error" }); };
    const rejection = () => { track("site_problem", { reason: "unhandled_rejection" }); track("$exception", { reason: "unhandled_rejection" }); };
    const toggle = (event: Event) => {
      const detail = event.target;
      if (detail instanceof HTMLDetailsElement && detail.open && detail.hasAttribute("data-analytics-faq")) track("faq_opened", { faq: Number(detail.dataset.analyticsFaq) });
    };
    document.addEventListener("click", click);
    document.addEventListener("toggle", toggle, true);
    window.addEventListener("error", error);
    window.addEventListener("unhandledrejection", rejection);
    return () => {
      document.removeEventListener("click", click);
      document.removeEventListener("toggle", toggle, true);
      window.removeEventListener("error", error);
      window.removeEventListener("unhandledrejection", rejection);
    };
  }, []);

  return null;
}
