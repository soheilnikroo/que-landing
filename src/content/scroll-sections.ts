import { APP_ORIGIN, showcaseSceneUrls, WAITER_ORIGIN } from '@/content/app-urls'

import customerBusy from '@/assets/mockups/customer-busy.svg?url'
import customerDiscover from '@/assets/mockups/customer-discover.svg?url'
import customerHome from '@/assets/mockups/customer-home.svg?url'
import customerJoin from '@/assets/mockups/customer-join.svg?url'
import customerWaiting from '@/assets/mockups/customer-waiting.svg?url'
import waiterCall from '@/assets/mockups/waiter-call.svg?url'
import waiterDesks from '@/assets/mockups/waiter-desks.svg?url'
import waiterQueue from '@/assets/mockups/waiter-queue.svg?url'

export type ScrollAct = 'customer' | 'waiter' | 'transition'

export type ScrollSectionCta = {
  primary: { label: string; href: string }
  secondary?: { label: string; href: string }
}

export type ScrollSection = {
  id: string
  label: string
  act: ScrollAct
  still: string
  clip?: string | null
  accent: string
  scroll?: number
  linger?: number
  eyebrow: string
  title: string
  body: string
  tags: string[]
  cta?: ScrollSectionCta
  /** Bundled poster image — always shown in mockup */
  mockupImage: string
  /** Live app embed (optional) — falls back to poster if unavailable */
  mockupEmbedUrl?: string
  mockupTitle?: string
}

const showcase = showcaseSceneUrls

/** اپ مهمان — همه قابلیت‌ها به زبان ساده */
const customerSections: ScrollSection[] = [
  {
    id: 'hero',
    label: 'شروع',
    act: 'customer',
    still: '/assets/scene-01.svg',
    accent: '#40916c',
    scroll: 1.7,
    eyebrow: 'برای مهمان‌ها',
    title: 'دیگر لازم نیست جلوی رستوران بایستید',
    body: 'با صف از گوشی خود نوبت بگیرید، جای خود را در صف ببینید، و وقتی نوبتتان شد خبر بگیرید.',
    tags: ['رایگان', 'بدون نصب', 'روی گوشی'],
    mockupImage: customerHome,
    mockupEmbedUrl: showcase.customerDiscover,
    mockupTitle: 'اپ مهمان',
  },
  {
    id: 'discover',
    label: 'جستجو',
    act: 'customer',
    still: '/assets/scene-02.svg',
    accent: '#52b788',
    scroll: 1.45,
    eyebrow: 'پیدا کردن رستوران',
    title: 'رستوران مورد نظرتان را پیدا کنید',
    body: 'نام رستوران را جستجو کنید یا از روی نقشه انتخاب کنید. قبل از رفتن، ببینید کجا شلوغ است.',
    tags: ['جستجو', 'نقشه', 'QR'],
    mockupImage: customerDiscover,
    mockupEmbedUrl: showcase.customerDiscover,
    mockupTitle: 'جستجوی رستوران',
  },
  {
    id: 'busy',
    label: 'شلوغی',
    act: 'customer',
    still: '/assets/scene-02.svg',
    accent: '#2d6a4f',
    scroll: 1.4,
    eyebrow: 'قبل از پیوستن',
    title: 'اول ببینید چقدر صف است',
    body: 'چند نفر در صف هستند و تقریباً چقدر باید صبر کنید — بعد راحت تصمیم بگیرید.',
    tags: ['شفاف', 'بدون تماس', 'سریع'],
    mockupImage: customerBusy,
    mockupEmbedUrl: showcase.customerDecide,
    mockupTitle: 'وضعیت صف',
  },
  {
    id: 'join',
    label: 'پیوستن',
    act: 'customer',
    still: '/assets/scene-03.svg',
    accent: '#40916c',
    scroll: 1.4,
    eyebrow: 'چند ثانیه',
    title: 'به صف بپیوندید، بدون حرف زدن با میزبان',
    body: 'تعداد نفرات را انتخاب کنید و تأیید کنید. جای شما در صف ثبت می‌شود.',
    tags: ['ساده', 'چند کلیک', 'بدون تماس'],
    mockupImage: customerJoin,
    mockupEmbedUrl: showcase.customerJoin,
    mockupTitle: 'پیوستن به صف',
  },
  {
    id: 'waiting',
    label: 'صف زنده',
    act: 'customer',
    still: '/assets/scene-04.svg',
    accent: '#40916c',
    scroll: 1.5,
    eyebrow: 'صف زنده',
    title: 'ببینید چند نفر جلوتر از شماست',
    body: 'شماره جای شما در صف و زمان تقریبی انتظار همیشه روی گوشی شماست.',
    tags: ['لحظه‌ای', 'شماره صف', 'زمان انتظار'],
    mockupImage: customerWaiting,
    mockupEmbedUrl: showcase.customerWaiting,
    mockupTitle: 'جای شما در صف',
  },
  {
    id: 'notify',
    label: 'اعلان',
    act: 'customer',
    still: '/assets/scene-04.svg',
    accent: '#52b788',
    scroll: 1.4,
    eyebrow: 'وقتی نوبتت شد',
    title: 'برو بیرون قدم بزن — ما خبرت می‌کنیم',
    body: 'وقتی نوبت شما نزدیک شد، روی گوشی اعلان می‌گیرید. لازم نیست جلوی در بمانید.',
    tags: ['اعلان', 'آزاد باشید', 'راحت'],
    mockupImage: customerWaiting,
    mockupEmbedUrl: showcase.customerWaiting,
    mockupTitle: 'اعلان نوبت',
  },
]

const handoffSection: ScrollSection = {
  id: 'handoff',
  label: 'تغییر',
  act: 'transition',
  still: '/assets/scene-05.svg',
  accent: '#8a7355',
  scroll: 1.6,
  eyebrow: 'دو طرف یک صف',
  title: 'حالا ببینید پرسنل چه می‌بینند',
  body: 'مهمان صف را از گوشی خود می‌بیند؛ گارسون و میزبان همان صف را از اپ پرسنل مدیریت می‌کنند — یک صف، دو نگاه.',
  tags: ['مهمان', 'پرسنل', 'یکجا'],
  mockupImage: customerWaiting,
  mockupTitle: 'مهمان → پرسنل',
}
const waiterSections: ScrollSection[] = [
  {
    id: 'queue-list',
    label: 'لیست صف',
    act: 'waiter',
    still: '/assets/scene-05.svg',
    accent: '#b08d57',
    scroll: 1.45,
    eyebrow: 'برای پرسنل',
    title: 'همهٔ مهمان‌های منتظر، یکجا',
    body: 'لیست کامل صف را ببینید: چند نفره، چقدر منتظر مانده‌اند، و برای کدام میز مناسب‌اند.',
    tags: ['لیست صف', 'واضح', 'سریع'],
    mockupImage: waiterQueue,
    mockupEmbedUrl: showcase.waiterManage,
    mockupTitle: 'لیست صف',
  },
  {
    id: 'call',
    label: 'فراخوانی',
    act: 'waiter',
    still: '/assets/scene-05.svg',
    accent: '#9a7b4f',
    scroll: 1.4,
    eyebrow: 'یک ضربه',
    title: 'مهمان بعدی را صدا کنید',
    body: 'با یک دکمه نفر اول صف را فراخوانی کنید. مهمان روی گوشی خود اعلان می‌گیرد.',
    tags: ['فراخوانی', 'یک کلیک', 'بدون خطا'],
    mockupImage: waiterCall,
    mockupEmbedUrl: showcase.waiterManage,
    mockupTitle: 'فراخوانی مهمان',
  },
  {
    id: 'desks',
    label: 'میزها',
    act: 'waiter',
    still: '/assets/scene-06.svg',
    accent: '#c4a35a',
    scroll: 1.4,
    eyebrow: 'چیدمان سالن',
    title: 'ببینید کدام میز خالی است',
    body: 'نقشه میزها را ببینید: خالی، پر، یا در حال تمیز شدن. برای هر گروه میز مناسب پیشنهاد می‌شود.',
    tags: ['میزها', 'پیشنهاد میز', 'شلوغی'],
    mockupImage: waiterDesks,
    mockupEmbedUrl: showcase.waiterDesks,
    mockupTitle: 'وضعیت میزها',
  },
  {
    id: 'finale',
    label: 'شروع',
    act: 'waiter',
    still: '/assets/scene-06.svg',
    accent: '#b08d57',
    scroll: 1.6,
    eyebrow: 'آماده‌اید؟',
    title: 'صف را برای رستوران خود فعال کنید',
    body: 'اپ مهمان برای مشتری‌ها و اپ پرسنل برای تیم شما. روی گوشی اندروید هم نصب می‌شود.',
    tags: ['رایگان', 'اندروید', 'آسان'],
    mockupImage: waiterDesks,
    mockupEmbedUrl: showcase.waiterDesks,
    mockupTitle: 'شروع کنید',
    cta: {
      primary: { label: 'شروع برای مهمان‌ها', href: APP_ORIGIN + '/' },
      secondary: { label: 'ورود پرسنل', href: `${WAITER_ORIGIN}/` },
    },
  },
]

export const scrollSections: ScrollSection[] = [
  ...customerSections,
  handoffSection,
  ...waiterSections,
]

export const customerSectionCount = customerSections.length
export const waiterSectionStart = customerSections.length + 1
