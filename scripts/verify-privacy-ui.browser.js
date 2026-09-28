// Local UI regression suite. Provider traffic is intercepted; no real events or inquiries.
// eslint-disable-next-line @typescript-eslint/no-unused-expressions -- playwright-cli evaluates this function.
async (page) => {
  const context = await page.context().browser().newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: "reduce" });
  const tab = await context.newPage();
  const origin = "http://127.0.0.1:3107";
  const checks = [];
  const assert = (value, label) => { if (!value) throw new Error(label); checks.push(label); };
  const errors = [];
  const requests = [];
  tab.on("pageerror", error => errors.push(error.message));
  await context.route(/https:\/\/[^/]*posthog\.com\//, route => {
    requests.push(route.request().url());
    return route.fulfill({ status: 200, contentType: "application/json", body: '{"status":1,"autocapture_opt_out":true,"sessionRecording":false}' });
  });
  await context.route("**/api/contact", route => route.abort());
  const analytics = tab.getByRole("switch", { name: "Analytics", exact: true });
  const recordings = tab.getByRole("switch", { name: "Recordings", exact: true });
  await tab.goto(origin);
  const notice = tab.getByRole("region", { name: "Privacy", exact: true });
  await notice.waitFor();
  await tab.screenshot({ path: "output/playwright/experience-notice-desktop.png" });
  const desktopBounds = await notice.boundingBox();
  assert(desktopBounds.width <= 600 && desktopBounds.height <= 155, "Notice stays compact while fitting the longer sentence");
  assert(await notice.locator("p").first().innerText() === "Optional analytics help us improve your experience with this website.", "Notice uses the exact requested copy");
  const desktopLines = await notice.locator("p").first().evaluate(el => {
    const range = document.createRange();
    range.selectNodeContents(el);
    return range.getClientRects().length;
  });
  assert(desktopLines === 1, "Complete desktop sentence fits on one line");
  const settingsLink = notice.getByRole("link", { name: "Settings", exact: true });
  assert(await settingsLink.innerText() === "" && await settingsLink.locator("svg").count() === 1, "Settings is an accessible icon-only link");
  assert(await settingsLink.getAttribute("href") === "/privacy#settings", "Settings icon targets privacy controls");
  const layouts = [];
  for (const [width, height] of [[1920, 1080], [1440, 900], [1024, 768], [768, 1024], [844, 390], [600, 360], [544, 844], [540, 844], [430, 932], [390, 844], [320, 568]]) {
    await tab.setViewportSize({ width, height });
    await tab.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    const layout = await notice.evaluate(el => {
      const paragraph = el.querySelector("p");
      const range = document.createRange();
      range.selectNodeContents(paragraph);
      const bounds = el.getBoundingClientRect();
      return { lines: range.getClientRects().length, fontSize: getComputedStyle(paragraph).fontSize, fits: bounds.left >= 0 && bounds.right <= innerWidth && bounds.top >= 0 && bounds.bottom <= innerHeight && el.scrollWidth <= el.clientWidth };
    });
    assert(layout.fits && layout.fontSize === "13px", `Readable notice fits ${width}x${height} without shrinking or overflow`);
    if (width >= 544) assert(layout.lines === 1, `Full sentence remains one line at ${width}x${height}`);
    layouts.push({ width, height, ...layout });
  }
  for (const width of [1440, 320]) {
    await tab.setViewportSize({ width, height: 900 });
    await notice.locator("p").first().evaluate(el => { el.style.fontSize = "26px"; });
    assert(await notice.evaluate(el => el.scrollWidth <= el.clientWidth && el.getBoundingClientRect().right <= innerWidth), `Double-size text wraps safely at ${width}px`);
  }
  await notice.locator("p").first().evaluate(el => { el.style.removeProperty("font-size"); });
  for (const width of [390, 320]) {
    await tab.setViewportSize({ width, height: 844 });
    await tab.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    const bounds = await notice.boundingBox();
    assert(bounds.x >= 0 && bounds.x + bounds.width <= width && bounds.y >= 0 && bounds.y + bounds.height <= 844, `Notice fits ${width}px viewport`);
    for (const label of ["Accept", "Decline"]) {
      const button = await tab.getByRole("button", { name: label, exact: true }).boundingBox();
      assert(button.height >= 44, `${label} has 44px touch height at ${width}px`);
    }
    await tab.screenshot({ path: `output/playwright/experience-notice-${width}.png` });
  }
  assert(requests.length === 0, "No PostHog requests before a choice");
  await tab.getByRole("button", { name: "Decline", exact: true }).click();
  assert(await tab.locator("#main-content").evaluate(el => el === document.activeElement), "Dismissing notice preserves a meaningful keyboard focus target");
  await tab.reload();
  assert(!await notice.isVisible() && requests.length === 0, "Decline persists and no floating control remains");
  await tab.getByRole("link", { name: "Privacy & settings", exact: true }).click();
  await analytics.waitFor();
  assert(!await notice.isVisible(), "Privacy page does not overlay its own settings with a notice");
  assert(!await analytics.isChecked() && !await recordings.isChecked() && await recordings.isDisabled(), "Both optional settings begin off; recordings depend on analytics");
  await analytics.focus();
  await tab.keyboard.press("Space");
  assert(await analytics.isChecked() && !await recordings.isChecked(), "Keyboard can enable analytics alone");
  await recordings.check();
  assert(await tab.evaluate(() => localStorage.getItem("sage-analytics-consent-v1")) === "recordings", "Recording permission saves using the existing preference format");
  await recordings.uncheck();
  assert(await analytics.isChecked() && await tab.evaluate(() => localStorage.getItem("sage-analytics-consent-v1")) === "analytics", "Recordings can be withdrawn independently");
  await recordings.check();
  await analytics.uncheck();
  assert(!await recordings.isChecked() && await recordings.isDisabled(), "Turning analytics off also disables recording");
  const secondTab = await context.newPage();
  await secondTab.goto(`${origin}/privacy`);
  await analytics.check();
  await secondTab.getByRole("switch", { name: "Analytics", exact: true }).waitFor({ state: "visible" });
  await secondTab.waitForTimeout(500);
  assert(await secondTab.getByRole("switch", { name: "Analytics", exact: true }).isChecked(), "Preference changes synchronize between tabs");
  await secondTab.close();
  await tab.getByRole("button", { name: "Turn off optional tracking", exact: true }).click();
  assert(!await analytics.isChecked() && !await recordings.isChecked(), "One click turns all optional tracking off");
  await tab.setViewportSize({ width: 390, height: 844 });
  await tab.evaluate(() => window.scrollTo(0, 0));
  await tab.screenshot({ path: "output/playwright/minimal-privacy-mobile.png", fullPage: true });
  assert(await tab.evaluate(() => document.documentElement.scrollWidth <= innerWidth), "Mobile settings page has no horizontal overflow");
  await tab.setViewportSize({ width: 1200, height: 1000 });
  await tab.screenshot({ path: "output/playwright/minimal-privacy-desktop.png", fullPage: true });
  assert(await tab.getByRole("heading", { name: "Privacy Disclosure", exact: true }).count() === 1, "Privacy Disclosure heading replaces the old title");
  assert(await tab.locator(".privacy-page__intro .ui-label").count() === 0 && !/The essentials|Your choices|Site owner settings/i.test(await tab.locator(".privacy-page").innerText()), "Requested eyebrow, tagline and owner controls are removed");
  assert(await tab.locator("#settings").evaluate(el => getComputedStyle(el).borderTopWidth) === "0px", "Divider beneath the summaries is removed");
  await tab.getByText("What we collect & protect", { exact: true }).click();
  assert(await tab.getByText(/PostHog starts only after you opt in/).isVisible(), "Expanded details disclose provider, data, processing region and protections");
  await tab.screenshot({ path: "output/playwright/minimal-privacy-expanded.png", fullPage: true });
  assert(errors.length === 0, "No uncaught browser errors");
  await context.close();
  return { checks, desktopBounds, layouts };
}
