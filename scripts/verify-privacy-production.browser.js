// Read-only production checks. Every inquiry POST and analytics upload is intercepted.
// eslint-disable-next-line @typescript-eslint/no-unused-expressions -- playwright-cli evaluates this function.
async (page) => {
  const userAgent = (await page.evaluate(() => navigator.userAgent)).replace("HeadlessChrome", "Chrome");
  const context = await page.context().browser().newContext({ userAgent, viewport: { width: 1440, height: 1000 }, reducedMotion: "reduce" });
  const live = await context.newPage();
  const requests = [], events = [], errors = [], checks = [];
  let configRead = false;
  const assert = (value, label) => { if (!value) throw new Error(label); checks.push(label); };
  live.on("pageerror", error => errors.push(error.message));
  await context.route("**/api/contact", route => route.abort());
  await context.route("**/_vercel/insights/view", route => route.fulfill({ status: 200, body: "{}" }));
  await context.route(/https:\/\/[^/]*posthog\.com\//, async route => {
    const request = route.request();
    requests.push(request.url());
    if (request.method() === "GET" && /\/array\//.test(request.url())) {
      const response = await route.fetch();
      configRead = response.ok();
      return route.fulfill({ response });
    }
    if (request.postData()) {
      let raw = request.postData();
      const bytes = request.postDataBuffer();
      if (bytes?.[0] === 31 && bytes?.[1] === 139) {
        raw = await live.evaluate(async data => new Response(new Blob([new Uint8Array(data)]).stream().pipeThrough(new DecompressionStream("gzip"))).text(), Array.from(bytes));
      }
      const encoded = raw.startsWith("{") || raw.startsWith("[") ? raw : new URLSearchParams(raw).get("data");
      if (encoded) {
        const data = JSON.parse(encoded.startsWith("{") || encoded.startsWith("[") ? encoded : Buffer.from(encoded, "base64").toString("utf8"));
        events.push(...(Array.isArray(data) ? data : data.batch ?? [data]).filter(event => event?.event));
      }
    }
    return route.fulfill({ status: 200, contentType: "application/json", body: '{"status":1,"featureFlags":{}}' });
  });
  const count = name => events.filter(event => event.event === name).length;
  await live.goto("https://sageburress.com/");
  const notice = live.getByRole("region", { name: "Privacy", exact: true });
  await notice.waitFor();
  await live.waitForTimeout(1200);
  assert(requests.length === 0, "No production PostHog request before consent");
  await live.screenshot({ path: "output/playwright/live-minimal-notice-desktop.png" });
  await live.setViewportSize({ width: 390, height: 844 });
  await live.waitForTimeout(300);
  await live.screenshot({ path: "output/playwright/live-minimal-notice-mobile.png" });
  const bounds = await notice.boundingBox();
  assert(bounds.x >= 0 && bounds.x + bounds.width <= 390 && bounds.y >= 0 && bounds.y + bounds.height <= 844, "Production notice fits mobile");
  await live.getByRole("button", { name: "Decline", exact: true }).click();
  await live.reload();
  await live.waitForTimeout(1200);
  assert(!await notice.isVisible() && requests.length === 0, "Decline persists without optional collection");
  await live.getByRole("link", { name: "Privacy & settings", exact: true }).click();
  const analytics = live.getByRole("switch", { name: "Analytics", exact: true });
  const recordings = live.getByRole("switch", { name: "Recordings", exact: true });
  await analytics.waitFor();
  assert(!await notice.isVisible() && !await analytics.isChecked() && !await recordings.isChecked(), "Footer opens individual settings with saved choices");
  await live.evaluate(() => window.scrollTo(0, 0));
  await live.screenshot({ path: "output/playwright/live-minimal-privacy-mobile.png", fullPage: true });
  await live.setViewportSize({ width: 1200, height: 1000 });
  await live.waitForTimeout(400);
  await live.screenshot({ path: "output/playwright/live-minimal-privacy-desktop.png", fullPage: true });
  await live.getByText("What we collect & protect", { exact: true }).click();
  const privacyText = await live.locator(".privacy-page__inner").innerText();
  assert(privacyText.includes("PostHog starts only after you opt in") && privacyText.includes("Global Privacy Control"), "Concise policy retains expandable consent and protection details");
  await live.getByText("What we collect & protect", { exact: true }).click();
  await analytics.check();
  for (let i = 0; i < 30 && count("$pageview") === 0; i++) await live.waitForTimeout(500);
  assert(configRead && count("$pageview") === 1, "Real production config loads and one pageview follows consent");
  await live.getByRole("navigation", { name: "Primary navigation" }).getByRole("link", { name: "Portfolio", exact: true }).click();
  await live.waitForTimeout(1500);
  assert(count("$pageview") === 2 && count("$snapshot") === 0, "One pageview per navigation and no analytics-only recordings");
  await live.getByRole("link", { name: "Privacy & settings", exact: true }).click();
  await recordings.check();
  await live.getByRole("navigation", { name: "Primary navigation" }).getByRole("link", { name: "Home", exact: true }).click();
  for (let i = 0; i < 40 && count("$snapshot") === 0; i++) {
    await live.mouse.move(350 + i, 300 + i);
    await live.mouse.wheel(0, i % 2 ? -20 : 20);
    await live.waitForTimeout(500);
  }
  assert(count("$snapshot") > 0, "Recordings start only after their separate setting is enabled");
  const replay = JSON.stringify(events.filter(event => event.event === "$snapshot"));
  assert(!replay.includes("contact@sageburress.com") && !replay.includes("hero-cutout"), "Production replay masks contact text and blocks images");
  await live.getByRole("navigation", { name: "Primary navigation" }).getByRole("link", { name: "Contact", exact: true }).click();
  const contactSnapshots = count("$snapshot");
  await live.waitForTimeout(8000);
  assert(count("$snapshot") === contactSnapshots, "No recordings on the production contact page");
  await live.getByRole("link", { name: "Privacy & settings", exact: true }).click();
  await live.getByRole("button", { name: "Turn off optional tracking", exact: true }).click();
  await live.waitForTimeout(1200);
  const afterDecline = requests.length;
  await live.getByRole("navigation", { name: "Primary navigation" }).getByRole("link", { name: "Home", exact: true }).click();
  await live.waitForTimeout(1500);
  assert(requests.length === afterDecline, "Privacy-page opt-out stops subsequent production collection");
  assert(events.every(event => event.properties.environment === "production" && /^https:\/\/sageburress.com\/(?:privacy|portfolio|contact)?$/.test(event.properties.$current_url) && event.properties.$process_person_profile === false), "Intercepted production payloads contain only sanitized URLs and no identified profiles");
  assert(errors.length === 0, "No uncaught JavaScript errors on production");
  const result = { checks, events: Object.fromEntries([...new Set(events.map(event => event.event))].map(name => [name, count(name)])), configRead, bounds, errors };
  await context.close();
  return result;
}
