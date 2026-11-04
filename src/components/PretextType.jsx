/**
 * PretextType.jsx
 *
 * Typography that needs to know where lines break before anything is painted, which is what pretext
 * measures without touching the DOM. Screen readers get the plain text; the positioned lines are hidden
 * from them, since they would otherwise read as many separate fragments.
 */

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { clearCache, layoutNextLine, measureNaturalWidth, prepareWithSegments } from '@chenglou/pretext'

const EASE = [0.22, 1, 0.36, 1]

/** pretext caches glyph widths by font, so a web font arriving late means measuring again. */
function useFontVersion() {
  const [version, setVersion] = useState(0)

  useEffect(() => {
    const remeasure = () => {
      clearCache()
      setVersion((value) => value + 1)
    }
    document.fonts.addEventListener('loadingdone', remeasure)
    return () => document.fonts.removeEventListener('loadingdone', remeasure)
  }, [])

  return version
}

export function useElementWidth() {
  const ref = useRef(null)
  const [width, setWidth] = useState(0)

  useLayoutEffect(() => {
    const element = ref.current
    setWidth(element.getBoundingClientRect().width)
    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width))
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return [ref, width]
}

/**
 * One line rising out of its own mask once it scrolls into view. The outer span is what gets observed:
 * the inner one starts fully clipped, so the browser would never report it as visible.
 */
function RevealLine({ index, className = '', style, children }) {
  return (
    <motion.span
      aria-hidden="true"
      className={`type-line ${className}`}
      style={style}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, margin: '-40px' }}
    >
      <motion.span
        className="type-line__inner"
        variants={{ hidden: { y: '112%' }, shown: { y: 0 } }}
        transition={{ duration: 0.9, delay: index * 0.05, ease: EASE }}
      >
        {children}
      </motion.span>
    </motion.span>
  )
}

/**
 * Sets each line at whatever size makes it fill the column exactly, like a letterpress poster.
 * `font` is everything in the CSS font shorthand except the size, for example `italic 400 "Instrument Serif"`.
 */
export function FitLines({ lines, font, as: Tag = 'p', maxSize = Infinity, className = '' }) {
  const [ref, width] = useElementWidth()
  const fontVersion = useFontVersion()

  const sizes = useMemo(() => {
    if (!width) return []
    const [before, family] = font.split(/\s(?=")/)
    return lines.map((line) => {
      const natural = measureNaturalWidth(prepareWithSegments(line, `${before} 100px ${family}`))
      // Just shy of full width, since canvas and layout can round glyph widths differently
      return Math.min(((width * 0.995) / natural) * 100, maxSize)
    })
    // fontVersion is what makes this measure again once the real font has loaded
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lines, font, maxSize, width, fontVersion])

  return (
    <Tag ref={ref} className={`type-fit ${className}`} dir="ltr">
      <span className="sr-only">{lines.join(' ')}</span>
      {lines.map((line, index) => (
        <RevealLine key={line} index={index} style={{ fontSize: sizes[index] }}>
          {line}
        </RevealLine>
      ))}
    </Tag>
  )
}

/**
 * Lays text out line by line, asking `insetAt(y)` how far each line must start from the edge. That lets
 * it wrap around any shape. Each block is { text, as, font, lineHeight, className, gapAfter }, where
 * `font` is a full CSS font shorthand.
 */
export function FlowText({ blocks, width, insetAt, minHeight = 0 }) {
  const fontVersion = useFontVersion()

  const { laidOut, height } = useMemo(() => {
    let y = 0
    let lineIndex = 0
    const result = blocks.map((block) => {
      const prepared = prepareWithSegments(block.text, block.font)
      const lines = []
      let cursor = { segmentIndex: 0, graphemeIndex: 0 }
      for (;;) {
        // The wider of the two edges of this line's band, so that no glyph touches the shape
        const inset = Math.max(insetAt(y), insetAt(y + block.lineHeight))
        const line = layoutNextLine(prepared, cursor, width - inset)
        if (!line) break
        lines.push({ text: line.text, inset, y, index: lineIndex })
        lineIndex += 1
        cursor = line.end
        y += block.lineHeight
      }
      y += block.gapAfter || 0
      return { ...block, lines }
    })
    return { laidOut: result, height: y }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blocks, width, insetAt, fontVersion])

  return (
    <div className="type-flow" style={{ height: Math.max(height, minHeight) }}>
      {laidOut.map(({ text, as: Tag = 'p', font, lineHeight, className = '', lines }) => (
        <Tag key={text} className="type-flow__block">
          <span className="sr-only">{text}</span>
          {lines.map((line) => (
            <RevealLine
              key={line.index}
              index={line.index}
              className={`type-line--flow ${className}`}
              style={{ font, lineHeight: `${lineHeight}px`, height: lineHeight, top: line.y, insetInlineStart: line.inset }}
            >
              {line.text}
            </RevealLine>
          ))}
        </Tag>
      ))}
    </div>
  )
}
