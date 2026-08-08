'use client'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    const xDot = gsap.quickTo(dot, 'x', { duration: 0.08, ease: 'power3' })
    const yDot = gsap.quickTo(dot, 'y', { duration: 0.08, ease: 'power3' })
    const xRing = gsap.quickTo(ring, 'x', { duration: 0.38, ease: 'power3' })
    const yRing = gsap.quickTo(ring, 'y', { duration: 0.38, ease: 'power3' })

    const onMove = (e: MouseEvent) => {
      xDot(e.clientX)
      yDot(e.clientY)
      xRing(e.clientX)
      yRing(e.clientY)
    }

    const grow = () => gsap.to(ring, { scale: 2.6, duration: 0.4, ease: 'power2.out' })
    const shrink = () => gsap.to(ring, { scale: 1, duration: 0.4, ease: 'power2.out' })
    const growBig = () => gsap.to(ring, { scale: 4.5, duration: 0.45, ease: 'power2.out' })

    window.addEventListener('mousemove', onMove)

    // Rastro: ecos que nascem do movimento e morrem em fade. Herdam o
    // mix-blend difference do cursor, então invertem cor em qualquer fundo.
    let lastSpawn = 0
    const onMoveEcho = (e: MouseEvent) => {
      const now = performance.now()
      if (now - lastSpawn < 80) return
      lastSpawn = now
      if (document.querySelectorAll('.c-echo').length > 16) return
      const echo = document.createElement('div')
      echo.className = 'c-echo'
      document.body.appendChild(echo)
      gsap.fromTo(
        echo,
        { x: e.clientX, y: e.clientY, scale: 1, opacity: 0.55 },
        {
          scale: 0,
          opacity: 0,
          duration: 0.8,
          ease: 'power2.out',
          onComplete: () => echo.remove(),
        }
      )
    }
    window.addEventListener('mousemove', onMoveEcho)

    const bindHover = () => {
      document.querySelectorAll('a, button').forEach((el) => {
        if (el.closest('.work-item')) return
        el.addEventListener('mouseenter', grow)
        el.addEventListener('mouseleave', shrink)
      })
      document.querySelectorAll('.work-item').forEach((el) => {
        el.addEventListener('mouseenter', growBig)
        el.addEventListener('mouseleave', shrink)
      })
    }

    bindHover()

    // Re-bind on route changes (SPA nav adds new elements)
    const observer = new MutationObserver(bindHover)
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mousemove', onMoveEcho)
      observer.disconnect()
    }
  }, [])

  return (
    <>
      <div ref={dotRef} className="c-dot" />
      <div ref={ringRef} className="c-ring" />
    </>
  )
}
