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
      events.push(...(Array.isArray(data) ? data : data.batch ?? [data]).filter(e => e?.event));
    }
    await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({
      status: 1, featureFlags: {}, supportedCompression: [], autocapture_opt_out: true,
      sessionRecording: { endpoint: "/s/", sampleRate: 1, minimumDurationMilliseconds: 0 },
    }) });
  });
  await context.route("**/api/contact", route => route.fulfill({ status: 503, contentType: "application/json", body: '{"code":"delivery_not_configured"}' }));
  await page.goto(origin);
  await page.getByRole("button", { name: "Allow analytics + recordings", exact: true }).click();
  await page.mouse.move(300, 300);
  await page.mouse.wheel(0, 400);
  for (let i=0; i<40 && !events.some(e=>e.event === "$snapshot"); i++) {
    await page.mouse.move(300 + i, 300 + i);
    await page.mouse.wheel(0, i % 2 ? -20 : 20);
    await page.waitForTimeout(500);
  }
  assert(events.some(e => e.event === "$snapshot"), "Explicit recording consent produces intercepted replay snapshots");
  const replay = JSON.stringify(events.filter(e=>e.event === "$snapshot"));
  assert(!replay.includes("contact@sageburress.com") && !replay.includes("hero-cutout"), "Replay masks contact links and blocks source images");
  await page.getByRole("navigation", { name: "Primary navigation" }).getByRole("link", { name: "Contact", exact: true }).click();
  await page.getByLabel("Name", { exact: true }).fill("REPLAY_PRIVATE_PERSON");
  await page.getByLabel("Email", { exact: true }).fill("replay-private@example.invalid");
  await page.getByLabel("Project details", { exact: true }).fill("REPLAY_PRIVATE_MESSAGE never leaves this browser in analytics.");
  const contactSnapshots = events.filter(e=>e.event === "$snapshot").length;
  await page.waitForTimeout(12000);
  assert(events.filter(e=>e.event === "$snapshot").length === contactSnapshots, "Contact page produces no recordings even after recording opt-in");
  await page.getByRole("navigation", { name: "Primary navigation" }).getByRole("link", { name: "Portfolio", exact: true }).click();
  await page.waitForTimeout(12000);
  const all = JSON.stringify(requests);
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
  await page.getByRole("button", { name: "Privacy choices", exact: true }).click();
  await page.getByRole("button", { name: "Decline optional tracking", exact: true }).click();
  const afterDecline = requests.length;
  await page.mouse.wheel(0, 300);
  await page.waitForTimeout(12000);
  assert(requests.length === afterDecline, "Withdrawing consent stops recording uploads");
  await page.evaluate(() => localStorage.clear());
  await context.addInitScript(() => Object.defineProperty(navigator, "globalPrivacyControl", { get: () => true, configurable: true }));
  await page.reload();
  const gpcRequests = requests.length;
  await page.getByRole("button", { name: "Privacy choices", exact: true }).click();
  assert(await page.getByRole("button", { name: "Allow analytics + recordings", exact: true }).isDisabled(), "Global Privacy Control disables recording opt-in");
  await page.waitForTimeout(1500);
  assert(requests.length === gpcRequests, "Global Privacy Control sends no analytics requests");
  return { checks, recordingBatches: events.filter(e=>e.event === "$snapshot").length };
}
