/**
 * useImageLoader.js
 *
 * Custom hook for image loading state management with an in-memory cache.
 * Replaces the duplicated image loading logic in WorksArchive and Portfolio pages.
 *
 * @param {string} src - The image source URL
 * @param {boolean} [enabled=true] - Whether to start loading (e.g., based on IntersectionObserver)
 * @returns {'idle' | 'loading' | 'loaded' | 'error'} Current image load state
 */

import { useState, useEffect } from 'react'

// Module-level cache so repeated mounts don't re-fetch already-known images
const imageCache = new Map()

export function useImageLoader(src, enabled = true) {
  const [state, setState] = useState(() => imageCache.get(src) || 'idle')

  useEffect(() => {
    const cached = imageCache.get(src)
    if (cached) {
      setState(cached)
      return
    }
    if (!enabled) {
      setState('idle')
      return
    }

    setState('loading')
    let cancelled = false

    const img = new Image()

    const resolve = (ok) => {
      if (cancelled) return
      const nextState = ok ? 'loaded' : 'error'
      imageCache.set(src, nextState)
      setState(nextState)
    }

    img.onload = () => resolve(true)
    img.onerror = () => resolve(false)
    img.src = src

    // Check if the browser already fully loaded the image (cached synchronously)
    if (img.complete) {
      if (img.naturalWidth > 0 || img.naturalHeight > 0) {
        resolve(true)
      } else {
        resolve(false)
      }
      return
    }

    const timeout = setTimeout(() => resolve(false), 10_000)

    return () => {
      cancelled = true
      clearTimeout(timeout)
    }
  }, [src, enabled])

  return state
}
