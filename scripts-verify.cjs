/* Verificação pós-fix: blob visível? featured escondido? screenshots. */
const { chromium } = require('playwright')

;(async () => {
  const browser = await chromium.launch()
  const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage()

  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' })
  await page.waitForTimeout(9000)

  const blob = await page.evaluate(() => {
    const c = document.querySelector('.hero__blob')
    if (!c) return 'sem canvas'
    const gl = c.getContext('webgl')
    const samples = []
    for (const [fx, fy] of [[0.5, 0.5], [0.3, 0.6], [0.7, 0.35], [0.2, 0.2], [0.8, 0.8]]) {
      const px = new Uint8Array(4)
      gl.readPixels(Math.floor(c.width * fx), Math.floor(c.height * fy), 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, px)
      samples.push(Array.from(px.slice(0, 3)))
    }
    return samples
  })
  console.log('BLOB SAMPLES:', JSON.stringify(blob))
  await page.screenshot({ path: '.playwright-mcp/fix-hero.png' })

  const docH = await page.evaluate(() => document.documentElement.scrollHeight)
  await page.evaluate((y) => window.__lenis?.scrollTo(y, { immediate: true }) ?? window.scrollTo(0, y), Math.round(docH * 0.75))
  await page.waitForTimeout(1500)
  const vis = await page.evaluate(() => {
    const f = document.querySelector('.featured')
    return { visibility: getComputedStyle(f).visibility, scrollY: Math.round(window.scrollY) }
  })
  console.log('FEATURED EM 75%:', JSON.stringify(vis))
  await page.screenshot({ path: '.playwright-mcp/fix-zona.png' })

  // Trilho: ghosts sumiram?
  await page.evaluate((y) => window.__lenis?.scrollTo(y, { immediate: true }) ?? window.scrollTo(0, y), Math.round(docH * 0.3))
  await page.waitForTimeout(1500)
  await page.screenshot({ path: '.playwright-mcp/fix-trilho.png' })

  await browser.close()
})()
