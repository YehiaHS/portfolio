import { cpSync, existsSync, mkdirSync, rmSync, readdirSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import { build as viteBuild } from 'vite'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const tmp = join(root, '_tmp')
const dist = join(root, 'dist')

const portfolioPublicDir = join(root, 'public', 'portfolio')
const imagesDir = join(root, 'public', 'images')
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

// index.html links /favicon.svg, which is served from public/ and must be copied explicitly
cpSync(join(root, 'public', 'favicon.svg'), join(dist, 'favicon.svg'))

if (existsSync(portfolioPublicDir)) {
  cpSync(portfolioPublicDir, dist, { recursive: true, force: false })
  
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
        // Only drop an original when a *_min copy exists; other originals are referenced directly by the site
        const stem = entry.name.replace(/\.(png|mp4)$/, '');
        const hasMinCopy = entries.some((e) => e.name.startsWith(`${stem}_min.`));
        if ((isOriginalImage || isOriginalVideo) && hasMinCopy) {
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

// GitHub Pages serves 404.html for unknown paths. Copying the SPA entry lets deep links
// such as /portfolio/works resolve, and BrowserRouter then renders the right route.
cpSync(join(dist, 'index.html'), join(dist, '404.html'))

rmSync(tmp, { recursive: true, force: true })

console.log('Assembled dist/')
