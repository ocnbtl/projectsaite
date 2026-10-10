// Isolated browser QA. Email/contact responses and analytics are intercepted, never sent.
// eslint-disable-next-line @typescript-eslint/no-unused-expressions
async (page) => {
  const base = new URL(page.url()).origin;
  const context = await page.context().browser().newContext({ reducedMotion: "reduce" });
  await context.route(/posthog\.com|\/_vercel\/insights\/view/, route => route.abort());
  // Test layout and full-frame rendering with a deterministic tall embed, including controls at its bottom.
  await context.route("https://www.instagram.com/**", route => route.fulfill({ contentType: "text/html", body: '<!doctype html><html><body style="margin:0;background:#f6f1f1;font:16px sans-serif"><div style="height:620px;display:grid;place-items:center;background:#e3dedc">Instagram playback fixture</div><button style="height:44px">Play fixture</button><p>Full video and controls fit in this frame.</p></body></html>' }));
  let requests = [], response = { status: 200, body: { ok: true, delivery: "accepted" } };
  await context.route("**/api/contact", route => { requests.push(route.request().postDataJSON()); return route.fulfill({ status: response.status, contentType: "application/json", body: JSON.stringify(response.body) }); });
  const tab = await context.newPage();
  const checks = [], failures = [], errors = [], geometry = [];
  const assert = (condition, label) => { if (!condition) failures.push(label); else checks.push(label); };
  tab.on("pageerror", error => errors.push(error.message));
  await tab.goto(base); await tab.getByRole("button", { name: "Decline", exact: true }).click();
  for (const width of [320, 390, 768, 1024, 1280, 1440, 1920]) {
    await tab.setViewportSize({ width, height: 1000 });
    await tab.evaluate(() => document.fonts.ready);
    await tab.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    const g = await tab.evaluate(() => {
      const rect = selector => { const r = document.querySelector(selector).getBoundingClientRect(); return { x: r.x, y: r.y, right: r.right, bottom: r.bottom, width: r.width }; };
      const lines = [...document.querySelectorAll(".editorial-hero__about p span")].map(el => { const range = document.createRange(); range.selectNodeContents(el); return range.getClientRects().length; });
      return { about: rect(".editorial-hero__about"), image: rect(".editorial-hero__image"), lines };
    });
    geometry.push({ width, ...g });
    assert(g.lines.length === 2 && g.lines.every(n => n === 1), `${width}: blurb exactly two readable lines`);
    assert(width < 1180 || g.about.x >= g.image.right, `${width}: desktop note to right of portrait`);
    assert(await tab.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${width}: homepage no overflow`);
    assert(await tab.locator(".editorial-service-context").count() === 0, "Redundant homepage service paragraph removed");
    if ([390, 1440].includes(width)) await tab.screenshot({ path: `output/playwright/polish-home-${width}.png` });
  }
  await tab.getByRole("link", { name: "Discover my story" }).click(); await tab.waitForURL("**/about");
  const about = await tab.locator(".editorial-about__copy").textContent();
  assert(about.includes("brands such as") && about.includes("I love being part of a shoot") && about.includes("Let’s create something that feels like you."), "About has non-exhaustive credits, dedicated creative paragraph and invitation");
  assert(!about.includes("Beyond the runway") && !about.includes("I travel to clients as needed"), "Old transition and ending removed");
  for (const width of [390, 1440]) { await tab.setViewportSize({ width, height: 1000 }); await tab.screenshot({ path: `output/playwright/polish-about-${width}.png`, fullPage: true }); }
  for (const width of [320, 390, 768, 1440]) {
    await tab.setViewportSize({ width, height: 1000 });
    for (const slug of ["modeling", "content-creation", "travel-collaborations", "makeup-artist", "henna", "face-painting"]) {
      await tab.goto(`${base}/services/${slug}`);
      const faq = tab.locator(".editorial-faq");
      assert(await faq.locator(".editorial-eyebrow").count() === 0, `${width} ${slug}: no FAQ eyebrow`);
      for (const entry of await faq.locator("details").all()) {
        await entry.locator("summary").focus(); await tab.keyboard.press("Enter");
        assert(await entry.locator("p").isVisible() && await entry.evaluate(el => el.scrollHeight <= el.clientHeight + 1 && el.scrollWidth <= el.clientWidth + 1), `${width} ${slug}: answer opens without clipping`);
      }
      assert(await tab.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${width} ${slug}: no page overflow`);
      if (slug === "content-creation" && [390, 1440].includes(width)) {
        await faq.scrollIntoViewIfNeeded(); await tab.screenshot({ path: `output/playwright/polish-faq-${width}.png` });
        await tab.locator(".editorial-reels").scrollIntoViewIfNeeded(); await tab.screenshot({ path: `output/playwright/polish-reels-${width}.png`, fullPage: true });

      }
    }
  }
  // Keep pointer interaction checks independent of the repeated resize/full-page screenshot pass.
  for (const width of [390, 1440]) {
    const reelTab = await context.newPage();
    await reelTab.setViewportSize({ width, height: 1000 });
    await reelTab.goto(`${base}/services/content-creation`);
        assert(await reelTab.locator(".editorial-reels iframe").count() === 1, "Only one reel embed loaded");
        await reelTab.getByRole("button", { name: "Next reel", exact: true }).click();
        await reelTab.waitForFunction(() => document.querySelector('.editorial-reels iframe')?.getAttribute('title') === 'Beach-day GRWM');
        assert(await reelTab.locator(".editorial-reels iframe").getAttribute("title") === "Beach-day GRWM", "Next reel switches source");
        await reelTab.getByRole("button", { name: "Vanlife storytelling reel", exact: true }).scrollIntoViewIfNeeded();
        await reelTab.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
        await reelTab.getByRole("button", { name: "Vanlife storytelling reel", exact: true }).click();
        await reelTab.waitForFunction(() => document.querySelector('.editorial-reels iframe')?.getAttribute('src')?.includes('DaGrAJgpGwr'));
        assert((await reelTab.locator(".editorial-reels iframe").getAttribute("src")).includes("DaGrAJgpGwr"), "Named reel selection switches source");
        assert((await reelTab.getByRole("link", { name: "Watch on Instagram", exact: true }).getAttribute("href")).includes("DaGrAJgpGwr"), "Direct playback fallback matches selected reel");
    const frame = reelTab.frameLocator(".editorial-reels iframe");
    await frame.locator("body").waitFor();
    await frame.locator("body").evaluate(() => parent.postMessage(JSON.stringify({ type: "MEASURE", details: { height: 812 } }), "*"));
    await reelTab.waitForFunction(() => document.querySelector('.editorial-reels iframe').clientHeight === 812);
    assert(await reelTab.locator(".editorial-reels iframe").evaluate(el => el.clientHeight === 812), `${width}: trusted embed measurement fits complete content`);
    await frame.locator("body").evaluate(() => parent.postMessage(JSON.stringify({ type: "MEASURE", details: { height: 90000 } }), "*"));
    await reelTab.evaluate(() => { window.dispatchEvent(new MessageEvent('message', { origin: 'https://www.instagram.com', source: window, data: JSON.stringify({ type: 'MEASURE', details: { height: 900 } }) })); window.dispatchEvent(new MessageEvent('message', { origin: 'https://example.invalid', source: document.querySelector('.editorial-reels iframe').contentWindow, data: JSON.stringify({ type: 'MEASURE', details: { height: 900 } }) })); });
    await reelTab.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    assert(await reelTab.locator(".editorial-reels iframe").evaluate(el => el.clientHeight === 812), `${width}: invalid measurement, origin and source rejected`);
    await reelTab.close();
  }
  await tab.setViewportSize({ width: 390, height: 844 });
  await tab.goto(`${base}/contact?inquiry=Henna`);
  const combo = tab.getByRole("combobox", { name: "What can I help with?" });
  assert((await combo.textContent()).includes("Henna"), "Deep link prefills custom dropdown");
  await combo.focus(); await tab.keyboard.press("Enter"); await tab.keyboard.press("Home"); await tab.keyboard.press("Enter");
  assert((await combo.textContent()).includes("Modeling"), "Keyboard selection commits");
  await combo.press("ArrowDown"); await combo.press("End"); await combo.press("Escape");
  assert((await combo.textContent()).includes("Modeling") && await combo.getAttribute("aria-expanded") === "false", "Escape cancels uncommitted selection");
  await combo.press("h"); await combo.press("Enter");
  assert((await combo.textContent()).includes("Henna"), "Typeahead selects Henna");
  await combo.click(); await tab.getByRole("option", { name: "Content Creation", exact: true }).click();
  assert((await combo.textContent()).includes("Content Creation"), "Pointer selection commits");
  await combo.click(); await tab.screenshot({ path: "output/playwright/polish-select-390.png" });
  await combo.press("Escape");
  await tab.getByRole("button", { name: "Send inquiry", exact: true }).click();
  assert(requests.length === 0, "Empty form validation prevents submission");
  await tab.getByLabel("Name", { exact: true }).fill("Synthetic QA");
  await tab.getByLabel("Email", { exact: true }).fill("qa@example.invalid");
  await tab.getByLabel("Project details", { exact: true }).fill("Synthetic verification only. Do not send a real email.");
  response = { status: 500, body: { code: "delivery_failed" } };
  await tab.getByRole("button", { name: "Send inquiry", exact: true }).click(); await tab.getByRole("alert").filter({ hasText: "could not be sent" }).waitFor();
  assert(requests.length === 1 && requests[0].inquiry === "Content Creation", "Custom dropdown reaches original payload on mocked failure");
  assert(await tab.getByLabel("Name", { exact: true }).inputValue() === "Synthetic QA", "Failure preserves entered form");
  response = { status: 200, body: { ok: true, delivery: "accepted" } };
  await tab.getByRole("button", { name: "Send inquiry", exact: true }).click(); await tab.getByText("Thank you for reaching out.", { exact: true }).waitFor();
  assert(requests.length === 2, "Retry shows success only for mocked accepted delivery");
  await tab.getByRole("button", { name: "Send another inquiry" }).click();
  assert((await combo.textContent()).includes("Henna"), "New inquiry resets selection to initial context");
  assert(await combo.evaluate(el => !!el.closest("[data-analytics-private].ph-no-capture")), "Custom control stays inside private analytics boundary");
  assert(errors.length === 0, "No application errors");
  await context.close();
  return { base, passed: checks.length, failures, geometry, errors, mockedSubmissions: requests.length, realSubmissions: 0 };
}
