// Invoked by playwright-cli run-code. Every third-party request is intercepted.
// eslint-disable-next-line @typescript-eslint/no-unused-expressions
async (page) => {
  const origin = "http://127.0.0.1:3118";
  const checks = [];
  const assert = (ok, name) => { if (!ok) throw new Error(name); checks.push(name); };
  const browser = page.context().browser();
  async function scenario(width, mode = "fresh") {
    const context = await browser.newContext({ viewport: { width, height: 844 }, serviceWorkers: "block" });
    const events = [], requests = [], failures = [];
    let decodeError;
    await context.route("**/*", async route => {
      const req = route.request(), url = new URL(req.url());
      if (url.origin === origin) {
        if (url.pathname.startsWith("/api/")) { failures.push(url.pathname); return route.abort(); }
        return route.continue();
      }
      if (!url.hostname.endsWith("posthog.com")) return route.abort();
      requests.push({ url: req.url(), body: req.postData() });
      try {
        if (req.postData()) {
          const raw = req.postData();
          const encoded = raw.startsWith("{") || raw.startsWith("[") ? raw : new URLSearchParams(raw).get("data");
          if (encoded) {
            const data = JSON.parse(encoded.startsWith("{") || encoded.startsWith("[") ? encoded : Buffer.from(encoded, "base64").toString("utf8"));
            const batch = (Array.isArray(data) ? data : data.batch ?? [data]).filter(e => e?.event);
            for (const event of batch) for (const snapshot of event.properties?.$snapshot_data ?? []) {
              if (typeof snapshot.data === "string" && snapshot.data.charCodeAt(0) === 31) snapshot.data = await page.evaluate(async raw => JSON.parse(await new Response(new Blob([Uint8Array.from(raw, c => c.charCodeAt(0))]).stream().pipeThrough(new DecompressionStream("gzip"))).text()), snapshot.data);
            }
            events.push(...batch);
          }
        }
      } catch (e) { decodeError = e.message; }
      return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ status: 1, featureFlags: {}, supportedCompression: [], autocapture_opt_out: true, sessionRecording: { endpoint: "/s/", sampleRate: 1, minimumDurationMilliseconds: 0 } }) });
    });
    await context.addInitScript(mode => {
      if (mode === "denied" && !localStorage.getItem("sage-analytics-consent-v1")) localStorage.setItem("sage-analytics-consent-v1", "denied");
      if (["gpc", "dnt"].includes(mode)) {
        localStorage.setItem("sage-analytics-consent-v1", "recordings");
        Object.defineProperty(navigator, mode === "gpc" ? "globalPrivacyControl" : "doNotTrack", { get: () => mode === "gpc" ? true : "1", configurable: true });
      }
    }, mode);
    const p = await context.newPage();
    await p.goto(origin);
    await p.getByRole("link", { name: "Your Privacy Choices", exact: true }).waitFor();
    assert(await p.locator(".privacy-notice,[role=dialog]").count() === 0, `${width}/${mode}: no popup`);
    assert(await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${width}/${mode}: no horizontal overflow`);
    await p.getByRole("link", { name: "Your Privacy Choices", exact: true }).click();
    await p.waitForURL("**/privacy#settings");
    const a = p.getByRole("switch", { name: "Analytics", exact: true });
    const h = p.getByRole("switch", { name: "Heatmaps", exact: true });
    const r = p.getByRole("switch", { name: "Recordings", exact: true });
    await p.waitForTimeout(1000);
    assert(requests.length === 0, `${width}/${mode}: no preconsent network`);
    if (["gpc", "dnt"].includes(mode)) {
      assert(await a.isDisabled() && await h.isDisabled() && await r.isDisabled(), `${width}/${mode}: browser signal overrides prior consent`);
      await context.close(); return;
    }
    assert(!await a.isChecked() && !await h.isChecked() && !await r.isChecked(), `${width}/${mode}: prior decline/unknown region stays off`);
    await a.check(); await h.check(); await r.check();
    await p.screenshot({ path: `output/playwright/privacy-controls-${width}.png`, fullPage: true });
    await p.goto(origin);
    await p.evaluate(() => {
      const fixture = document.createElement("div");
      fixture.id = "CANARY_PRIVATE_ID";
      fixture.title = "CANARY_PRIVATE_TITLE";
      fixture.setAttribute("data-secret", "CANARY_PRIVATE_DATA");
      fixture.innerHTML = '<span>CANARY_PRIVATE_TEXT</span><form><input value="CANARY_PRIVATE_INPUT"><textarea>CANARY_PRIVATE_MESSAGE</textarea><input type="file" data-file="CANARY_PRIVATE_UPLOAD"></form><div data-analytics-private>CANARY_PRIVATE_AREA</div><a href="mailto:CANARY_PRIVATE_EMAIL@example.invalid">CANARY_PRIVATE_EMAIL</a><img src="data:image/svg+xml,CANARY_PRIVATE_IMAGE"><a href="/contact?email=CANARY_PRIVATE_QUERY">Private link</a>';
      document.body.append(fixture);
      console.log("CANARY_PRIVATE_CONSOLE");
      window.dispatchEvent(new ErrorEvent("error", { message: "CANARY_PRIVATE_ERROR" }));
    });
    for (let i = 0; i < 40 && !events.some(e => e.event === "$snapshot"); i++) {
      await p.mouse.move(150 + i, 220 + i); await p.mouse.wheel(0, i % 2 ? -30 : 30); await p.waitForTimeout(500);
    }
    assert(!decodeError, `Decoded payloads (${decodeError ?? "ok"})`);
    assert(events.some(e => e.event === "$pageview"), `${width}: real SDK pageview intercepted`);
    assert(events.some(e => e.event === "$snapshot"), `${width}: real SDK replay intercepted`);
    const snapshots = events.filter(e => e.event === "$snapshot");
    assert(!JSON.stringify(events).includes("CANARY_PRIVATE"), `${width}: decoded payloads exclude all canaries`);
    assert(!JSON.stringify(requests).includes("CANARY_PRIVATE"), `${width}: actual outgoing requests exclude all canaries`);
    const full = snapshots.flatMap(e => e.properties?.$snapshot_data ?? []).find(s => s.type === 2 && s.data?.node);
    assert(Boolean(full), `${width}: full replay DOM captured`);
    assert(JSON.stringify(full).includes("editorial-hero") && JSON.stringify(full).includes("Sage"), `${width}: static public copy and styling retained`);
    // Restore captured DOM to verify readable layout rather than just matching strings.
    const html = await p.evaluate(({ node, origin }) => {
      const doc = document.implementation.createHTMLDocument();
      function create(n) {
        if (n.type === 3) return doc.createTextNode(n.textContent ?? "");
        if (n.type !== 2 || ["script", "iframe", "object", "embed", "base"].includes(n.tagName)) return null;
        const el = n.attributes?._cssText ? doc.createElement("style") : n.isSVG ? doc.createElementNS("http://www.w3.org/2000/svg", n.tagName) : doc.createElement(n.tagName);
        for (const [k,v] of Object.entries(n.attributes ?? {})) if (!k.startsWith("_") && !k.startsWith("on") && v != null) try { el.setAttribute(k, String(v)); } catch { /* rrweb-only attrs */ }
        if (n.attributes?._cssText) el.textContent = n.attributes._cssText;
        else for (const child of n.childNodes ?? []) { const out = create(child); if (out) el.append(out); }
        return el;
      }
      const root = create(node.childNodes.find(n => n.tagName === "html"));
      const base = doc.createElement("base"); base.href = origin; root.querySelector("head").prepend(base);
      return "<!doctype html>" + root.outerHTML;
    }, { node: full.data.node, origin });
    const restored = await context.newPage(); await restored.setContent(html); await restored.waitForTimeout(1500);
    assert(await restored.locator("h1").evaluate(el => parseFloat(getComputedStyle(el).fontSize) > 35), `${width}: captured CSS restores headline`);
    await restored.screenshot({ path: `output/playwright/replay-restored-${width}.png`, fullPage: true }); await restored.close();
    for (const path of ["/contact", "/admin/login", "/uploads/CANARY_PRIVATE", "/?email=CANARY_PRIVATE_QUERY#CANARY_PRIVATE_HASH"]) {
      await p.goto(origin + path);
      if (path === "/contact") { await p.getByLabel("Name", { exact: true }).fill("CANARY_PRIVATE_PERSON"); await p.getByLabel("Email", { exact: true }).fill("canary@example.invalid"); }
      const count = events.filter(e => e.event === "$snapshot").length;
      await p.waitForTimeout(1500);
      assert(events.filter(e => e.event === "$snapshot").length === count, `${width}: replay excluded on ${path}`);
    }
    assert(!JSON.stringify(events).includes("CANARY_PRIVATE"), `${width}: navigation/form canaries excluded`);
    await p.goto(origin + "/privacy");
    await r.uncheck();
    assert(await a.isChecked() && await h.isChecked(), `${width}: replay opt-out independent`);
    await p.goto(origin); const beforeReplay = events.filter(e => e.event === "$snapshot").length; await p.waitForTimeout(1500);
    assert(events.filter(e => e.event === "$snapshot").length === beforeReplay, `${width}: no replay after opt-out navigation`);
    await p.goto(origin + "/privacy"); await a.uncheck();
    assert(await h.isChecked(), `${width}: heatmaps independent of analytics`);
    await p.getByRole("button", { name: "Turn off optional tracking", exact: true }).click();
    const stopped = requests.length;
    await p.goto(origin + "/about"); await p.reload(); await p.waitForTimeout(2000);
    assert(requests.length === stopped, `${width}: opt-out persists across navigation and reload`);
    assert(failures.length === 0, `${width}: no form/API submissions`);
    await context.close();
  }
  for (const width of [1280, 390]) await scenario(width);
  for (const mode of ["denied", "gpc", "dnt"]) await scenario(390, mode);
  return { checks };
}
