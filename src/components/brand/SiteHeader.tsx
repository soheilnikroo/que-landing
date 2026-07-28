import { APP_ORIGIN, WAITER_ORIGIN } from '@/content/app-urls'
import { BRAND_LOGO_SRC } from '@/content/brand'

import './site-header.css'

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
        <a href="#faq">سوالات</a>
        <a href={`${WAITER_ORIGIN}/`}>پنل پرسنل</a>
      </nav>

      <div className="site-header__actions">
        <a className="site-btn site-btn--ghost" href={`${WAITER_ORIGIN}/`}>ورود پرسنل</a>
        <a className="site-btn site-btn--primary" href={`${APP_ORIGIN}/`}>
          شروع اپ مهمان
        </a>
      </div>
    </header>
  )
}
