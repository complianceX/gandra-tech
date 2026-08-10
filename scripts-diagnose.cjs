/* Diagnóstico: hero (blob/partículas) e a zona morta pós-trilho. */
const { chromium } = require('playwright')

;(async () => {
  const browser = await chromium.launch()
  const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage()

  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' })
  await page.waitForTimeout(9000) // entrada completa: cortina + voo das partículas

  // 1. As partículas formaram o nome? Amostra o canvas.
  const probe = await page.evaluate(() => {
    const hero = document.querySelector('.hero')
    const blob = hero?.querySelector('.hero__blob')
    const parts = hero?.querySelector('.hero__particles')
    const out = { blobExists: !!blob, partsExists: !!parts }
    if (parts && parts.width > 0) {
      const ctx = parts.getContext('2d')
      // Conta pixels não-pretos numa faixa central (onde o nome deveria estar)
      const w = parts.width
      const h = parts.height
      const row = ctx.getImageData(0, Math.floor(h * 0.35), w, Math.floor(h * 0.3)).data
      let lit = 0
      for (let i = 0; i < row.length; i += 4) {
        if (row[i] + row[i + 1] + row[i + 2] > 40) lit++
      }
      out.particleLitPixels = lit
    }
    if (blob && blob.width > 0) {
      const gl = blob.getContext('webgl')
      const px = new Uint8Array(4)
      gl.readPixels(Math.floor(blob.width / 2), Math.floor(blob.height / 2), 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, px)
      out.blobCenterPixel = Array.from(px)
      const px2 = new Uint8Array(4)
      gl.readPixels(Math.floor(blob.width * 0.25), Math.floor(blob.height * 0.6), 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, px2)
      out.blobQuarterPixel = Array.from(px2)
    }
    return out
  })
  console.log('HERO PROBE:', JSON.stringify(probe))
  await page.screenshot({ path: '.playwright-mcp/diag-hero-9s.png' })

  // 2. Zona morta: o que está no centro da viewport em 75% do documento?
  const docH = await page.evaluate(() => document.documentElement.scrollHeight)
  await page.evaluate((y) => window.__lenis?.scrollTo(y, { immediate: true }) ?? window.scrollTo(0, y), Math.round(docH * 0.75))
  await page.waitForTimeout(1500)
  const zone = await page.evaluate(() => {
    const el = document.elementFromPoint(window.innerWidth / 2, window.innerHeight / 2)
    const rail = document.querySelector('.work-rail')?.getBoundingClientRect()
    const track = document.querySelector('.work-rail__track')
    const featured = document.querySelector('.featured')?.getBoundingClientRect()
    const manifesto = document.querySelector('.manifesto')?.getBoundingClientRect()
    return {
      centerEl: el ? `${el.tagName}.${el.className}` : 'nada',
      rail: rail && { top: Math.round(rail.top), bottom: Math.round(rail.bottom), height: Math.round(rail.height) },
      trackWidth: track?.scrollWidth,
      trackTransform: track?.style.transform,
      featured: featured && { top: Math.round(featured.top), bottom: Math.round(featured.bottom) },
      manifesto: manifesto && { top: Math.round(manifesto.top), bottom: Math.round(manifesto.bottom) },
      innerWidth: window.innerWidth,
      scrollY: Math.round(window.scrollY),
    }
  })
  console.log('ZONA MORTA:', JSON.stringify(zone, null, 1))

  await browser.close()
})()
