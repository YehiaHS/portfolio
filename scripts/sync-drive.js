/**
 * sync-drive.js
 *
 * Copies a public Google Drive folder into the site. Every top-level subfolder becomes a category on
 * the Works page and files directly in the folder land in "Just added".
 *
 *   node scripts/sync-drive.js          download new files and write public/portfolio/drive/manifest.json
 *   node scripts/sync-drive.js --check  only report whether the folder differs from the deployed site
 *
 * Needs DRIVE_API_KEY and DRIVE_FOLDER_ID. See "Google Drive" in the README for the setup.
 */

import { createHash } from 'crypto'
import { appendFileSync, existsSync, mkdirSync, readdirSync, rmSync, statSync, writeFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const outDir = process.env.DRIVE_OUT_DIR || join(__dirname, '..', 'public', 'portfolio', 'drive')
const manifestPath = join(outDir, 'manifest.json')

const API = process.env.DRIVE_API_BASE || 'https://www.googleapis.com'
const SITE_MANIFEST = process.env.DRIVE_SITE_MANIFEST || 'https://yehiahs.github.io/portfolio/drive/manifest.json'
const API_KEY = process.env.DRIVE_API_KEY
const FOLDER_ID = process.env.DRIVE_FOLDER_ID

// GitHub Pages sites are limited to 1 GB and the existing media already uses about 300 MB.
// Videos over these limits still appear on the site, played through Drive's own embedded player.
const MAX_VIDEO_BYTES = Number(process.env.DRIVE_MAX_VIDEO_MB || 90) * 1024 * 1024
const MAX_TOTAL_VIDEO_BYTES = Number(process.env.DRIVE_MAX_TOTAL_VIDEO_MB || 400) * 1024 * 1024
const MAX_IMAGE_BYTES = 80 * 1024 * 1024
const CONCURRENCY = 4
const FOLDER_MIME = 'application/vnd.google-apps.folder'
const LOCAL_VIDEO_TYPES = { 'video/mp4': 'mp4', 'video/webm': 'webm' }
// Bumped whenever the output format changes, so the next run redeploys even with no Drive changes
const FORMAT_VERSION = 1

/** Keys must never reach the logs, and Drive error messages can echo the request URL. */
const scrub = (text) => (API_KEY ? String(text).split(API_KEY).join('***') : String(text))

async function request(url, attempt = 1) {
  const response = await fetch(url)
  if (response.ok) return response
  if ((response.status === 429 || response.status >= 500) && attempt < 4) {
    await new Promise((resolve) => setTimeout(resolve, 1000 * 2 ** attempt))
    return request(url, attempt + 1)
  }
  throw new Error(`Drive responded ${response.status}: ${scrub((await response.text()).slice(0, 300))}`)
}

async function listChildren(folderId) {
  const files = []
  let pageToken = ''
  do {
    const params = new URLSearchParams({
      key: API_KEY,
      q: `'${folderId}' in parents and trashed = false`,
      pageSize: '200',
      orderBy: 'createdTime desc',
      supportsAllDrives: 'true',
      includeItemsFromAllDrives: 'true',
      fields:
        'nextPageToken,files(id,name,mimeType,description,createdTime,modifiedTime,size,md5Checksum,thumbnailLink,webViewLink)',
    })
    if (pageToken) params.set('pageToken', pageToken)
    const data = await (await request(`${API}/drive/v3/files?${params}`)).json()
    files.push(...data.files)
    pageToken = data.nextPageToken || ''
  } while (pageToken)
  return files
}

/** Walks the folder; anything nested deeper than one level belongs to its top-level subfolder. */
async function readFolderTree() {
  const seen = new Set([FOLDER_ID])
  const collected = []
  const walk = async (folderId, category) => {
    for (const file of await listChildren(folderId)) {
      if (file.mimeType !== FOLDER_MIME) {
        collected.push({ ...file, category })
      } else if (!seen.has(file.id)) {
        seen.add(file.id)
        await walk(file.id, category ?? file.name)
      }
    }
  }
  await walk(FOLDER_ID, null)
  return collected
}

const fingerprintOf = (files) =>
  createHash('sha256')
    .update(
      JSON.stringify([
        FORMAT_VERSION,
        files
          .map((file) => [file.id, file.name, file.modifiedTime, file.description || '', file.category || ''])
          .sort(([a], [b]) => (a < b ? -1 : 1)),
      ]),
    )
    .digest('hex')

const captionOf = (file) =>
  file.description?.trim() ||
  file.name
    .replace(/\.[^.]+$/, '')
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const slugOf = (label) =>
  `drive-${label
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-|-$/g, '')}`

const fileUrl = (id) => `${API}/drive/v3/files/${encodeURIComponent(id)}?alt=media&key=${API_KEY}&supportsAllDrives=true`
const sizedThumbnail = (file, size) => file.thumbnailLink?.replace(/=s\d+$/, `=s${size}`)

/** Output names carry the Drive revision, so an edited file replaces the old copy. */
const stemOf = (file) => `${file.id.replace(/[^\w-]/g, '')}-${createHash('md5').update(file.modifiedTime).digest('hex').slice(0, 8)}`

async function fetchBuffer(url) {
  return Buffer.from(await (await request(url)).arrayBuffer())
}

async function processImage(file, sharp) {
  const stem = stemOf(file)
  const full = `${stem}.webp`
  const thumb = `${stem}-thumb.webp`

  if (!existsSync(join(outDir, full)) || !existsSync(join(outDir, thumb))) {
    let source = null
    if (Number(file.size || 0) <= MAX_IMAGE_BYTES) {
      try {
        const original = await fetchBuffer(fileUrl(file.id))
        await sharp(original).metadata()
        source = original
      } catch (error) {
        console.warn(`  ${file.name}: using Drive's rendering (${scrub(error.message)})`)
      }
    }
    // Formats sharp can't read, such as HEIC from an iPhone, still have a Drive-rendered preview
    if (!source && !file.thumbnailLink) return null
    source ??= await fetchBuffer(sizedThumbnail(file, 2200))

    await sharp(source)
      .rotate()
      .resize({ width: 2200, height: 2200, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 82 })
      .toFile(join(outDir, full))
    await sharp(source)
      .rotate()
      .resize({ width: 800, height: 800, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 72 })
      .toFile(join(outDir, thumb))
  }

  return { type: 'image', src: full, thumb }
}

async function savePoster(file, sharp) {
  if (!file.thumbnailLink) return undefined
  const poster = `${stemOf(file)}-poster.webp`
  if (!existsSync(join(outDir, poster))) {
    try {
      await sharp(await fetchBuffer(sizedThumbnail(file, 800))).webp({ quality: 72 }).toFile(join(outDir, poster))
    } catch (error) {
      console.warn(`  ${file.name}: no preview image (${scrub(error.message)})`)
      return undefined
    }
  }
  return poster
}

async function processVideo(file, sharp, budget) {
  const poster = await savePoster(file, sharp)
  const extension = LOCAL_VIDEO_TYPES[file.mimeType]
  const size = Number(file.size || 0)

  if (extension && size > 0 && size <= MAX_VIDEO_BYTES && budget.videoBytes + size <= MAX_TOTAL_VIDEO_BYTES) {
    budget.videoBytes += size
    const name = `${stemOf(file)}.${extension}`
    if (!existsSync(join(outDir, name))) writeFileSync(join(outDir, name), await fetchBuffer(fileUrl(file.id)))
    return { type: 'video', src: name, poster }
  }
  return { type: 'embed', src: `https://drive.google.com/file/d/${encodeURIComponent(file.id)}/preview`, poster }
}

async function processFile(file, sharp, budget) {
  const base = {
    id: file.id,
    caption: captionOf(file),
    addedAt: file.createdTime,
    driveUrl: file.webViewLink,
  }
  if (file.mimeType.startsWith('video/')) return { ...base, ...(await processVideo(file, sharp, budget)) }
  if (file.mimeType === 'application/vnd.google-apps.shortcut') return null
  if (file.mimeType.startsWith('image/')) {
    const image = await processImage(file, sharp)
    if (image) return { ...base, ...image }
  }

  // PDFs, Docs, PSDs and the rest open in Drive, which can already display all of them
  return {
    ...base,
    type: 'doc',
    src: file.webViewLink,
    poster: await savePoster(file, sharp),
    label: file.name.includes('.') ? file.name.split('.').pop().toUpperCase().slice(0, 6) : 'DOC',
  }
}

async function mapLimit(items, limit, worker) {
  const results = new Array(items.length)
  let next = 0
  const run = async () => {
    while (next < items.length) {
      const index = next++
      try {
        results[index] = await worker(items[index])
      } catch (error) {
        // One unreadable file shouldn't keep the rest of the folder off the site
        console.warn(`  Skipped ${items[index].name}: ${scrub(error.message)}`)
        results[index] = null
      }
    }
  }
  await Promise.all(Array.from({ length: limit }, run))
  return results
}

function pruneOutput(manifest) {
  const keep = new Set(['manifest.json'])
  for (const category of manifest.categories) {
    for (const item of category.items) {
      for (const name of [item.src, item.thumb, item.poster]) if (name) keep.add(name)
    }
  }
  for (const name of readdirSync(outDir)) if (!keep.has(name)) rmSync(join(outDir, name), { force: true })
}

function setOutput(name, value) {
  if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, `${name}=${value}\n`)
}

/** Scheduled runs call this. A failure here should be loud: it means the sync has stopped working. */
async function check() {
  const fingerprint = fingerprintOf(await readFolderTree())
  let deployed = null
  try {
    const response = await fetch(SITE_MANIFEST)
    if (response.ok) deployed = (await response.json()).fingerprint
  } catch {
    // Nothing deployed yet counts as a change
  }
  const changed = fingerprint !== deployed
  console.log(changed ? 'Drive folder changed, the site needs a rebuild.' : 'Drive folder unchanged.')
  setOutput('changed', String(changed))
}

async function sync() {
  mkdirSync(outDir, { recursive: true })

  let files
  try {
    files = await readFolderTree()
  } catch (error) {
    // A Drive outage or an expired key must not block deploys or wipe the files already on the site
    const kept = existsSync(manifestPath)
    console.log(`::warning::Drive sync failed, ${kept ? 'keeping the last synced files' : 'building without Drive files'}: ${scrub(error.message)}`)
    return
  }

  const fingerprint = fingerprintOf(files)
  const { default: sharp } = await import('sharp')
  const budget = { videoBytes: 0 }
  const newestFirst = [...files].sort((a, b) => (a.createdTime < b.createdTime ? 1 : -1))
  const processed = await mapLimit(newestFirst, CONCURRENCY, async (file) => {
    const item = await processFile(file, sharp, budget)
    if (item) console.log(`  ${file.name}`)
    return item && { ...item, category: file.category }
  })

  const categories = new Map()
  for (const entry of processed) {
    if (!entry) continue
    const { category, ...item } = entry
    const label = category || 'Just added'
    if (!categories.has(label)) categories.set(label, { id: slugOf(label), label, items: [] })
    categories.get(label).items.push(item)
  }

  const manifest = { version: FORMAT_VERSION, fingerprint, syncedAt: new Date().toISOString(), categories: [...categories.values()] }
  pruneOutput(manifest)
  writeFileSync(manifestPath, JSON.stringify(manifest))

  const total = processed.filter(Boolean).length
  const bytes = readdirSync(outDir).reduce((sum, name) => sum + statSync(join(outDir, name)).size, 0)
  console.log(`Synced ${total} of ${files.length} files into ${categories.size} categories (${(bytes / 1024 / 1024).toFixed(1)} MB).`)
}

if (!API_KEY || !FOLDER_ID) {
  // Forks, pull requests and local builds have no secrets, and the site works fine without Drive files
  console.log('DRIVE_API_KEY or DRIVE_FOLDER_ID not set, skipping the Drive sync.')
  setOutput('changed', 'false')
} else if (process.argv.includes('--check')) {
  await check()
} else {
  await sync()
}

