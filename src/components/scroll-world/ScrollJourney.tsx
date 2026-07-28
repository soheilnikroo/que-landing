import { useEffect, useState, type CSSProperties } from 'react'

import { SiteHeader } from '@/components/brand/SiteHeader'
import { AppShowcaseMockup } from '@/components/phone-mockup/LiveAppMockup'
import { scrollSections, type ScrollAct } from '@/content/scroll-sections'
import {
  buildJourneyLayout,
  actBlendForSection,
  resolveScrollState,
} from '@/lib/scroll-journey/layout'
import { applyActTheme, clearActTheme } from '@/lib/scroll-journey/act-theme'
import { copyOpacityForActiveSection } from '@/lib/scroll-journey/copy-opacity'

import './journey.css'

function pad(n: number) {
  return String(n).padStart(2, '0')
}

export function ScrollJourney() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [sectionProgress, setSectionProgress] = useState(0)
  const [journeyComplete, setJourneyComplete] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [layout, setLayout] = useState(() => buildJourneyLayout(scrollSections))

  const section = scrollSections[activeIndex]
  const act: ScrollAct = section?.act ?? 'customer'
  const actBlend = actBlendForSection(scrollSections, activeIndex, sectionProgress)
  const copyOpacity = copyOpacityForActiveSection(sectionProgress, activeIndex === 0)

  useEffect(() => {
    const placeholder = document.getElementById('journey-placeholder')
    if (placeholder) {
      placeholder.hidden = true
      placeholder.removeAttribute('aria-busy')
    }

    const relayout = () => setLayout(buildJourneyLayout(scrollSections))

    const onScroll = () => {
      const state = resolveScrollState(window.scrollY, layout)
      setActiveIndex(state.activeIndex)
      setSectionProgress(state.sectionProgress)
      setJourneyComplete(state.journeyComplete)
      setScrollProgress(layout.endY > 0 ? Math.min(1, window.scrollY / layout.endY) : 0)

      const current = scrollSections[state.activeIndex]
      const scrollAct = current?.act ?? 'customer'
      const blend = actBlendForSection(scrollSections, state.activeIndex, state.sectionProgress)
      document.documentElement.dataset.scrollAct = scrollAct
      applyActTheme(blend)

      if (state.journeyComplete) {
        document.documentElement.dataset.journeyComplete = 'true'
      } else {
        delete document.documentElement.dataset.journeyComplete
      }
    }

    const onResize = () => {
      relayout()
      onScroll()
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)
    onScroll()

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      delete document.documentElement.dataset.journeyComplete
      delete document.documentElement.dataset.scrollAct
      clearActTheme()
    }
  }, [layout])

  const jumpTo = (index: number) => {
    const segment = layout.segments[index]
    if (!segment) return
    const target = segment.start + segment.width * 0.45
    window.scrollTo({ top: target, behavior: 'smooth' })
  }

  return (
    <>
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {section.title}
      </div>
      <div
        className="journey-stage"
        data-complete={journeyComplete}
        data-act={act}
        style={{ '--act-blend': actBlend } as CSSProperties}
      >
        <div className="journey-act-veil" aria-hidden="true" />

        <div className="journey-bg" aria-hidden="true">
          {scrollSections.map((item, index) => (
            <img
              key={item.id}
              src={item.still}
              alt=""
              width={1200}
              height={800}
              decoding="async"
              loading={index === 0 ? 'eager' : 'lazy'}
              fetchPriority={index === 0 ? 'high' : 'low'}
              className={`journey-bg__layer${index === activeIndex ? ' is-active' : ''}`}
            />
          ))}
          <div className="journey-bg__wash" />
        </div>

        <SiteHeader />

        <div className="journey-body">
          <div className="journey-grid">
            <div className="journey-mockup">
              <AppShowcaseMockup
                sections={scrollSections}
                activeIndex={activeIndex}
                sectionProgress={sectionProgress}
                actBlend={actBlend}
                inline
                staticOnly
              />
            </div>

            <div className="journey-copy-stack">
              <article
                key={section.id}
                className="journey-copy"
                style={{ opacity: copyOpacity }}
              >
                <span className="journey-copy__num">
                  {pad(activeIndex + 1)} / {pad(scrollSections.length)}
                </span>
                {section.eyebrow ? (
                  <span className="journey-copy__eyebrow">{section.eyebrow}</span>
                ) : null}
                <h2 className="journey-copy__title">{section.title}</h2>
                <p className="journey-copy__body">{section.body}</p>
                {section.tags?.length ? (
                  <ul className="journey-copy__tags">
                    {section.tags.map((tag) => (
                      <li key={tag}>{tag}</li>
                    ))}
                  </ul>
                ) : null}
                {section.cta ? (
                  <div className="journey-copy__cta">
                    <a className="journey-btn journey-btn--primary" href={section.cta.primary.href}>
                      {section.cta.primary.label}
                    </a>
                    {section.cta.secondary ? (
                      <a className="journey-btn journey-btn--ghost" href={section.cta.secondary.href}>
                        {section.cta.secondary.label}
                      </a>
                    ) : null}
                  </div>
                ) : null}
              </article>
            </div>
          </div>
        </div>

        <nav className="journey-rail" aria-label="بخش‌های صفحه">
          {scrollSections.map((item, index) => {
            const railAct =
              item.act === 'waiter' ? 'waiter' : item.act === 'transition' ? 'transition' : 'customer'
            return (
              <span key={item.id} className="journey-rail__item">
                <button
                  type="button"
                  className={`journey-rail__dot journey-rail__dot--${railAct}${index === activeIndex ? ' is-active' : ''}`}
                  aria-label={item.label}
                  aria-current={index === activeIndex ? 'step' : undefined}
                  onClick={() => jumpTo(index)}
                >
                  <span className="journey-rail__label">{item.label}</span>
                </button>
              </span>
            )
          })}
        </nav>

        <div className="journey-hint" aria-hidden={journeyComplete}>
          <span>اسکرول کنید</span>
          <i />
        </div>

        <div className="journey-progress" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(scrollProgress * 100)} aria-label="پیشرفت اسکرول">
          <span style={{ transform: `scaleX(${scrollProgress})` }} />
        </div>
      </div>

      <div className="journey-spacer" style={{ height: layout.totalHeight }} aria-hidden="true" />
    </>
  )
}
