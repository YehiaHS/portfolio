/**
 * sections/Hero.jsx
 *
 * Hero section with a full Wix-style visual editor studio:
 * - Layout drag/slider editing for hero layers
 * - Global design token editing (colors, fonts, spacing)
 * - Typography controls
 * - Visibility toggles for hero elements
 * - Custom CSS selector rules for any page element
 * - Local presets + JSON export/import for push-ready snapshots
 */

import { useRef, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView, AnimatePresence, useMotionValue } from 'framer-motion'
import { createPortal } from 'react-dom'
import { useLanguage } from '../LanguageContext'
import { getQuotes } from '../i18n'
import heroEditorDefault from '../data/heroEditorDefault.json'

const STORAGE_KEY = 'ys:wix-style-editor:v4'
const PRESETS_KEY = 'ys:wix-style-editor:presets:v1'
const RULE_STYLE_TAG_ID = 'wix-style-editor-overrides'
const DEFAULT_GRID = {
  columns: 100,
  rows: 100,
  snap: 0.25,
}

const clamp = (value, min, max) => Math.min(max, Math.max(min, value))
const snapToStep = (value, step) => {
  const safeStep = Number(step)
  if (!Number.isFinite(safeStep) || safeStep <= 0) return value
  return Math.round(value / safeStep) * safeStep
}
const safeGridMax = (value, fallback = 100) => {
  const numeric = Number(value)
  if (!Number.isFinite(numeric) || numeric <= 0) return fallback
  return numeric
}
const gridToPercent = (gridValue, gridMax) => {
  const max = safeGridMax(gridMax)
  return (Number(gridValue) / max) * 100
}

const createDefaultEditorConfig = () => JSON.parse(JSON.stringify(heroEditorDefault))

const normalizeRule = (rule, index) => ({
  id: rule?.id || `rule-${Date.now()}-${index}`,
  selector: typeof rule?.selector === 'string' ? rule.selector : '',
  property: typeof rule?.property === 'string' ? rule.property : 'color',
  value: typeof rule?.value === 'string' ? rule.value : '#ffffff',
  enabled: rule?.enabled !== false,
})

const normalizeEditorConfig = (candidate) => {
  const base = createDefaultEditorConfig()
  if (!candidate || typeof candidate !== 'object') return base

  const merged = {
    ...base,
    ...candidate,
    layoutMode: candidate.layoutMode !== false,
    grid: { ...(base.grid || DEFAULT_GRID), ...(candidate.grid || {}) },
    positions: { ...base.positions, ...(candidate.positions || {}) },
    visibility: { ...base.visibility, ...(candidate.visibility || {}) },
    tokens: { ...base.tokens, ...(candidate.tokens || {}) },
    global: { ...base.global, ...(candidate.global || {}) },
    sizes: { ...base.sizes, ...(candidate.sizes || {}) },
    layers: { ...base.layers, ...(candidate.layers || {}) },
    ui: { ...base.ui, ...(candidate.ui || {}) },
    customRules: Array.isArray(candidate.customRules)
      ? candidate.customRules.map(normalizeRule)
      : base.customRules,
  }

  merged.grid.columns = safeGridMax(merged.grid.columns, DEFAULT_GRID.columns)
  merged.grid.rows = safeGridMax(merged.grid.rows, DEFAULT_GRID.rows)
  merged.grid.snap = clamp(Number(merged.grid.snap) || DEFAULT_GRID.snap, 0.05, 5)

  merged.global.rootFontSize = clamp(Number(merged.global.rootFontSize) || 16, 12, 24)
  merged.global.bodyLineHeight = clamp(Number(merged.global.bodyLineHeight) || 1.7, 1.1, 2.4)
  merged.global.bodyLetterSpacing = clamp(Number(merged.global.bodyLetterSpacing) || 0, -1.5, 3)
  merged.global.contentMaxWidth = clamp(Number(merged.global.contentMaxWidth) || 80, 56, 140)
  merged.sizes.helloScale = clamp(Number(merged.sizes.helloScale) || 1, 0.5, 2)
  merged.sizes.yehiaScale = clamp(Number(merged.sizes.yehiaScale) || 1, 0.5, 2)
  merged.sizes.salemScale = clamp(Number(merged.sizes.salemScale) || 1, 0.5, 2)
  merged.sizes.statsScale = clamp(Number(merged.sizes.statsScale) || 1, 0.5, 2)
  merged.sizes.portraitHeight = clamp(Number(merged.sizes.portraitHeight) || 92, 40, 100)
  merged.sizes.portraitScale = clamp(Number(merged.sizes.portraitScale) || 1.05, 0.6, 2)
  merged.sizes.infoWidth = clamp(Number(merged.sizes.infoWidth) || 440, 260, 760)
  merged.sizes.infoPadding = clamp(Number(merged.sizes.infoPadding) || 2, 0.5, 4)

  const layerKeys = Object.keys(base.layers)
  for (const key of layerKeys) {
    const layer = { ...base.layers[key], ...(merged.layers[key] || {}) }
    merged.layers[key] = {
      z: clamp(Number(layer.z) || base.layers[key].z, 0, 100),
      locked: Boolean(layer.locked),
      opacity: clamp(Number(layer.opacity) || base.layers[key].opacity, 0.1, 1),
    }
  }

  const positionKeys = Object.keys(base.positions)
  for (const key of positionKeys) {
    const pos = merged.positions[key] || base.positions[key]
    const snappedX = snapToStep(clamp(Number(pos.x), 0, merged.grid.columns), merged.grid.snap)
    const snappedY = snapToStep(clamp(Number(pos.y), 0, merged.grid.rows), merged.grid.snap)
    merged.positions[key] = {
      x: Number(snappedX.toFixed(3)),
      y: Number(snappedY.toFixed(3)),
    }
  }

  merged.ui.simpleMode = candidate?.ui?.simpleMode !== false

  return merged
}

const loadEditorConfig = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return createDefaultEditorConfig()
    return normalizeEditorConfig(JSON.parse(raw))
  } catch {
    return createDefaultEditorConfig()
  }
}

const loadPresets = () => {
  try {
    const raw = localStorage.getItem(PRESETS_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter((item) => item && typeof item === 'object' && item.name && item.config)
  } catch {
    return []
  }
}

const colorTokenControls = [
  { key: '--paper', label: 'Paper' },
  { key: '--paper-darker', label: 'Paper Darker' },
  { key: '--paper-darkest', label: 'Paper Darkest' },
  { key: '--ink', label: 'Ink' },
  { key: '--ink-light', label: 'Ink Light' },
  { key: '--ink-faint', label: 'Ink Faint' },
  { key: '--accent', label: 'Accent' },
  { key: '--accent-deep', label: 'Accent Deep' },
  { key: '--accent-light', label: 'Accent Light' },
  { key: '--sage', label: 'Sage' },
  { key: '--sage-light', label: 'Sage Light' },
]

const fontStacks = [
  { label: 'Fraunces', value: "'Fraunces', Georgia, serif" },
  { label: 'Instrument Serif', value: "'Instrument Serif', Georgia, serif" },
  { label: 'Syne', value: "'Syne', sans-serif" },
  { label: 'Manrope', value: "'Manrope', system-ui, sans-serif" },
  { label: 'Georgia', value: "Georgia, 'Times New Roman', serif" },
  { label: 'Arial', value: "Arial, Helvetica, sans-serif" },
]

const visibilityControls = [
  { key: 'ambientGlow', label: 'Ambient Glow' },
  { key: 'serial', label: 'Big Serial Number' },
  { key: 'stats', label: 'Stats Column' },
  { key: 'hello', label: 'Hello Line' },
  { key: 'yehia', label: 'Yehia Wordmark' },
  { key: 'portrait', label: 'Portrait Layer' },
  { key: 'salem', label: 'Salem Wordmark' },
  { key: 'info', label: 'Info Card' },
  { key: 'scrollIndicator', label: 'Scroll Indicator' },
]

const positionControls = [
  { key: 'hello', label: 'Hello' },
  { key: 'yehia', label: 'Yehia' },
  { key: 'salem', label: 'Salem' },
  { key: 'portrait', label: 'Portrait' },
  { key: 'info', label: 'Info Card' },
  { key: 'stat0', label: 'Stats #1' },
  { key: 'stat1', label: 'Stats #2' },
  { key: 'stat2', label: 'Stats #3' },
  { key: 'stat3', label: 'Stats #4' },
]

const sizeControls = [
  { key: 'helloScale', label: 'Hello Scale', min: 0.5, max: 2, step: 0.01 },
  { key: 'yehiaScale', label: 'Yehia Scale', min: 0.5, max: 2, step: 0.01 },
  { key: 'salemScale', label: 'Salem Scale', min: 0.5, max: 2, step: 0.01 },
  { key: 'statsScale', label: 'Stats Scale', min: 0.5, max: 2, step: 0.01 },
  { key: 'portraitHeight', label: 'Portrait Height (vh)', min: 40, max: 100, step: 1 },
  { key: 'portraitScale', label: 'Portrait Zoom', min: 0.6, max: 2, step: 0.01 },
  { key: 'infoWidth', label: 'Info Card Width (px)', min: 260, max: 760, step: 1 },
  { key: 'infoPadding', label: 'Info Card Padding (rem)', min: 0.5, max: 4, step: 0.05 },
]

const editorTabs = [
  { id: 'layout', label: 'Layout' },
  { id: 'theme', label: 'Theme' },
  { id: 'type', label: 'Type' },
  { id: 'elements', label: 'Elements' },
  { id: 'save', label: 'Save' },
]

const layerControls = [
  { key: 'serial', label: 'Serial 01' },
  { key: 'stats', label: 'Stats Group' },
  { key: 'hello', label: 'Hello Label' },
  { key: 'yehia', label: 'Yehia Wordmark' },
  { key: 'portrait', label: 'Portrait' },
  { key: 'salem', label: 'Salem Wordmark' },
  { key: 'info', label: 'Info Card' },
  { key: 'scrollIndicator', label: 'Scroll Indicator' },
]

/* ── Shared fade-up variant ──────────────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } },
}

const AnimatedSection = ({ children, className = '', delay = 0 }) => {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div ref={ref} initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={fadeUp} transition={{ delay }} className={className}>
      {children}
    </motion.div>
  )
}

const EditableLayer = ({
  layerId,
  dragKey,
  layer,
  isLayoutEditing,
  dragConstraintsRef,
  onCommit,
  scale = 1,
  style,
  className,
  initial,
  animate,
  transition,
  children,
}) => {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const canDrag = isLayoutEditing && !layer.locked

  const handleDragEnd = (event) => {
    onCommit(dragKey, event.currentTarget)
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      drag={canDrag}
      dragConstraints={dragConstraintsRef}
      dragMomentum={false}
      dragElastic={0}
      dragTransition={{ power: 0, timeConstant: 0 }}
      onDragEnd={handleDragEnd}
      initial={initial}
      animate={animate}
      transition={transition}
      x={x}
      y={y}
      className={className}
      style={{ ...style, zIndex: layer.z, opacity: layer.opacity, transformOrigin: 'top left', scale }}
      data-layer-id={layerId}
    >
      {children}
    </motion.div>
  )
}

/* ── Quote Block Component ────────────────────────────────────────────────── */
const QuoteBlock = () => {
  const { language } = useLanguage()
  const allQuotes = getQuotes(language)
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (!allQuotes.length) return undefined
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % allQuotes.length)
    }, 8000)
    return () => clearInterval(timer)
  }, [allQuotes.length])

  if (!allQuotes.length) return null
  const quote = allQuotes[index]

  return (
    <div className="border-l border-[#4a9f62]/30 pl-6 mb-10 min-h-[120px] flex flex-col justify-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={`${language}-${index}`}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
        >
          <p className="text-ink-faint italic text-lg lg:text-xl serif-italic leading-relaxed opacity-80 max-w-[380px]">
            "{quote.text}"
          </p>
          <p className="text-right text-ink-faint/40 text-[0.6rem] tracking-[0.2em] mt-4 uppercase font-heading">
            - {quote.source}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

/* ── Hero ────────────────────────────────────────────────────────────────── */
export default function Hero() {
  const canvasRef = useRef(null)
  const quickToggleRef = useRef({ count: 0, lastTs: 0 })
  const [heroOpacity, setHeroOpacity] = useState(1)
  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('layout')
  const [editorConfig, setEditorConfig] = useState(loadEditorConfig)
  const [savedPresets, setSavedPresets] = useState(loadPresets)
  const [presetName, setPresetName] = useState('')
  const [importPayload, setImportPayload] = useState('')

  const { t } = useLanguage()

  const stats = [
    { n: '3', l: 'Languages' },
    { n: '2', l: 'Degrees' },
    { n: '8.5', l: 'IELTS Score' },
    { n: '10+', l: 'Design Tools' },
  ]

  const availableTabs = editorConfig.ui.simpleMode
    ? editorTabs.filter((tab) => tab.id === 'layout' || tab.id === 'save')
    : editorTabs

  const isLayoutEditing = isEditorOpen && editorConfig.layoutMode
  const gridColumns = safeGridMax(editorConfig.grid?.columns, DEFAULT_GRID.columns)
  const gridRows = safeGridMax(editorConfig.grid?.rows, DEFAULT_GRID.rows)
  const gridSnap = clamp(Number(editorConfig.grid?.snap) || DEFAULT_GRID.snap, 0.05, 5)

  const updatePositionFromElement = (key, element) => {
    if (!canvasRef.current || !element) return

    const canvasRect = canvasRef.current.getBoundingClientRect()
    const elementRect = element.getBoundingClientRect()

    const xPx = elementRect.left - canvasRect.left
    const yPx = elementRect.top - canvasRect.top

    const xGrid = snapToStep(clamp((xPx / Math.max(canvasRect.width, 1)) * gridColumns, 0, gridColumns), gridSnap)
    const yGrid = snapToStep(clamp((yPx / Math.max(canvasRect.height, 1)) * gridRows, 0, gridRows), gridSnap)

    setEditorConfig((prev) => ({
      ...prev,
      positions: {
        ...prev.positions,
        [key]: { x: Number(xGrid.toFixed(3)), y: Number(yGrid.toFixed(3)) },
      },
    }))
  }

  const updatePositionAxis = (key, axis, value) => {
    const axisMax = axis === 'x' ? gridColumns : gridRows
    const numeric = snapToStep(clamp(Number(value), 0, axisMax), gridSnap)
    setEditorConfig((prev) => ({
      ...prev,
      positions: {
        ...prev.positions,
        [key]: {
          ...prev.positions[key],
          [axis]: Number(numeric.toFixed(3)),
        },
      },
    }))
  }

  const clampAllPositions = () => {
    setEditorConfig((prev) => {
      const nextPositions = { ...prev.positions }
      let changed = false
      for (const key of Object.keys(nextPositions)) {
        const x = Number(snapToStep(clamp(Number(nextPositions[key].x), 0, gridColumns), gridSnap).toFixed(3))
        const y = Number(snapToStep(clamp(Number(nextPositions[key].y), 0, gridRows), gridSnap).toFixed(3))
        if (x !== nextPositions[key].x || y !== nextPositions[key].y) {
          nextPositions[key] = { x, y }
          changed = true
        }
      }
      if (!changed) return prev
      return { ...prev, positions: nextPositions }
    })
  }

  const updateToken = (token, value) => {
    setEditorConfig((prev) => ({
      ...prev,
      tokens: {
        ...prev.tokens,
        [token]: value,
      },
    }))
  }

  const updateGlobal = (key, value, min, max) => {
    const numeric = clamp(Number(value), min, max)
    setEditorConfig((prev) => ({
      ...prev,
      global: {
        ...prev.global,
        [key]: numeric,
      },
    }))
  }

  const updateSize = (key, value, min, max) => {
    setEditorConfig((prev) => ({
      ...prev,
      sizes: {
        ...prev.sizes,
        [key]: clamp(Number(value), min, max),
      },
    }))
  }

  const updateLayer = (key, patch) => {
    setEditorConfig((prev) => ({
      ...prev,
      layers: {
        ...prev.layers,
        [key]: {
          ...prev.layers[key],
          ...patch,
        },
      },
    }))
  }

  const toggleLayerLock = (key) => {
    updateLayer(key, { locked: !editorConfig.layers[key].locked })
  }

  const toggleVisibility = (key) => {
    setEditorConfig((prev) => ({
      ...prev,
      visibility: {
        ...prev.visibility,
        [key]: !prev.visibility[key],
      },
    }))
  }

  const addCustomRule = () => {
    setEditorConfig((prev) => ({
      ...prev,
      customRules: [
        ...prev.customRules,
        normalizeRule({
          selector: '.section-number',
          property: 'color',
          value: prev.tokens['--accent'] || '#4a9f62',
          enabled: true,
        }, prev.customRules.length),
      ],
    }))
  }

  const updateCustomRule = (id, patch) => {
    setEditorConfig((prev) => ({
      ...prev,
      customRules: prev.customRules.map((rule) => (rule.id === id ? { ...rule, ...patch } : rule)),
    }))
  }

  const removeCustomRule = (id) => {
    setEditorConfig((prev) => ({
      ...prev,
      customRules: prev.customRules.filter((rule) => rule.id !== id),
    }))
  }

  const getStyle = (key) => ({
    left: `${gridToPercent(editorConfig.positions[key].x, gridColumns)}%`,
    top: `${gridToPercent(editorConfig.positions[key].y, gridRows)}%`,
    position: 'absolute',
  })

  const copyText = async (value, successMessage) => {
    try {
      await navigator.clipboard.writeText(value)
      alert(successMessage)
    } catch {
      console.log(value)
      alert('Clipboard unavailable in this browser context. JSON was sent to the console instead.')
    }
  }

  const exportConfig = async () => {
    const payload = JSON.stringify(editorConfig, null, 2)
    await copyText(payload, 'Editor JSON copied. Paste it into a file and push your adjusted version.')
  }

  const copyGitSnippet = async () => {
    const snippet = `export const pushedStyleEditorPreset = ${JSON.stringify(editorConfig, null, 2)}\n`
    await copyText(snippet, 'Git-ready preset snippet copied.')
  }

  const downloadConfig = () => {
    const blob = new Blob([JSON.stringify(editorConfig, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'style-editor-preset.json'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const importConfig = () => {
    if (!importPayload.trim()) {
      alert('Paste JSON before importing.')
      return
    }

    try {
      const parsed = JSON.parse(importPayload)
      setEditorConfig(normalizeEditorConfig(parsed))
      setImportPayload('')
      alert('Preset imported and applied.')
    } catch {
      alert('Invalid JSON. Check your payload and try again.')
    }
  }

  const savePreset = () => {
    const normalizedName = presetName.trim()
    if (!normalizedName) {
      alert('Give your preset a name first.')
      return
    }

    const preset = {
      id: `${Date.now()}`,
      name: normalizedName,
      updatedAt: new Date().toISOString(),
      config: editorConfig,
    }

    setSavedPresets((prev) => [preset, ...prev])
    setPresetName('')
  }

  const loadPreset = (preset) => {
    setEditorConfig(normalizeEditorConfig(preset.config))
  }

  const deletePreset = (id) => {
    setSavedPresets((prev) => prev.filter((preset) => preset.id !== id))
  }

  const resetAll = () => {
    if (!window.confirm('Reset all editor settings to defaults?')) return
    setEditorConfig(createDefaultEditorConfig())
  }

  useEffect(() => {
    if (!availableTabs.some((tab) => tab.id === activeTab)) {
      setActiveTab('layout')
    }
  }, [activeTab, availableTabs])

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      const opacity = Math.max(0, 1 - scrollY / 600)
      setHeroOpacity(opacity)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleEditorHotkey = (event) => {
      const key = typeof event.key === 'string' ? event.key.toLowerCase() : ''
      const isEKey = key === 'e' || event.code === 'KeyE'
      const hasPrimaryModifier = event.ctrlKey || event.metaKey
      const isPrimaryHotkey = hasPrimaryModifier && event.shiftKey && isEKey
      const isAltHotkey = hasPrimaryModifier && event.altKey && isEKey

      const now = Date.now()
      if (isEKey && !event.ctrlKey && !event.metaKey && !event.altKey && !event.shiftKey) {
        const withinBurstWindow = now - quickToggleRef.current.lastTs < 700
        quickToggleRef.current.count = withinBurstWindow ? quickToggleRef.current.count + 1 : 1
        quickToggleRef.current.lastTs = now
      } else {
        quickToggleRef.current.count = 0
      }

      const isBurstFallback = quickToggleRef.current.count >= 3
      const isToggleHotkey = isPrimaryHotkey || isAltHotkey || isBurstFallback

      if (isToggleHotkey) {
        event.preventDefault()
        setIsEditorOpen((prev) => !prev)
        quickToggleRef.current.count = 0
      }

      if (event.key === 'Escape') {
        setIsEditorOpen(false)
      }
    }

    window.addEventListener('keydown', handleEditorHotkey, true)
    return () => {
      window.removeEventListener('keydown', handleEditorHotkey, true)
    }
  }, [])

  useEffect(() => {
    const handleViewportChange = () => {
      clampAllPositions()
    }

    window.addEventListener('resize', handleViewportChange)
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleViewportChange)
      window.visualViewport.addEventListener('scroll', handleViewportChange)
    }

    return () => {
      window.removeEventListener('resize', handleViewportChange)
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleViewportChange)
        window.visualViewport.removeEventListener('scroll', handleViewportChange)
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(editorConfig))
  }, [editorConfig])

  useEffect(() => {
    localStorage.setItem(PRESETS_KEY, JSON.stringify(savedPresets))
  }, [savedPresets])

  useEffect(() => {
    const root = document.documentElement

    Object.entries(editorConfig.tokens).forEach(([token, value]) => {
      root.style.setProperty(token, String(value))
    })

    root.style.fontSize = `${editorConfig.global.rootFontSize}px`
    document.body.style.letterSpacing = `${editorConfig.global.bodyLetterSpacing}px`
    document.body.style.lineHeight = String(editorConfig.global.bodyLineHeight)

    let styleTag = document.getElementById(RULE_STYLE_TAG_ID)
    if (!styleTag) {
      styleTag = document.createElement('style')
      styleTag.id = RULE_STYLE_TAG_ID
      document.head.appendChild(styleTag)
    }

    const maxW = editorConfig.global.contentMaxWidth
    const maxXl = Math.max(28, Math.round(maxW * 0.42))

    const customCss = editorConfig.customRules
      .filter((rule) => rule.enabled && rule.selector.trim() && rule.property.trim())
      .map((rule) => `${rule.selector} { ${rule.property}: ${rule.value}; }`)
      .join('\n')

    styleTag.textContent = `
      .max-w-7xl { max-width: min(${maxW}rem, calc(100vw - 2.5rem)) !important; }
      .max-w-xl { max-width: min(${maxXl}rem, 100%) !important; }
      ${customCss}
    `
  }, [editorConfig])

  return (
    <section className="relative h-screen min-h-[800px] w-full overflow-hidden bg-[#0d1410] font-body flex items-center justify-center pt-16">
      {/* Wix-style editor trigger + panel */}
      {typeof document !== 'undefined' && isEditorOpen && createPortal(
      <div className="fixed bottom-3 right-3 z-[160] pointer-events-auto">
        <div className="flex justify-end gap-2 mb-2">
          <button
            onClick={exportConfig}
            className="bg-[#111c14] text-ink border border-[#4a9f62]/50 px-4 py-2 rounded-full font-bold text-[0.58rem] uppercase tracking-[0.18em] shadow-2xl hover:bg-[#1a2a1f]"
          >
            Export JSON
          </button>
          <button
            onClick={() => setIsEditorOpen((prev) => !prev)}
            className="bg-[#4a9f62] text-white px-5 py-2 rounded-full font-bold text-[0.62rem] uppercase tracking-[0.2em] shadow-2xl"
          >
            {isEditorOpen ? 'Hide Studio' : 'Open Studio'}
          </button>
        </div>

        <div className="wix-editor-panel w-[min(96vw,540px)] max-h-[calc(100dvh-4.5rem)] overscroll-contain overflow-y-auto overflow-x-hidden rounded-2xl border border-[#4a9f62]/35 bg-[#0d1410]/95 backdrop-blur-xl shadow-[0_50px_100px_-30px_rgba(0,0,0,0.8)]">
            <div className="p-4 border-b border-[#4a9f62]/20">
              <p className="text-[0.58rem] tracking-[0.24em] uppercase text-ink-faint">Wix Style Studio</p>
              <h3 className="font-display text-xl text-ink mt-1">Global Visual Editor</h3>
              <p className="text-[0.72rem] text-ink-faint mt-1">Edit tokens, target selectors, save presets, then export push-ready JSON. Toggle with Ctrl/Cmd + Shift + E, Ctrl/Cmd + Alt + E, or press E three times.</p>
              <div className="mt-3 flex items-center justify-between rounded-md border border-[#4a9f62]/20 bg-[#101811] px-3 py-2">
                <span className="text-[0.58rem] uppercase tracking-[0.18em] text-ink-faint">Simple Mode</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={exportConfig}
                    className="px-2.5 py-1 rounded-full text-[0.52rem] uppercase tracking-[0.14em] bg-[#1f2f24] text-ink hover:bg-[#2a3b2f]"
                  >
                    Export
                  </button>
                  <button
                    onClick={() => setEditorConfig((prev) => ({ ...prev, ui: { ...prev.ui, simpleMode: !prev.ui.simpleMode } }))}
                    className={`px-2.5 py-1 rounded-full text-[0.55rem] uppercase tracking-[0.15em] ${editorConfig.ui.simpleMode ? 'bg-[#4a9f62] text-white' : 'bg-[#1f2f24] text-ink-faint'}`}
                  >
                    {editorConfig.ui.simpleMode ? 'On' : 'Off'}
                  </button>
                </div>
              </div>
            </div>

            <div className="grid gap-1 p-2 border-b border-[#4a9f62]/15 bg-[#0f1712]" style={{ gridTemplateColumns: `repeat(${availableTabs.length}, minmax(0, 1fr))` }}>
              {availableTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`text-[0.58rem] uppercase tracking-[0.18em] py-2 rounded-md transition-colors ${
                    activeTab === tab.id ? 'bg-[#4a9f62] text-white' : 'text-ink-faint hover:text-ink hover:bg-[#4a9f62]/15'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="p-4 space-y-4">
              {activeTab === 'layout' && (
                <>
                  <div className="flex items-center justify-between rounded-lg border border-[#4a9f62]/20 bg-[#111c14]/80 px-3 py-2">
                    <div>
                      <p className="text-[0.65rem] uppercase tracking-[0.2em] text-ink-faint">Drag Mode</p>
                      <p className="text-[0.72rem] text-ink-faint">Enable dragging on hero layers.</p>
                    </div>
                    <button
                      onClick={() => setEditorConfig((prev) => ({ ...prev, layoutMode: !prev.layoutMode }))}
                      className={`px-3 py-1.5 rounded-full text-[0.58rem] uppercase tracking-[0.16em] font-semibold ${
                        editorConfig.layoutMode ? 'bg-[#4a9f62] text-white' : 'bg-[#1f2f24] text-ink-faint'
                      }`}
                    >
                      {editorConfig.layoutMode ? 'On' : 'Off'}
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {visibilityControls.map((entry) => (
                      <button
                        key={entry.key}
                        onClick={() => toggleVisibility(entry.key)}
                        className={`text-left px-3 py-2 rounded-md border transition-colors ${
                          editorConfig.visibility[entry.key]
                            ? 'border-[#4a9f62]/50 bg-[#4a9f62]/20 text-ink'
                            : 'border-[#4a9f62]/20 bg-[#101811] text-ink-faint'
                        }`}
                      >
                        <span className="text-[0.6rem] uppercase tracking-[0.18em] block">{entry.label}</span>
                      </button>
                    ))}
                  </div>

                  <div className="rounded-lg border border-[#4a9f62]/20 bg-[#111c14]/70 p-3">
                    <p className="text-[0.62rem] uppercase tracking-[0.22em] text-ink mb-3">Layer Adjustments</p>
                    <div className="space-y-3">
                      {layerControls.map((layer) => (
                        <div key={layer.key} className="rounded-md border border-[#4a9f62]/20 bg-[#0f1712] p-2">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[0.56rem] uppercase tracking-[0.16em] text-ink">{layer.label}</span>
                            <button
                              onClick={() => toggleLayerLock(layer.key)}
                              className={`px-2 py-1 rounded text-[0.52rem] uppercase tracking-[0.14em] ${editorConfig.layers[layer.key].locked ? 'bg-[#4a9f62] text-white' : 'bg-[#1f2f24] text-ink-faint'}`}
                            >
                              {editorConfig.layers[layer.key].locked ? 'Locked' : 'Unlocked'}
                            </button>
                          </div>

                          <div className="space-y-2">
                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <label className="text-[0.52rem] uppercase tracking-[0.14em] text-ink-faint">Order (z-index)</label>
                                <span className="text-[0.52rem] text-ink-faint">{editorConfig.layers[layer.key].z}</span>
                              </div>
                              <input
                                type="range"
                                min="0"
                                max="100"
                                step="1"
                                value={editorConfig.layers[layer.key].z}
                                onChange={(e) => updateLayer(layer.key, { z: clamp(Number(e.target.value), 0, 100) })}
                                className="editor-range block w-full max-w-full min-w-0"
                              />
                            </div>

                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <label className="text-[0.52rem] uppercase tracking-[0.14em] text-ink-faint">Opacity</label>
                                <span className="text-[0.52rem] text-ink-faint">{editorConfig.layers[layer.key].opacity.toFixed(2)}</span>
                              </div>
                              <input
                                type="range"
                                min="0.1"
                                max="1"
                                step="0.01"
                                value={editorConfig.layers[layer.key].opacity}
                                onChange={(e) => updateLayer(layer.key, { opacity: clamp(Number(e.target.value), 0.1, 1) })}
                                className="editor-range block w-full max-w-full min-w-0"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    {positionControls.map((entry) => (
                      <div key={entry.key} className="rounded-lg border border-[#4a9f62]/20 bg-[#111c14]/70 p-3">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-[0.62rem] uppercase tracking-[0.22em] text-ink">{entry.label}</p>
                          <p className="text-[0.58rem] text-ink-faint">
                            X {editorConfig.positions[entry.key].x.toFixed(2)}g ({gridToPercent(editorConfig.positions[entry.key].x, gridColumns).toFixed(1)}%) / Y {editorConfig.positions[entry.key].y.toFixed(2)}g ({gridToPercent(editorConfig.positions[entry.key].y, gridRows).toFixed(1)}%)
                          </p>
                        </div>
                        <div className="space-y-2">
                          <div>
                            <label className="text-[0.58rem] uppercase tracking-[0.14em] text-ink-faint block mb-1">X</label>
                            <input
                              type="range"
                              min="0"
                              max={gridColumns}
                              step={gridSnap}
                              value={editorConfig.positions[entry.key].x}
                              onChange={(e) => updatePositionAxis(entry.key, 'x', e.target.value)}
                              className="editor-range block w-full max-w-full min-w-0"
                            />
                          </div>
                          <div>
                            <label className="text-[0.58rem] uppercase tracking-[0.14em] text-ink-faint block mb-1">Y</label>
                            <input
                              type="range"
                              min="0"
                              max={gridRows}
                              step={gridSnap}
                              value={editorConfig.positions[entry.key].y}
                              onChange={(e) => updatePositionAxis(entry.key, 'y', e.target.value)}
                              className="editor-range block w-full max-w-full min-w-0"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-lg border border-[#4a9f62]/20 bg-[#111c14]/70 p-3">
                    <p className="text-[0.62rem] uppercase tracking-[0.22em] text-ink mb-3">Resize Controls</p>
                    <div className="space-y-3">
                      {sizeControls.map((entry) => (
                        <div key={entry.key}>
                          <div className="flex items-center justify-between mb-1">
                            <label className="text-[0.58rem] uppercase tracking-[0.14em] text-ink-faint">{entry.label}</label>
                            <span className="text-[0.58rem] text-ink-faint">{Number(editorConfig.sizes[entry.key]).toFixed(entry.step < 1 ? 2 : 0)}</span>
                          </div>
                          <input
                            type="range"
                            min={entry.min}
                            max={entry.max}
                            step={entry.step}
                            value={editorConfig.sizes[entry.key]}
                            onChange={(e) => updateSize(entry.key, e.target.value, entry.min, entry.max)}
                            className="editor-range block w-full max-w-full min-w-0"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'theme' && (
                <>
                  <div className="rounded-lg border border-[#4a9f62]/20 bg-[#111c14]/70 p-3">
                    <label className="text-[0.6rem] uppercase tracking-[0.2em] text-ink-faint block mb-2">Content Width (max-w-7xl)</label>
                    <input
                      type="range"
                      min="56"
                      max="140"
                      step="1"
                      value={editorConfig.global.contentMaxWidth}
                      onChange={(e) => updateGlobal('contentMaxWidth', e.target.value, 56, 140)}
                      className="editor-range block w-full max-w-full min-w-0"
                    />
                    <p className="text-[0.64rem] text-ink-faint mt-2">{editorConfig.global.contentMaxWidth.toFixed(0)}rem</p>
                  </div>

                  <div className="space-y-2">
                    {colorTokenControls.map((token) => (
                      <div key={token.key} className="grid grid-cols-[1fr_auto] gap-2 items-center rounded-md border border-[#4a9f62]/20 bg-[#101811] p-2">
                        <div>
                          <label className="text-[0.58rem] uppercase tracking-[0.16em] text-ink-faint block">{token.label}</label>
                          <input
                            type="text"
                            value={editorConfig.tokens[token.key]}
                            onChange={(e) => updateToken(token.key, e.target.value)}
                            className="mt-1 w-full bg-[#0b130d] border border-[#4a9f62]/30 rounded px-2 py-1 text-[0.7rem] text-ink"
                          />
                        </div>
                        <input
                          type="color"
                          value={editorConfig.tokens[token.key]}
                          onChange={(e) => updateToken(token.key, e.target.value)}
                          className="w-9 h-9 border border-[#4a9f62]/35 rounded bg-transparent"
                        />
                      </div>
                    ))}
                  </div>
                </>
              )}

              {activeTab === 'type' && (
                <>
                  <div className="space-y-3">
                    <div className="rounded-lg border border-[#4a9f62]/20 bg-[#111c14]/70 p-3">
                      <label className="text-[0.6rem] uppercase tracking-[0.18em] text-ink-faint block mb-2">Display Font</label>
                      <select
                        value={editorConfig.tokens['--font-display']}
                        onChange={(e) => updateToken('--font-display', e.target.value)}
                        className="w-full bg-[#0b130d] border border-[#4a9f62]/30 rounded px-2 py-2 text-[0.72rem] text-ink"
                      >
                        {fontStacks.map((font) => (
                          <option key={`display-${font.value}`} value={font.value}>{font.label}</option>
                        ))}
                      </select>
                    </div>

                    <div className="rounded-lg border border-[#4a9f62]/20 bg-[#111c14]/70 p-3">
                      <label className="text-[0.6rem] uppercase tracking-[0.18em] text-ink-faint block mb-2">Heading Font</label>
                      <select
                        value={editorConfig.tokens['--font-heading']}
                        onChange={(e) => updateToken('--font-heading', e.target.value)}
                        className="w-full bg-[#0b130d] border border-[#4a9f62]/30 rounded px-2 py-2 text-[0.72rem] text-ink"
                      >
                        {fontStacks.map((font) => (
                          <option key={`heading-${font.value}`} value={font.value}>{font.label}</option>
                        ))}
                      </select>
                    </div>

                    <div className="rounded-lg border border-[#4a9f62]/20 bg-[#111c14]/70 p-3">
                      <label className="text-[0.6rem] uppercase tracking-[0.18em] text-ink-faint block mb-2">Body Font</label>
                      <select
                        value={editorConfig.tokens['--font-body']}
                        onChange={(e) => updateToken('--font-body', e.target.value)}
                        className="w-full bg-[#0b130d] border border-[#4a9f62]/30 rounded px-2 py-2 text-[0.72rem] text-ink"
                      >
                        {fontStacks.map((font) => (
                          <option key={`body-${font.value}`} value={font.value}>{font.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="rounded-lg border border-[#4a9f62]/20 bg-[#111c14]/70 p-3 space-y-3">
                    <div>
                      <label className="text-[0.6rem] uppercase tracking-[0.18em] text-ink-faint block mb-2">Root Font Size</label>
                      <input
                        type="range"
                        min="12"
                        max="24"
                        step="0.1"
                        value={editorConfig.global.rootFontSize}
                        onChange={(e) => updateGlobal('rootFontSize', e.target.value, 12, 24)}
                        className="editor-range block w-full max-w-full min-w-0"
                      />
                      <p className="text-[0.64rem] text-ink-faint mt-1">{editorConfig.global.rootFontSize.toFixed(1)}px</p>
                    </div>

                    <div>
                      <label className="text-[0.6rem] uppercase tracking-[0.18em] text-ink-faint block mb-2">Body Line Height</label>
                      <input
                        type="range"
                        min="1.1"
                        max="2.4"
                        step="0.01"
                        value={editorConfig.global.bodyLineHeight}
                        onChange={(e) => updateGlobal('bodyLineHeight', e.target.value, 1.1, 2.4)}
                        className="editor-range block w-full max-w-full min-w-0"
                      />
                      <p className="text-[0.64rem] text-ink-faint mt-1">{editorConfig.global.bodyLineHeight.toFixed(2)}</p>
                    </div>

                    <div>
                      <label className="text-[0.6rem] uppercase tracking-[0.18em] text-ink-faint block mb-2">Body Letter Spacing</label>
                      <input
                        type="range"
                        min="-1.5"
                        max="3"
                        step="0.05"
                        value={editorConfig.global.bodyLetterSpacing}
                        onChange={(e) => updateGlobal('bodyLetterSpacing', e.target.value, -1.5, 3)}
                        className="editor-range block w-full max-w-full min-w-0"
                      />
                      <p className="text-[0.64rem] text-ink-faint mt-1">{editorConfig.global.bodyLetterSpacing.toFixed(2)}px</p>
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'elements' && (
                <>
                  <p className="text-[0.7rem] text-ink-faint">Target any page element with selector + property + value. These rules apply live to the whole page.</p>

                  <button
                    onClick={addCustomRule}
                    className="w-full border border-[#4a9f62]/35 bg-[#4a9f62]/15 hover:bg-[#4a9f62]/25 text-ink py-2 rounded-md text-[0.62rem] uppercase tracking-[0.18em]"
                  >
                    Add Rule
                  </button>

                  <div className="space-y-2">
                    {editorConfig.customRules.length === 0 && (
                      <div className="rounded-md border border-dashed border-[#4a9f62]/25 p-3 text-[0.68rem] text-ink-faint">
                        No custom rules yet. Add one to style any selector.
                      </div>
                    )}

                    {editorConfig.customRules.map((rule) => (
                      <div key={rule.id} className="rounded-md border border-[#4a9f62]/25 bg-[#111c14]/70 p-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="flex items-center gap-2 text-[0.62rem] uppercase tracking-[0.18em] text-ink-faint">
                            <input
                              type="checkbox"
                              checked={rule.enabled}
                              onChange={(e) => updateCustomRule(rule.id, { enabled: e.target.checked })}
                            />
                            Enabled
                          </label>
                          <button
                            onClick={() => removeCustomRule(rule.id)}
                            className="text-[0.58rem] uppercase tracking-[0.18em] px-2 py-1 rounded border border-red-400/40 text-red-200 hover:bg-red-500/15"
                          >
                            Remove
                          </button>
                        </div>

                        <input
                          type="text"
                          value={rule.selector}
                          onChange={(e) => updateCustomRule(rule.id, { selector: e.target.value })}
                          placeholder="Selector (example: .section-number)"
                          className="w-full bg-[#0b130d] border border-[#4a9f62]/30 rounded px-2 py-1.5 text-[0.7rem] text-ink"
                        />

                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            value={rule.property}
                            onChange={(e) => updateCustomRule(rule.id, { property: e.target.value })}
                            placeholder="Property"
                            className="w-full bg-[#0b130d] border border-[#4a9f62]/30 rounded px-2 py-1.5 text-[0.7rem] text-ink"
                          />
                          <input
                            type="text"
                            value={rule.value}
                            onChange={(e) => updateCustomRule(rule.id, { value: e.target.value })}
                            placeholder="Value"
                            className="w-full bg-[#0b130d] border border-[#4a9f62]/30 rounded px-2 py-1.5 text-[0.7rem] text-ink"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {activeTab === 'save' && (
                <>
                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={exportConfig} className="border border-[#4a9f62]/35 bg-[#4a9f62]/15 hover:bg-[#4a9f62]/25 text-ink py-2 rounded-md text-[0.62rem] uppercase tracking-[0.18em]">
                      Copy JSON
                    </button>
                    <button onClick={downloadConfig} className="border border-[#4a9f62]/35 bg-[#4a9f62]/15 hover:bg-[#4a9f62]/25 text-ink py-2 rounded-md text-[0.62rem] uppercase tracking-[0.18em]">
                      Download
                    </button>
                    <button onClick={copyGitSnippet} className="border border-[#4a9f62]/35 bg-[#4a9f62]/15 hover:bg-[#4a9f62]/25 text-ink py-2 rounded-md text-[0.62rem] uppercase tracking-[0.18em] col-span-2">
                      Copy Git Snippet
                    </button>
                  </div>

                  <div className="rounded-lg border border-[#4a9f62]/20 bg-[#111c14]/70 p-3 space-y-2">
                    <label className="text-[0.6rem] uppercase tracking-[0.18em] text-ink-faint block">Save Browser Preset</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={presetName}
                        onChange={(e) => setPresetName(e.target.value)}
                        placeholder="Preset name"
                        className="flex-1 bg-[#0b130d] border border-[#4a9f62]/30 rounded px-2 py-1.5 text-[0.7rem] text-ink"
                      />
                      <button
                        onClick={savePreset}
                        className="px-3 py-1.5 rounded border border-[#4a9f62]/35 text-[0.58rem] uppercase tracking-[0.16em] text-ink hover:bg-[#4a9f62]/20"
                      >
                        Save
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {savedPresets.length === 0 && (
                      <div className="rounded-md border border-dashed border-[#4a9f62]/25 p-3 text-[0.68rem] text-ink-faint">
                        No saved presets yet.
                      </div>
                    )}
                    {savedPresets.map((preset) => (
                      <div key={preset.id} className="rounded-md border border-[#4a9f62]/25 bg-[#101811] p-3 flex items-center justify-between gap-3">
                        <div>
                          <p className="text-[0.62rem] uppercase tracking-[0.18em] text-ink">{preset.name}</p>
                          <p className="text-[0.58rem] text-ink-faint">{new Date(preset.updatedAt).toLocaleString()}</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => loadPreset(preset)}
                            className="px-2 py-1 rounded border border-[#4a9f62]/35 text-[0.55rem] uppercase tracking-[0.15em] text-ink hover:bg-[#4a9f62]/20"
                          >
                            Load
                          </button>
                          <button
                            onClick={() => deletePreset(preset.id)}
                            className="px-2 py-1 rounded border border-red-400/40 text-[0.55rem] uppercase tracking-[0.15em] text-red-200 hover:bg-red-500/15"
                          >
                            Del
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-lg border border-[#4a9f62]/20 bg-[#111c14]/70 p-3 space-y-2">
                    <label className="text-[0.6rem] uppercase tracking-[0.18em] text-ink-faint block">Import JSON</label>
                    <textarea
                      rows={5}
                      value={importPayload}
                      onChange={(e) => setImportPayload(e.target.value)}
                      placeholder="Paste exported JSON here"
                      className="w-full bg-[#0b130d] border border-[#4a9f62]/30 rounded px-2 py-2 text-[0.68rem] text-ink"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={importConfig}
                        className="flex-1 px-3 py-2 rounded border border-[#4a9f62]/35 text-[0.58rem] uppercase tracking-[0.16em] text-ink hover:bg-[#4a9f62]/20"
                      >
                        Apply Import
                      </button>
                      <button
                        onClick={resetAll}
                        className="px-3 py-2 rounded border border-red-400/45 text-[0.58rem] uppercase tracking-[0.16em] text-red-200 hover:bg-red-500/15"
                      >
                        Reset
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
      </div>,
        document.body
      )}

      {editorConfig.visibility.ambientGlow && (
        <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
          <div className="w-[600px] h-[600px] bg-[#4a9f62]/5 rounded-full blur-[120px]" />
        </div>
      )}

      <motion.div ref={canvasRef} style={{ opacity: heroOpacity }} className="absolute inset-0 w-full h-full pointer-events-none">
        {editorConfig.visibility.serial && (
          <div className="absolute right-[5%] top-[5%] font-display font-bold select-none pointer-events-none" style={{ fontSize: 'clamp(15rem, 35vh, 30rem)', lineHeight: 0.8, zIndex: editorConfig.layers.serial.z, opacity: 0.02 * editorConfig.layers.serial.opacity }}>
            01
          </div>
        )}

        {editorConfig.visibility.stats && stats.map((stat, i) => (
          <EditableLayer
            key={stat.l}
            layerId="stats"
            dragKey={`stat${i}`}
            layer={editorConfig.layers.stats}
            isLayoutEditing={isLayoutEditing}
            dragConstraintsRef={canvasRef}
            onCommit={updatePositionFromElement}
            scale={editorConfig.sizes.statsScale}
            className={`hidden lg:block text-center ${isLayoutEditing && !editorConfig.layers.stats.locked ? 'pointer-events-auto cursor-move border border-dashed border-[#4a9f62]/40 p-2 rounded-md bg-[#0d1410]/35' : 'pointer-events-auto'}`}
            style={getStyle(`stat${i}`)}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 + (i * 0.1), duration: 0.8 }}
          >
            <div className="text-[3rem] xl:text-[3.5rem] leading-none font-display font-bold text-[#5c9e6a] mb-2">{stat.n}</div>
            <div className="text-[0.65rem] xl:text-[0.75rem] font-body text-ink-faint tracking-[0.28em] uppercase">{stat.l}</div>
          </EditableLayer>
        ))}

        {editorConfig.visibility.hello && (
          <EditableLayer
            layerId="hello"
            dragKey="hello"
            layer={editorConfig.layers.hello}
            isLayoutEditing={isLayoutEditing}
            dragConstraintsRef={canvasRef}
            onCommit={updatePositionFromElement}
            scale={editorConfig.sizes.helloScale}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className={`text-[clamp(1.5rem,3vw,2.5rem)] serif-italic text-ink ${isLayoutEditing && !editorConfig.layers.hello.locked ? 'pointer-events-auto cursor-move border border-dashed border-[#4a9f62]/40 rounded-md p-1 bg-[#0d1410]/25' : 'pointer-events-none'}`}
            style={getStyle('hello')}
          >
            {t('hello')}
          </EditableLayer>
        )}

        {editorConfig.visibility.yehia && (
          <EditableLayer
            layerId="yehia"
            dragKey="yehia"
            layer={editorConfig.layers.yehia}
            isLayoutEditing={isLayoutEditing}
            dragConstraintsRef={canvasRef}
            onCommit={updatePositionFromElement}
            scale={editorConfig.sizes.yehiaScale}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className={`text-[clamp(6rem,11vw,13rem)] xl:text-[15rem] font-bold tracking-tighter text-ink leading-[0.75] font-display m-0 ${isLayoutEditing && !editorConfig.layers.yehia.locked ? 'pointer-events-auto cursor-move border border-dashed border-[#4a9f62]/40 rounded-md p-1 bg-[#0d1410]/25' : 'pointer-events-none'}`}
            style={getStyle('yehia')}
          >
            Yehia
          </EditableLayer>
        )}

        {editorConfig.visibility.portrait && (
          <EditableLayer
            layerId="portrait"
            dragKey="portrait"
            layer={editorConfig.layers.portrait}
            isLayoutEditing={isLayoutEditing}
            dragConstraintsRef={canvasRef}
            onCommit={updatePositionFromElement}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 0.7 }}
            className={`flex items-end ${isLayoutEditing && !editorConfig.layers.portrait.locked ? 'pointer-events-auto cursor-move border border-dashed border-[#4a9f62]/40 rounded-md bg-[#0d1410]/20' : 'pointer-events-none'}`}
            style={{ ...getStyle('portrait'), height: `${editorConfig.sizes.portraitHeight}vh` }}
          >
            <img
              src={`${import.meta.env.BASE_URL}images/Yehia_Professional.png`}
              alt="Yehia Salem"
              draggable={false}
              onDragStart={(event) => event.preventDefault()}
              style={{ WebkitUserDrag: 'none', userSelect: 'none', transform: `scale(${editorConfig.sizes.portraitScale})` }}
              className="w-auto h-full max-h-[1000px] object-contain object-bottom drop-shadow-2xl origin-bottom pointer-events-none"
            />
          </EditableLayer>
        )}

        {editorConfig.visibility.salem && (
          <EditableLayer
            layerId="salem"
            dragKey="salem"
            layer={editorConfig.layers.salem}
            isLayoutEditing={isLayoutEditing}
            dragConstraintsRef={canvasRef}
            onCommit={updatePositionFromElement}
            scale={editorConfig.sizes.salemScale}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className={`text-[clamp(5.5rem,10vw,12rem)] xl:text-[14rem] serif-italic tracking-tighter text-[#4a9f62] leading-[0.7] m-0 ${isLayoutEditing && !editorConfig.layers.salem.locked ? 'pointer-events-auto cursor-move border border-dashed border-[#4a9f62]/40 rounded-md p-1 bg-[#0d1410]/25' : 'pointer-events-none'}`}
            style={getStyle('salem')}
          >
            Salem
          </EditableLayer>
        )}

        {editorConfig.visibility.info && (
          <EditableLayer
            layerId="info"
            dragKey="info"
            layer={editorConfig.layers.info}
            isLayoutEditing={isLayoutEditing}
            dragConstraintsRef={canvasRef}
            onCommit={updatePositionFromElement}
            className={`bg-[#0d1410]/40 rounded-xl backdrop-blur-2xl shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6)] border border-[#4a9f62]/20 ${isLayoutEditing && !editorConfig.layers.info.locked ? 'cursor-move border-dashed border-[#4a9f62] pointer-events-auto' : 'pointer-events-auto'}`}
            style={{ ...getStyle('info'), width: `${editorConfig.sizes.infoWidth}px`, padding: `${editorConfig.sizes.infoPadding}rem` }}
          >
            <AnimatedSection delay={0.9}>
              <p className="text-ink-light text-[0.85rem] md:text-[0.95rem] font-body tracking-wide mb-1.5 opacity-90 pointer-events-none">
                {t('tagline')}
              </p>
              <p className="text-ink-faint text-[0.7rem] font-body tracking-[0.28em] mb-7 opacity-70 pointer-events-none uppercase">
                {t('location')}
              </p>
            </AnimatedSection>

            <AnimatedSection delay={1.1}>
              <QuoteBlock />
            </AnimatedSection>

            <AnimatedSection delay={1.3}>
              <div className="flex flex-col gap-6">
                <div className="flex flex-wrap items-center gap-5">
                  <Link to="#about" className="group relative w-[80px] h-[35px] bg-[#d4e4d8] hover:bg-white transition-all duration-500 rounded-sm overflow-hidden shadow-sm">
                    <motion.div className="absolute inset-0 bg-[#4a9f62]/10 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500" />
                  </Link>

                  <Link to="/works" className="text-[0.65rem] font-heading font-bold tracking-[0.28em] uppercase text-ink hover:text-[#4a9f62] flex items-center gap-3 transition-colors group">
                    {t('viewPortfolio').replace(' ->', '')}{' '}
                    <motion.span className="text-lg" animate={{ x: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>{'->'}</motion.span>
                  </Link>
                </div>
              </div>
            </AnimatedSection>
          </EditableLayer>
        )}
      </motion.div>

      {editorConfig.visibility.scrollIndicator && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 pointer-events-none"
          style={{ zIndex: editorConfig.layers.scrollIndicator.z, opacity: editorConfig.layers.scrollIndicator.opacity }}
        >
          <span className="text-ink-faint text-[0.65rem] tracking-[0.4em] uppercase font-heading">{t('explore')}</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-px h-12 bg-gradient-to-b from-accent to-transparent"
          />
        </motion.div>
      )}
    </section>
  )
}
