import { cpSync, existsSync, mkdirSync, rmSync, readdirSync, statSync } from 'fs'
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
  
  // Cleanup large source files from dist to keep the build small
  const prune = (dir) => {
    const entries = readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = join(dir, entry.name);
      if (entry.isDirectory()) {
        prune(fullPath);
      } else {
        const isOriginalImage = entry.name.endsWith('.png') && !entry.name.includes('_min');
        const isOriginalVideo = entry.name.endsWith('.mp4') && !entry.name.includes('_min');
        if (isOriginalImage || isOriginalVideo) {
          rmSync(fullPath);
        }
      }
    }
  };
  prune(dist);
}

if (existsSync(imagesDir)) {
  cpSync(imagesDir, join(dist, 'images'), { recursive: true })
}

if (existsSync(notFoundPage)) {
  cpSync(notFoundPage, join(dist, '404.html'))
}

rmSync(tmp, { recursive: true, force: true })

console.log('Assembled dist/')
