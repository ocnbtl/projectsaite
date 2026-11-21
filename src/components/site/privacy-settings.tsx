"use client";

import { useEffect, useState } from "react";
import { usePrivacyRegion } from "./privacy-region";
import { internalVisitor, privacySignal, readPreferences, savePreferences } from "@/lib/analytics";
import { CONSENT_KEY, PRIVACY_KEY, INTERNAL_KEY, PREFERENCES_EVENT, DEFAULT_PREFERENCES, type PrivacyPreferences } from "@/lib/analytics-policy";

export function PrivacySettings({ environment }: { environment: string }) {
  const policy = usePrivacyRegion();
  const [preferences, setPreferences] = useState<PrivacyPreferences>(DEFAULT_PREFERENCES);
  const [ready, setReady] = useState(false);
  const [signal, setSignal] = useState(false);
  const [internal, setInternal] = useState(false);
  const [status, setStatus] = useState("");
  const configured = Boolean(process.env.NEXT_PUBLIC_POSTHOG_KEY);

  useEffect(() => {
    const refresh = () => {
      setPreferences(readPreferences(policy.defaultsAllowed, policy.replayDefaultAllowed));
      setSignal(privacySignal() || policy.blocked);
      setInternal(internalVisitor());
      setReady(true);
    };
    const storage = (event: StorageEvent) => {
      if (event.key === CONSENT_KEY || event.key === PRIVACY_KEY || event.key === INTERNAL_KEY || event.key === null) refresh();
    };
    refresh();
    window.addEventListener("storage", storage);
    window.addEventListener(PREFERENCES_EVENT, refresh);
    return () => { window.removeEventListener("storage", storage); window.removeEventListener(PREFERENCES_EVENT, refresh); };
  }, [policy]);

  const blocked = !ready || !configured || signal || internal;
  const analytics = !blocked && preferences.analytics;
  const recordings = !blocked && preferences.recordings;

  function choose(value: PrivacyPreferences) {
    setStatus(savePreferences(value, environment) ? "Saved. Your choice applies immediately in this browser." : "Unable to save. Check your browser settings.");
  }

  return (
    <section className="privacy-settings" id="settings" aria-labelledby="privacy-settings-title" data-analytics-private>
      <div className="privacy-settings__heading">
        <h2 id="privacy-settings-title">Your Privacy Choices</h2>
        <p>Optional and independent. Saved in this browser.</p>
      </div>
      <p>{policy.defaultsAllowed ? "Optional public-page insights are on by default for this region. You can turn each off below." : "Optional tracking stays off until you enable it for this region."} Existing declines and browser privacy signals are honored.</p>
      {signal && <p className="privacy-settings__notice">Tracking is off per your browser preference (GPC or Do Not Track).</p>}
      {internal && <p className="privacy-settings__notice">This browser is excluded.</p>}
      {!configured && <p className="privacy-settings__notice">Optional analytics are unavailable.</p>}
      <label className="privacy-setting">
        <span><span className="privacy-setting__name" id="analytics-label">Analytics</span><span className="privacy-setting__description" id="analytics-description">Visits, actions, errors and page speed. Includes Vercel traffic analytics.</span></span>
        <input type="checkbox" role="switch" aria-labelledby="analytics-label" aria-describedby="analytics-description" checked={analytics} disabled={blocked} onChange={event => choose({ ...preferences, analytics: event.target.checked })} />
      </label>
      <label className="privacy-setting">
        <span><span className="privacy-setting__name" id="heatmaps-label">Heatmaps</span><span className="privacy-setting__description" id="heatmaps-description">Public-page click and movement coordinates, without form contents.</span></span>
        <input type="checkbox" role="switch" aria-labelledby="heatmaps-label" aria-describedby="heatmaps-description" checked={!blocked && preferences.heatmaps} disabled={blocked} onChange={event => choose({ ...preferences, heatmaps: event.target.checked })} />
      </label>
      <label className="privacy-setting">
        <span><span className="privacy-setting__name" id="recordings-label">Recordings</span><span className="privacy-setting__description" id="recordings-description">Masked public-page replay. {policy.defaultsAllowed && !policy.replayDefaultAllowed ? "Requires your opt-in in this region." : "Private inputs hidden."}</span></span>
        <input type="checkbox" role="switch" aria-labelledby="recordings-label" aria-describedby="recordings-description" checked={recordings} disabled={blocked} onChange={event => choose({ ...preferences, recordings: event.target.checked })} />
      </label>
      <div className="privacy-settings__footer">
        <button className="privacy-text-button" type="button" aria-label="Turn off optional tracking" disabled={!ready} onClick={() => choose({ analytics: false, heatmaps: false, recordings: false })}>Turn off all</button>
        <span role="status">{status}</span>
      </div>
    </section>
  );
}
