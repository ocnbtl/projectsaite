// Isolated read-only browser checks; no analytics uploads or real inquiries.
// eslint-disable-next-line @typescript-eslint/no-unused-expressions
async (page) => {
  const base = new URL(page.url()).origin;
  const context = await page.context().browser().newContext({ reducedMotion: "reduce" });
  await context.route(/posthog\.com|\/_vercel\/insights\/view/, route => route.abort());
  await context.route("**/api/contact", route => route.abort());
  const tab = await context.newPage();
  const checks = [], errors = [];
  const assert = (value, label) => { if (!value) throw new Error(label); checks.push(label); };
  tab.on("pageerror", error => errors.push(error.message));
  await tab.goto(base);
  await tab.getByRole("button", { name: "Decline", exact: true }).click();
  const mark = tab.getByRole("img", { name: "Fischer Homes — face painting", exact: true });
  assert(await mark.count() === 1, "One accessible face-painting credit, not a modeling claim");
  assert(await tab.locator('.editorial-brandmark--fischer-homes[aria-hidden="true"]').count() === 1, "Animation duplicate hidden from assistive technology");
  const geometry = [];
  for (const width of [1440, 390, 320]) {
    await tab.setViewportSize({ width, height: 900 });
    await mark.scrollIntoViewIfNeeded();
    const img = mark.locator("img");
    await img.evaluate(image => image.decode());
    const g = await img.evaluate(image => ({ loaded: image.naturalWidth > 0, width: image.clientWidth, height: image.clientHeight, fit: getComputedStyle(image).objectFit, filter: getComputedStyle(image).filter }));
    geometry.push({ viewportWidth: width, ...g });
    assert(g.loaded && g.width === 160 && g.height === 48 && g.fit === "contain" && g.filter === "brightness(0)", `${width}: original logo loaded, proportional and monochrome`);
    assert(await tab.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${width}: no page overflow`);
    assert(await mark.evaluate(el => { const r = el.getBoundingClientRect(); return r.left >= 0 && r.right <= innerWidth; }), `${width}: reduced-motion rail can reveal complete credit`);
    await tab.screenshot({ path: `output/playwright/fischer-credit-${width}.png` });
  }
  const markdown = await (await context.request.get(base, { headers: { Accept: "text/markdown" } })).text();
  assert(markdown.includes("Fischer Homes — face painting"), "Markdown shares the accurate credit");
  const asset = await context.request.get(`${base}/media/brands/fischer-homes.svg`);
  assert(asset.ok() && (await asset.text()).startsWith("<svg"), "Local SVG served successfully");
  await tab.getByRole("link", { name: "Discover my story" }).click();
  await tab.waitForURL("**/about");
  assert(await tab.locator("h1").textContent() === "The story so far.", "Existing About navigation preserved");
  assert(errors.length === 0, "No uncaught browser errors");
  await context.close();
  return { base, passed: checks.length, geometry, errors };
}
