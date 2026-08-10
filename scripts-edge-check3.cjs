const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(5000);
  await page.evaluate(() => {
    const m = document.querySelector('.featured');
    const top = m.getBoundingClientRect().top + window.scrollY;
    window.scrollTo(0, top + window.innerHeight * 0.5);
  });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: '.playwright-mcp/edge-featured.png' });
  const probe = await page.evaluate(() => {
    const out = [];
    for (const [x, y] of [[4, 450], [1435, 450]]) {
      const el = document.elementFromPoint(x, y);
      out.push(`${x},${y}: <${el ? el.tagName.toLowerCase() : '?'}> .${el ? String(el.className).slice(0,60) : ''}`);
    }
    return out;
  });
  console.log(probe.join('\n'));
  await browser.close();
  console.log('done');
})();
