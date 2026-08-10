const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(5000);
  await page.evaluate(() => {
    const el = document.querySelector('.manifesto__photo');
    window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.35);
  });
  await page.waitForTimeout(2500);
  await page.screenshot({ path: '.playwright-mcp/rest-manifesto-big.png' });
  await browser.close();
  console.log('done');
})();
