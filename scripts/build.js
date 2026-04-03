import { cpSync, rmSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')

const tmp = join(root, '_tmp')
const dist = join(root, 'dist')

// Clean
rmSync(tmp, { recursive: true, force: true })
rmSync(dist, { recursive: true, force: true })

// Step 1: Build to _tmp (Vite uses publicDir = 'public' by default)
import { execSync } from 'child_process'
const viteBin = join(root, 'node_modules', '.bin', 'vite')
execSync(`${viteBin} build --outDir _tmp`, { stdio: 'inherit', cwd: root })

// Step 2: Assemble dist/ at ROOT level
// dist/ index.html, assets/, vite.svg → from Vite build output
cpSync(join(tmp, 'index.html'), join(dist, 'index.html'))
cpSync(join(tmp, 'assets'), join(dist, 'assets'), { recursive: true })
try { cpSync(join(tmp, 'vite.svg'), join(dist, 'vite.svg')) } catch {}

// Step 3: Copy public/portfolio/* → dist/portfolio/ (media files)
// public/images/* → dist/images/
// public/404.html → dist/404.html (root-level spa fallback)
cpSync(join(root, 'public', 'portfolio'), join(dist, 'portfolio'), { recursive: true })
try { cpSync(join(root, 'public', 'images'), join(dist, 'images'), { recursive: true }) } catch {}
try { cpSync(join(root, 'public', '404.html'), join(dist, '404.html')) } catch {}

// Clean
rmSync(tmp, { recursive: true, force: true })

console.log('✓ Assembled dist/')
