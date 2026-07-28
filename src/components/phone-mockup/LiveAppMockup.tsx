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
      setScale(Math.min(width / EMBED_VIEWPORT_WIDTH, height / EMBED_VIEWPORT_HEIGHT))
    }

    update()
    const observer = new ResizeObserver(update)
    observer.observe(screen)
    return () => observer.disconnect()
  }, [screenRef])

  return scale
}

/** Unique live scenes — one iframe per URL, kept mounted to avoid flash/reload */
function collectEmbedScenes(sections: ScrollSection[]) {
  const scenes: { url: string; title: string; act: 'customer' | 'waiter' }[] = []
  const seen = new Set<string>()

  for (const section of sections) {
    const url = section.mockupEmbedUrl
    if (!url || seen.has(url)) continue
    seen.add(url)
    scenes.push({
      url,
      title: section.mockupTitle ?? section.label,
      act: section.act === 'waiter' ? 'waiter' : 'customer',
    })
  }

  return scenes
}

/** Phone mockup — persistent live embeds, switch by opacity only */
export function AppShowcaseMockup({
  sections,
  activeIndex,
  sectionProgress = 0,
  actBlend = 0,
  inline = false,
}: AppShowcaseMockupProps) {
  const screenRef = useRef<HTMLDivElement>(null)
  const [deviceVariant] = useState<DeviceMockupVariant>(() => detectDeviceMockup())
  const scale = usePhoneScale(screenRef)
  const [readyUrls, setReadyUrls] = useState<Record<string, boolean>>({})

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

  const embedScenes = useMemo(() => collectEmbedScenes(sections), [sections])

  const activeUrl = visibleSection?.mockupEmbedUrl
  const morphFromUrl = sections[lastCustomerIndex]?.mockupEmbedUrl
  const morphToUrl = sections[firstWaiterIndex]?.mockupEmbedUrl

  const caption =
    visibleSection?.mockupTitle ??
    (act === 'waiter' ? 'اپ پرسنل' : act === 'transition' ? 'مهمان → پرسنل' : 'اپ مهمان')

  const markReady = (url: string) => {
    setReadyUrls((prev) => (prev[url] ? prev : { ...prev, [url]: true }))
  }

  const activeReady = Boolean(activeUrl && readyUrls[activeUrl])

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
        <div
          className={`showcase-mockup__boot showcase-mockup__boot--${act === 'waiter' ? 'waiter' : 'customer'}${activeReady || isActMorph ? ' is-hidden' : ''}`}
          aria-hidden="true"
        />

        <div className="showcase-mockup__layers">
          {embedScenes.map((scene) => {
            let opacity = 0

            if (isActMorph) {
              if (scene.url === morphFromUrl) opacity = 1 - sectionProgress
              else if (scene.url === morphToUrl) opacity = sectionProgress
            } else if (scene.url === activeUrl) {
              opacity = readyUrls[scene.url] ? 1 : 0
            }

            return (
              <iframe
                key={scene.url}
                className={`showcase-mockup__iframe showcase-mockup__iframe--${scene.act}${readyUrls[scene.url] ? ' is-ready' : ''}`}
                src={scene.url}
                title={scene.title}
                loading="eager"
                referrerPolicy="no-referrer"
                tabIndex={-1}
                style={{
                  width: EMBED_VIEWPORT_WIDTH,
                  height: EMBED_VIEWPORT_HEIGHT,
                  transform: `scale(${scale})`,
                  opacity,
                }}
                onLoad={() => markReady(scene.url)}
              />
            )
          })}
        </div>

        <div className="showcase-mockup__shield" aria-hidden="true" />
      </DeviceFrame>

      <figcaption className="showcase-mockup__caption">{caption}</figcaption>
    </figure>
  )
}

/** @deprecated use AppShowcaseMockup */
export const LiveAppMockup = AppShowcaseMockup
