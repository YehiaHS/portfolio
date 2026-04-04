import { createRef, useRef, useEffect, useMemo, memo } from 'react'
import { prepare } from '@chenglou/pretext'

/* ============================================================
   Pretext-based text measurement & sizing utilities.
   Measures actual text height without DOM reflow, then uses the
   measurement to size containers precisely instead of relying on
   fixed padding/guesses.
   ============================================================ */

/* Measure a string + font and return height for a given width */
export function measureText(text, font, maxWidth, lineHeight) {
  try {
    const prepared = prepare(text, font)
    const { height, lineCount } = layout(prepared, maxWidth, lineHeight)
    return { height, lineCount }
  } catch {
    // Fallback: rough estimate
    const words = text.split(/\s+/).length
    const charsPerLine = Math.max(1, Math.floor(maxWidth / (font.startsWith('12px') ? 7 : 9)))
    const lines = Math.ceil(words / charsPerLine * 4)
    return { height: lines * lineHeight, lineCount: lines }
  }
}

/* Measure and cache a text block. Use from components to size
   containers based on actual rendered text height. */
export function useTextMeasure(text, font = '14px Manrope', maxWidth = 400, lineHeight = 24) {
  const key = `${text}__${font}__${maxWidth}__${lineHeight}`
  return useMemo(
    () => measureText(text, font, maxWidth, lineHeight),
    [key]
  )
}

/* A component that wraps text content with properly measured
   height instead of relying on fixed padding/gaps. Replaces the
   pattern of "page-number" class which hardcodes 1rem padding. */
export const TextBlock = memo(({ text, font = '14px Manrope', maxWidth = '100%', lineHeight = 1.7, className = '', style = {}, fontSize = '0.6rem', letterSpacing = '0.15em', color }) => {
  const ref = useRef(null)

  return (
    <span
      ref={ref}
      className={className}
      style={{
        fontFamily: 'var(--font-body), Manrope, system-ui, sans-serif',
        fontSize,
        fontWeight: 500,
        letterSpacing,
        color: color || 'var(--ink-faint, #5a6a5e)',
        lineHeight,
        display: 'block',
        ...style,
      }}
    >
      {text}
    </span>
  )
})
