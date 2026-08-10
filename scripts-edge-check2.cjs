const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(5000);

  // Meio da transição do manifesto (pinned, encolhendo, contato subindo)
  await page.evaluate(() => {
    const m = document.querySelector('.manifesto');
    const top = m.getBoundingClientRect().top + window.scrollY;
    window.scrollTo(0, top + window.innerHeight * 0.45);
  });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: '.playwright-mcp/edge-manifesto.png' });

  const probe = await page.evaluate(() => {
    const out = [];
    for (const [x, y] of [[4, 450], [1435, 450]]) {
      const el = document.elementFromPoint(x, y);
      const cls = el && el.className ? String(el.className).slice(0, 60) : '';
      out.push(`${x},${y}: <${el ? el.tagName.toLowerCase() : '?'}> .${cls}`);
    }
    const inner = document.querySelector('.manifesto [data-stack-inner]');
    out.push(`manifesto inner transform: ${inner ? getComputedStyle(inner).transform : 'n/a'}`);
    const m = document.querySelector('.manifesto');
    out.push(`manifesto section transform: ${getComputedStyle(m).transform}`);
    return out;
  });
  console.log(probe.join('\n'));
  await browser.close();
  console.log('done');
})();
