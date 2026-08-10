const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const desk = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const dp = await desk.newPage();
  dp.on('response', r => { if (r.status() >= 400) console.log('[bad]', r.status(), r.url()); });
  await dp.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await dp.waitForTimeout(16000);
  await dp.screenshot({ path: '.playwright-mcp/recheck-desktop-hero-16s.png' });
  await browser.close();
  console.log('done');
})();
