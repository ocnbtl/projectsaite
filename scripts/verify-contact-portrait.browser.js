// Read-only layout/interaction checks; never send inquiries or analytics.
// eslint-disable-next-line @typescript-eslint/no-unused-expressions
async page => {
  const base = new URL(page.url()).origin;
  const context = await page.context().browser().newContext({ reducedMotion: 'reduce' });
  await context.route(/posthog\.com|\/_vercel\/insights\/view|\/api\/contact/, r => r.abort());
  const tab = await context.newPage(), checks = [], errors = [];
  tab.on('pageerror', e => errors.push(e.message));
  const assert = (value, name) => { if (!value) throw new Error(name); checks.push(name); };
  for (const [width,height] of [[320,568],[390,844],[768,1024],[1440,1000]]) {
    await tab.setViewportSize({ width, height });
    await tab.goto(`${base}/contact`);
    const decline = tab.getByRole('button', { name:'Decline', exact:true });
    if (await decline.isVisible()) await decline.click();
    const trigger = tab.getByRole('combobox');
    await trigger.click();
    await tab.waitForTimeout(100);
    const geometry = await tab.getByRole('listbox').evaluate(el => {
      const r=el.getBoundingClientRect();
      return { count:el.children.length, scroll:el.scrollHeight-el.clientHeight, top:r.top,bottom:r.bottom, height:innerHeight, options:[...el.children].map(o=>{ const r=o.getBoundingClientRect();return {top:r.top,bottom:r.bottom,height:r.height}; }) };
    });
    assert(geometry.count===7 && geometry.scroll<=1, `${width}: seven options without internal scrolling`);
    assert(geometry.top>=75 && geometry.bottom<=geometry.height, `${width}: complete menu visible (${geometry.top.toFixed(1)}–${geometry.bottom.toFixed(1)})`);
    assert(geometry.options.every(o=>o.height>=44), `${width}: usable touch targets`);
    if ([390,1440].includes(width)) await tab.screenshot({path:`output/playwright/contact-full-options-${width}.png`});
    await tab.getByRole('option',{name:'Something else',exact:true}).click();
    assert(await tab.locator('input[name="inquiry"]').inputValue()==='Something else', `${width}: last option selects correctly`);
    await trigger.press('Home'); await trigger.press('Enter');
    assert(await tab.locator('input[name="inquiry"]').inputValue()==='Modeling', `${width}: keyboard selection preserved`);
    await trigger.click(); await trigger.press('Escape');
    assert(await trigger.getAttribute('aria-expanded')==='false', `${width}: Escape closes menu`);
    await tab.goto(`${base}/about`);
    const portrait=tab.locator('.editorial-about__image img');
    await portrait.evaluate(el=>el.decode());
    const image=await portrait.evaluate(el=>{const r=el.getBoundingClientRect(),p=el.parentElement.getBoundingClientRect();return {ratio:r.width/r.height,source:Number(el.getAttribute('width'))/Number(el.getAttribute('height')),fit:getComputedStyle(el).objectFit,center:Math.abs((r.left+r.right)-(p.left+p.right))/2};});
    assert(image.fit==='contain' && Math.abs(image.ratio-image.source)<0.005, `${width}: full portrait without cropping or distortion`);
    assert(image.center<1, `${width}: portrait centered`);
    assert(await tab.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1), `${width}: no horizontal overflow`);
    if ([390,1440].includes(width)) await tab.screenshot({path:`output/playwright/about-full-portrait-${width}.png`,fullPage:true});
  }
  assert(errors.length===0, 'No application errors');
  await context.close(); return {passed:checks.length,checks,errors};
}
