# YehiaHS Portfolio

Personal portfolio site built with React, Vite, and Tailwind CSS, then published to GitHub Pages.

## Requirements

- Node.js `^20.19.0` or `>=22.12.0`
- npm `>=10`

## Scripts

- `npm run dev`: start the local Vite dev server
- `npm run lint`: run ESLint against the non-frontend repo tooling/config surface
- `npm run build`: produce the final `dist/` directory
- `npm run verify:build`: assert the generated artifact layout expected by GitHub Pages
- `npm run check`: run lint, build, and build verification together
- `npm run preview`: serve the generated build locally
- `npm run deploy`: publish `dist/` with `gh-pages`

## Project Notes

- The site is deployed under the `/portfolio/` base path.
- Portfolio media lives in `public/portfolio` and is copied into `dist/` with its subfolders preserved (for example `dist/design`, `dist/photos`).
- `scripts/build.js` handles that copy step after Vite finishes bundling and generates `404.html` from `index.html` so deep links work on GitHub Pages.
- `scripts/verify-build.js` checks the assembled output so deployment failures are caught before publishing.

## CI

GitHub Actions verifies pull requests with `npm run check` and only deploys on pushes to `main`.
