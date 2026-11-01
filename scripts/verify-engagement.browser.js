// Local-only harness: telemetry and delivery are intercepted, never sent.
// eslint-disable-next-line @typescript-eslint/no-unused-expressions -- evaluated by playwright-cli.
async (page) => {
  const origin = "http://127.0.0.1:3107";
  const events = [], checks = [];
  const assert = (value, message) => { if (!value) throw Error(message); checks.push(message); };
  const context = page.context();
  await context.unrouteAll({ behavior: "wait" });
  await context.route(/https:\/\/[^/]*posthog\.com\//, async route => {
    try {
      const raw = route.request().postData();
      if (raw) {
        const encoded = /^[{[]/.test(raw) ? raw : new URLSearchParams(raw).get("data");
        const data = JSON.parse(/^[{[]/.test(encoded) ? encoded : Buffer.from(encoded, "base64").toString("utf8"));
        for (const event of Array.isArray(data) ? data : data.batch ?? [data]) if (event?.event) events.push(event);
      }
    } catch { /* Config is not event data. */ }
    await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ status: 1, featureFlags: {}, supportedCompression: [], autocapture_opt_out: true, sessionRecording: { endpoint: "/s/", sampleRate: 1, minimumDurationMilliseconds: 0 } }) });
  });
  await context.route("**/api/contact", route => route.fulfill({ status: 200, contentType: "application/json", body: '{"ok":true,"delivery":"accepted"}' }));
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(origin);
  await page.evaluate(() => { localStorage.clear(); sessionStorage.clear(); });
  events.length = 0;
  await page.goto(`${origin}/?utm_source=perplexity&private=PRIVATE_TEST_TOKEN`);
  await page.waitForTimeout(500);
  assert(events.length === 0, "New landing source sends nothing before consent");
  await page.evaluate(() => { localStorage.setItem("sage-analytics-consent-v1", "analytics"); window.dispatchEvent(new Event("sage-privacy-change")); });
  await page.waitForTimeout(1600);
  const initial = events.find(event => event.event === "$pageview");
  assert(initial?.properties.traffic_source === "perplexity", "AI source classified without retaining private URL");
  await page.goto(`${origin}/services/modeling`);
  await page.waitForTimeout(1800);
  assert(events.filter(event => event.event === "service_viewed").length === 1, "Exactly one service view");
  const latest = events.filter(event => event.event === "$pageview").at(-1);
  assert(latest.properties.distinct_id === initial.properties.distinct_id && latest.properties.traffic_source === "perplexity", "Anonymous identity and source survive same-tab navigation");
  const faq = page.locator("details[data-analytics-faq]").first();
  await faq.locator("summary").click();
  await page.waitForTimeout(400);
  assert(events.filter(event => event.event === "faq_opened").length === 1 && events.find(event => event.event === "faq_opened").properties.service === "modeling", "FAQ records one open with service, not answer text");
  await page.waitForTimeout(5400);
  assert(events.some(event => event.event === "$$heatmap"), "Consented public-page heatmap recorded");
  await page.goto(`${origin}/portfolio`);
  await page.waitForTimeout(1600);
  await page.locator("a[data-portfolio-photo]").first().click();
  await page.getByRole("dialog", { name: "Portfolio photo viewer" }).waitFor();
  await page.waitForTimeout(500);
  assert(events.some(event => event.event === "portfolio_opened"), "Portfolio event follows successful fullscreen opening");
  await page.getByRole("button", { name: "Close photo" }).click();
  await page.goto(`${origin}/services/content-creation`);
  await page.waitForTimeout(1600);
  await page.getByRole("button", { name: "Play Vacation photo pose ideas", exact: true }).click();
  const video = page.locator("video").first();
  await page.waitForFunction(() => { const v = document.querySelector("video"); return v && !v.paused && v.currentTime > 0; });
  await page.waitForTimeout(500);
  assert(events.filter(event => event.event === "reel_started").length === 1, "Real local video playback records one start");
  await video.evaluate(v => { v.currentTime = v.duration - 0.2; });
  await page.waitForTimeout(1700);
  assert(events.filter(event => event.event === "reel_completed").length === 1, "Reaching video end records once, not as a booking");
  await page.evaluate(() => window.dispatchEvent(new ErrorEvent("error", { message: "PRIVATE_TEST_ERROR secret@example.com", error: Error("PRIVATE_TEST_STACK") })));
  await page.waitForTimeout(500);
  assert(events.some(event => event.event === "$exception"), "Runtime failure produces an Error Tracking event");
  assert(!JSON.stringify(events).includes("PRIVATE_TEST") && !JSON.stringify(events).includes("secret@example.com"), "URLs, error messages and stacks never enter analytics");
  await page.goto(`${origin}/contact`);
  await page.waitForTimeout(1500);
  const before = events.filter(event => ["$$heatmap", "$snapshot"].includes(event.event)).length;
  await page.getByLabel("Name", { exact: true }).fill("PRIVATE_TEST_NAME");
  await page.waitForTimeout(5500);
  assert(events.filter(event => ["$$heatmap", "$snapshot"].includes(event.event)).length === before, "No heatmaps or replay on contact form");
  await page.evaluate(() => { localStorage.setItem("sage-analytics-consent-v1", "recordings"); window.dispatchEvent(new Event("sage-privacy-change")); });
  await page.goto(`${origin}/portfolio`);
  for (let i = 0; i < 40 && !events.some(event => event.event === "$snapshot"); i++) {
    await page.mouse.move(300 + i, 300 + i);
    await page.mouse.wheel(0, i % 2 ? -20 : 20);
    await page.waitForTimeout(500);
  }
  assert(events.some(event => event.event === "$snapshot"), "Replay begins only with separate recording consent on public page");
  assert(!JSON.stringify(events).includes("PRIVATE_TEST_NAME"), "Replay excludes previously entered contact information");
  await page.goto(`${origin}/portfolio?token=PRIVATE_TEST_TOKEN`);
  await page.waitForTimeout(1000);
  const privateBefore = events.filter(event => ["$$heatmap", "$snapshot"].includes(event.event)).length;
  await page.mouse.click(100, 300);
  await page.waitForTimeout(5500);
  assert(events.filter(event => ["$$heatmap", "$snapshot"].includes(event.event)).length === privateBefore, "Sensitive query URLs disable recording and heatmaps");
  await page.evaluate(() => { localStorage.setItem("sage-analytics-consent-v1", "denied"); window.dispatchEvent(new Event("sage-privacy-change")); });
  await page.waitForTimeout(500);
  const stopped = events.length;
  await page.goto(`${origin}/services/henna`);
  await page.waitForTimeout(1000);
  assert(events.length === stopped, "Withdrawal stops all new event types");
  assert(await page.evaluate(() => sessionStorage.getItem("sage-analytics-source-v2")) === null, "Withdrawal removes stored attribution");
  await page.addInitScript(() => { Object.defineProperty(navigator, "globalPrivacyControl", { value: true }); localStorage.setItem("sage-analytics-consent-v1", "recordings"); });
  await page.goto(origin);
  await page.waitForTimeout(1000);
  assert(events.length === stopped, "Global Privacy Control overrides saved opt-in");
  return { checks, counts: Object.fromEntries([...new Set(events.map(e => e.event))].map(name => [name, events.filter(e => e.event === name).length])) };
}
