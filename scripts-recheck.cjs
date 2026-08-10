const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const dir = '.playwright-mcp';

  // 1) Mobile hero
  const mob = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const mp = await mob.newPage();
  mp.on('console', m => { if (m.type() === 'error') console.log('[mob err]', m.text()); });
  await mp.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await mp.waitForTimeout(9000); // preloader + entrada das partículas
  await mp.screenshot({ path: `${dir}/recheck-mobile-hero.png` });

  // 2) Desktop hero
  const desk = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const dp = await desk.newPage();
  await dp.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await dp.waitForTimeout(9000);
  await dp.screenshot({ path: `${dir}/recheck-desktop-hero.png` });

  // 3) 404
  const nf = await desk.newPage();
  await nf.goto('http://localhost:3000/pagina-que-nao-existe', { waitUntil: 'networkidle' });
  await nf.waitForTimeout(4000);
  await nf.screenshot({ path: `${dir}/recheck-404.png` });

  await browser.close();
  console.log('done');
})();
