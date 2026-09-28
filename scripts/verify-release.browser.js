// Run against the normal production build on localhost, TEST_MODE=false.
// eslint-disable-next-line @typescript-eslint/no-unused-expressions -- playwright-cli evaluates this function.
async (page) => {
  const checks = [];
  const assert = (value, name) => { if (!value) throw new Error(name); checks.push(name); };
  const context = page.context();
  await context.unrouteAll({ behavior: "wait" });
  if (page.url().startsWith("http://127.0.0.1:3107")) await page.evaluate(() => localStorage.clear());
  let analyticsRequests = 0;
  let attempts = 0;
  let outcome = "success";
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  await context.route(/https:\/\/[^/]*posthog\.com\//, route => { analyticsRequests++; return route.abort(); });
  await context.route("**/api/contact", async route => {
    attempts++;
    await page.waitForTimeout(150);
    return route.fulfill({ status: outcome === "success" ? 200 : 500, contentType: "application/json", body: outcome === "success" ? '{"ok":true,"delivery":"accepted"}' : '{"code":"delivery_failed"}' });
  });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("http://127.0.0.1:3107/");
  await page.getByRole("button", { name: "Accept", exact: true }).click();
  await page.waitForTimeout(1500);
  assert(analyticsRequests === 0, "Normal localhost production build never initializes PostHog, even after opt-in");
  await page.getByRole("navigation", { name: "Primary navigation" }).getByRole("link", { name: "Contact", exact: true }).click();
  const fill = async () => {
    await page.getByLabel("Name", { exact: true }).fill("Local Mock");
    await page.getByLabel("Email", { exact: true }).fill("local-mock@example.invalid");
    await page.getByLabel("Project details", { exact: true }).fill("Only a mocked local verification, no real inquiry.");
  };
  await fill();
  await page.getByRole("button", { name: "Send inquiry", exact: true }).click();
  await page.getByRole("heading", { name: "Thank you for reaching out." }).waitFor();
  await page.locator(".form-confirmation").scrollIntoViewIfNeeded();
  await page.screenshot({ path: "output/playwright/release-confirmation-desktop.png" });
  assert(attempts === 1, "Desktop confirmation follows one mocked provider-accepted response");
  await page.getByRole("button", { name: "Send another inquiry", exact: true }).click();
  await page.setViewportSize({ width: 390, height: 844 });
  await fill();
  outcome = "failure";
  await page.getByRole("button", { name: "Send inquiry", exact: true }).click();
  await page.getByRole("alert").filter({ hasText: "The message could not be sent" }).waitFor();
  await page.screenshot({ path: "output/playwright/release-failure-mobile.png" });
  assert(await page.getByLabel("Email", { exact: true }).inputValue() === "local-mock@example.invalid", "Mobile failure retains the form for recovery");
  outcome = "success";
  await page.getByRole("button", { name: "Send inquiry", exact: true }).click();
  await page.getByRole("heading", { name: "Thank you for reaching out." }).waitFor();
  await page.locator(".form-confirmation").scrollIntoViewIfNeeded();
  await page.screenshot({ path: "output/playwright/release-confirmation-mobile.png" });
  assert(attempts === 3, "Mobile retry produces one further mocked submission");
  await page.getByRole("link", { name: "Privacy & settings", exact: true }).click();
  const panel = await page.getByRole("region", { name: "Settings", exact: true }).boundingBox();
  assert(panel && panel.x >= 0 && panel.x + panel.width <= 390, "Release privacy settings fit mobile viewport");
  await page.screenshot({ path: "output/playwright/release-privacy-mobile.png" });
  await page.getByRole("button", { name: "Turn off optional tracking", exact: true }).click();
  assert(await page.getByRole("button", { name: "Turn off optional tracking", exact: true }).evaluate(el => document.activeElement === el), "Privacy choice keeps keyboard focus on its control");
  assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), "No horizontal overflow in the mobile contact layout");
  assert(analyticsRequests === 0 && errors.length === 0, "No PostHog requests or uncaught JavaScript errors in release-mode local smoke test");
  return { checks, mockedSubmissions: attempts };
}
