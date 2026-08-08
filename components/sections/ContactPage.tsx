'use client'
import WordReveal from '@/components/motion/WordReveal'
import FadeIn from '@/components/motion/FadeIn'
import PageTransition from '@/components/motion/PageTransition'
import { activeSocialLinks, contactEmail, contactNotes } from '@/lib/site'

export default function ContactPage() {
  return (
    <PageTransition>
      {/* Hero */}
      <section className="cp-hero">
        <div className="container">
          <FadeIn as="div" className="cp-hero__label" trigger="load" y={12} duration={0.5}>
            VAMOS CONVERSAR
          </FadeIn>
          <WordReveal
            as="h1"
            className="cp-hero__title"
            trigger="load"
            y={44}
            blur={12}
            stagger={0.07}
            duration={0.95}
          >
            Trabalho bom começa com uma conversa honesta.
          </WordReveal>
          <FadeIn as="p" className="cp-hero__sub" trigger="load" delay={0.3} y={20} duration={0.7}>
            Conta o que você tem em mente. A gente responde com atenção — sem roteiro de vendas,
            sem promessa vazia.
          </FadeIn>
          <FadeIn trigger="load" delay={0.5} y={16} duration={0.7}>
            <a href={`mailto:${contactEmail}`} className="cp-hero__email">
              {contactEmail} ↗
            </a>
          </FadeIn>
        </div>
      </section>

      {/* Info grid */}
      <section className="cp-grid-section">
        <div className="container">
          <div className="cp-grid">

            <div className="cp-grid__col cp-grid__col--main">
              <div className="cp-grid__label">CONTATO DIRETO</div>
              <a href={`mailto:${contactEmail}`} className="cp-grid__email-link">
                {contactEmail}
              </a>
              {activeSocialLinks.length > 0 && (
                <>
                  <div className="cp-grid__label" style={{ marginTop: 40 }}>REDES</div>
                  <div className="cp-grid__links">
                    {activeSocialLinks.map((item) => (
                      <a
                        key={item.label}
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="cp-grid__link"
                      >
                        <span className="cp-grid__link-label">{item.label}</span>
                        <span className="cp-grid__link-value">{item.handle} ↗</span>
                      </a>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="cp-grid__col">
              <div className="cp-grid__label">NOTAS</div>
              <div className="cp-grid__notes">
                {contactNotes.map((n) => (
                  <p key={n}>{n}</p>
                ))}
              </div>
            </div>

            <div className="cp-grid__col">
              <div className="cp-grid__label">LOCALIZAÇÃO</div>
              <p className="cp-grid__location">
                Teresina, Piauí<br />
                Brasil — GMT−3
              </p>
              <div className="cp-grid__label" style={{ marginTop: 40 }}>DISPONIBILIDADE</div>
              <p className="cp-grid__location">
                Aceitando projetos<br />
                para 2026
              </p>
            </div>

          </div>
        </div>
      </section>
    </PageTransition>
  )
}
