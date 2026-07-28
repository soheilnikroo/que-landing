import { useEffect, useMemo, useRef, useState, type CSSProperties, type RefObject } from 'react'

import type { ScrollAct, ScrollSection } from '@/content/scroll-sections'
import { detectDeviceMockup, type DeviceMockupVariant } from '@/lib/device/detect-device'

import { DeviceFrame } from './DeviceFrame'
import './live-app-mockup.css'

const EMBED_VIEWPORT_WIDTH = 390
const EMBED_VIEWPORT_HEIGHT = 780

type AppShowcaseMockupProps = {
  sections: ScrollSection[]
  activeIndex: number
  sectionProgress?: number
  actBlend?: number
  inline?: boolean
  /** Use poster images only — no live iframes (avoids skeleton flash while embeds load). */
  staticOnly?: boolean
}

function resolveAct(sections: ScrollSection[], index: number): ScrollAct {
  const section = sections[index]
  if (!section) return 'customer'
  if (section.act === 'transition') return 'transition'
  return section.act === 'waiter' ? 'waiter' : 'customer'
}

function usePhoneScale(screenRef: RefObject<HTMLDivElement | null>) {
  const [scale, setScale] = useState(0.5)

  useEffect(() => {
    const screen = screenRef.current
    if (!screen) return

    const update = () => {
      const width = screen.clientWidth
      const height = screen.clientHeight
      if (width <= 0 || height <= 0) return
      // Fit the phone screen like object-fit: contain (no crop, no overflow)
      setScale(Math.min(width / EMBED_VIEWPORT_WIDTH, height / EMBED_VIEWPORT_HEIGHT))
    }

    update()
    const observer = new ResizeObserver(update)
    observer.observe(screen)
    return () => observer.disconnect()
  }, [screenRef])

  return scale
}

function MockupScreen({
  section,
  sectionAct,
  preferLive,
  isActive,
  scale,
}: {
  section: ScrollSection
  sectionAct: 'customer' | 'waiter'
  preferLive: boolean
  isActive: boolean
  scale: number
}) {
  const [liveFailed, setLiveFailed] = useState(false)
  const embedUrl = section.mockupEmbedUrl
  const showLive = preferLive && Boolean(embedUrl) && !liveFailed

  return (
    <>
      <img
        src={section.mockupImage}
        alt=""
        draggable={false}
        decoding="sync"
        loading="eager"
        fetchPriority="high"
        className={`showcase-mockup__screen showcase-mockup__screen--${sectionAct}${showLive ? ' showcase-mockup__screen--poster' : ''}`}
      />
      {showLive ? (
        <iframe
          className={`showcase-mockup__iframe showcase-mockup__iframe--${sectionAct}`}
          src={embedUrl}
          title={section.mockupTitle ?? section.label}
          loading={isActive ? 'eager' : 'lazy'}
          referrerPolicy="no-referrer"
          tabIndex={-1}
          style={{
            width: EMBED_VIEWPORT_WIDTH,
            height: EMBED_VIEWPORT_HEIGHT,
            transform: `scale(${scale})`,
          }}
          onError={() => setLiveFailed(true)}
        />
      ) : null}
    </>
  )
}

/** Showcase mockup — live embed iframes with poster fallback */
export function AppShowcaseMockup({
  sections,
  activeIndex,
  sectionProgress = 0,
  actBlend = 0,
  inline = false,
  staticOnly = false,
}: AppShowcaseMockupProps) {
  const scrollInnerRef = useRef<HTMLDivElement>(null)
  const screenRef = useRef<HTMLDivElement>(null)
  const [deviceVariant] = useState<DeviceMockupVariant>(() => detectDeviceMockup())
  const scale = usePhoneScale(screenRef)

  const displayIndex = activeIndex >= 0 ? activeIndex : 0
  const visibleSection = sections[displayIndex]
  const act = resolveAct(sections, displayIndex)

  const handoffIndex = useMemo(
    () => sections.findIndex((s) => s.act === 'transition'),
    [sections],
  )

  const lastCustomerIndex = handoffIndex > 0 ? handoffIndex - 1 : 0
  const firstWaiterIndex = handoffIndex >= 0 ? handoffIndex + 1 : sections.length - 1

  const isActMorph = handoffIndex >= 0 && displayIndex === handoffIndex

  const liveWindow = useMemo(() => {
    if (staticOnly) return new Set<number>()
    const indexes = new Set<number>()
    indexes.add(displayIndex)
    return indexes
  }, [displayIndex, staticOnly])

  useEffect(() => {
    for (const section of sections) {
      const img = new Image()
      img.src = section.mockupImage
    }
  }, [sections])

  const caption =
    visibleSection?.mockupTitle ??
    (act === 'waiter' ? 'اپ پرسنل' : act === 'transition' ? 'مهمان → پرسنل' : 'اپ مهمان')

  return (
    <figure
      className={`showcase-mockup${inline ? ' showcase-mockup--inline' : ''}${isActMorph ? ' showcase-mockup--morphing' : ''}`}
      data-act={act}
      data-device={deviceVariant}
      style={{ '--act-blend': actBlend } as CSSProperties}
      aria-hidden="true"
    >
      <div className={`showcase-mockup__badge${act === 'transition' ? ' showcase-mockup__badge--hidden' : ''}`}>
        {act === 'waiter' ? (
          <>
            <span className="showcase-mockup__dot showcase-mockup__dot--waiter" />
            اپ پرسنل
          </>
        ) : (
          <>
            <span className="showcase-mockup__dot showcase-mockup__dot--customer" />
            اپ مهمان
          </>
        )}
      </div>

      <DeviceFrame variant={deviceVariant} act={act} screenRef={screenRef}>
        {isActMorph ? (
          <div className="showcase-mockup__morph">
            <img
              src={sections[lastCustomerIndex]?.mockupImage}
              alt=""
              draggable={false}
              decoding="sync"
              className="showcase-mockup__screen showcase-mockup__morph-from"
              style={{ opacity: 1 - sectionProgress }}
            />
            <img
              src={sections[firstWaiterIndex]?.mockupImage}
              alt=""
              draggable={false}
              decoding="sync"
              className="showcase-mockup__screen showcase-mockup__morph-to"
              style={{ opacity: sectionProgress }}
            />
          </div>
        ) : (
          <div ref={scrollInnerRef} className="showcase-mockup__scroll-inner">
            {(() => {
              const section = sections[displayIndex]
              if (!section) return null
              const sectionAct = section.act === 'waiter' ? 'waiter' : 'customer'
              return (
                <div key={section.id} className="showcase-mockup__slide is-active">
                  <MockupScreen
                    section={section}
                    sectionAct={sectionAct}
                    preferLive={liveWindow.has(displayIndex)}
                    isActive
                    scale={scale}
                  />
                </div>
              )
            })()}
          </div>
        )}
        <div className="showcase-mockup__shield" aria-hidden="true" />
      </DeviceFrame>

      <figcaption className="showcase-mockup__caption">{caption}</figcaption>
    </figure>
  )
}

/** @deprecated use AppShowcaseMockup */
export const LiveAppMockup = AppShowcaseMockup
