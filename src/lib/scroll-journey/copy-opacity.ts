/** Opacity for the single active copy block — no overlapping panels */
export function copyOpacityForActiveSection(
  sectionProgress: number,
  isHero: boolean,
): number {
  const edge = 0.14

  if (isHero && sectionProgress <= edge) {
    return 1
  }

  if (sectionProgress < edge) {
    return smoothstep(sectionProgress / edge)
  }

  if (sectionProgress > 1 - edge) {
    return smoothstep((1 - sectionProgress) / edge)
  }

  return 1
}

function smoothstep(value: number): number {
  const x = Math.min(1, Math.max(0, value))
  return x * x * (3 - 2 * x)
}
