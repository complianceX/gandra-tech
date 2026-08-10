/* Inspeção visual do site: screenshots por faixa de scroll + console. */
const { chromium } = require('playwright')

const BASE = 'http://localhost:3000'

async function shoot(page, name) {
  await page.screenshot({ path: `.playwright-mcp/${name}.png` })
}

async function scrollTo(page, y) {
  await page.evaluate((yy) => {
    if (window.__lenis) window.__lenis.scrollTo(yy, { immediate: true })
    else window.scrollTo(0, yy)
  }, y)
  await page.waitForTimeout(1400)
}

;(async () => {
  const browser = await chromium.launch()
  const errors = []

  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  const page = await ctx.newPage()
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(`[home/desktop] ${m.text()}`)
  })
  page.on('pageerror', (e) => errors.push(`[home/desktop PAGEERROR] ${e.message}`))

  await page.goto(BASE, { waitUntil: 'networkidle' })
  await page.waitForTimeout(4500) // preloader completo + partículas
  await shoot(page, 'audit-01-hero')

  const docH = await page.evaluate(() => document.documentElement.scrollHeight)
  const stops = [0.15, 0.3, 0.45, 0.6, 0.75, 0.9, 1]
  for (let i = 0; i < stops.length; i++) {
    await scrollTo(page, Math.round(docH * stops[i]))
    await shoot(page, `audit-02-scroll-${i}`)
  }

  // Página de projeto
  await page.goto(`${BASE}/trabalhos/sgs`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(3500)
  await shoot(page, 'audit-03-projeto')

  // Contato
  await page.goto(`${BASE}/contato`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(3000)
  await shoot(page, 'audit-04-contato')

  // 404
  await page.goto(`${BASE}/nao-existe`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(3000)
  await shoot(page, 'audit-05-404')

  await ctx.close()

  // Mobile
  const mctx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  })
  const mp = await mctx.newPage()
  mp.on('console', (m) => {
    if (m.type() === 'error') errors.push(`[home/mobile] ${m.text()}`)
  })
  mp.on('pageerror', (e) => errors.push(`[home/mobile PAGEERROR] ${e.message}`))
  await mp.goto(BASE, { waitUntil: 'networkidle' })
  await mp.waitForTimeout(4500)
  await mp.screenshot({ path: '.playwright-mcp/audit-06-mobile-hero.png' })
  const docHM = await mp.evaluate(() => document.documentElement.scrollHeight)
  await scrollTo(mp, Math.round(docHM * 0.45))
  await mp.screenshot({ path: '.playwright-mcp/audit-07-mobile-mid.png' })
  await scrollTo(mp, docHM)
  await mp.screenshot({ path: '.playwright-mcp/audit-08-mobile-end.png' })

  await browser.close()

  console.log('ERROS DE CONSOLE:', errors.length)
  errors.forEach((e) => console.log(' -', e))
})()
