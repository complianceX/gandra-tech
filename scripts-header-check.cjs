const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const mob = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  const mp = await mob.newPage();
  await mp.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await mp.waitForTimeout(8000);
  await mp.screenshot({ path: '.playwright-mcp/final-mobile-header.png', clip: { x: 0, y: 0, width: 390, height: 120 } });
  await browser.close();
  console.log('done');
})();
