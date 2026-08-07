#!/usr/bin/env node
/**
 * Builds que-app's customer + waiter apps as static bundles and copies them
 * into public/app-showcase/ so the landing page's phone mockups can iframe a
 * same-origin static copy of the real app instead of the live production
 * site.
 *
 * Runs automatically before both `pnpm dev` and `pnpm build` (see
 * package.json) — but only actually builds once: if public/app-showcase/*
 * already has an index.html, it's left alone so `pnpm dev` restarts stay
 * fast. Run `pnpm build:app-showcase` yourself (or set
 * FORCE_APP_SHOWCASE_BUILD=true) after changing que-app to refresh it.
 *
 * que-app is expected as a sibling checkout:
 *   Applications/
 *     que-app/       <- this script builds apps/customer and apps/waiter here
 *     q-landing/     <- and copies their dist/ into here
 *
 * Override the location with QUE_APP_DIR if your layout differs. In CI, set
 * REQUIRE_APP_SHOWCASE=true so a missing/broken que-app checkout fails the
 * build loudly instead of silently shipping a stale (or missing) showcase.
 */
import { execFileSync } from 'node:child_process'
import { cpSync, existsSync, rmSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const landingRoot = path.resolve(fileURLToPath(new URL('.', import.meta.url)), '..')
const queAppDir = path.resolve(process.env.QUE_APP_DIR || path.join(landingRoot, '../que-app'))
const requireShowcase = process.env.REQUIRE_APP_SHOWCASE === 'true'
const forceRebuild = process.env.FORCE_APP_SHOWCASE_BUILD === 'true'

const targets = [
  { pkg: '@que-app/customer', dir: 'customer', basePath: '/app-showcase/customer/' },
  { pkg: '@que-app/waiter', dir: 'waiter', basePath: '/app-showcase/waiter/' },
]

function fail(message) {
  if (requireShowcase) {
    console.error(`\n✖ ${message}`)
    process.exit(1)
  }
  console.warn(`\n⚠ ${message}`)
  console.warn('  Skipping the static app-showcase build — the phone mockups will 404 until it exists.')
  console.warn('  Run `pnpm build:app-showcase` once que-app is available, or set QUE_APP_DIR.')
  console.warn('  Set REQUIRE_APP_SHOWCASE=true to make this a hard failure instead.\n')
}

const alreadyBuilt = targets.every((target) =>
  existsSync(path.join(landingRoot, 'public', 'app-showcase', target.dir, 'index.html')),
)

if (alreadyBuilt && !forceRebuild) {
  console.log('app-showcase already built — skipping (set FORCE_APP_SHOWCASE_BUILD=true to refresh).')
  process.exit(0)
}

if (!existsSync(queAppDir)) {
  fail(
    `que-app checkout not found at ${queAppDir}. ` +
      'Clone it as a sibling of q-landing, or set QUE_APP_DIR to its path.',
  )
  process.exit(0)
}

console.log(`Building app-showcase from ${queAppDir}\n`)

for (const target of targets) {
  console.log(`→ Building ${target.pkg} (base ${target.basePath})`)
  try {
    execFileSync('pnpm', ['--filter', target.pkg, 'build'], {
      cwd: queAppDir,
      stdio: 'inherit',
      env: { ...process.env, VITE_BASE_PATH: target.basePath },
    })
  } catch (error) {
    fail(`Building ${target.pkg} failed: ${error.message}`)
    continue
  }

  const sourceDist = path.join(queAppDir, 'apps', target.dir, 'dist')
  if (!existsSync(sourceDist)) {
    fail(`${target.pkg} built but no dist/ was produced at ${sourceDist}`)
    continue
  }

  const destDir = path.join(landingRoot, 'public', 'app-showcase', target.dir)
  rmSync(destDir, { recursive: true, force: true })
  cpSync(sourceDist, destDir, { recursive: true })
  console.log(`  copied → public/app-showcase/${target.dir}/\n`)
}

console.log('Done.')
