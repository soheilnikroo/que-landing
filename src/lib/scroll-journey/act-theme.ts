/** Interpolate customer (fresh green) ↔ waiter (warm slate + gold) from scroll blend. */

const CUSTOMER = {
  canvas: [245, 248, 246] as const,
  accent: [64, 145, 108] as const,
  primary: [27, 67, 50] as const,
  secondary: [228, 240, 232] as const,
  muted: [95, 109, 102] as const,
  border: [213, 224, 217] as const,
}

const WAITER = {
  canvas: [242, 236, 228] as const,
  accent: [176, 141, 87] as const,
  primary: [46, 52, 64] as const,
  secondary: [232, 224, 212] as const,
  muted: [107, 98, 88] as const,
  border: [216, 206, 192] as const,
}

function lerpChannel(a: number, b: number, t: number): number {
  return Math.round(a + (b - a) * t)
}

function lerpRgb(
  from: readonly [number, number, number],
  to: readonly [number, number, number],
  t: number,
): string {
  return `rgb(${lerpChannel(from[0], to[0], t)} ${lerpChannel(from[1], to[1], t)} ${lerpChannel(from[2], to[2], t)})`
}

export function themeFromActBlend(blend: number): Record<string, string> {
  const t = Math.min(1, Math.max(0, blend))
  return {
    '--act-blend': String(t),
    '--color-canvas': lerpRgb(CUSTOMER.canvas, WAITER.canvas, t),
    '--color-accent': lerpRgb(CUSTOMER.accent, WAITER.accent, t),
    '--color-primary': lerpRgb(CUSTOMER.primary, WAITER.primary, t),
    '--color-secondary': lerpRgb(CUSTOMER.secondary, WAITER.secondary, t),
    '--color-muted': lerpRgb(CUSTOMER.muted, WAITER.muted, t),
    '--color-border': lerpRgb(CUSTOMER.border, WAITER.border, t),
    '--sw-bg': lerpRgb(CUSTOMER.canvas, WAITER.canvas, t),
    '--sw-accent': lerpRgb(CUSTOMER.accent, WAITER.accent, t),
  }
}

export function applyActTheme(blend: number): void {
  const vars = themeFromActBlend(blend)
  const root = document.documentElement
  for (const [key, value] of Object.entries(vars)) {
    root.style.setProperty(key, value)
  }
}

export function clearActTheme(): void {
  const root = document.documentElement
  for (const key of [
    '--act-blend',
    '--color-canvas',
    '--color-accent',
    '--color-primary',
    '--color-secondary',
    '--color-muted',
    '--color-border',
    '--sw-bg',
    '--sw-accent',
  ]) {
    root.style.removeProperty(key)
  }
}
