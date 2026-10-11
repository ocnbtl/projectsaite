// Read-only local checks; no contact submissions or analytics uploads.
// eslint-disable-next-line @typescript-eslint/no-unused-expressions
async (page) => {
  const base = new URL(page.url()).origin;
  const context = await page.context().browser().newContext({ reducedMotion: "reduce" });
  await context.route(/posthog\.com|\/_vercel\/insights\/view|\/api\/contact/, route => route.abort());
  const tab = await context.newPage();
  const checks = [], errors = [];
  const assert = (value, label) => { if (!value) throw new Error(label); checks.push(label); };
  tab.on("pageerror", e => errors.push(e.message));
  await tab.goto(base);
  await tab.getByRole("button", { name: "Decline", exact: true }).click();
  assert(await tab.locator(".editorial-mosaic__item").count() === 12, "Homepage keeps its 12-photo selection");
  assert(await tab.locator('img[src*="agency%2F"]').count() === 0, "No agency additions on homepage");
  assert(await tab.locator(".editorial-service-index").evaluate(el => getComputedStyle(el).borderTopWidth === "0px"), "Removed divider above Services");
  await tab.getByRole("link", { name: "More about my work" }).click();
  await tab.waitForURL("**/about");
  assert(await tab.locator("h1").textContent() === "Experience Meets Creativity", "New CTA reaches approved About heading");
  await tab.goto(`${base}/portfolio`);
  assert(await tab.locator(".editorial-mosaic__item").count() === 17, "Portfolio contains 17 photos");
  const additions = tab.locator('img[src*="agency%2F"]');
  assert(await additions.count() === 5, "Exactly five selected agency additions");
  for (const img of await additions.all()) {
    await img.scrollIntoViewIfNeeded(); await img.evaluate(el => el.decode());
    assert(await img.evaluate(el => el.naturalWidth > 0 && el.getAttribute("width") === "1080" && el.getAttribute("height") === "1619"), `Photo decodes with correct proportions: ${await img.getAttribute("alt")}`);
  }
  assert(await tab.locator('img[src*="sage-006"]').count() === 0, "Excluded photo remains absent");
  for (const width of [320, 390, 768, 1440]) {
    await tab.setViewportSize({ width, height: 1000 });
    assert(await tab.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${width}: no portfolio overflow`);
    assert(await additions.evaluateAll(images => images.every(img => {
      const r = img.getBoundingClientRect(); return Math.abs(r.width / r.height - 1080 / 1619) < 0.01;
    })), `${width}: additions display uncropped proportions`);
    if ([390, 1440].includes(width)) await tab.screenshot({ path: `output/playwright/portfolio-additions-${width}.png`, fullPage: true });
  }
  const markdown = await (await context.request.get(`${base}/portfolio`, { headers: { Accept: "text/markdown" } })).text();
  for (const alt of await additions.evaluateAll(images => images.map(img => img.alt))) assert(markdown.includes(alt), "Portfolio Markdown includes selected photo description");
  assert(errors.length === 0, "No browser errors");
  await context.close();
  return { passed: checks.length, checks, errors };
}
