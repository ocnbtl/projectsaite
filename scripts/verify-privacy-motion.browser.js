// Run against the current local or public page. All analytics uploads are blocked.
// eslint-disable-next-line @typescript-eslint/no-unused-expressions -- playwright-cli evaluates this function.
async (page) => {
  const origin = await page.evaluate(() => location.origin);
  const context = await page.context().browser().newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: "no-preference" });
  await context.route(/https:\/\/[^/]*posthog\.com\//, route => route.abort());
  await context.route("**/_vercel/insights/view", route => route.fulfill({ status: 200, body: "{}" }));
  await context.route("**/api/contact", route => route.abort());
  await context.addInitScript(() => {
    window.__privacyMotion = { heroFinishedAt: 0, firstVisibleAt: 0, remaining: [] };
    window.addEventListener("editorial:hero-intro-complete", () => {
      window.__privacyMotion.heroFinishedAt = performance.now();
    });
    const inspect = () => {
      const root = document.querySelector(".editorial-site");
      const notice = document.querySelector(".privacy-notice");
      if (notice && getComputedStyle(notice).visibility === "visible") {
        window.__privacyMotion.firstVisibleAt = performance.now();
        window.__privacyMotion.remaining = root.getAnimations({ subtree: true })
          .filter(animation => animation.playState !== "finished" && animation.effect?.getTiming().iterations !== Infinity)
          .map(animation => animation.animationName ?? "transition");
        return;
      }
      requestAnimationFrame(inspect);
    };
    requestAnimationFrame(inspect);
  });
  const tab = await context.newPage();
  const checks = [], timings = [], errors = [];
  const assert = (condition, label) => { if (!condition) throw new Error(label); checks.push(label); };
  tab.on("pageerror", error => errors.push(error.message));
  const notice = tab.locator(".privacy-notice");
  const checkIntro = async label => {
    await notice.waitFor({ state: "attached" });
    assert(!await notice.isVisible(), `${label}: notice stays hidden during the intro`);
    await notice.waitFor({ state: "visible", timeout: 20000 });
    await tab.waitForFunction(() => window.__privacyMotion.firstVisibleAt > 0);
    const timing = await tab.evaluate(() => window.__privacyMotion);
    timings.push({ label, ...timing });
    assert(timing.heroFinishedAt > 0 && timing.firstVisibleAt > timing.heroFinishedAt && timing.remaining.length === 0, `${label}: typing and all finite entrance animations finish before the notice`);
  };
  await tab.goto(origin, { waitUntil: "domcontentloaded" });
  await checkIntro("Desktop");
  assert(await tab.locator(".editorial-rail__track").evaluate(el => el.getAnimations().some(animation => animation.effect?.getTiming().iterations === Infinity)), "Continuous brand rail does not block the notice");
  await tab.getByRole("navigation", { name: "Primary navigation" }).getByRole("link", { name: "Portfolio", exact: true }).click();
  await tab.waitForURL("**/portfolio");
  assert(await notice.isVisible(), "Other public pages do not wait for a homepage animation");
  await tab.getByRole("navigation", { name: "Primary navigation" }).getByRole("link", { name: "Home", exact: true }).click();
  await tab.waitForURL(`${origin}/`);
  assert(!await notice.isVisible(), "Returning home waits for the new intro instead of stale completion state");
  await notice.waitFor({ state: "visible", timeout: 20000 });
  await tab.setViewportSize({ width: 390, height: 844 });
  await tab.reload({ waitUntil: "domcontentloaded" });
  await tab.mouse.wheel(0, 180);
  await checkIntro("Mobile with early scroll");
  await tab.emulateMedia({ reducedMotion: "reduce" });
  await tab.reload();
  await notice.waitFor({ state: "visible", timeout: 5000 });
  assert(await tab.locator(".editorial-site").getAttribute("data-home-intro-complete") === "true", "Reduced-motion visitors are not held behind a typing timer");
  await notice.getByRole("link", { name: "Settings", exact: true }).click();
  await tab.getByRole("switch", { name: "Analytics", exact: true }).waitFor();
  assert(!await notice.isVisible() && await tab.evaluate(() => location.pathname) === "/privacy", "Gear icon opens privacy controls without another notice");
  assert(errors.length === 0, "No motion-related browser errors");
  await context.close();
  return { checks, timings };
}
