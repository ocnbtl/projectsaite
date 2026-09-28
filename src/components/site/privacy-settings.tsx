"use client";

import { useEffect, useState } from "react";
import { internalVisitor, privacySignal, readConsent, saveConsent, syncAnalytics } from "@/lib/analytics";
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
    setStatus(saveConsent(value, environment) ? "Saved for this browser." : "Unable to save. Please check your browser settings.");
  }

  function excludeBrowser(excluded: boolean) {
    try { localStorage.setItem(INTERNAL_KEY, String(excluded)); }
    catch { setStatus("Your browser could not save this setting."); return; }
    void syncAnalytics(environment);
    window.dispatchEvent(new Event(PREFERENCES_EVENT));
    setStatus(excluded ? "This browser is excluded from analytics." : "Browser exclusion removed.");
  }

  return (
    <section className="privacy-settings" id="settings" aria-labelledby="privacy-settings-title" data-analytics-private>
      <div className="privacy-settings__heading">
        <h2 id="privacy-settings-title">Your settings</h2>
        <p>Optional. Change anytime. Saved in this browser.</p>
      </div>
      {signal && <p className="privacy-settings__notice">Your browser’s privacy signal keeps optional tracking off.</p>}
      {internal && <p className="privacy-settings__notice">This browser is excluded from analytics.</p>}
      {!configured && <p className="privacy-settings__notice">Optional analytics are unavailable.</p>}
      <label className="privacy-setting">
        <span><span className="privacy-setting__name" id="analytics-label">Analytics</span><span className="privacy-setting__description" id="analytics-description">Page visits, clicks and form outcomes.</span></span>
        <input type="checkbox" role="switch" aria-labelledby="analytics-label" aria-describedby="analytics-description" checked={analytics} disabled={blocked} onChange={event => choose(event.target.checked ? "analytics" : "denied")} />
      </label>
      <label className="privacy-setting">
        <span><span className="privacy-setting__name" id="recordings-label">Session recordings</span><span className="privacy-setting__description" id="recordings-description">Masked interactions, never form entries. Requires analytics.</span></span>
        <input type="checkbox" role="switch" aria-labelledby="recordings-label" aria-describedby="recordings-description" checked={recordings} disabled={blocked || !analytics} onChange={event => choose(event.target.checked ? "recordings" : "analytics")} />
      </label>
      <div className="privacy-settings__footer">
        <button className="privacy-text-button" type="button" disabled={!ready || !configured} onClick={() => choose("denied")}>Turn off optional tracking</button>
        <span role="status">{status}</span>
      </div>
      <details className="privacy-settings__owner">
        <summary>Site owner settings</summary>
        <label><input type="checkbox" checked={internal} disabled={!ready} onChange={event => excludeBrowser(event.target.checked)} /> Exclude this browser from analytics</label>
      </details>
    </section>
  );
}
