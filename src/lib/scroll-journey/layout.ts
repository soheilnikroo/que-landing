import type { ScrollSection } from '@/content/scroll-sections'

export type JourneySegment = {
  index: number
  start: number
  end: number
  width: number
}

export type JourneyLayout = {
  segments: JourneySegment[]
  totalHeight: number
  endY: number
}

const DEFAULT_DIVE = 1.35

export function getViewportHeight(): number {
  if (typeof window === 'undefined') return 800
  return window.innerHeight || 800
}

export function buildJourneyLayout(sections: ScrollSection[]): JourneyLayout {
  const vh = getViewportHeight()
  let offset = 0
  const segments: JourneySegment[] = sections.map((section, index) => {
    const width = (section.scroll ?? DEFAULT_DIVE) * vh
    const start = offset
    offset += width
    return { index, start, end: offset, width }
  })

  return { segments, totalHeight: offset, endY: offset }
}

export function clamp(value: number, min = 0, max = 1): number {
  return Math.min(max, Math.max(min, value))
}

export function smoothstep(value: number): number {
  const x = clamp(value)
  return x * x * (3 - 2 * x)
}

export function resolveScrollState(
  scrollY: number,
  layout: JourneyLayout,
): { activeIndex: number; sectionProgress: number; journeyComplete: boolean } {
  const { segments, endY } = layout
  const vh = getViewportHeight()
  const journeyComplete = scrollY >= endY - vh * 0.35

  if (scrollY >= endY) {
    return {
      activeIndex: segments.length - 1,
      sectionProgress: 1,
      journeyComplete: true,
    }
  }

  for (const segment of segments) {
    if (scrollY >= segment.start && scrollY < segment.end) {
      return {
        activeIndex: segment.index,
        sectionProgress: clamp((scrollY - segment.start) / segment.width),
        journeyComplete,
      }
    }
  }

  return { activeIndex: 0, sectionProgress: 0, journeyComplete: false }
}

/** 0 = customer, 1 = waiter — drives the act-shift animation */
export function actBlendForSection(
  sections: ScrollSection[],
  activeIndex: number,
  sectionProgress: number,
): number {
  const handoffIndex = sections.findIndex((s) => s.act === 'transition')
  if (handoffIndex < 0) return activeIndex > 0 ? 1 : 0

  if (activeIndex < handoffIndex) return 0
  if (activeIndex > handoffIndex) return 1

  return smoothstep(sectionProgress)
}
