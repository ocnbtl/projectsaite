// Run with playwright-cli against an open local or production page. No real submissions.
// eslint-disable-next-line @typescript-eslint/no-unused-expressions
async (page) => {
  const base = new URL(page.url()).origin;
  const context = await page.context().browser().newContext({ reducedMotion: "reduce" });
  await context.route("**/api/contact", route => route.abort());
  await context.route(/posthog\.com|\/_vercel\/insights\/view/, route => route.abort());
  const tab = await context.newPage();
  const checks = [], geometry = [], errors = [];
  tab.on("pageerror", error => errors.push(error.message));
  const assert = (condition, label) => { if (!condition) throw new Error(label); checks.push(label); };
  await tab.goto(`${base}/about`);
  await tab.getByRole("button", { name: "Decline", exact: true }).click();
  const copy = tab.locator(".editorial-about__copy");
  const text = await copy.textContent();
  for (const value of ["The story so far.", "brands such as", "Through brand content and travel collaborations", "model & content creator", "commercial, e-commerce, fitness, high fashion, and runway", "Macy’s", "Saks Fifth Avenue", "Westcott Lighting", "New York Fashion Week", "among many others", "Sage’s Shenanigans"]) assert(text.includes(value), `Copy: ${value}`);
  for (const value of ["Selected credits", "educational videos", "dates and arrangements confirmed", "Beyond the runway", "I travel to clients as needed"]) assert(!text.includes(value), `Removed: ${value}`);
  const links = copy.locator(".editorial-about__links a");
  assert(JSON.stringify(await links.allTextContents()) === JSON.stringify(["Work with Sage ↗", "Explore my portfolio ↗", "Agency profile & credits ↗"]), "CTA order and labels");
  assert(await links.nth(2).getAttribute("href") === "https://www.heymantalent.com/t/sage-burress" && await links.nth(2).getAttribute("target") === "_blank", "Agency destination preserved");
  for (const width of [320, 390, 768, 1024, 1440]) {
    await tab.setViewportSize({ width, height: 1000 });
    await tab.evaluate(() => document.fonts.ready);
    const dimensions = await tab.locator(".editorial-about h1").evaluate(el => {
      const range = document.createRange(); range.selectNodeContents(el);
      return { lines: range.getClientRects().length, font: getComputedStyle(el).fontSize, width: el.getBoundingClientRect().width };
    });
    geometry.push({ width, ...dimensions });
    assert(dimensions.lines === 1, `${width}: headline on one line`);
    assert(await tab.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${width}: no horizontal overflow`);
    if ([390, 1440].includes(width)) await tab.screenshot({ path: `output/playwright/about-refined-${width}.png`, fullPage: true });
  }
  await tab.setViewportSize({ width: 320, height: 1000 });
  await tab.addStyleTag({ content: "html { font-size: 200% !important; }" });
  assert(await tab.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), "Enlarged text reflows without clipping");
  await tab.reload();
  await links.first().focus();
  await tab.keyboard.press("Enter"); await tab.waitForURL("**/contact");
  assert(await tab.locator("form").count() > 0, "First CTA reaches contact form without submitting");
  await tab.goto(`${base}/about`);
  await links.nth(1).click(); await tab.waitForURL("**/portfolio");
  assert(await tab.locator("h1").count() === 1, "Second CTA opens portfolio");
  const markdown = await (await context.request.get(`${base}/about`, { headers: { Accept: "text/markdown" } })).text();
  assert(markdown.includes("model & content creator") && markdown.includes("Westcott Lighting") && !markdown.includes("educational videos"), "HTML and agent-readable biography agree");
  assert(errors.length === 0, "No uncaught page errors");
  await context.close();
  return { base, passed: checks.length, geometry, checks, errors };
}
