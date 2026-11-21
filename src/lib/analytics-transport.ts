// One attempt only: an SDK retry must not outlive a privacy choice. The caller
// supplies an already sanitized event; no browser URL, referrer or credentials
// are added here. Dropped packets are intentionally not persisted or retried.
export function privacyTransport() {
  const active = new Set<AbortController>();
  return {
    cancel() {
      for (const controller of active) controller.abort();
      active.clear();
    },
    send(host: string, key: string, event: { event: string; properties: Record<string, unknown> }, permitted: () => boolean) {
      if (!permitted()) return;
      const controller = new AbortController();
      active.add(controller);
      const snapshot = event.event === "$snapshot";
      const body = JSON.stringify(snapshot ? event : { api_key: key, batch: [event] });
      if (!permitted()) { active.delete(controller); return; }
      void fetch(`${host.replace(/\/$/, "")}/${snapshot ? "s" : "e"}/?ip=0`, {
        method: "POST", body, headers: { "Content-Type": "application/json" },
        credentials: "omit", referrerPolicy: "no-referrer", cache: "no-store",
        keepalive: false, signal: controller.signal,
      }).catch(() => { /* Optional telemetry is lossy, never retried. */ })
        .finally(() => active.delete(controller));
    },
  };
}
