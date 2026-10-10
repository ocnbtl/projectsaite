// Run through playwright-cli on a local or live homepage; no real submissions.
// eslint-disable-next-line @typescript-eslint/no-unused-expressions
async (page) => {
  const base = new URL(page.url()).origin;
  const context = await page.context().browser().newContext({ reducedMotion: "reduce" });
  await context.route("**/api/contact", route => route.abort());
  await context.route(/posthog\.com|\/_vercel\/insights\/view/, route => route.abort());
  const tab = await context.newPage();
  const checks = [], geometry = [], errors = [];
  const assert = (condition, label) => { if (!condition) throw new Error(label); checks.push(label); };
  tab.on("pageerror", error => errors.push(error.message));
  await tab.goto(base);
  await tab.getByRole("button", { name: "Decline", exact: true }).click();
  assert(await tab.locator(".editorial-hero .editorial-hero__about").count() === 1, "About blurb belongs to first section");
  assert(await tab.locator(".editorial-credibility").count() === 0, "Old interstitial section removed");
  assert(await tab.locator(".editorial-rail + .editorial-portfolio-preview").count() === 1, "Rail flows directly to portfolio");
  assert(await tab.locator(".editorial-brandmark--donnys-devils, .editorial-brandmark--diyanni-surf").count() === 0, "Retired designer marks absent");
  for (const width of [320, 390, 768, 1024, 1110, 1280, 1440, 1920]) {
    await tab.setViewportSize({ width, height: 1000 });
    await tab.evaluate(() => document.fonts.ready);
    await tab.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    const g = await tab.evaluate(() => {
      const rect = selector => { const r = document.querySelector(selector).getBoundingClientRect(); return { x: r.x, y: r.y, right: r.right, bottom: r.bottom, width: r.width, height: r.height }; };
      const about = document.querySelector(".editorial-hero__about p");
      return { hero: rect(".editorial-hero"), about: rect(".editorial-hero__about"), name: rect(".editorial-hero h1"), image: rect(".editorial-hero__image"), services: rect(".editorial-hero__services"), font: getComputedStyle(about).fontStyle };
    });
    geometry.push({ width, ...g });
    assert(await tab.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${width}: no page overflow`);
    assert(g.about.x >= g.hero.x && g.about.right <= g.hero.right + 1 && g.about.y >= g.hero.y && g.about.bottom <= g.hero.bottom + 1, `${width}: blurb fits inside hero`);
    assert(g.font === "italic", `${width}: editorial italic styling`);
    if (width >= 1180) assert(g.about.x >= g.image.right, `${width}: blurb to right of portrait`);
    else assert(g.about.y >= g.name.bottom, `${width}: compact layout reflows below name`);
    if ([320, 390, 768, 1024, 1110, 1280, 1440, 1920].includes(width)) {
      await tab.evaluate(() => window.scrollTo(0, 0));
      await tab.screenshot({ path: `output/playwright/hero-rail-${width}.png` });
    }
  }
  const names = ["xavier-university", "university-cincinnati", "fashion-week-columbus", "highest-on-the-runway", "new-york-fashion-week", "paris-fashion-week"];
  await tab.setViewportSize({ width: 1440, height: 1000 });
  for (const name of names) {
    const mark = tab.locator(`.editorial-brandmark--${name}`).first();
    await mark.scrollIntoViewIfNeeded();
    await mark.locator("img").evaluate(image => image.decode());
    assert(await mark.locator("img").evaluate(image => image.naturalWidth > 0), `${name}: image decoded`);
    assert(await mark.getAttribute("aria-label") !== null, `${name}: accessible credit`);
  }
  assert(await tab.locator(".editorial-brandmark--xavier-university img").first().evaluate(img => getComputedStyle(img).filter === "brightness(0)" && getComputedStyle(img).backgroundColor === "rgba(0, 0, 0, 0)"), "Xavier monochrome without navy panel");
  await tab.locator(".editorial-brandmark--highest-on-the-runway").first().scrollIntoViewIfNeeded();
  await tab.screenshot({ path: "output/playwright/hero-fashion-rail.png" });
  await tab.getByRole("link", { name: "Get to know me" }).focus();
  await tab.keyboard.press("Enter"); await tab.waitForURL("**/about");
  assert(await tab.locator(".editorial-about").isVisible(), "About link works with keyboard");
  const markdown = await (await context.request.get(base, { headers: { Accept: "text/markdown" } })).text();
  assert(markdown.includes("A decade of modeling, magazine features, and runways around the world.") && !markdown.includes("Donny’s Devils") && !markdown.includes("Diyanni Surf"), "Markdown aligned with hero and rail");
  assert(errors.length === 0, "No uncaught page errors");
  await context.close();
  return { base, passed: checks.length, geometry, checks, errors };
}
