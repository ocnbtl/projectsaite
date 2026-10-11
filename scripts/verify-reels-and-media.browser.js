// Isolated layout/playback-control fixtures, never real inquiries or analytics.
// eslint-disable-next-line @typescript-eslint/no-unused-expressions
async (page) => {
  const base = new URL(page.url()).origin;
  const context = await page.context().browser().newContext({ reducedMotion: "reduce" });
  await context.route(/posthog\.com|\/_vercel\/insights\/view|\/api\/contact/, r => r.abort());
  await context.route("https://www.instagram.com/**", r => r.fulfill({ contentType: "text/html", body: `<!doctype html><html><body style="margin:0;font:14px sans-serif;background:white"><header style="height:48px">Instagram fixture</header><div style="aspect-ratio:9/16;background:#dedad6;display:grid;place-items:center">Portrait video fixture</div><button style="height:44px">Play fixture</button><footer style="height:76px">Full playback controls</footer><script>new ResizeObserver(()=>parent.postMessage(JSON.stringify({type:'MEASURE',details:{height:document.body.scrollHeight}}),'*')).observe(document.body);</script></body></html>` }));
  const tab = await context.newPage(), checks = [], errors = [], geometry = [];
  const assert = (value, label) => { if (!value) throw new Error(label); checks.push(label); };
  tab.on("pageerror", e => errors.push(e.message));
  await tab.goto(base);
  await tab.getByRole("button", { name: "Decline", exact: true }).click();
  for (const width of [320, 390, 768, 1440]) {
    await tab.setViewportSize({ width, height: 1000 });
    await tab.locator("#home-services-heading").scrollIntoViewIfNeeded();
    const gap = await tab.evaluate(() => document.querySelector('#home-services-heading').getBoundingClientRect().top - document.querySelector('.editorial-section-link a').getBoundingClientRect().bottom);
    assert(gap < 125, `${width}: Services is closer to portfolio CTA (${gap.toFixed(1)}px)`);
  }
  await tab.goto(`${base}/about`);
  assert((await tab.locator('.editorial-about__image img').getAttribute('src')).includes('zh14h2356ikjkc'), "About uses Portrait 13");
  await tab.goto(`${base}/portfolio`);
  assert((await tab.locator('.editorial-mosaic__item').nth(15).locator('figcaption').textContent()).includes('Editorial'), "Photograph 16 is Editorial");
  await tab.goto(`${base}/services/modeling`);
  assert(await tab.locator('.editorial-mosaic__item').count() === 17, "Modeling includes all 17 portfolio photos");
  assert(await tab.locator('img[src*="agency%2F"]').count() === 5, "All five additions appear on Modeling");
  for (const width of [320, 390, 768, 1440]) {
    await tab.setViewportSize({ width, height: 1000 });
    await tab.goto(`${base}/services/content-creation`);
    const viewport = tab.locator('.editorial-reels__viewport');
    await viewport.scrollIntoViewIfNeeded();
    assert(await tab.locator('.editorial-reels__card').count() === 5, `${width}: five portrait screens`);
    await tab.locator('.editorial-reels iframe').first().evaluate(el => { el.loading = 'eager'; });
    const frame = tab.frameLocator('.editorial-reels iframe').first();
    await frame.getByRole('button', { name: 'Play fixture' }).waitFor();
    await tab.waitForTimeout(150);
    const g = await tab.locator('.editorial-reels__card').first().evaluate(el => {
      const embed = el.querySelector('.editorial-reels__embed'), iframe = el.querySelector('iframe');
      const a=embed.getBoundingClientRect(), b=iframe.getBoundingClientRect();
      return { card:el.clientWidth,embedWidth:a.width,frameWidth:b.width,embedHeight:a.height,frameHeight:b.height };
    });
    geometry.push({ width, ...g });
    assert(Math.abs(g.embedWidth-g.frameWidth) < 1 && Math.abs(g.embedHeight-g.frameHeight) < 1, `${width}: entire embed fits screen without cropping`);
    assert(g.card <= 360 && g.embedHeight/g.embedWidth < 2.5, `${width}: portrait screen stays proportionate, not stretched`);
    assert(await tab.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${width}: no page overflow`);
    const initial = await viewport.evaluate(el => el.scrollLeft);
    await tab.getByRole('button', { name:'Next reel',exact:true }).click();
    await tab.waitForFunction(start => document.querySelector('.editorial-reels__viewport').scrollLeft > start + 100, initial);
    assert(true, `${width}: next arrow scrolls to another screen`);
    await viewport.focus(); await tab.keyboard.press('End');
    await tab.waitForFunction(() => document.querySelector('[aria-label="Next reel"]').disabled);
    assert(true, `${width}: keyboard End reaches final screen`);
    await tab.keyboard.press('Home');
    await tab.waitForFunction(() => document.querySelector('[aria-label="Previous reel"]').disabled);
    await tab.keyboard.press('ArrowRight');
    assert(await viewport.evaluate(el => el.scrollLeft > 100), `${width}: keyboard arrow scrolls gallery`);
    await tab.keyboard.press('Home');
    assert(await tab.getByRole('link', {name:'Watch on Instagram',exact:true}).count() === 5, `${width}: direct playback fallback for every reel`);
    // Fix the fixture body geometry before testing hostile messages, so its own
    // valid ResizeObserver reports cannot race the assertion.
    await frame.locator('body').evaluate(el => { el.style.height = '812px'; el.style.overflow = 'hidden'; });
    await tab.waitForTimeout(150);
    await frame.locator('body').evaluate(() => parent.postMessage(JSON.stringify({type:'MEASURE',details:{height:812}}),'*'));
    await tab.waitForFunction(() => document.querySelector('.editorial-reels iframe').style.height === '812px');
    await tab.evaluate(() => window.dispatchEvent(new MessageEvent('message', { origin:'https://example.invalid',source:document.querySelector('.editorial-reels iframe').contentWindow,data:JSON.stringify({type:'MEASURE',details:{height:2000}}) })));
    await frame.locator('body').evaluate(() => parent.postMessage(JSON.stringify({type:'MEASURE',details:{height:90000}}),'*'));
    const afterInvalid = await tab.locator('.editorial-reels iframe').first().evaluate(el => el.style.height);
    assert(afterInvalid === '812px', `${width}: invalid provider measurements rejected (actual ${afterInvalid})`);
  }
  assert(errors.length === 0, 'No application errors');
  await context.close(); return {passed:checks.length,checks,geometry,errors};
}
