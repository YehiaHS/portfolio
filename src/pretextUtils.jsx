/**
 * pretextUtils.jsx
 *
 * Shared pretext-powered text metric utilities.
 * Extracted from App.jsx so they can be reused across any component without circular deps.
 *
 * @see https://github.com/chenglou/pretext
 */

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { prepare, layout, layoutWithLines } from '@chenglou/pretext'

/* ── Hook ─────────────────────────────────────────────────────────────────── */

/**
 * Computes typography metrics for a string using pretext's virtual layout engine.
 * The result is memoised — it only recomputes when the text, font, maxWidth, or
 * lineHeight input changes.
 *
 * @param {string} text
 * @param {string} [font='14px Manrope']
 * @param {number} [maxWidth=600]
 * @param {number} [lineHeight=22]
 */
export function useTextMetrics(text, font = '14px Manrope', maxWidth = 600, lineHeight = 22) {
  return useMemo(() => {
    try {
      const prepared = prepare(text, font)
      const { height, lineCount, lastLineWidth } = layout(prepared, maxWidth, lineHeight)
      const wordCount = text.split(/\s+/).filter(Boolean).length
      const readingTimeSec = Math.max(1, Math.ceil(wordCount / 3.8)) // ~230 wpm
      return { height, lineCount, lastLineWidth, wordCount, readingTimeSec, charCount: text.length }
    } catch {
      const words = text.split(/\s+/).filter(Boolean)
      return { height: 0, lineCount: 0, lastLineWidth: 0, wordCount: words.length, readingTimeSec: 1, charCount: text.length }
    }
  }, [text, font, maxWidth, lineHeight])
}

/* ── ReadingBadge ─────────────────────────────────────────────────────────── */

/**
 * Animated reading-time badge — uses pretext for real text measurement.
 */
export const ReadingBadge = ({ text, className = '' }) => {
  const { readingTimeSec, lineCount, charCount } = useTextMetrics(text, '14px Manrope', 380)
  const lines = lineCount || 1
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: 0.6, duration: 0.3 }}
      className={`inline-flex items-center gap-3 px-2.5 py-1 border rounded-sm ${className}`}
    >
      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
      <span className="text-[0.55rem] font-heading tracking-wide">
        {readingTimeSec < 120 ? `${readingTimeSec}s read` : `${Math.ceil(readingTimeSec / 60)} min read`}
      </span>
      <span className="w-px h-3" style={{ backgroundColor: '#2d5a3d20' }} />
      <span className="text-[0.55rem] font-heading tracking-wide" style={{ color: '#2d5a3d60' }}>
        {lines}l · {charCount}c
      </span>
    </motion.span>
  )
}

/* ── TextDensityBar ───────────────────────────────────────────────────────── */

/**
 * Visualises actual line widths from the pretext layout engine as a bar chart.
 */
export const TextDensityBar = ({ text, className = '' }) => {
  const ratios = useMemo(() => {
    try {
      const prepared = prepare(text, '14px Manrope')
      const { lines } = layoutWithLines(prepared, 380, 22)
      const widths = lines.map((l) => l.width)
      const max = Math.max(...widths, 1)
      return widths.map((w) => w / max)
    } catch {
      return []
    }
  }, [text])

  if (ratios.length < 2) return null

  return (
    <motion.div
      className={`overflow-hidden rounded-sm ${className}`}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay: 0.5, duration: 0.3 }}
    >
      <div className="flex items-end gap-[2px] h-6">
        {ratios.map((r, i) => (
          <motion.div
            key={i}
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 + i * 0.03, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="flex-1 rounded-full origin-bottom"
            style={{
              height: `${Math.max(4, r * 100)}%`,
              backgroundColor: r > 0.8 ? '#4a9f6240' : '#2d5a3d15',
            }}
          />
        ))}
      </div>
    </motion.div>
  )
}

/* ── TextSampleDensity ────────────────────────────────────────────────────── */

/**
 * Decorative type specimen strip showing pretext-computed word widths
 * as an editorial bar chart.
 */
export const TextSampleDensity = ({ className = '' }) => {
  const bars = useMemo(() => {
    try {
      const text = 'creativity meets code'
      const prepared = prepare(text, '14px Manrope')
      const { lines } = layoutWithLines(prepared, 500, 22)
      const allWords = []
      for (const line of lines) {
        const words = line.text.split(/\s+/).filter(Boolean)
        for (const w of words) {
          const p = prepare(w, '14px Manrope')
          const l = layout(p, 500, 22)
          allWords.push({ text: w, width: l.lastLineWidth })
        }
      }
      const maxW = Math.max(...allWords.map((w) => w.width), 1)
      return allWords.map((w) => ({ ...w, ratio: w.width / maxW }))
    } catch {
      return []
    }
  }, [])

  if (!bars.length) return null

  return (
    <motion.div
      className={`mt-6 ${className}`}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay: 0.6, duration: 0.5 }}
    >
      <div className="flex items-end gap-[3px] h-5 justify-center">
        {bars.map((b, i) => (
          <motion.div
            key={b.text + i}
            className="rounded-sm origin-bottom"
            title={`"${b.text}" — ${b.width.toFixed(1)}px`}
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 + i * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            style={{
              width: `${Math.max(6, b.ratio * 40)}px`,
              height: `${Math.max(3, b.ratio * 100)}%`,
              backgroundColor: b.ratio > 0.6 ? '#4a9f6230' : '#2d5a3d10',
            }}
          />
        ))}
      </div>
      <p className="mt-2 text-center text-[0.5rem] font-heading tracking-widest text-ink-faint/40 uppercase">
        Type Sample — &ldquo;{bars.map((b) => b.text).join(' ')}&rdquo;
      </p>
    </motion.div>
  )
}
