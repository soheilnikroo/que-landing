import { APP_ORIGIN, WAITER_ORIGIN } from '@/content/app-urls'
import { BRAND_LOGO_SRC } from '@/content/brand'

import './site-header.css'

function ThemeToggle() {
  const toggleTheme = () => {
    const root = document.documentElement
    const current = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light'
    const next = current === 'dark' ? 'light' : 'dark'
    root.setAttribute('data-theme', next)
    try {
      localStorage.setItem('q-theme', next)
    } catch {
      // Storage may be unavailable (private mode) — theme still applies for this visit.
    }
  }

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label="جابه‌جایی حالت روشن و تیره"
    >
      <svg
        className="theme-toggle__icon theme-toggle__icon--sun"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="4.2" />
        <path d="M12 2.5v2.4M12 19.1v2.4M4.9 4.9l1.7 1.7M17.4 17.4l1.7 1.7M2.5 12h2.4M19.1 12h2.4M4.9 19.1l1.7-1.7M17.4 6.6l1.7-1.7" />
      </svg>
      <svg
        className="theme-toggle__icon theme-toggle__icon--moon"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M20.4 14.7A8.5 8.5 0 0 1 9.3 3.6a.75.75 0 0 0-.9-.98A9.5 9.5 0 1 0 21.4 15.6a.75.75 0 0 0-1-.9Z" />
      </svg>
    </button>
  )
}

export function SiteHeader() {
  return (
    <header className="site-header">
      <a className="site-brand" href="#top" aria-label="صف — بازگشت به بالای صفحه">
        <img
          className="site-brand__logo"
          src={BRAND_LOGO_SRC}
          alt=""
          width={36}
          height={36}
          decoding="async"
        />
        <span className="site-brand__stack">
          <span className="site-brand__name">صف</span>
          <span className="site-brand__tag">مدیریت صف رستوران</span>
        </span>
      </a>

      <nav className="site-nav" aria-label="ناوبری اصلی">
        <a href="#features">امکانات</a>
        <a href="#apps">شروع کنید</a>
        <a href="#faq">سوالات</a>
        <a href={`${WAITER_ORIGIN}/`}>پنل پرسنل</a>
      </nav>

      <div className="site-header__actions">
        <ThemeToggle />
        <a className="site-btn site-btn--ghost" href={`${WAITER_ORIGIN}/`}>ورود پرسنل</a>
        <a className="site-btn site-btn--primary" href={`${APP_ORIGIN}/`}>
          شروع اپ مهمان
        </a>
      </div>
    </header>
  )
}
