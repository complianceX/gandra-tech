const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(6000);

  // Rola até o meio da transição hero -> featured (hero sticky encolhendo)
  await page.evaluate(() => window.scrollTo(0, window.innerHeight * 0.45));
  await page.waitForTimeout(1500);
  await page.screenshot({ path: '.playwright-mcp/edge-mid.png' });

  // Identifica o que está sob os pontos das bordas marcadas
  const probe = await page.evaluate(() => {
    const out = [];
    for (const [x, y] of [[4, 450], [1435, 450], [10, 300], [1430, 600]]) {
      const el = document.elementFromPoint(x, y);
      if (!el) { out.push(`${x},${y}: nada`); continue; }
      const cls = el.className && el.className.baseVal !== undefined ? el.className.baseVal : el.className;
      out.push(`${x},${y}: <${el.tagName.toLowerCase()}> .${String(cls).slice(0, 80)} | texto: "${(el.textContent || '').trim().slice(0, 40)}"`);
    }
    const hero = document.querySelector('.hero');
    const cs = getComputedStyle(hero);
    out.push(`hero transform: ${cs.transform} | filter: ${cs.filter} | visibility: ${cs.visibility}`);
    out.push(`body bg: ${getComputedStyle(document.body).backgroundColor}`);
    const main = document.querySelector('main');
    out.push(`main bg: ${getComputedStyle(main).backgroundColor}`);
    return out;
  });
  console.log(probe.join('\n'));

  await browser.close();
  console.log('done');
})();
