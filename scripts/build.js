import { cpSync, existsSync, mkdirSync, rmSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import { build as viteBuild } from 'vite'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const tmp = join(root, '_tmp')
const dist = join(root, 'dist')

const portfolioPublicDir = join(root, 'public', 'portfolio')
const imagesDir = join(root, 'public', 'images')
const notFoundPage = join(root, 'public', '404.html')
const viteSvg = join(tmp, 'vite.svg')

rmSync(tmp, { recursive: true, force: true })
rmSync(dist, { recursive: true, force: true })
mkdirSync(dist, { recursive: true })

await viteBuild({
  configFile: join(root, 'vite.config.js'),
  root,
  logLevel: 'info',
  build: {
    outDir: tmp,
    emptyOutDir: false,
  },
})

cpSync(join(tmp, 'index.html'), join(dist, 'index.html'))
cpSync(join(tmp, 'assets'), join(dist, 'assets'), { recursive: true })

if (existsSync(viteSvg)) {
  cpSync(viteSvg, join(dist, 'vite.svg'))
}

if (existsSync(portfolioPublicDir)) {
  cpSync(portfolioPublicDir, dist, { recursive: true, overwrite: false })
}

if (existsSync(imagesDir)) {
  cpSync(imagesDir, join(dist, 'images'), { recursive: true })
}

if (existsSync(notFoundPage)) {
  cpSync(notFoundPage, join(dist, '404.html'))
}

rmSync(tmp, { recursive: true, force: true })

console.log('Assembled dist/')
