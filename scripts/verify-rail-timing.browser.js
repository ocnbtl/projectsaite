// Isolated browser checks: no analytics uploads or real inquiries.
// eslint-disable-next-line @typescript-eslint/no-unused-expressions
async (page) => {
  const base = new URL(page.url()).origin;
  const checks = [], samples = [], errors = [];
  const assert = (value, label) => { if (!value) throw new Error(label); checks.push(label); };
  for (const width of [1440, 390]) {
    const context = await page.context().browser().newContext({ viewport: { width, height: 1000 }, reducedMotion: "no-preference" });
    await context.route(/posthog\.com|\/_vercel\/insights\/view|\/api\/contact/, route => route.abort());
    const tab = await context.newPage();
    tab.on("pageerror", e => errors.push(e.message));
    await tab.addInitScript(() => {
      window.railEvents = [];
      document.addEventListener("animationstart", e => {
        if (e.target.classList?.contains("editorial-rail")) {
          requestAnimationFrame(() => window.railEvents.push({ at: performance.now(), running: e.target.dataset.railRunning }));
        }
      });
    });
    await tab.goto(base);
    const rail = tab.locator(".editorial-rail"), track = tab.locator(".editorial-rail__track");
    await rail.scrollIntoViewIfNeeded();
    await tab.waitForFunction(() => document.querySelector(".editorial-rail").dataset.railRunning === "true");
    assert(await track.evaluate(el => getComputedStyle(el).animationDuration === "52s"), `${width}: original 52-second loop`);
    const entrance = await tab.evaluate(() => window.railEvents);
    assert(entrance.some(e => e.running === "true"), `${width}: motion begins at entrance without two-second hold`);
    await tab.getByRole("button", { name: "Decline", exact: true }).click();
    await rail.scrollIntoViewIfNeeded();
    await rail.hover();
    const before = await track.evaluate(el => el.getAnimations()[0].currentTime);
    await tab.waitForTimeout(200);
    assert(await track.evaluate(el => el.getAnimations()[0].currentTime) > before + 100, `${width}: hover does not pause movement`);
    await tab.getByRole("button", { name: "Pause logo scrolling", exact: true }).click();
    await tab.waitForFunction(() => document.querySelector(".editorial-rail").dataset.railRunning === "false");
    assert(await track.evaluate(el => getComputedStyle(el).animationPlayState === "paused"), `${width}: explicit pause works`);
    await track.evaluate(async el => {
      await Promise.all([...el.querySelectorAll("img")].map(img => { img.loading = "eager"; return img.decode(); }));
      await document.fonts.ready;
      el.getAnimations()[0].currentTime = 0;
    });
    await tab.waitForTimeout(60);
    const geometry = await track.evaluate(el => {
      const marks = [...el.children], n = marks.length / 3;
      const primary = marks[n].getBoundingClientRect();
      const period = marks[n * 2].getBoundingClientRect().left - primary.left;
      const style = getComputedStyle(el);
      const viewport = el.parentElement.getBoundingClientRect();
      return { center: primary.left + primary.width / 2, target: viewport.left + viewport.width / 2, period, distance: parseFloat(style.getPropertyValue("--editorial-rail-start")) - parseFloat(style.getPropertyValue("--editorial-rail-end")) };
    });
    assert(Math.abs(geometry.center - geometry.target) < 2, `${width}: Macy's centered at first frame ${JSON.stringify(geometry)}`);
    assert(Math.abs(geometry.period - geometry.distance) < 2, `${width}: seamless full-set loop`);
    const heyman = tab.getByRole("img", { name: "Heyman Talent", exact: true });
    assert(await heyman.locator("img").count() === 2, `${width}: Heyman symbol and official wordmark`);
    assert(await heyman.locator("img").evaluateAll(images => images.every(img => img.naturalWidth > 0)), `${width}: both Heyman assets decode`);
    for (const seconds of [0, 2, 5, 10]) {
      await track.evaluate((el, ms) => { el.getAnimations()[0].currentTime = ms; }, seconds * 1000);
      await tab.waitForTimeout(50);
      const visible = await track.evaluate(el => [...el.children].filter(mark => {
        const r = mark.getBoundingClientRect(); return r.right > 25 && r.left < innerWidth - 25;
      }).map(mark => mark.className));
      samples.push({ width, seconds, visible });
      if (seconds === 0 || seconds === 5) await tab.screenshot({ path: `output/playwright/rail-new-${width}-${seconds}s.png` });
    }
    await tab.getByRole("button", { name: "Resume logo scrolling", exact: true }).click();
    await tab.waitForFunction(() => document.querySelector(".editorial-rail").dataset.railRunning === "true");
    assert(await track.evaluate(el => getComputedStyle(el).animationPlayState === "running"), `${width}: resume works`);
    await tab.locator("footer").scrollIntoViewIfNeeded();
    await tab.waitForFunction(() => document.querySelector(".editorial-rail").dataset.railRunning === "false");
    assert(true, `${width}: offscreen motion pauses`);
    await tab.emulateMedia({ reducedMotion: "reduce" });
    assert(await track.evaluate(el => getComputedStyle(el).animationName === "none"), `${width}: reduced motion has no loop`);
    await heyman.scrollIntoViewIfNeeded();
    await tab.screenshot({ path: `output/playwright/heyman-new-${width}.png` });
    assert(await heyman.evaluate(el => { const r = el.getBoundingClientRect(); return r.left >= 0 && r.right <= innerWidth; }), `${width}: manual scroll reaches complete Heyman credit`);
    assert(await tab.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${width}: no page overflow`);
    await context.close();
  }
  assert(errors.length === 0, "No uncaught browser errors");
  return { passed: checks.length, checks, samples, errors };
}
