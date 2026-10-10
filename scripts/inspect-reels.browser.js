// Read-only inspection of the existing public Instagram embeds; never like/comment/share.
// eslint-disable-next-line @typescript-eslint/no-unused-expressions
async (page) => {
  const base = new URL(page.url()).origin;
  const context = await page.context().browser().newContext({ viewport: { width: 1440, height: 1100 }, reducedMotion: "reduce" });
  await context.route(/posthog\.com|\/_vercel\/insights\/view/, route => route.abort());
  await context.addInitScript(() => { window.__embedMessages = []; window.addEventListener("message", event => { if (event.origin === "https://www.instagram.com" && typeof event.data === "string" && event.data.includes("MEASURE")) window.__embedMessages.push(event.data); }); });
  const tab = await context.newPage();
  await tab.goto(`${base}/services/content-creation`);
  const decline = tab.getByRole("button", { name: "Decline", exact: true }); if (await decline.isVisible()) await decline.click();
  await tab.locator(".editorial-reels").scrollIntoViewIfNeeded();
  const frames = [];
  for (const width of [1440, 390, 320]) {
    await tab.setViewportSize({ width, height: 1100 });
    const frameElement = tab.locator(".editorial-reels iframe");
    const frame = await (await frameElement.elementHandle()).contentFrame();
    await frame.waitForURL("https://www.instagram.com/**", { timeout: 45000 });
    await frame.waitForLoadState("domcontentloaded");
    await frame.locator("body").waitFor();
    frames.push({ width, frame: await frameElement.boundingBox(), document: await frame.evaluate(() => ({ width: innerWidth, scrollWidth: document.documentElement.scrollWidth, height: innerHeight, scrollHeight: document.body.scrollHeight, videoCount: document.querySelectorAll("video").length, hasPlay: document.body.innerText.includes("Play") })) });
    await tab.locator(".editorial-reels__toolbar").scrollIntoViewIfNeeded();
    await tab.screenshot({ path: `output/playwright/reels-real-${width}.png` });
  }
  const messages = await tab.evaluate(() => window.__embedMessages);
  await context.close(); return { base, frames, messages };
}
