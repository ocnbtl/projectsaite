// Regression for logo decoding changing the marquee's animation endpoints.
// eslint-disable-next-line @typescript-eslint/no-unused-expressions
async (page) => {
  const context = await page.context().browser().newContext({ viewport: { width: 1440, height: 1000 } });
  await context.route(/posthog\.com|\/_vercel\/insights\/view|\/api\/contact/, r => r.abort());
  const tab = await context.newPage();
  await tab.goto(new URL(page.url()).origin);
  await tab.getByRole('button', { name: 'Decline', exact: true }).click();
  await tab.locator('.editorial-rail').scrollIntoViewIfNeeded();
  await tab.waitForFunction(() => [...document.querySelectorAll('.editorial-rail img')].every(img => img.complete && img.naturalWidth));
  const result = await tab.evaluate(async () => {
    const track = document.querySelector('.editorial-rail__track');
    const images = [...track.querySelectorAll('img')];
    // srcset density correction rounds natural dimensions down to whole CSS pixels.
    const ratioErrors = images.filter(img => Math.abs(img.naturalWidth * Number(img.getAttribute('height')) / Number(img.getAttribute('width')) - img.naturalHeight) > 1.1).map(img => ({ src: img.src, width: img.naturalWidth, height: img.naturalHeight }));
    let lastX, lastTime, maxError = 0, samples = 0;
    const changes = [];
    const observer = new MutationObserver(() => changes.push(track.getAttribute('style')));
    observer.observe(track, { attributes: true, attributeFilter: ['style'] });
    const start = performance.now();
    setTimeout(() => images.forEach(img => { img.loading = 'eager'; }), 1500);
    await new Promise(resolve => {
      function frame(t) {
        const x = new DOMMatrix(getComputedStyle(track).transform).m41;
        const time = Number(track.getAnimations()[0]?.currentTime ?? 0);
        const period = Math.abs(parseFloat(track.style.getPropertyValue('--editorial-rail-start')) - parseFloat(track.style.getPropertyValue('--editorial-rail-end')));
        if (lastTime !== undefined && time >= lastTime && Math.floor(time / 52000) === Math.floor(lastTime / 52000)) maxError = Math.max(maxError, Math.abs((x - lastX) + period * (time - lastTime) / 52000));
        lastX = x; lastTime = time; samples++;
        if (t - start < 8000) requestAnimationFrame(frame); else resolve();
      }
      requestAnimationFrame(frame);
    });
    observer.disconnect();
    return { ratioErrors, maxError, samples, geometryChanges: changes.length, willChange: getComputedStyle(track).willChange };
  });
  await context.close();
  if (result.ratioErrors.length || result.maxError > 1 || result.geometryChanges || result.willChange !== 'transform') throw new Error(JSON.stringify(result));
  return { passed: 4, ...result };
}
