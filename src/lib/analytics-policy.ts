/** Only fixed public route names and categorical values may enter analytics. */
export const CONSENT_KEY = "sage-analytics-consent-v1";
export const PRIVACY_KEY = "sage-privacy-preferences-v2";
export type PrivacyPreferences = { analytics: boolean; heatmaps: boolean; recordings: boolean };
// Conservative fallback. Never infer geography from language, timezone or URL.
export const DEFAULT_PREFERENCES: PrivacyPreferences = { analytics: false, heatmaps: false, recordings: false };
export type PrivacyRegion = { defaultsAllowed: boolean; replayDefaultAllowed: boolean; blocked: boolean };
const US_REGIONS = new Set("AL AK AZ AR CA CO CT DE DC FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI WY".split(" "));
// Vercel supplies ISO 3166-1 alpha-2 codes. Reject placeholders and malformed locations.
const COUNTRIES = new Set(("AD AE AF AG AI AL AM AO AQ AR AS AT AU AW AX AZ BA BB BD BE BF BG BH BI BJ BL BM BN BO BQ BR BS BT BV BW BY BZ " +
  "CA CC CD CF CG CH CI CK CL CM CN CO CR CU CV CW CX CY CZ DE DJ DK DM DO DZ EC EE EG EH ER ES ET FI FJ FK FM FO FR " +
  "GA GB GD GE GF GG GH GI GL GM GN GP GQ GR GS GT GU GW GY HK HM HN HR HT HU ID IE IL IM IN IO IQ IR IS IT JE JM JO JP " +
  "KE KG KH KI KM KN KP KR KW KY KZ LA LB LC LI LK LR LS LT LU LV LY MA MC MD ME MF MG MH MK ML MM MN MO MP MQ MR MS MT MU MV MW MX MY MZ " +
  "NA NC NE NF NG NI NL NO NP NR NU NZ OM PA PE PF PG PH PK PL PM PN PR PS PT PW PY QA RE RO RS RU RW SA SB SC SD SE SG SH SI SJ SK SL SM SN SO SR SS ST SV SX SY SZ " +
  "TC TD TF TG TH TJ TK TL TM TN TO TR TT TV TW TZ UA UG UM US UY UZ VA VC VE VG VI VN VU WF WS YE YT ZA ZM ZW").split(" "));
// EEA and its individually coded EU territories, UK, Switzerland, and mainland China
// (US analytics processing). Canada is evaluated at province level below.
const PRIOR_CHOICE = new Set("AT BE BG HR CY CZ DE DK EE ES FI FR GR HU IE IT LT LU LV MT NL PL PT RO SE SI SK IS LI NO AX GF GP MF MQ RE YT GB CH CN".split(" "));
const CA_REGIONS = new Set("AB BC MB NB NL NS NT NU ON PE QC SK YT".split(" "));
// Conservative replay-specific hold for all-party/mixed recording-law states.
// This is not a declaration that every statute applies to masked public replay.
const REPLAY_PRIOR_CHOICE = new Set("CA CT DE FL IL MD MA MI MT NV NH PA WA".split(" "));
export function privacyRegion(trustedPlatform: boolean, country: string | null, region: string | null, gpc: string | null, dnt: string | null): PrivacyRegion {
  const blocked = gpc === "1" || dnt === "1";
  let defaultsAllowed = trustedPlatform && !blocked && COUNTRIES.has(country ?? "") && !PRIOR_CHOICE.has(country ?? "");
  if (country === "US") defaultsAllowed = defaultsAllowed && US_REGIONS.has(region ?? "");
  if (country === "CA") defaultsAllowed = defaultsAllowed && CA_REGIONS.has(region ?? "") && region !== "QC";
  // Canada's meaningful-consent guidance distinguishes unexpected collection.
  // Ask separately for detailed session playback even when basic insights are on.
  const replayNeedsChoice = country === "CA" || (country === "US" && REPLAY_PRIOR_CHOICE.has(region ?? ""));
  return { defaultsAllowed, replayDefaultAllowed: defaultsAllowed && !replayNeedsChoice, blocked };
}
export function collectionPath(path: string) {
  const safe = publicPath(path);
  return safe && !["/contact", "/privacy"].includes(safe) ? safe : null;
}
export function safeVercelReferrer(referrer: string, origin: string) {
  if (!referrer) return true;
  try {
    const url = new URL(referrer);
    return url.origin === origin && !url.search && !url.hash && collectionPath(url.pathname) !== null;
  } catch { return false; }
}
export const PREFERENCES_EVENT = "sage-privacy-change";
export const INTERNAL_KEY = "sage-analytics-internal";
export const ATTRIBUTION_KEY = "sage-analytics-source-v2";
export const SERVICES = ["modeling", "content-creation", "makeup-artist", "travel-collaborations", "henna", "face-painting", "other"] as const;
export function serviceCategory(value: unknown) {
  const slug = typeof value === "string" ? value.toLowerCase().replaceAll(" ", "-").replace("travel-promotions", "travel-collaborations") : "";
  return (SERVICES as readonly string[]).includes(slug) ? slug : "other";
}
// Keep historical IDs readable while admitting only the owner-approved new reels.
export const REELS = ["vacation-pose-ideas", "beach-day-grwm", "runway-walk", "vanlife-story", "cayman-dinner-grwm",
  "Ddo5D8uJbMw", "DdmF7BoRO4i", "DcPCf61JC_A", "DUjZuJvCRyd", "DUsxBB9kZ9t", "DOZGwmliabC", "DdfKnCVJpp_",
  "DdcHGPxJn5i", "DdbmqQ7RlDQ", "DQkL8qsiaO2", "DdhgiJ-p5pB", "DdaFZX4JFLA"];
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

// Native heatmaps buffer raw URL keys. Rebuild them before transport and keep
// only coordinates on known public, non-form pages; never text or selectors.
export function safeHeatmap(data: unknown, origin: string) {
  const result: Record<string, { x: number; y: number; type: string; target_fixed: boolean }[]> = {};
  if (!data || typeof data !== "object") return result;
  for (const [href, points] of Object.entries(data)) {
    try {
      const url = new URL(href);
      const path = publicPath(url.pathname);
      if (url.origin !== origin || url.search || url.hash || !path || ["/contact", "/privacy"].includes(path) || !Array.isArray(points)) continue;
      result[`https://sageburress.com${path}`] = points.slice(0, 3000).filter(point =>
        point && Number.isFinite(point.x) && Number.isFinite(point.y) && point.x >= 0 && point.y >= 0 &&
        point.x < 100000 && point.y < 100000 && ["click", "mousemove", "rageclick", "deadclick"].includes(point.type),
      ).map(point => ({ x: Math.round(point.x), y: Math.round(point.y), type: point.type, target_fixed: point.target_fixed === true }));
    } catch { /* Invalid or private URLs are discarded. */ }
  }
  return result;
}

export function trafficSource(href: string, referrer: string): string {
  const sources: Record<string, string> = {
    instagram: "instagram", ig: "instagram", facebook: "facebook", fb: "facebook",
    threads: "threads", google: "google", bing: "bing", chatgpt: "chatgpt",
    duckduckgo: "duckduckgo", youtube: "youtube", tiktok: "tiktok",
    perplexity: "perplexity", claude: "claude", gemini: "gemini", google_business: "google_business",
  };
  try {
    const url = new URL(href);
    const source = url.searchParams.get("utm_source")?.toLowerCase() ?? "";
    if (Object.hasOwn(sources, source)) return sources[source];
    const host = new URL(referrer).hostname.toLowerCase();
    if (host === url.hostname) return "internal";
    if (host === "gemini.google.com") return "gemini";
    if (host === "claude.ai" || host.endsWith(".claude.ai")) return "claude";
    if (host === "perplexity.ai" || host.endsWith(".perplexity.ai")) return "perplexity";
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
  "contact_submit_failed", "site_problem", "service_viewed", "faq_opened", "portfolio_opened",
  "reel_started", "reel_completed", "web_vital", "$exception",
] as const;
export type AnalyticsEvent = (typeof EVENT_NAMES)[number];
export type EventProperties = {
  action?: "contact" | "email" | "external_link" | "portfolio" | "service";
  destination?: string;
  service?: string;
  placement?: "navigation" | "footer" | "page";
  reel?: string;
  faq?: number;
  metric?: string;
  value?: number;
  reason?: "invalid_form" | "rate_limited" | "delivery_not_configured" | "delivery_failed" | "network" | "unexpected_response" | "runtime_error" | "unhandled_rejection" | "media_load";
};
