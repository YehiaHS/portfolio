import { execFileSync } from 'child_process'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const eslintBin = join(root, 'node_modules', 'eslint', 'bin', 'eslint.js')
const targets = ['scripts', '.eslintrc.cjs', 'vite.config.js', 'postcss.config.js', 'tailwind.config.js']

execFileSync(
  process.execPath,
  [
    eslintBin,
    ...targets,
    '--ext',
    'js,jsx',
    '--report-unused-disable-directives',
    '--max-warnings',
    '0',
  ],
  {
    cwd: root,
    stdio: 'inherit',
  },
)
