/**
 * ui-add.mjs
 * ----------------------------------------------------------------------------
 * Pulls components from the ui-layouts.com shadcn-style registry into this
 * Vite + React 19 + Tailwind 3.4 project ("Method B" manual porting).
 *
 * For every registry file it:
 *   1. mirrors the registry layout under ./src
 *      (./components/ui/marquee.tsx      -> src/components/ui/marquee.tsx)
 *   2. strips `'use client'`
 *   3. rewrites Tailwind v4-only syntax to Tailwind 3.4
 *      - `gap-(--gap)`               -> `gap-[var(--gap)]`
 *      - `--theme(--color-slate-800)`-> `theme(colors.slate.800)`
 *      - `outline-hidden`            -> `outline-none`
 *   4. swaps `next/image` + `next/link` for local shims
 *   5. (--demos) copies registry demo pages into src/components/gallery/demos
 *
 * Usage:
 *   node scripts/ui-add.mjs                 # base components (components/ui/*)
 *   node scripts/ui-add.mjs marquee tab     # specific registry items
 *   node scripts/ui-add.mjs --demos         # base + every demo variant
 *   node scripts/ui-add.mjs --all           # literally every registry item
 *   ... add --force to overwrite files that already exist
 */
import { existsSync } from 'node:fs'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

const ROOT = process.cwd()
const REGISTRY = 'https://ui-layouts.com/r/registry.json'
const ITEM = (name) => `https://ui-layouts.com/r/${name}.json`

const argv = process.argv.slice(2)
const ALL = argv.includes('--all')
const DEMOS = argv.includes('--demos')
const FORCE = argv.includes('--force')
const only = argv.filter((a) => !a.startsWith('--'))

const written = new Map() // absolute target -> item name
const deps = new Set()
const specifiers = new Set()
const skipped = []

function transform(src) {
  let s = src
  s = s.replace(/^\s*['"]use client['"];?\s*\r?\n/, '')
  // Tailwind v4 shorthand utilities: `foo-(--bar)` -> `foo-[var(--bar)]`
  s = s.replace(/([A-Za-z][A-Za-z0-9]*(?:-[A-Za-z0-9]+)*)-\((--[A-Za-z0-9-]+)\)/g, '$1-[var($2)]')
  // Tailwind v4 internal theme() colour lookup
  s = s.replace(/--theme\(--color-([a-z]+)-(\d+)\)/g, 'theme(colors.$1.$2)')
  s = s.replace(/--theme\(--color-([a-z]+)\)/g, 'theme(colors.$1)')
  // Tailwind v3 renamed the outline reset utility
  s = s.replace(/\boutline-hidden\b/g, 'outline-none')
  // Next.js shims
  s = s.replace(/(['"])next\/image\1/g, "'@/components/ui/shim-image'")
  s = s.replace(/(['"])next\/link\1/g, "'@/components/ui/shim-link'")
  // registry demo pages are copied elsewhere
  s = s.replace(/(['"])@\/registry\/components\//g, "'@/components/gallery/demos/")
  return s
}

/** Map a registry-relative path to a project path, or null to skip it. */
function mapFile(rel) {
  if (/^(components|hooks|lib)\//.test(rel)) return path.join(ROOT, 'src', rel)
  if ((DEMOS || ALL) && rel.startsWith('registry/components/')) {
    return path.join(ROOT, 'src', 'components', 'gallery', 'demos', rel.slice('registry/components/'.length))
  }
  if ((DEMOS || ALL) && rel.startsWith('assets/')) return path.join(ROOT, 'src', rel)
  return null
}

function collectSpecifiers(src) {
  const re = /(?:from|import)\s*['"]([^'"]+)['"]/g
  let m
  while ((m = re.exec(src))) specifiers.add(m[1])
}

async function fetchJson(url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`${res.status} ${url}`)
  return res.json()
}

async function run() {
  const index = await fetchJson(REGISTRY)
  const items = index.items || []
  const baseItems = items.filter((it) =>
    (it.files || []).some((f) => (f.path || '').includes('components/ui/')),
  )

  const queue = only.length
    ? [...only]
    : (ALL || DEMOS ? items : baseItems).map((it) => it.name)
  const queued = new Set(queue)
  const visited = new Set()

  const CONCURRENCY = 8
  let cursor = 0

  async function worker() {
    while (cursor < queue.length) {
      const name = queue[cursor++]
      if (visited.has(name)) continue
      visited.add(name)

      let item
      try {
        item = await fetchJson(ITEM(name))
      } catch {
        skipped.push(name)
        continue
      }

      ;(item.dependencies || []).forEach((d) => deps.add(d))
      for (const rd of item.registryDependencies || []) {
        if (!queued.has(rd)) {
          queued.add(rd)
          queue.push(rd)
        }
      }

      for (const f of item.files || []) {
        const rel = (f.path || f.target || '').replace(/^\.\//, '')
        if (!rel || typeof f.content !== 'string') continue
        const target = mapFile(rel)
        if (!target) continue
        if (!FORCE && existsSync(target)) continue
        collectSpecifiers(f.content)
        written.set(target, name)
        await mkdir(path.dirname(target), { recursive: true })
        await writeFile(target, transform(f.content), 'utf8')
      }
    }
  }

  await Promise.all(Array.from({ length: CONCURRENCY }, worker))

  const targets = [...written.keys()].map((p) => `/${p.replace(/\\/g, '/')}`)
  const hasTarget = (abs) =>
    ['', '.ts', '.tsx', '.js', '.jsx', '.mjs', '/index.ts', '/index.tsx'].some((e) =>
      targets.includes(abs + e),
    )
  const localMissing = [...new Set(
    [...specifiers]
      .filter((s) => s.startsWith('@/'))
      .map((s) => `/${path.join(ROOT, 'src', s.slice(2)).replace(/\\/g, '/')}`)
      .filter((abs) => !hasTarget(abs) && !existsSync(abs.replace(/^\//, ''))),
  )]

  console.log(`\nWrote ${written.size} file(s) from ${visited.size - skipped.length} registry item(s).`)
  if (skipped.length) console.log(`Not found / Pro: ${[...new Set(skipped)].sort().join(', ')}`)
  if (localMissing.length) console.log(`\nUnresolved local imports:\n  ${localMissing.join('\n  ')}`)
  console.log(`\nnpm deps referenced:\n  ${[...deps].sort().join(' ') || '(none)'}`)
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
