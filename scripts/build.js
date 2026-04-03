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

// Step 1: Build to _tmp
import { execSync } from 'child_process'
// Use the project's local node_modules vite (not npx)
const viteBin = join(root, 'node_modules', '.bin', 'vite')
execSync(`${viteBin} build --outDir _tmp`, { stdio: 'inherit', cwd: root })

// Step 2: Assemble dist/
// _tmp/* → dist/portfolio/ (the app bundle + index.html)
cpSync(join(tmp, 'index.html'), join(dist, 'portfolio', 'index.html'))
cpSync(join(tmp, 'assets'), join(dist, 'portfolio', 'assets'), { recursive: true })

// Copy _tmp vite.svg (root-level public file) to dist/portfolio/
try { cpSync(join(tmp, 'vite.svg'), join(dist, 'portfolio', 'vite.svg')) } catch {}

// Step 3: Copy public/* to dist/
// public/portfolio/* → dist/portfolio/ (images)
// public/images/* → dist/images/
// public/404.html → dist/404.html
cpSync(join(root, 'public', 'portfolio'), join(dist, 'portfolio'), { recursive: true, overwrite: false })
try { cpSync(join(root, 'public', 'images'), join(dist, 'images'), { recursive: true }) } catch {}
try { cpSync(join(root, 'public', '404.html'), join(dist, '404.html')) } catch {}

// Clean
rmSync(tmp, { recursive: true, force: true })

console.log('✓ Assembled dist/')
