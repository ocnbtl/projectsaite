"use client";

import type { PostHog, PostHogConfig } from "posthog-js";
import { CONSENT_KEY, INTERNAL_KEY, PREFERENCES_EVENT, EVENT_NAMES, isAnalyticsEnvironment, publicPath, trafficSource, type AnalyticsConsent, type AnalyticsEvent, type EventProperties } from "./analytics-policy";

let client: PostHog | undefined;
let loading: Promise<void> | undefined;
let deployment = "local";
let lastPage: string | null = null;
let source = "direct_or_unknown";

export function readConsent(): AnalyticsConsent | null {
  try {
    const value = localStorage.getItem(CONSENT_KEY);
    return value === "analytics" || value === "recordings" || value === "denied" ? value : null;
  } catch { return null; }
}

export function privacySignal() {
  return navigator.doNotTrack === "1" || (navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl === true;
}

export function internalVisitor() {
  try { return localStorage.getItem(INTERNAL_KEY) === "true"; } catch { return true; }
}

export function environmentAllowed() {
  return isAnalyticsEnvironment(deployment, location.hostname, process.env.NEXT_PUBLIC_POSTHOG_TEST_MODE === "true");
}

function allowed() {
  return environmentAllowed() && !internalVisitor() && !privacySignal() && ["analytics", "recordings"].includes(readConsent() ?? "") && publicPath(location.pathname) !== null;
}

export function analyticsActive() { return Boolean(client) && allowed(); }

function replayAllowed() {
  return allowed() && readConsent() === "recordings" && location.pathname !== "/contact" && location.pathname !== "/privacy" && !location.search && !location.hash;
}

// A closed property list removes SDK URL/referrer/person defaults as well as accidental application data.
const protocolKeys = new Set(["token", "distinct_id", "$device_id", "$session_id", "$window_id", "$insert_id", "$lib", "$lib_version", "$browser", "$browser_version", "$os", "$os_version", "$device_type", "$screen_height", "$screen_width", "$viewport_height", "$viewport_width", "$snapshot_bytes", "$snapshot_data", "$snapshot_source"]);
const appKeys = new Set(["action", "destination", "reason", "traffic_source", "environment", "schema_version", "page_path", "$current_url", "$pathname", "$host", "$process_person_profile", "$geoip_disable"]);

export const beforeSend: PostHogConfig["before_send"] = (event) => {
  if (!event || !allowed()) return null;
  if (event.event === "$snapshot") {
    if (!replayAllowed()) return null;
  } else if (!(EVENT_NAMES as readonly string[]).includes(event.event)) return null;
  const properties = Object.fromEntries(Object.entries(event.properties ?? {}).filter(([key]) => protocolKeys.has(key) || appKeys.has(key)));
  const path = publicPath(location.pathname)!;
  properties.$current_url = `https://sageburress.com${path}`;
  properties.$pathname = path;
  properties.$host = "sageburress.com";
  properties.page_path = path;
  properties.environment = deployment === "production" ? "production" : "test";
  properties.traffic_source = source;
  properties.schema_version = 1;
  properties.$process_person_profile = false;
  properties.$geoip_disable = true;
  event.properties = properties;
  delete event.$set;
  delete event.$set_once;
  return event;
};

export async function syncAnalytics(environment: string) {
  deployment = environment;
  if (!allowed() || !process.env.NEXT_PUBLIC_POSTHOG_KEY) {
    client?.stopSessionRecording();
    if (readConsent() === "denied" || internalVisitor() || privacySignal()) {
      client?.opt_out_capturing();
      client?.reset();
    }
    lastPage = null;
    return;
  }
  if (!client) {
    loading ??= (async () => {
      // No PostHog network request or identifier is created until explicit consent.
      const { default: posthog } = await import("posthog-js/full/no-external");
      if (!allowed()) return;
      source = trafficSource(location.href, document.referrer);
      posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
        ui_host: "https://us.posthog.com",
        defaults: "2026-05-30",
        persistence: "memory",
        person_profiles: "never",
        ip: false,
        autocapture: false,
        capture_pageview: false,
        capture_pageleave: false,
        capture_dead_clicks: false,
        rageclick: false,
        capture_exceptions: false,
        capture_performance: false,
        enable_heatmaps: false,
        enable_recording_console_log: false,
        disable_surveys: true,
        disable_session_recording: true,
        disable_capture_url_hashes: true,
        save_referrer: false,
        save_campaign_params: false,
        advanced_disable_feature_flags: true,
        request_batching: false,
        disable_compression: process.env.NEXT_PUBLIC_POSTHOG_TEST_MODE === "true",
        opt_out_useragent_filter: process.env.NEXT_PUBLIC_POSTHOG_TEST_MODE === "true",
        get_current_url: () => `https://sageburress.com${publicPath(location.pathname) ?? "/"}`,
        before_send: beforeSend,
        session_recording: {
          maskAllInputs: true,
          maskTextSelector: "*",
          maskAllElementAttributes: true,
          blockSelector: "form, input, textarea, select, [contenteditable], img, video, canvas, iframe, [data-analytics-private], a[href^='mailto:'], a[href^='tel:']",
          recordBody: false,
          recordHeaders: false,
          captureJsonLd: false,
          collectFonts: false,
          recordCrossOriginIframes: false,
          captureCanvas: { recordCanvas: false },
          maskCapturedNetworkRequestFn: (request) => {
            // The SDK also calls this with { name } for replay navigation metadata.
            // Keep only a fixed public route there; discard actual network entries.
            if (Object.keys(request).length === 1 && replayAllowed()) {
              return { ...request, name: `https://sageburress.com${publicPath(location.pathname)}` };
            }
            return null;
          },
        },
      });
      client = posthog;
    })().catch((error: unknown) => {
      // Optional analytics must never interrupt browsing or sending an inquiry.
      if (process.env.NODE_ENV === "development") console.warn("Optional analytics unavailable", error);
    }).finally(() => { loading = undefined; });
    await loading;
  }
  if (!client || !allowed()) return;
  if (client.has_opted_out_capturing()) client.opt_in_capturing({ captureEventName: false });
  if (replayAllowed()) client.startSessionRecording();
  else client.stopSessionRecording();
  const path = publicPath(location.pathname);
  if (path !== lastPage) {
    lastPage = path;
    track("$pageview");
  }
}

export function stopAnalytics() {
  client?.stopSessionRecording();
  lastPage = null;
}

export function track(event: AnalyticsEvent, properties: EventProperties = {}) {
  if (!client || !allowed()) return false;
  const safe: EventProperties = {};
  if (["contact", "email", "external_link", "portfolio", "service"].includes(properties.action ?? "")) safe.action = properties.action;
  if (properties.destination && publicPath(properties.destination)) safe.destination = publicPath(properties.destination)!;
  if (["invalid_form", "rate_limited", "delivery_not_configured", "delivery_failed", "network", "unexpected_response", "runtime_error", "unhandled_rejection"].includes(properties.reason ?? "")) safe.reason = properties.reason;
  try {
    client.capture(event, safe);
    return true;
  } catch { return false; }
}

export function saveConsent(value: AnalyticsConsent, environment: string) {
  try { localStorage.setItem(CONSENT_KEY, value); } catch { return false; }
  if (value !== "recordings") client?.stopSessionRecording();
  if (value === "denied") { client?.opt_out_capturing(); client?.reset(); lastPage = null; }
  void syncAnalytics(environment);
  window.dispatchEvent(new Event(PREFERENCES_EVENT));
  return true;
}
