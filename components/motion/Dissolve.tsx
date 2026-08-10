'use client'
import { useRef, useEffect } from 'react'

type Part = {
  x: number
  y: number
  vx: number
  vy: number
  tx: number
  ty: number
  c: string
}

/**
 * Desmaterialização: no hover, a imagem envolvida é amostrada em ~2600
 * partículas coloridas que se dispersam; ao sair, a mola remonta pixel a
 * pixel e a imagem volta. Só atua com ponteiro fino (mouse).
 */
export default function Dissolve({ children }: { children: React.ReactNode }) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const wrap = wrapRef.current
    const canvas = canvasRef.current
    if (!wrap || !canvas) return
    if (window.matchMedia('(pointer: coarse)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let parts: Part[] | null = null
    let raf = 0
    let mode: 'idle' | 'scatter' | 'return' = 'idle'
    let w = 0
    let h = 0
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    const setImgOpacity = (v: string) => {
      const img = wrap.querySelector('img')
      if (img) img.style.opacity = v
    }

    const sample = () => {
      const img = wrap.querySelector('img') as HTMLImageElement | null
      if (!img || !img.complete || !img.naturalWidth) return false

      const r = wrap.getBoundingClientRect()
      w = Math.round(r.width)
      h = Math.round(r.height)
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      // A imagem usa object-fit: contain — reproduz o letterbox na amostra.
      const iw = img.naturalWidth
      const ih = img.naturalHeight
      const scale = Math.min(w / iw, h / ih)
      const dw = iw * scale
      const dh = ih * scale
      const dx = (w - dw) / 2
      const dy = (h - dh) / 2

      const off = document.createElement('canvas')
      off.width = w
      off.height = h
      const octx = off.getContext('2d')
      if (!octx) return false
      octx.drawImage(img, dx, dy, dw, dh)
      const data = octx.getImageData(0, 0, w, h).data

      const gap = 4
      const pts: Part[] = []
      for (let y = 0; y < h; y += gap) {
        for (let x = 0; x < w; x += gap) {
          const i = (y * w + x) * 4
          if (data[i + 3] > 128) {
            pts.push({ tx: x, ty: y, x, y, vx: 0, vy: 0, c: `${data[i]},${data[i + 1]},${data[i + 2]}` })
          }
        }
      }
      // Corta o excesso mantendo a distribuição.
      if (pts.length > 2600) {
        const keep = 2600 / pts.length
        parts = pts.filter(() => Math.random() < keep)
      } else {
        parts = pts
      }
      return parts.length > 0
    }

    const tick = () => {
      if (!parts) return
      ctx.clearRect(0, 0, w, h)
      let settled = true
      for (const p of parts) {
        if (mode === 'return') {
          p.vx += (p.tx - p.x) * 0.02
          p.vy += (p.ty - p.y) * 0.02
          if (Math.abs(p.tx - p.x) + Math.abs(p.ty - p.y) > 1.5) settled = false
        }
        p.vx *= 0.94
        p.vy *= 0.94
        p.x += p.vx
        p.y += p.vy
        ctx.fillStyle = `rgba(${p.c},0.9)`
        ctx.fillRect(p.x, p.y, 2, 2)
      }
      if (mode === 'return' && settled) {
        mode = 'idle'
        setImgOpacity('')
        ctx.clearRect(0, 0, w, h)
        return
      }
      raf = requestAnimationFrame(tick)
    }

    const onEnter = () => {
      if (!parts && !sample()) return
      setImgOpacity('0')
      mode = 'scatter'
      for (const p of parts!) {
        const a = Math.random() * Math.PI * 2
        const s = 1 + Math.random() * 3.5
        p.vx = Math.cos(a) * s
        p.vy = Math.sin(a) * s - 1.2 // deriva leve para cima, como poeira
      }
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(tick)
    }

    const onLeave = () => {
      if (!parts) return
      mode = 'return'
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(tick)
    }

    wrap.addEventListener('mouseenter', onEnter)
    wrap.addEventListener('mouseleave', onLeave)
    return () => {
      cancelAnimationFrame(raf)
      wrap.removeEventListener('mouseenter', onEnter)
      wrap.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  return (
    <div ref={wrapRef} className="dissolve">
      {children}
      <canvas ref={canvasRef} className="dissolve__canvas" aria-hidden="true" />
    </div>
  )
}
