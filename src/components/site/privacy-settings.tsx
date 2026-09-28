"use client";

import { useEffect, useState } from "react";
import { internalVisitor, privacySignal, readConsent, saveConsent } from "@/lib/analytics";
import { CONSENT_KEY, INTERNAL_KEY, PREFERENCES_EVENT, type AnalyticsConsent } from "@/lib/analytics-policy";

export function PrivacySettings({ environment }: { environment: string }) {
  const [consent, setConsent] = useState<AnalyticsConsent | null>(null);
  const [ready, setReady] = useState(false);
  const [signal, setSignal] = useState(false);
  const [internal, setInternal] = useState(false);
  const [status, setStatus] = useState("");
  const configured = Boolean(process.env.NEXT_PUBLIC_POSTHOG_KEY);

  useEffect(() => {
    const refresh = () => {
      setConsent(readConsent());
      setSignal(privacySignal());
      setInternal(internalVisitor());
      setReady(true);
    };
    const storage = (event: StorageEvent) => {
      if (event.key === CONSENT_KEY || event.key === INTERNAL_KEY || event.key === null) refresh();
    };
    refresh();
    window.addEventListener("storage", storage);
    window.addEventListener(PREFERENCES_EVENT, refresh);
    return () => { window.removeEventListener("storage", storage); window.removeEventListener(PREFERENCES_EVENT, refresh); };
  }, []);

  const blocked = !ready || !configured || signal || internal;
  const analytics = !blocked && (consent === "analytics" || consent === "recordings");
  const recordings = !blocked && consent === "recordings";

  function choose(value: AnalyticsConsent) {
    setStatus(saveConsent(value, environment) ? "Saved." : "Unable to save. Check your browser settings.");
  }

  return (
    <section className="privacy-settings" id="settings" aria-labelledby="privacy-settings-title" data-analytics-private>
      <div className="privacy-settings__heading">
        <h2 id="privacy-settings-title">Settings</h2>
        <p>Optional. Saved in this browser.</p>
      </div>
      {signal && <p className="privacy-settings__notice">Tracking is off per your browser preference.</p>}
      {internal && <p className="privacy-settings__notice">This browser is excluded.</p>}
      {!configured && <p className="privacy-settings__notice">Optional analytics are unavailable.</p>}
      <label className="privacy-setting">
        <span><span className="privacy-setting__name" id="analytics-label">Analytics</span><span className="privacy-setting__description" id="analytics-description">Visits, actions and errors.</span></span>
        <input type="checkbox" role="switch" aria-labelledby="analytics-label" aria-describedby="analytics-description" checked={analytics} disabled={blocked} onChange={event => choose(event.target.checked ? "analytics" : "denied")} />
      </label>
      <label className="privacy-setting">
        <span><span className="privacy-setting__name" id="recordings-label">Recordings</span><span className="privacy-setting__description" id="recordings-description">Masked interactions. Requires analytics.</span></span>
        <input type="checkbox" role="switch" aria-labelledby="recordings-label" aria-describedby="recordings-description" checked={recordings} disabled={blocked || !analytics} onChange={event => choose(event.target.checked ? "recordings" : "analytics")} />
      </label>
      <div className="privacy-settings__footer">
        <button className="privacy-text-button" type="button" aria-label="Turn off optional tracking" disabled={!ready || !configured} onClick={() => choose("denied")}>Turn off</button>
        <span role="status">{status}</span>
      </div>
    </section>
  );
}
