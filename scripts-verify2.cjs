const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const dir = '.playwright-mcp';
  const bad = [];

  const desk = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const dp = await desk.newPage();
  dp.on('response', r => { if (r.status() >= 400) bad.push(`${r.status()} ${r.url()}`); });
  dp.on('console', m => { if (m.type() === 'error') bad.push('[console] ' + m.text()); });

  // 1) Nova página /trabalhos
  await dp.goto('http://localhost:3000/trabalhos', { waitUntil: 'networkidle' });
  await dp.waitForTimeout(3500);
  await dp.mouse.move(500, 420); // hover na segunda linha p/ revelar thumb
  await dp.waitForTimeout(900);
  await dp.screenshot({ path: `${dir}/new-trabalhos-index.png` });

  // 2) Home: link no cabeçalho da seção + fim do trilho com padding novo
  await dp.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await dp.waitForTimeout(6000);
  const label = dp.locator('.work-list .section-label');
  await label.scrollIntoViewIfNeeded();
  await dp.waitForTimeout(1200);
  await dp.screenshot({ path: `${dir}/new-worklist-label.png` });

  // rolar até o fim do trilho
  const rail = dp.locator('.work-rail');
  await rail.scrollIntoViewIfNeeded();
  await dp.evaluate(() => {
    const r = document.querySelector('.work-rail');
    const top = r.getBoundingClientRect().top + window.scrollY;
    window.scrollTo(0, top + r.offsetHeight - window.innerHeight - 10);
  });
  await dp.waitForTimeout(2000);
  await dp.screenshot({ path: `${dir}/new-rail-end.png` });

  // 3) Mobile da nova página
  const mob = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  const mp = await mob.newPage();
  await mp.goto('http://localhost:3000/trabalhos', { waitUntil: 'networkidle' });
  await mp.waitForTimeout(3000);
  await mp.screenshot({ path: `${dir}/new-trabalhos-mobile.png` });

  console.log('bad:', bad.length ? bad.join('\n') : 'nenhum');
  await browser.close();
  console.log('done');
})();
