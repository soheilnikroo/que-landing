/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_APP_ORIGIN?: string
  readonly PUBLIC_WAITER_ORIGIN?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
