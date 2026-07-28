/** Production app origin (customer shell) */
const DEFAULT_APP_ORIGIN = 'https://queuegrow-app.com'

/**
 * Override in `.env` for local showcase:
 *   PUBLIC_APP_ORIGIN=http://localhost:5173
 *   PUBLIC_WAITER_ORIGIN=http://localhost:5174/waiter
 */
export const APP_ORIGIN = import.meta.env.PUBLIC_APP_ORIGIN?.replace(/\/$/, '') || DEFAULT_APP_ORIGIN

export const WAITER_ORIGIN =
  import.meta.env.PUBLIC_WAITER_ORIGIN?.replace(/\/$/, '') || `${APP_ORIGIN}/waiter`

/**
 * Live app URLs for iframe mockups.
 * Embed routes (`/embed/*`) give deterministic demo states.
 */
export const appShowcaseUrls = {
  customerDiscover: `${APP_ORIGIN}/`,
  customerJoin: `${APP_ORIGIN}/r/restaurant-narenjestan`,
  customerWaiting: `${APP_ORIGIN}/r/restaurant-narenjestan`,
  waiterManage: `${WAITER_ORIGIN}/login`,
  waiterDesks: `${WAITER_ORIGIN}/login`,
} as const

/** Prefer embed URLs for phone mockups / DualApps showcase */
export const embedShowcaseUrls = {
  customerDiscover: `${APP_ORIGIN}/embed/customer?scene=discover`,
  customerDecide: `${APP_ORIGIN}/embed/customer?scene=decide&restaurant=restaurant-narenjestan`,
  customerJoin: `${APP_ORIGIN}/embed/customer?scene=join&restaurant=restaurant-narenjestan`,
  customerWaiting: `${APP_ORIGIN}/embed/customer?scene=waiting&restaurant=restaurant-narenjestan`,
  waiterManage: `${WAITER_ORIGIN}/embed/waiter?scene=manage`,
  waiterDesks: `${WAITER_ORIGIN}/embed/waiter?scene=desks`,
} as const

export const twaApps = [
  {
    name: 'صف — مهمان',
    packageId: 'com.queuegrow.app',
    url: `${APP_ORIGIN}/`,
  },
  {
    name: 'صف — پرسنل',
    packageId: 'com.queuegrow.app.staff',
    url: `${WAITER_ORIGIN}/`,
  },
] as const
