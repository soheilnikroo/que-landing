import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'astro/config'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.dirname(fileURLToPath(import.meta.url))

/**
 * `astro dev` runs Vite in `appType: 'custom'` mode (Astro owns routing), so
 * Vite's own `htmlFallbackMiddleware` — the thing that normally rewrites a
 * trailing-slash request like `/app-showcase/customer/` to
 * `/app-showcase/customer/index.html` — never gets installed. That
 * middleware only runs in `astro preview` / production static hosting
 * (`appType: 'mpa'`), which is why the app-showcase static bundles under
 * `public/app-showcase/**` 404 in `astro dev` despite the files existing on
 * disk. This plugin reproduces that fallback for dev only, so behavior
 * matches preview/production.
 */
function publicDirIndexFallback() {
  return {
    name: 'public-dir-index-fallback',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url) {
          const urlPath = req.url.split('?')[0].split('#')[0]
          if (urlPath.endsWith('/')) {
            const publicDir = server.config.publicDir
            const candidate = path.join(publicDir, decodeURIComponent(urlPath), 'index.html')
            if (existsSync(candidate)) {
              req.url = req.url.replace(urlPath, `${urlPath}index.html`)
            }
          }
        }
        next()
      })
    },
  }
}

export default defineConfig({
  site: 'https://landing.queuegrow-app.com',
  output: 'static',
  compressHTML: true,
  integrations: [react(), sitemap()],
  vite: {
    plugins: [publicDirIndexFallback(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(root, 'src'),
      },
    },
  },
})
