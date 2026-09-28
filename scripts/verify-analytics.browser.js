// Run with playwright-cli run-code --filename scripts/verify-analytics.browser.js.
// The local server must use NEXT_PUBLIC_POSTHOG_TEST_MODE=true and no email/Blob credentials.
// All PostHog requests and every contact submission are intercepted. No real events or emails.
// eslint-disable-next-line @typescript-eslint/no-unused-expressions -- playwright-cli evaluates this function.
async (page) => {
  const origin = "http://127.0.0.1:3107";
  const checks = [];
  const assert = (value, label) => { if (!value) throw new Error(label); checks.push(label); };
  const requests = [];
  const events = [];
  let outcome = "failure";
  let submissions = 0;
  const context = page.context();
  await context.unrouteAll({ behavior: "wait" });
  if (page.url().startsWith(origin)) await page.evaluate(() => localStorage.clear());
  page.on("pageerror", error => console.log("PAGE ERROR", error.message));
  await context.route(/https:\/\/[^/]*posthog\.com\//, async route => {
    const request = route.request();
    requests.push({ url: request.url(), method: request.method(), body: request.postData() });
    if (request.postData()) {
      try {
        const raw = request.postData();
        const encoded = raw.startsWith("{") || raw.startsWith("[") ? raw : new URLSearchParams(raw).get("data");
        const data = JSON.parse(encoded.startsWith("{") || encoded.startsWith("[") ? encoded : Buffer.from(encoded, "base64").toString("utf8"));
        for (const event of Array.isArray(data) ? data : data.batch ?? [data]) if (event?.event) events.push(event);
      } catch { /* Config requests may have no event body. */ }
    }
    await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({
      status: 1, featureFlags: {}, supportedCompression: [], autocapture_opt_out: true,
      sessionRecording: { endpoint: "/s/", sampleRate: 1, minimumDurationMilliseconds: 0 },
    }) });
  });
  await context.route("**/api/contact", async route => {
    submissions++;
    if (outcome === "network") return route.abort("failed");
    const responses = {
      success: [200, { ok: true, delivery: "accepted" }],
      unconfirmed: [200, { ok: true }],
      failure: [500, { code: "delivery_failed" }],
      fallback: [503, { code: "delivery_not_configured" }],
      rate: [429, { code: "rate_limited" }],
    };
    const [status, body] = responses[outcome];
    await route.fulfill({ status, contentType: "application/json", body: JSON.stringify(body) });
  });
  const count = name => events.filter(event => event.event === name).length;
  const settle = () => page.waitForTimeout(1400);
  const preferences = async () => { await page.getByRole("link", { name: "Privacy & settings", exact: true }).click(); await page.getByRole("switch", { name: "Analytics", exact: true }).waitFor(); };
  await page.goto(origin);
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await settle();
  assert(requests.length === 0, "No PostHog requests before consent");
  await page.getByRole("button", { name: "Decline", exact: true }).click();
  await page.reload();
  await settle();
  assert(requests.length === 0, "Decline persists without PostHog requests");
  await preferences();
  await page.getByRole("switch", { name: "Analytics", exact: true }).check();
  for (let i = 0; i < 20 && count("$pageview") === 0; i++) await page.waitForTimeout(500);
  assert(count("$pageview") === 1, `Exactly one initial pageview (got ${count("$pageview")})`);
  assert(count("$snapshot") === 0, "Analytics-only consent sends no replay");
  await page.getByRole("navigation", { name: "Primary navigation" }).getByRole("link", { name: "Contact", exact: true }).click();
  await page.getByLabel("Name", { exact: true }).waitFor();
  await settle();
  assert(count("$pageview") === 2, "Client navigation produces one additional pageview");
  await page.getByRole("button", { name: "Send inquiry", exact: true }).click();
  await settle();
  assert(submissions === 0 && count("contact_validation_failed") === 1, "Invalid form is measured once and never submitted");
  const fill = async () => {
    await page.getByLabel("Name", { exact: true }).fill("PRIVATE_TEST_PERSON");
    await page.getByLabel("Email", { exact: true }).fill("private-test@example.invalid");
    await page.getByLabel("Project details", { exact: true }).fill("PRIVATE_TEST_MESSAGE only a mocked delivery test, never a real inquiry.");
  };
  await fill();
  await page.getByRole("button", { name: "Send inquiry", exact: true }).click();
  await page.getByRole("alert").filter({ hasText: "The message could not be sent" }).waitFor();
  await settle();
  assert(count("contact_form_started") === 1 && count("contact_submit_failed") === 1 && count("contact_submit_succeeded") === 0, "Form start and delivery failure are distinct from success");
  assert(await page.getByLabel("Name", { exact: true }).inputValue() === "PRIVATE_TEST_PERSON", "Failure retains entered details for retry");
  outcome = "success";
  await page.getByRole("button", { name: "Send inquiry", exact: true }).click();
  await page.getByRole("heading", { name: "Thank you for reaching out." }).waitFor();
  await settle();
  assert(count("contact_submit_succeeded") === 1, "Only server-confirmed provider acceptance produces success");
  await page.getByRole("heading", { name: "Thank you for reaching out." }).scrollIntoViewIfNeeded();
  await page.screenshot({ path: "output/playwright/contact-success-desktop.png" });
  await page.getByRole("button", { name: "Send another inquiry", exact: true }).click();
  await fill();
  for (const state of ["fallback", "rate", "network", "unconfirmed"]) {
    outcome = state;
    await page.getByRole("button", { name: "Send inquiry", exact: true }).click();
    await settle();
    assert(await page.getByRole("button", { name: "Send inquiry", exact: true }).isEnabled(), `${state} response permits recovery`);
  }
  assert(count("contact_submit_succeeded") === 1, "Fallback, rate limit, network error and unconfirmed 200 never count as success");
  assert(!JSON.stringify(events).includes("PRIVATE_TEST") && !JSON.stringify(events).includes("private-test@example"), "Analytics contain no entered names, messages or email addresses");
  assert(events.every(event => event.properties.environment === "test"), "All intercepted local events are tagged test");
  await preferences();
  await page.getByRole("button", { name: "Turn off optional tracking", exact: true }).click();
  await settle();
  const afterDecline = requests.length;
  await page.getByRole("navigation", { name: "Primary navigation" }).getByRole("link", { name: "Portfolio", exact: true }).click();
  await settle();
  assert(requests.length === afterDecline, "Consent withdrawal stops future tracking during navigation");
  await page.setViewportSize({ width: 390, height: 844 });
  await preferences();
  await page.screenshot({ path: "output/playwright/privacy-mobile.png" });
  const bounds = await page.getByRole("region", { name: "Settings", exact: true }).boundingBox();
  assert(bounds && bounds.x >= 0 && bounds.x + bounds.width <= 390, "Privacy settings fit mobile width");
  assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), "No horizontal overflow on mobile");
  assert(await page.getByText("Site owner settings", { exact: true }).count() === 0, "Site owner controls are no longer public");
  await page.evaluate(() => {
    localStorage.setItem("sage-analytics-internal", "true");
    window.dispatchEvent(new Event("sage-privacy-change"));
  });
  assert(await page.getByRole("switch", { name: "Analytics", exact: true }).isDisabled(), "Internal browser exclusion disables optional tracking");
  return { checks, submissions, eventCounts: Object.fromEntries([...new Set(events.map(event => event.event))].map(name => [name, count(name)])) };
}
