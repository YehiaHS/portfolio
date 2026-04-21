import { existsSync, readdirSync, readFileSync, statSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const dist = join(root, 'dist')

function assert(condition, message) {
  if (!condition) {
    throw new Error(message)
  }
}

const expectedPaths = [
  'index.html',
  '404.html',
  'assets',
  'images/hero-pattern.svg',
  'images/monogram-frame.svg',
  'design/FF_Poster_1_min.jpg',
  'video/OpenDay_Overview_min.mp4',
]

assert(existsSync(dist), 'dist/ was not generated')

for (const relativePath of expectedPaths) {
  assert(existsSync(join(dist, relativePath)), `Missing build artifact: ${relativePath}`)
}

const assetFiles = readdirSync(join(dist, 'assets'))
assert(assetFiles.some((file) => file.endsWith('.js')), 'No JS bundle was generated in dist/assets')
assert(assetFiles.some((file) => file.endsWith('.css')), 'No CSS bundle was generated in dist/assets')

const indexHtml = readFileSync(join(dist, 'index.html'), 'utf8')
assert(indexHtml.includes('/portfolio/'), 'index.html is missing the GitHub Pages base path')

const flattenedMediaDir = join(dist, 'photos')
assert(statSync(flattenedMediaDir).isDirectory(), 'Portfolio media was not flattened into dist/')

console.log('Build artifacts verified successfully.')
