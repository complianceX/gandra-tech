const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(5000);

  // Featured em repouso (seção inteira na viewport)
  await page.evaluate(() => {
    const el = document.querySelector('.featured');
    window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 40);
  });
  await page.waitForTimeout(2500);
  await page.screenshot({ path: '.playwright-mcp/rest-featured.png' });

  // Manifesto em repouso
  await page.evaluate(() => {
    const el = document.querySelector('.manifesto');
    window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 20);
  });
  await page.waitForTimeout(2500);
  await page.screenshot({ path: '.playwright-mcp/rest-manifesto.png' });

  // Página do projeto SGS (capa 21:9)
  await page.goto('http://localhost:3000/trabalhos/sgs', { waitUntil: 'networkidle' });
  await page.waitForTimeout(4500);
  await page.screenshot({ path: '.playwright-mcp/rest-project-sgs.png' });

  await browser.close();
  console.log('done');
})();
