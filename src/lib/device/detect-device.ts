export type DeviceMockupVariant = 'android-phone' | 'iphone' | 'android-tablet' | 'ipad'

function isTabletViewport(): boolean {
  if (typeof window === 'undefined') return false
  const minSide = Math.min(window.screen.width, window.screen.height)
  const coarse = window.matchMedia('(hover: none) and (pointer: coarse)').matches
  return minSide >= 600 && coarse
}

/** Default is Android phone — matches most visitors and brand TWA focus. */
export function detectDeviceMockup(): DeviceMockupVariant {
  if (typeof navigator === 'undefined') return 'android-phone'

  const ua = navigator.userAgent
  const isIOS =
    /iPad|iPhone|iPod/i.test(ua) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  const isAndroid = /Android/i.test(ua)
  const isIPad = /iPad/i.test(ua) || (isIOS && isTabletViewport())
  const isAndroidTablet = isAndroid && (!/Mobile/i.test(ua) || isTabletViewport())

  if (isIPad) return 'ipad'
  if (isIOS) return 'iphone'
  if (isAndroidTablet) return 'android-tablet'
  return 'android-phone'
}
