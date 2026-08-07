/** Production app origin (customer shell) — real "start the app" links point here. */
const DEFAULT_APP_ORIGIN = 'https://queuegrow-app.com'

/**
 * Override in `.env` for local dev:
 *   PUBLIC_APP_ORIGIN=http://localhost:5173
 *   PUBLIC_WAITER_ORIGIN=http://localhost:5174/waiter
 */
export const APP_ORIGIN = import.meta.env.PUBLIC_APP_ORIGIN?.replace(/\/$/, '') || DEFAULT_APP_ORIGIN

export const WAITER_ORIGIN =
  import.meta.env.PUBLIC_WAITER_ORIGIN?.replace(/\/$/, '') || `${APP_ORIGIN}/waiter`

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

/**
 * Static build of que-app, copied into `public/app-showcase/` at build time by
 * `scripts/build-app-showcase.mjs` (from the sibling `que-app` checkout). The
 * phone-mockup showcase iframes this local copy instead of the live production
 * app — same origin as the landing page, so it loads instantly and works even
 * if the production app is slow, down, or offline.
 *
 * `?scene=` seeds a deterministic demo state on the app's own root route (see
 * `showcase-mode.ts` in que-app) — there's no separate `/showcase/*` path
 * because a static file host only has one real entry point (`index.html`) per
 * folder; nested route paths would need a server rewrite we can't rely on.
 */
const SHOWCASE_CUSTOMER_BASE = '/app-showcase/customer/'
const SHOWCASE_WAITER_BASE = '/app-showcase/waiter/'
const SHOWCASE_RESTAURANT_ID = 'restaurant-narenjestan'

export const showcaseSceneUrls = {
  customerDiscover: `${SHOWCASE_CUSTOMER_BASE}?scene=discover`,
  customerDecide: `${SHOWCASE_CUSTOMER_BASE}?scene=decide&restaurant=${SHOWCASE_RESTAURANT_ID}`,
  customerJoin: `${SHOWCASE_CUSTOMER_BASE}?scene=join&restaurant=${SHOWCASE_RESTAURANT_ID}`,
  customerWaiting: `${SHOWCASE_CUSTOMER_BASE}?scene=waiting&restaurant=${SHOWCASE_RESTAURANT_ID}`,
  waiterManage: `${SHOWCASE_WAITER_BASE}?scene=manage`,
  waiterDesks: `${SHOWCASE_WAITER_BASE}?scene=desks`,
} as const
