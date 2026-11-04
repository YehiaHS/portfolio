/**
 * driveContent.js
 *
 * Reads the manifest written by scripts/sync-drive.js and shapes its files like the static archive
 * data, so the rest of the site can treat them the same. The manifest is fetched at runtime because
 * it only exists on sites that have the Drive sync configured.
 */

import { useEffect, useState } from 'react'

const BASE = import.meta.env.BASE_URL
const NEW_FOR_DAYS = 14

const local = (name) => (name ? `${BASE}drive/${encodeURIComponent(name)}` : undefined)

function toArchiveItem(item) {
  return {
    id: item.id,
    caption: item.caption,
    src: item.type === 'image' || item.type === 'video' ? local(item.src) : item.src,
    thumb: local(item.thumb),
    poster: local(item.poster),
    isVideo: item.type === 'video' || item.type === 'embed',
    isEmbed: item.type === 'embed',
    isDoc: item.type === 'doc',
    docLabel: item.label,
    driveFallback: item.driveUrl,
    addedAt: item.addedAt,
    isNew: Date.now() - new Date(item.addedAt).getTime() < NEW_FOR_DAYS * 86_400_000,
  }
}

let manifestRequest = null

function loadManifest() {
  manifestRequest ??= fetch(`${BASE}drive/manifest.json`)
    .then((response) => (response.ok ? response.json() : null))
    // The dev server answers unknown paths with index.html, which fails to parse as JSON
    .catch(() => null)
    .then((manifest) => {
      if (!Array.isArray(manifest?.categories)) return []
      return manifest.categories.map((category) => ({
        id: category.id,
        label: category.label,
        description: 'Added from Google Drive',
        items: category.items.map(toArchiveItem),
      }))
    })
  return manifestRequest
}

/** Drive categories, or an empty list until they load and whenever there are none. */
export function useDriveCategories() {
  const [categories, setCategories] = useState([])

  useEffect(() => {
    let active = true
    loadManifest().then((loaded) => {
      if (active) setCategories(loaded)
    })
    return () => {
      active = false
    }
  }, [])

  return categories
}

/** A Drive folder named like an existing category adds to it; any other name becomes a new one. */
export function mergeCategories(staticCategories, driveCategories) {
  const merged = staticCategories.map((category) => ({ ...category }))
  const added = []
  for (const driveCategory of driveCategories) {
    const match = merged.find((category) => category.label.toLowerCase() === driveCategory.label.toLowerCase())
    if (match) match.items = [...driveCategory.items, ...match.items]
    else added.push(driveCategory)
  }
  return [...added, ...merged]
}

export function latestItems(driveCategories, count) {
  return driveCategories
    .flatMap((category) => category.items)
    .sort((a, b) => (a.addedAt < b.addedAt ? 1 : -1))
    .slice(0, count)
}
