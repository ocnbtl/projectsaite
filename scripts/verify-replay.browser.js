// Local-only replay/privacy tests. All remote requests are intercepted.
// eslint-disable-next-line @typescript-eslint/no-unused-expressions -- playwright-cli evaluates this function.
async (page) => {
  const origin = "http://127.0.0.1:3107";
  const checks = [];
  const assert = (value, name) => { if (!value) throw new Error(name); checks.push(name); };
  const context = page.context();
  await context.unrouteAll({ behavior: "wait" });
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.evaluate(() => localStorage.clear());
  const requests = [];
  const events = [];
  await context.route(/https:\/\/[^/]*posthog\.com\//, async route => {
    const req = route.request();
    requests.push({ url: req.url(), body: req.postData() });
    if (req.postData()) {
      const raw = req.postData();
      const encoded = raw.startsWith("{") || raw.startsWith("[") ? raw : new URLSearchParams(raw).get("data");
      const data = JSON.parse(encoded.startsWith("{") || encoded.startsWith("[") ? encoded : Buffer.from(encoded, "base64").toString("utf8"));
      const batch = (Array.isArray(data) ? data : data.batch ?? [data]).filter(e => e?.event);
      for (const event of batch) {
        for (const snapshot of event.properties?.$snapshot_data ?? []) {
          if (typeof snapshot.data === "string" && snapshot.data.charCodeAt(0) === 31) {
            snapshot.data = await page.evaluate(async raw => JSON.parse(await new Response(new Blob([Uint8Array.from(raw, c => c.charCodeAt(0))]).stream().pipeThrough(new DecompressionStream("gzip"))).text()), snapshot.data);
          }
        }
      }
      events.push(...batch);
    }
    await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({
      status: 1, featureFlags: {}, supportedCompression: [], autocapture_opt_out: true,
      sessionRecording: { endpoint: "/s/", sampleRate: 1, minimumDurationMilliseconds: 0 },
    }) });
  });
  await context.route("**/api/contact", route => route.fulfill({ status: 503, contentType: "application/json", body: '{"code":"delivery_not_configured"}' }));
  await page.goto(origin);
  await page.evaluate(() => {
    const fixture = document.createElement("div");
    fixture.innerHTML = '<form><input value="REPLAY_PRIVATE_INPUT"><textarea>REPLAY_PRIVATE_TEXTAREA</textarea><input type="file" data-file="REPLAY_PRIVATE_UPLOAD"></form><div data-analytics-private>REPLAY_PRIVATE_AREA</div><a href="mailto:replay-private@example.invalid">REPLAY_PRIVATE_EMAIL</a><img src="data:image/svg+xml,REPLAY_PRIVATE_IMAGE"><a href="/contact?email=REPLAY_PRIVATE_QUERY">Private link</a>';
    document.body.append(fixture);
  });
  await page.getByRole("button", { name: "Accept", exact: true }).click();
  await page.mouse.move(300, 300);
  await page.mouse.wheel(0, 400);
  for (let i=0; i<40 && !events.some(e=>e.event === "$snapshot"); i++) {
    await page.mouse.move(300 + i, 300 + i);
    await page.mouse.wheel(0, i % 2 ? -20 : 20);
    await page.waitForTimeout(500);
  }
  assert(events.some(e => e.event === "$snapshot"), "Explicit recording consent produces intercepted replay snapshots");
  const replay = JSON.stringify(events.filter(e=>e.event === "$snapshot"));
  assert(!replay.includes("contact@sageburress.com"), "Replay hides contact links");
  assert(replay.includes("hero-cutout"), "Replay retains public source images");
  assert(replay.includes("Sage") && replay.includes("hero"), "Replay retains public copy and styling identifiers");
  assert(!replay.includes("REPLAY_PRIVATE") && !replay.includes("replay-private@example"), "Decompressed replay excludes private areas, inputs, file metadata, mail links and non-public images");
  const full = events.flatMap(e=>e.properties?.$snapshot_data ?? []).find(s=>s.type===2 && s.data?.node);
  assert(Boolean(full), "A real full DOM snapshot is available for visual verification");
  const html = await page.evaluate(({ node, origin }) => {
    const doc = document.implementation.createHTMLDocument();
    const create = (n) => {
      if (n.type === 3) return doc.createTextNode(n.textContent ?? "");
      if (n.type !== 2 || ["script", "iframe", "object", "embed", "base"].includes(n.tagName)) return null;
      const el = n.attributes?._cssText ? doc.createElement("style") : n.isSVG ? doc.createElementNS("http://www.w3.org/2000/svg", n.tagName) : doc.createElement(n.tagName);
      for (const [key, value] of Object.entries(n.attributes ?? {})) {
        if (!key.startsWith("_") && !key.startsWith("on") && value != null) try { el.setAttribute(key, String(value)); } catch { /* rrweb-only attributes */ }
      }
      if (n.attributes?._cssText) el.textContent = n.attributes._cssText;
      else for (const child of n.childNodes ?? []) { const out = create(child); if (out) el.append(out); }
      return el;
    };
    const root = node.childNodes.find(n=>n.tagName==="html");
    const rendered = create(root);
    const base = doc.createElement("base"); base.href = origin;
    rendered.querySelector("head").prepend(base);
    return '<!doctype html>' + rendered.outerHTML;
  }, { node: full.data.node, origin });
  const reconstruction = await context.newPage();
  await reconstruction.setContent(html);
  await reconstruction.waitForTimeout(4000);
  assert(await reconstruction.locator("img").first().evaluate(el=>el.complete && el.naturalWidth>0), "Public photograph loads from the captured DOM");
  assert(await reconstruction.locator("h1").evaluate(el=>parseFloat(getComputedStyle(el).fontSize)>40), "Captured CSS restores the designed headline size");
  await reconstruction.screenshot({ path: "output/playwright/replay-restored-desktop.png" });
  await reconstruction.setViewportSize({ width: 390, height: 844 });
  await reconstruction.screenshot({ path: "output/playwright/replay-restored-mobile.png" });
  await reconstruction.close();
  await page.getByRole("navigation", { name: "Primary navigation" }).getByRole("link", { name: "Contact", exact: true }).click();
  await page.getByLabel("Name", { exact: true }).fill("REPLAY_PRIVATE_PERSON");
  await page.getByLabel("Email", { exact: true }).fill("replay-private@example.invalid");
  await page.getByLabel("Project details", { exact: true }).fill("REPLAY_PRIVATE_MESSAGE never leaves this browser in analytics.");
  const contactSnapshots = events.filter(e=>e.event === "$snapshot").length;
  await page.waitForTimeout(12000);
  assert(events.filter(e=>e.event === "$snapshot").length === contactSnapshots, "Contact page produces no recordings even after recording opt-in");
  await page.getByRole("navigation", { name: "Primary navigation" }).getByRole("link", { name: "Portfolio", exact: true }).click();
  await page.waitForTimeout(12000);
  const all = JSON.stringify(events) + JSON.stringify(requests);
  assert(!all.includes("REPLAY_PRIVATE") && !all.includes("replay-private@example"), "No replay or analytics request contains contact details");
  await page.goto(`${origin}/?utm_source=instagram&email=QUERY_PRIVATE#HASH_PRIVATE`);
  const atQuery = events.filter(e=>e.event === "$snapshot").length;
  await page.waitForTimeout(12000);
  assert(events.filter(e=>e.event === "$snapshot").length === atQuery, "Pages with query strings or fragments produce no recording");
  const latestView = events.filter(e=>e.event === "$pageview").at(-1);
  assert(latestView.properties.traffic_source === "instagram" && latestView.properties.$current_url === "https://sageburress.com/", "Traffic source remains categorical and page URL is sanitized");
  assert(!JSON.stringify(requests).includes("QUERY_PRIVATE") && !JSON.stringify(requests).includes("HASH_PRIVATE"), "Sensitive URL values never leave in any PostHog request");
  await page.goto(`${origin}/admin/login`);
  const adminRequests = requests.length;
  await page.waitForTimeout(1500);
  assert(requests.length === adminRequests, "Admin page does not initialize analytics or replay");
  await page.goto(origin);
  await page.getByRole("link", { name: "Privacy & settings", exact: true }).click();
  await page.getByRole("button", { name: "Turn off optional tracking", exact: true }).click();
  const afterDecline = requests.length;
  await page.mouse.wheel(0, 300);
  await page.waitForTimeout(12000);
  assert(requests.length === afterDecline, "Withdrawing consent stops recording uploads");
  await page.evaluate(() => localStorage.clear());
  await context.addInitScript(() => Object.defineProperty(navigator, "globalPrivacyControl", { get: () => true, configurable: true }));
  await page.reload();
  const gpcRequests = requests.length;
  assert(await page.getByRole("switch", { name: "Recordings", exact: true }).isDisabled(), "Global Privacy Control disables recording opt-in");
  await page.waitForTimeout(1500);
  assert(requests.length === gpcRequests, "Global Privacy Control sends no analytics requests");
  return { checks, recordingBatches: events.filter(e=>e.event === "$snapshot").length };
}
