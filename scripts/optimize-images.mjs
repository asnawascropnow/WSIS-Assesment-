import { readdirSync, statSync, mkdirSync } from 'node:fs'
import { join, relative, dirname, extname, resolve } from 'node:path'
import sharp from 'sharp'

const root = process.cwd()
const srcRoot = resolve(root, 'wsis-brochure-main/public')
const outRoot = resolve(root, 'public')

const UNUSED = new Set([
  'images/3c-infographic.png',
  'images/treatment-plant-iso.png',
  'images/aeration-basin.jpg',
  'images/leak-detection.jpg',
  'images/pipelines.jpg',
  'images/tankers.jpg',
  'images/problem/bangalore-tankers.png',
  'images/problem/dry-borewell.png',
])

const RASTER = new Set(['.png', '.jpg', '.jpeg', '.avif', '.webp', '.tif', '.tiff'])

function plan(rel) {
  const p = rel.toLowerCase()
  if (p.includes('hero-water')) return { width: 1920, quality: 74 }
  if (p.includes('clarifiers-forest')) return { width: 1920, quality: 74 }
  if (p.includes('self-reliant-campus')) return { width: 1600, quality: 74 }
  if (p.includes('values/')) return { width: 1200, quality: 74 }
  if (p.includes('clients/')) return { width: 400, quality: 90 }
  if (p.includes('brand/')) return { width: 640, quality: 92 }
  if (p.includes('assess-rcgc')) return { width: 1000, quality: 88 }
  if (p.includes('aud-')) return { width: 1200, quality: 74 }
  if (p.includes('website/')) return { width: 1500, quality: 75 }
  if (p.includes('problem/')) return { width: 1400, quality: 74 }
  if (p.includes('solutions/')) return { width: 1400, quality: 76 }
  return { width: 1400, quality: 76 }
}

function* walk(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) yield* walk(full)
    else yield full
  }
}

let totalIn = 0
let totalOut = 0
let count = 0
const rows = []

for (const file of walk(srcRoot)) {
  const rel = relative(srcRoot, file).split('\\').join('/')
  if (!RASTER.has(extname(rel).toLowerCase())) continue
  if (UNUSED.has(rel)) continue

  const { width, quality } = plan(rel)
  const outRel = rel.replace(/\.(png|jpe?g|avif|webp|tiff?)$/i, '.webp')
  const outPath = join(outRoot, outRel)
  mkdirSync(dirname(outPath), { recursive: true })

  const before = statSync(file).size
  const info = await sharp(file)
    .rotate()
    .resize({ width, withoutEnlargement: true })
    .webp({ quality, effort: 5, alphaQuality: 82 })
    .toFile(outPath)
  const after = statSync(outPath).size
  totalIn += before
  totalOut += after
  count++
  rows.push(
    `${outRel.padEnd(52)} ${(before / 1024).toFixed(0).padStart(6)}KB -> ${(after / 1024).toFixed(0).padStart(5)}KB  (${info.width}x${info.height})`,
  )
}

rows.sort()
console.log(rows.join('\n'))
console.log(
  `\n${count} images: ${(totalIn / 1048576).toFixed(1)}MB -> ${(totalOut / 1048576).toFixed(1)}MB ` +
    `(${(100 - (totalOut / totalIn) * 100).toFixed(0)}% smaller)`,
)
