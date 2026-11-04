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

## Google Drive

Files in one Google Drive folder appear on the site automatically. Drop a file in and it shows up on the homepage and the Works page within about 30 minutes. Remove it from Drive and it leaves the site the same way.

- Subfolders become categories on the Works page. A subfolder named like an existing category, such as `Creative Designs`, adds to that category.
- Files directly in the main folder go under "Just added".
- The title is the file name (`Film_Poster_v2.jpg` becomes "Film Poster v2"). To set your own, add a description to the file in Drive.
- Images are resized and converted to WebP. Videos up to 90 MB are copied to the site in MP4 or WebM; anything larger plays through Drive's embedded player. PDFs and other documents open in Drive.

Everything in the folder is published, so keep private files out of it.

### Setup

1. Create a folder in Google Drive and set its sharing to "Anyone with the link" (Viewer). The folder ID is the last part of its URL.
2. In the [Google Cloud console](https://console.cloud.google.com/), create a project, enable the **Google Drive API**, and create an **API key**. Restrict the key to the Google Drive API.
3. In this repository, go to Settings > Secrets and variables > Actions and add two secrets: `DRIVE_API_KEY` and `DRIVE_FOLDER_ID`.
4. Under the Actions tab, open "Deploy to GitHub Pages" and choose "Run workflow" for the first sync.

GitHub turns off scheduled workflows after 60 days without repository activity and emails you first. If files stop appearing, re-enable the workflow from the Actions tab.

## Project Notes

- The site is deployed under the `/portfolio/` base path.
- Portfolio media lives in `public/portfolio` and is copied into `dist/` with its subfolders preserved (for example `dist/design`, `dist/photos`).
- `scripts/build.js` handles that copy step after Vite finishes bundling and generates `404.html` from `index.html` so deep links work on GitHub Pages.
- `scripts/verify-build.js` checks the assembled output so deployment failures are caught before publishing.

## CI

GitHub Actions verifies pull requests with `npm run check` and only deploys on pushes to `main`.
