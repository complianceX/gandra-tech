'use client'
import { useRef, useEffect } from 'react'

/**
 * Campo de partículas do hero: pontos à deriva num flow-field senoidal,
 * repelidos pelo cursor. O rastro vem de redesenhar um véu preto
 * translúcido por frame em vez de limpar o canvas.
 */
export default function HeroParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let w = 0
    let h = 0
    const resize = () => {
      const parent = canvas.parentElement
      if (!parent) return
      const r = parent.getBoundingClientRect()
      w = r.width
      h = r.height
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.fillStyle = '#000'
      ctx.fillRect(0, 0, w, h)
    }
    resize()
    window.addEventListener('resize', resize)

    const mouse = { x: -9999, y: -9999 }
    const onMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect()
      mouse.x = e.clientX - r.left
      mouse.y = e.clientY - r.top
    }
    const onOut = () => {
      mouse.x = -9999
      mouse.y = -9999
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseout', onOut)

    const COLORS = ['245,244,241', '245,244,241', '143,151,221'] // papel ×2, acento ×1
    const N = 220
    const parts = Array.from({ length: N }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: 0,
      vy: 0,
      c: COLORS[Math.floor(Math.random() * COLORS.length)],
      s: 0.6 + Math.random() * 1.2,
    }))

    let t = 0
    let raf = requestAnimationFrame(function tick() {
      t += 0.0035
      ctx.fillStyle = 'rgba(0,0,0,0.085)'
      ctx.fillRect(0, 0, w, h)

      for (const p of parts) {
        // Flow field: direção vem de senos/cossenos sobre a posição.
        const a = Math.sin(p.x * 0.0022 + t * 2) + Math.cos(p.y * 0.0026 - t * 1.6)
        p.vx += Math.cos(a * Math.PI) * 0.03
        p.vy += Math.sin(a * Math.PI) * 0.03

        // Repulsão do cursor num raio de 130px.
        const dx = p.x - mouse.x
        const dy = p.y - mouse.y
        const d2 = dx * dx + dy * dy
        if (d2 < 16900) {
          const d = Math.sqrt(d2) || 1
          const f = ((130 - d) / 130) * 0.9
          p.vx += (dx / d) * f
          p.vy += (dy / d) * f
        }

        p.vx *= 0.96
        p.vy *= 0.96
        p.x += p.vx
        p.y += p.vy

        if (p.x < -10) p.x = w + 10
        else if (p.x > w + 10) p.x = -10
        if (p.y < -10) p.y = h + 10
        else if (p.y > h + 10) p.y = -10

        ctx.fillStyle = `rgba(${p.c},0.75)`
        ctx.fillRect(p.x, p.y, p.s, p.s)
      }
      raf = requestAnimationFrame(tick)
    })

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseout', onOut)
    }
  }, [])

  return <canvas ref={canvasRef} className="hero__particles" aria-hidden="true" />
}
