// Run with playwright-cli on an already opened local or live homepage.
// All contact submissions and analytics uploads are blocked.
// eslint-disable-next-line @typescript-eslint/no-unused-expressions
async (page) => {
  const base = new URL(page.url()).origin;
  const checks = [], errors = [];
  const assert = (condition, name) => { if (!condition) throw new Error(name); checks.push(name); };
  const context = await page.context().browser().newContext({ reducedMotion: "reduce", viewport: { width: 1440, height: 1000 } });
  await context.route("**/api/contact", route => route.abort());
  await context.route(/posthog\.com|\/_vercel\/insights\/view/, route => route.abort());
  const tab = await context.newPage();
  tab.on("pageerror", error => errors.push(error.message));
  const slugs = ["modeling", "content-creation", "travel-collaborations", "makeup-artist", "henna", "face-painting"];
  const paths = ["/", "/about", ...slugs.map(slug => `/services/${slug}`)];
  const titles = new Set();
  for (const path of paths) {
    const htmlResponse = await context.request.get(`${base}${path}`, { headers: { Accept: "text/html" } });
    const html = await htmlResponse.text();
    assert(htmlResponse.status() === 200, `${path}: HTML 200`);
    assert(htmlResponse.headers()["cache-control"]?.includes("no-store"), `${path}: HTML is uncached to avoid representation mixing`);
    const title = html.match(/<title>(.*?)<\/title>/s)?.[1];
    assert(title && !titles.has(title), `${path}: unique title`); titles.add(title);
    assert(html.includes(`href="https://sageburress.com${path === "/" ? "" : path}"`) || html.includes(`href="https://sageburress.com${path}"`), `${path}: canonical present`);
    const schema = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(match => JSON.parse(match[1]));
    assert(schema.some(value => value["@graph"]?.some(entity => entity["@type"] === "Person")), `${path}: valid person identity JSON-LD`);
    assert(html.includes('property="og:image"') && !/property="og:image"[^>]*hero-cutout/.test(html), `${path}: SB share image retained`);
    if (path.includes("/services/")) assert(html.includes("A few useful answers.") && html.includes("<details"), `${path}: FAQs in raw HTML`);
    const mdResponse = await context.request.get(`${base}${path}`, { headers: { Accept: "text/markdown" } });
    const md = await mdResponse.text();
    assert(mdResponse.status() === 200 && mdResponse.headers()["content-type"].startsWith("text/markdown") && md.startsWith("# "), `${path}: real Markdown response`);
    assert(/(?:^|,)\s*Accept\s*(?:,|$)/i.test(mdResponse.headers().vary) && mdResponse.headers().link?.includes('rel="canonical"'), `${path}: Markdown cache variation and canonical`);
    if (path === "/about") assert(md.includes("Macy’s") && md.includes("Saks Fifth Avenue") && md.includes("Westcott Lighting") && md.includes("Sage’s Shenanigans"), "About facts aligned in Markdown");
  }
  for (const accept of ["text/markdown;q=0", "text/html,text/markdown;q=0.8", "text/html,text/markdown", "*/*"]) {
    const response = await context.request.get(base, { headers: { Accept: accept } });
    assert(response.headers()["content-type"].startsWith("text/html"), `HTML preference honored: ${accept}`);
  }
  for (const accept of ["text/html", "text/markdown"]) {
    const response = await context.request.get(`${base}/seo-missing-page-check`, { headers: { Accept: accept } });
    assert(response.status() === 404 && response.headers()["content-type"].startsWith(accept), `404 status and ${accept} representation`);
  }
  const admin = await context.request.get(`${base}/admin/login`);
  assert(admin.status() === 200 && admin.headers()["x-robots-tag"]?.includes("noindex") && (await admin.text()).includes('content="noindex, nofollow"'), "Admin login noindex header and metadata");
  const denied = await context.request.get(`${base}/api/admin/content`);
  assert([401,403].includes(denied.status()), "Admin content still denies unauthenticated requests");
  for (const path of ["/admin", "/admin/settings", "/admin/analytics", "/admin/pitch-kit", "/admin/style-guide"]) {
    for (const accept of ["text/html", "text/markdown"]) {
      const response = await context.request.get(`${base}${path}`, { maxRedirects: 0, headers: { Accept: accept, Cookie: "saite_admin_session=invalid.invalid" } });
      assert([307,308].includes(response.status()) && response.headers().location.endsWith("/admin/login"), `${path}: unauthenticated ${accept} stays protected`);
    }
  }
  const sitemap = await (await context.request.get(`${base}/sitemap.xml`)).text();
  assert(sitemap.includes("/about</loc>") && !sitemap.includes("/admin") && !sitemap.includes("agent-content"), "About in sitemap; private/internal routes excluded");
  const robots = await (await context.request.get(`${base}/robots.txt`)).text();
  assert(robots.includes("Allow: /admin/login$") && robots.includes("Disallow: /api/"), "Robots permits reading login noindex, keeps API restriction");
  assert((await (await context.request.get(`${base}/llms.txt`)).text()).includes("## When to use this site"), "Agent guide describes real capabilities, no booking API");
  for (const width of [390, 768, 1440]) {
    await tab.setViewportSize({ width, height: 1000 });
    for (const path of paths) {
      await tab.goto(`${base}${path}`);
      await tab.locator("h1").waitFor();
      assert(await tab.locator("h1").count() === 1, `${width} ${path}: one H1`);
      assert(await tab.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${width} ${path}: no horizontal overflow`);
      if (path.startsWith("/services/")) {
        const faqs = tab.locator(".editorial-faq details");
        assert(await faqs.count() === 4, `${width} ${path}: four useful FAQs`);
        await faqs.first().locator("summary").focus();
        await tab.keyboard.press("Enter");
        assert(await faqs.first().getAttribute("open") !== null && await faqs.first().locator("p").isVisible(), `${width} ${path}: keyboard opens answer`);
        await tab.keyboard.press("Enter");
        assert(await faqs.first().getAttribute("open") === null, `${width} ${path}: keyboard closes answer`);
      }
      if (path === "/about" && width !== 768) await tab.screenshot({ path: `output/playwright/seo-about-${width}.png`, fullPage: true });
      if (path === "/services/henna" && width === 390) { await tab.locator(".editorial-faq").scrollIntoViewIfNeeded(); await tab.screenshot({ path: "output/playwright/seo-faq-mobile.png" }); }
      if (path === "/" && width === 1440) { await tab.locator(".editorial-hero__about").scrollIntoViewIfNeeded(); await tab.screenshot({ path: "output/playwright/seo-home-hero.png" }); }
    }
  }
  await tab.goto(base);
  await tab.getByRole("link", { name: "More about my work" }).click();
  await tab.waitForURL("**/about");
  assert((await tab.locator("h1").innerText()) === "Experience Meets Creativity", "Client-side About navigation remains HTML");
  for (const name of ["xavier-university", "university-cincinnati", "fashion-week-columbus"]) {
    const extension = name === "fashion-week-columbus" ? "png" : "svg";
    await tab.goto(`${base}/media/brands/${name}${name === "fashion-week-columbus" ? "-dark" : ""}.${extension}`);
    assert(await tab.evaluate(() => document.contentType.startsWith("image/")), `${name}: real image asset`);
  }
  const noJsContext = await page.context().browser().newContext({ javaScriptEnabled: false, viewport: { width: 1280, height: 900 } });
  const noJs = await noJsContext.newPage(); await noJs.goto(base);
  assert((await noJs.locator("h1").textContent()).trim() === "Hi, my name is Sage Burress", "Stable semantic heading without scrambled characters");
  assert(await noJs.locator("h1").isVisible(), "Heading visible without JavaScript");
  await noJs.goto(`${base}/services/henna`); await noJs.locator(".editorial-faq summary").first().click();
  assert(await noJs.locator(".editorial-faq details").first().getAttribute("open") !== null, "FAQ works without JavaScript");
  await noJsContext.close();
  assert(errors.length === 0, "No uncaught page errors");
  await context.close();
  return { base, passed: checks.length, checks, errors };
}
