'use client'
import { scrollToTop } from '@/lib/scroll'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__copy">© {new Date().getFullYear()} Gandra Tech</div>
      <div className="site-footer__icons">
        <button
          type="button"
          onClick={scrollToTop}
          aria-label="Voltar ao topo"
          className="site-footer__top"
        >
          ↑
        </button>
      </div>
    </footer>
  )
}
