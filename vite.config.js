import { existsSync } from 'fs'
import { join } from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Production flattens public/portfolio into the site root (see scripts/build.js), so the data files
// use /portfolio/design/x.jpg. Without this the dev server only has those at /portfolio/portfolio/...
const serveFlattenedMedia = () => ({
  name: 'serve-flattened-media',
  configureServer(server) {
    server.middlewares.use((req, _res, next) => {
      const [pathname] = (req.url || '').split('?')
      if (pathname.startsWith('/portfolio/') && !pathname.startsWith('/portfolio/portfolio/')) {
        const relative = decodeURIComponent(pathname.slice('/portfolio/'.length))
        if (relative && existsSync(join('public/portfolio', relative))) {
          req.url = `/portfolio${req.url}`
        }
      }
      next()
    })
  },
})

export default defineConfig({
  base: '/portfolio/',
  plugins: [react(), serveFlattenedMedia()],
  // three.js is one large chunk by nature, and it only loads after the page is usable
  build: { chunkSizeWarningLimit: 600 },
})
