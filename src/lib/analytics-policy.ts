/** Only fixed public route names and categorical values may enter analytics. */
export const CONSENT_KEY = "sage-analytics-consent-v1";
export const INTERNAL_KEY = "sage-analytics-internal";
export type AnalyticsConsent = "denied" | "analytics" | "recordings";

export function isAnalyticsEnvironment(environment: string, hostname: string, testMode = false) {
  return (environment === "production" && ["sageburress.com", "www.sageburress.com"].includes(hostname)) ||
    (environment === "local" && testMode && ["localhost", "127.0.0.1"].includes(hostname));
}

export const PUBLIC_PATHS = [
  "/", "/about", "/services", "/services/modeling", "/services/content-creation",
  "/services/makeup-artist", "/services/travel-collaborations", "/services/henna",
  "/services/face-painting", "/portfolio", "/links", "/contact", "/privacy",
] as const;

export function publicPath(path: string): string | null {
  const normalized = path === "/" ? "/" : path.replace(/\/$/, "");
  if ((PUBLIC_PATHS as readonly string[]).includes(normalized)) return normalized;
  return null;
}

export function trafficSource(href: string, referrer: string): string {
  const sources: Record<string, string> = {
    instagram: "instagram", ig: "instagram", facebook: "facebook", fb: "facebook",
    threads: "threads", google: "google", bing: "bing", chatgpt: "chatgpt",
    duckduckgo: "duckduckgo", youtube: "youtube", tiktok: "tiktok",
  };
  try {
    const url = new URL(href);
    const source = url.searchParams.get("utm_source")?.toLowerCase() ?? "";
    if (Object.hasOwn(sources, source)) return sources[source];
    const host = new URL(referrer).hostname.toLowerCase();
    if (host === url.hostname) return "internal";
    for (const domain of ["instagram", "facebook", "threads", "google", "bing", "chatgpt", "duckduckgo", "youtube", "tiktok"]) {
      if (host === `${domain}.com` || host.endsWith(`.${domain}.com`) || host === `${domain}.net`) return domain;
    }
    return "other_referral";
  } catch {
    return "direct_or_unknown";
  }
}

export const EVENT_NAMES = [
  "$pageview", "page_engaged", "key_action_clicked", "contact_form_started",
  "contact_validation_failed", "contact_submit_attempted", "contact_submit_succeeded",
  "contact_submit_failed", "site_problem",
] as const;
export type AnalyticsEvent = (typeof EVENT_NAMES)[number];
export type EventProperties = {
  action?: "contact" | "email" | "external_link" | "portfolio" | "service";
  destination?: string;
  reason?: "invalid_form" | "rate_limited" | "delivery_not_configured" | "delivery_failed" | "network" | "unexpected_response" | "runtime_error" | "unhandled_rejection";
};
