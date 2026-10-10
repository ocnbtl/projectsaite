// eslint-disable-next-line @typescript-eslint/no-unused-expressions
async (page) => {
  await page.goto(new URL("/", page.url()).href);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 1440, height: 900 });
  const decline = page.getByRole("button", { name: "Decline", exact: true });
  if (await decline.isVisible()) await decline.click();
  const xavier = page.locator(".editorial-brandmark--xavier-university").first();
  await xavier.scrollIntoViewIfNeeded();
  await page.locator(".editorial-brandmark--fashion-week-columbus").first().locator("img").evaluate(image => image.decode());
  await page.screenshot({ path: "output/playwright/seo-credit-rail.png" });
  const names = ["xavier-university", "university-cincinnati", "fashion-week-columbus", "highest-on-the-runway", "new-york-fashion-week", "paris-fashion-week"];
  const checks = [];
  for (const name of names) {
    const img = page.locator(`.editorial-brandmark--${name}`).first().locator("img");
    await img.scrollIntoViewIfNeeded();
    await img.evaluate(image => image.decode());
    if (!(await img.evaluate(image => image.naturalWidth > 0 && image.naturalHeight > 0))) throw new Error(`${name} image failed`);
    checks.push(`${name}: decoded actual image`);
  }
  await page.locator(".editorial-brandmark--highest-on-the-runway").first().scrollIntoViewIfNeeded();
  await page.screenshot({ path: "output/playwright/fashion-credit-rail.png" });
  return { checks };
}
