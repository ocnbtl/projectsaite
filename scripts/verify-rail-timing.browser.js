// Read-only, isolated browser checks. Never submit inquiries or upload analytics.
// eslint-disable-next-line @typescript-eslint/no-unused-expressions
async (page) => {
  const base = new URL(page.url()).origin;
  const checks = [], samples = [], errors = [];
  const assert = (condition, label) => { if (!condition) throw new Error(label); checks.push(label); };
  for (const width of [1440, 390]) {
    const context = await page.context().browser().newContext({ viewport: { width, height: 500 }, reducedMotion: "no-preference" });
    await context.route(/posthog\.com|\/_vercel\/insights\/view/, route => route.abort());
    await context.route("**/api/contact", route => route.abort());
    const tab = await context.newPage();
    tab.on("pageerror", e => errors.push(e.message));
    await tab.goto(base);
    const rail = tab.locator(".editorial-rail"), track = tab.locator(".editorial-rail__track");
    await tab.waitForFunction(() => document.querySelector(".editorial-site").dataset.homeIntroComplete === "true");
    await tab.getByRole("button", { name: "Decline", exact: true }).click();
    assert(await track.evaluate(el => el.getAnimations()[0].currentTime === 0), `${width}: no credits pass while rail is offscreen`);
    await rail.scrollIntoViewIfNeeded();
    const visibleAt = Date.now();
    await tab.mouse.move(1, 1);
    await tab.waitForTimeout(900);
    assert(await track.evaluate(el => el.getAnimations()[0].currentTime === 0), `${width}: leading credits held on first view`);
    await tab.waitForFunction(() => document.querySelector(".editorial-rail").dataset.railRunning === "true");
    assert(Date.now() - visibleAt >= 1750, `${width}: approximately two-second hold before scrolling`);
    assert(await track.evaluate(el => getComputedStyle(el).animationPlayState === "running"), `${width}: rail starts after the hold`);
    await track.evaluate(async el => {
      const animation = el.getAnimations()[0]; animation.pause();
      await Promise.all([...el.querySelectorAll("img")].map(img => { img.loading = "eager"; return img.decode(); }));
      await document.fonts.ready;
    });
    const geometry = await track.evaluate(el => {
      const marks = [...el.children], gap = parseFloat(getComputedStyle(el).gap);
      const boxes = marks.map(mark => mark.getBoundingClientRect());
      return { gap, gaps: boxes.slice(1).map((b, i) => b.left - boxes[i].right), period: el.scrollWidth / 2, repeat: boxes[24].left - boxes[0].left };
    });
    assert(geometry.gaps.every(gap => Math.abs(gap - geometry.gap) < 0.2), `${width}: every logo frame and loop seam has equal spacing`);
    assert(Math.abs(geometry.period - geometry.repeat) < 1, `${width}: seamless duplicate-set distance`);
    const mark = tab.getByRole("img", { name: "Heyman Talent", exact: true });
    assert((await mark.locator("img").getAttribute("src")).includes("heyman-talent-symbol"), `${width}: supplied Heyman symbol used`);
    assert(await mark.locator("img").evaluate(img => img.width === 46 && img.height === 46 && img.naturalWidth > 0), `${width}: Heyman symbol loaded without distortion`);
    for (const seconds of [2, 5, 10]) {
      await track.evaluate((el, ms) => { el.getAnimations()[0].currentTime = ms; }, (seconds - 2) * 1000);
      await tab.waitForTimeout(50);
      const visible = await track.evaluate(el => [...el.children].filter(mark => {
        const r = mark.getBoundingClientRect(); return r.right > 25 && r.left < innerWidth - 25;
      }).map(mark => mark.getAttribute("aria-label")).filter(Boolean));
      samples.push({ width, seconds, visible });
      assert(visible.length > 0 && visible.every(name => ["Macy's", "Saks Fifth Avenue", "University of Cincinnati — educational video", "Xavier University — educational video", "Shows during New York Fashion Week — runway", "Shows during Paris Fashion Week — runway", "Versed Skincare", "Fischer Homes", "Heyman Talent", "Rebel Magazine"].includes(name)), `${width}: priority brands fill the ${seconds}-second sample`);
      await tab.screenshot({ path: `output/playwright/rail-${width}-${seconds}s.png` });
    }
    await track.evaluate(el => el.getAnimations()[0].play());
    await rail.hover();
    assert(await track.evaluate(el => getComputedStyle(el).animationPlayState === "paused"), `${width}: hover pauses scrolling`);
    await tab.mouse.move(1, 1);
    await tab.locator(".editorial-rail__viewport").focus();
    assert(await track.evaluate(el => getComputedStyle(el).animationPlayState === "paused"), `${width}: keyboard focus pauses scrolling`);
    await tab.locator(".editorial-rail__viewport").evaluate(el => el.blur());
    await tab.evaluate(() => window.scrollTo(0, 0));
    await tab.waitForFunction(() => document.querySelector(".editorial-rail").dataset.railRunning === "false");
    assert(await track.evaluate(el => getComputedStyle(el).animationPlayState === "paused"), `${width}: offscreen motion pauses`);
    await tab.emulateMedia({ reducedMotion: "reduce" });
    assert(await track.evaluate(el => getComputedStyle(el).animationName === "none"), `${width}: reduced motion stops the loop`);
    await tab.getByRole("img", { name: "Romantic Adventure Getaways", exact: true }).scrollIntoViewIfNeeded();
    await tab.screenshot({ path: `output/playwright/rail-romantic-${width}.png` });
    assert(await tab.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${width}: no horizontal page overflow`);
    await context.close();
  }
  assert(errors.length === 0, "No uncaught browser errors");
  return { passed: checks.length, checks, samples, errors };
}
