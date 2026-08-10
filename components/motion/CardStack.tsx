'use client'
import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Cartas empilhadas: as seções marcadas com .stack-card ficam grudadas no
 * topo (CSS) enquanto o conteúdo seguinte desliza por cima; aqui, a seção
 * coberta encolhe e escurece, como uma carta indo para o fundo do monte.
 * Também garante a ordem de empilhamento (z-index) entre as seções.
 */
export default function CardStack() {
  useEffect(() => {
    if (!window.matchMedia('(min-width: 1024px)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    // z-index crescente: o que vem depois sempre cobre o que está preso.
    const all = document.querySelectorAll<HTMLElement>('main > section')
    all.forEach((s, i) => {
      s.style.position = s.classList.contains('stack-card') ? '' : 'relative'
      s.style.zIndex = String(i + 1)
    })

    const cards = gsap.utils.toArray<HTMLElement>('.stack-card')
    const tweens = cards.map((card) => {
      // Se a seção tem uma camada [data-stack-inner], o encolhimento acontece
      // nela e não na seção — assim o fundo da seção segue full-bleed e as
      // frestas laterais não revelam o que está atrás (hero preto sobre
      // página clara).
      const target = card.querySelector<HTMLElement>('[data-stack-inner]') ?? card
      return gsap.fromTo(
        target,
        { scale: 1, filter: 'brightness(1)' },
        {
          scale: 0.93,
          filter: 'brightness(0.5)',
          transformOrigin: 'center top',
          ease: 'none',
          scrollTrigger: {
            trigger: card,
            start: 'top top',
            end: '+=90%',
            scrub: true,
          },
        }
      )
    })

    // O sticky dura até o fim do <main>: sem esta guarda, a carta coberta
    // volta a aparecer nas frestas entre as seções seguintes. Quando a
    // próxima seção "inteira" (marquees finos não cobrem) a esconde por
    // completo, ela se aposenta.
    const watchers: ScrollTrigger[] = []
    cards.forEach((card) => {
      let cover = card.nextElementSibling
      while (cover && cover.classList.contains('marquee')) {
        cover = cover.nextElementSibling
      }
      if (!cover) return
      watchers.push(
        ScrollTrigger.create({
          trigger: cover,
          start: 'top top',
          onEnter: () => {
            card.style.visibility = 'hidden'
          },
          onLeaveBack: () => {
            card.style.visibility = ''
          },
        })
      )
    })

    return () => {
      tweens.forEach((t) => {
        t.scrollTrigger?.kill()
        t.kill()
      })
      watchers.forEach((w) => w.kill())
      all.forEach((s) => {
        s.style.position = ''
        s.style.zIndex = ''
      })
    }
  }, [])

  return null
}
