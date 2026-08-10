const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const dir = '.playwright-mcp';

  // Desktop: manifesto com foto nova
  const desk = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const dp = await desk.newPage();
  const bad = [];
  dp.on('response', r => { if (r.status() >= 400) bad.push(`${r.status()} ${r.url()}`); });
  dp.on('console', m => { if (m.type() === 'error') bad.push('[console] ' + m.text()); });
  await dp.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await dp.waitForTimeout(6000);
  await dp.mouse.move(720, 450);

  // manifesto: localizar e rolar até ele
  const man = dp.locator('.manifesto');
  await man.scrollIntoViewIfNeeded();
  await dp.waitForTimeout(2500);
  await dp.screenshot({ path: `${dir}/final-manifesto.png` });

  // trilho horizontal / seção de trabalhos na home
  const rail = dp.locator('.work-rail');
  if (await rail.count()) {
    await rail.scrollIntoViewIfNeeded();
    await dp.waitForTimeout(2000);
    await dp.mouse.wheel(0, 1200);
    await dp.waitForTimeout(1500);
    await dp.screenshot({ path: `${dir}/final-rail.png` });
  }

  // página trabalhos
  await dp.goto('http://localhost:3000/trabalhos', { waitUntil: 'networkidle' });
  await dp.waitForTimeout(4000);
  await dp.screenshot({ path: `${dir}/final-trabalhos.png`, fullPage: false });
  await dp.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.5));
  await dp.waitForTimeout(2000);
  await dp.screenshot({ path: `${dir}/final-trabalhos-mid.png` });

  // Mobile real (touch): sem anel de cursor no canto
  const mob = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  const mp = await mob.newPage();
  await mp.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await mp.waitForTimeout(9000);
  await mp.screenshot({ path: `${dir}/final-mobile-hero.png` });

  console.log('bad requests:', bad.length ? bad.join('\n') : 'nenhum');
  await browser.close();
  console.log('done');
})();
