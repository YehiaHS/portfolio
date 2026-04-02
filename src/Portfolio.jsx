import { useState, useRef, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence, useScroll, useTransform, useInView } from 'framer-motion'
import { LineSlideUp, MaskReveal, GlitchText, DividerText, StaggerContainer, TextCounter, ImageParallax } from './motionEffects'
import { useLanguage } from './LanguageContext'
import LanguageSelector from './LanguageSelector'
import Cursor from './Cursor'

/* ──────────────────────────────────────────────────────────────────
   MOCK DATA for visual hierarchy elements not in translation files
   ────────────────────────────────────────────────────────────────── */
const PROCESS_STEPS = [
  { key: 'processResearch', label: 'Research', icon: '◉' },
  { key: 'processConcept', label: 'Concept', icon: '◆' },
  { key: 'processDesign', label: 'Design', icon: '▣' },
  { key: 'processReview', label: 'Review', icon: '◇' },
  { key: 'processDeliver', label: 'Deliver', icon: '▸' },
]

const ALL_TOOLS = [
  { name: 'Affinity Photo', level: 'primary' },
  { name: 'Affinity Designer', level: 'primary' },
  { name: 'Affinity Publisher', level: 'primary' },
  { name: 'DaVinci Resolve', level: 'primary' },
  { name: 'Photoshop', level: 'secondary' },
  { name: 'Adobe Premiere', level: 'secondary' },
  { name: 'Krita', level: 'secondary' },
  { name: 'Sony Vegas', level: 'tertiary' },
  { name: 'Paint Tool SAI', level: 'tertiary' },
  { name: 'Figma', level: 'secondary' },
  { name: 'GIMP', level: 'tertiary' },
]

const PROJECT_META = [
  {
    caption: 'Print design, A2 format — Offset lithography',
    difficulty: 7,
    impact: 9,
    quote: 'A poster must communicate before it is understood.',
  },
  {
    caption: 'Brand identity system — Vector, multi-scale application',
    difficulty: 8,
    impact: 8,
    quote: 'A logo should be unmistakable at any size.',
  },
  {
    caption: 'Large-format billboard — 6m x 3m digital print',
    difficulty: 6,
    impact: 10,
    quote: 'Scale changes everything about how design is perceived.',
  },
  {
    caption: 'Editorial cover design — A5, narrative composition',
    difficulty: 9,
    impact: 7,
    quote: 'The cover is the doorway, not the entire house.',
  },
]

const COLLEGE_TOOLS = [
  'Affinity Suite v2', 'DaVinci Resolve 18', 'Photoshop CC', 'Krita 5.x',
  'Custom color profiles', 'CMYK / RGB workflows', 'Large-format printing',
  'Vector-based identity systems', 'Typography systems',
]

/* ──────────────────────────────────────────────────────────────────
   SVG PLACEHOLDER PATTERNS — one per project
   ────────────────────────────────────────────────────────────────── */

const ProjectSVG_1 = () => (
  <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <rect width="400" height="300" fill="#1a3526" />
    <line x1="0" y1="0" x2="400" y2="300" stroke="#2d5a3d" strokeWidth="2" />
    <line x1="400" y1="0" x2="0" y2="300" stroke="#2d5a3d" strokeWidth="2" />
    <line x1="200" y1="0" x2="0" y2="300" stroke="#4a8f5c" strokeWidth="1" opacity="0.5" />
    <line x1="200" y1="300" x2="400" y2="0" stroke="#4a8f5c" strokeWidth="1" opacity="0.5" />
    <rect x="100" y="80" width="200" height="140" fill="none" stroke="#63b476" strokeWidth="1.5" opacity="0.6" />
    <circle cx="200" cy="150" r="40" fill="none" stroke="#2d5a3d" strokeWidth="2" opacity="0.4" />
    <text x="200" y="160" textAnchor="middle" fill="#63b476" fontSize="28" fontFamily="serif" opacity="0.7">01</text>
    <rect x="30" y="30" width="40" height="40" fill="#2d5a3d" opacity="0.3" />
    <rect x="330" y="230" width="40" height="40" fill="#4a8f5c" opacity="0.2" />
  </svg>
)

const ProjectSVG_2 = () => (
  <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <rect width="400" height="300" fill="#0d1a0f" />
    <circle cx="200" cy="150" r="100" fill="none" stroke="#2d5a3d" strokeWidth="3" opacity="0.5" />
    <circle cx="200" cy="150" r="80" fill="none" stroke="#4a8f5c" strokeWidth="1.5" opacity="0.4" />
    <circle cx="200" cy="150" r="60" fill="none" stroke="#63b476" strokeWidth="1" opacity="0.3" />
    <circle cx="200" cy="150" r="40" fill="#2d5a3d" opacity="0.15" />
    <line x1="100" y1="150" x2="300" y2="150" stroke="#2d5a3d" strokeWidth="0.5" opacity="0.3" />
    <line x1="200" y1="50" x2="200" y2="250" stroke="#2d5a3d" strokeWidth="0.5" opacity="0.3" />
    <line x1="129" y1="79" x2="271" y2="221" stroke="#4a8f5c" strokeWidth="0.5" opacity="0.2" />
    <line x1="271" y1="79" x2="129" y2="221" stroke="#4a8f5c" strokeWidth="0.5" opacity="0.2" />
    <text x="200" y="158" textAnchor="middle" fill="#63b476" fontSize="32" fontFamily="serif" opacity="0.8">YS</text>
    <text x="200" y="185" textAnchor="middle" fill="#4a8f5c" fontSize="10" fontFamily="sans-serif" letterSpacing="4" opacity="0.5">BRAND</text>
  </svg>
)

const ProjectSVG_3 = () => (
  <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <rect width="400" height="300" fill="#1a3526" />
    <rect x="0" y="0" width="400" height="180" fill="#2d5a3d" opacity="0.6" />
    <rect x="0" y="160" width="400" height="4" fill="#63b476" opacity="0.4" />
    <line x1="0" y1="60" x2="400" y2="60" stroke="#4a8f5c" strokeWidth="0.5" opacity="0.2" />
    <line x1="0" y1="120" x2="400" y2="120" stroke="#4a8f5c" strokeWidth="0.5" opacity="0.2" />
    <text x="30" y="100" fill="#f5f5f0" fontSize="48" fontFamily="serif" fontWeight="bold" opacity="0.85">LARGE</text>
    <text x="30" y="145" fill="#63b476" fontSize="36" fontFamily="serif" opacity="0.6">FORMAT</text>
    <text x="240" y="230" fill="#2d5a3d" fontSize="14" fontFamily="sans-serif" letterSpacing="6" opacity="0.4">BILLBOARD</text>
    <circle cx="350" cy="250" r="30" fill="none" stroke="#4a8f5c" strokeWidth="1" opacity="0.3" />
    <circle cx="350" cy="250" r="20" fill="#4a8f5c" opacity="0.1" />
    <text x="350" y="255" textAnchor="middle" fill="#63b476" fontSize="16" opacity="0.5">03</text>
  </svg>
)

const ProjectSVG_4 = () => (
  <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <rect width="400" height="300" fill="#f5f5f0" />
    <rect x="120" y="30" width="160" height="240" fill="#1a3526" />
    <line x1="120" y1="50" x2="280" y2="50" stroke="#2d5a3d" strokeWidth="2" />
    <line x1="120" y1="250" x2="280" y2="250" stroke="#2d5a3d" strokeWidth="2" />
    <text x="200" y="100" textAnchor="middle" fill="#63b476" fontSize="20" fontFamily="serif" letterSpacing="3">CHAPTER</text>
    <text x="200" y="140" textAnchor="middle" fill="#f5f5f0" fontSize="42" fontFamily="serif" fontWeight="bold">04</text>
    <line x1="160" y1="170" x2="240" y2="170" stroke="#4a8f5c" strokeWidth="1" />
    <text x="200" y="200" textAnchor="middle" fill="#4a8f5c" fontSize="10" fontFamily="sans-serif" letterSpacing="2" opacity="0.7">COVER DESIGN</text>
    <text x="200" y="80" textAnchor="middle" fill="#f5f5f0" fontSize="8" fontFamily="sans-serif" letterSpacing="4" opacity="0.4">NARRATIVE</text>
    <rect x="40" y="60" width="60" height="180" fill="#2d5a3d" opacity="0.08" />
    <rect x="300" y="60" width="60" height="180" fill="#2d5a3d" opacity="0.08" />
  </svg>
)

const projectSvgs = [ProjectSVG_1, ProjectSVG_2, ProjectSVG_3, ProjectSVG_4]

/* ──────────────────────────────────────────────────────────────────
   VISUAL GALLERY — process snapshot SVGs
   ────────────────────────────────────────────────────────────────── */

const ProcessSnapshotSVG = ({ variant }) => {
  if (variant === 0) {
    return (
      <svg viewBox="0 0 300 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full rounded-sm">
        <rect width="300" height="200" fill="#f5f5f0" />
        <circle cx="80" cy="100" r="40" fill="none" stroke="#2d5a3d" strokeWidth="2" />
        <circle cx="80" cy="100" r="25" fill="#2d5a3d" opacity="0.1" />
        <text x="80" y="105" textAnchor="middle" fill="#2d5a3d" fontSize="14" fontFamily="serif">R</text>
        <line x1="120" y1="100" x2="180" y2="100" stroke="#4a8f5c" strokeWidth="1.5" strokeDasharray="4" />
        <rect x="180" y="60" width="60" height="80" fill="none" stroke="#2d5a3d" strokeWidth="1.5" />
        <line x1="190" y1="80" x2="230" y2="80" stroke="#63b476" strokeWidth="1" opacity="0.5" />
        <line x1="190" y1="90" x2="230" y2="90" stroke="#63b476" strokeWidth="1" opacity="0.5" />
        <line x1="190" y1="100" x2="220" y2="100" stroke="#63b476" strokeWidth="1" opacity="0.5" />
        <text x="210" y="70" textAnchor="middle" fill="#0d1a0f" fontSize="8" fontFamily="sans-serif" letterSpacing="2">RESEARCH PHASE</text>
        <text x="150" y="180" textAnchor="middle" fill="#2d5a3d" fontSize="9" fontFamily="sans-serif" letterSpacing="3" opacity="0.5">PROCESS 01</text>
      </svg>
    )
  }
  if (variant === 1) {
    return (
      <svg viewBox="0 0 300 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full rounded-sm">
        <rect width="300" height="200" fill="#0d1a0f" />
        <polygon points="150,30 250,170 50,170" fill="none" stroke="#4a8f5c" strokeWidth="1.5" opacity="0.6" />
        <polygon points="150,50 230,160 70,160" fill="none" stroke="#2d5a3d" strokeWidth="1" opacity="0.4" />
        <circle cx="150" cy="120" r="20" fill="#2d5a3d" opacity="0.3" />
        <circle cx="150" cy="120" r="10" fill="#63b476" opacity="0.5" />
        <text x="150" y="125" textAnchor="middle" fill="#f5f5f0" fontSize="10" fontFamily="serif">C</text>
        <line x1="30" y1="185" x2="270" y2="185" stroke="#2d5a3d" strokeWidth="0.5" />
        <text x="150" y="195" textAnchor="middle" fill="#4a8f5c" fontSize="9" fontFamily="sans-serif" letterSpacing="3" opacity="0.5">PROCESS 02</text>
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 300 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full rounded-sm">
      <rect width="300" height="200" fill="#1a3526" />
      <rect x="40" y="40" width="220" height="120" fill="none" stroke="#4a8f5c" strokeWidth="1" opacity="0.3" />
      <rect x="60" y="60" width="180" height="80" fill="#2d5a3d" opacity="0.2" />
      <rect x="80" y="80" width="140" height="40" fill="#4a8f5c" opacity="0.15" />
      <text x="150" y="105" textAnchor="middle" fill="#63b476" fontSize="16" fontFamily="serif">DESIGN → FINAL</text>
      <circle cx="40" cy="40" r="4" fill="#63b476" opacity="0.5" />
      <circle cx="260" cy="160" r="4" fill="#63b476" opacity="0.5" />
      <line x1="40" y1="40" x2="260" y2="160" stroke="#4a8f5c" strokeWidth="0.5" strokeDasharray="3" opacity="0.3" />
      <text x="150" y="190" textAnchor="middle" fill="#4a8f5c" fontSize="9" fontFamily="sans-serif" letterSpacing="3" opacity="0.5">PROCESS 03</text>
    </svg>
  )
}

/* ──────────────────────────────────────────────────────────────────
   BOTANICAL HEADER WATERMARK SVG
   ────────────────────────────────────────────────────────────────── */

const BotanicalWatermark = () => (
  <svg
    className="absolute top-0 right-0 w-full h-full opacity-[0.03] pointer-events-none"
    viewBox="0 0 1200 600"
    preserveAspectRatio="xMaxYMid slice"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <defs>
      <path id="vine" d="M0,300 C150,280 200,200 350,250 C500,300 550,150 700,200 C850,250 900,100 1050,180 C1100,210 1150,250 1200,200" fill="none" stroke="#2d5a3d" strokeWidth="2" />
      <path id="leaf" d="M0,0 C15,-30 35,-20 40,0 C35,20 15,30 0,0 Z" fill="#2d5a3d" />
    </defs>
    <use href="#vine" />
    <use href="#vine" transform="translate(0, 80) scale(0.8)" opacity="0.6" />
    <use href="#vine" transform="translate(0, -60) scale(1.2)" opacity="0.4" />
    {Array.from({ length: 12 }).map((_, i) => (
      <use key={i} href="#leaf" transform={`translate(${100 + i * 90}, ${150 + Math.sin(i) * 80}) rotate(${i * 15 - 30}) scale(${0.6 + Math.random() * 0.4})`} opacity="0.5" />
    ))}
    {Array.from({ length: 6 }).map((_, i) => (
      <circle key={`d${i}`} cx={200 + i * 180} cy={350 + Math.cos(i) * 60} r="3" fill="#4a8f5c" opacity="0.3" />
    ))}
    <path d="M0,500 L1200,420" stroke="#4a8f5c" strokeWidth="0.5" opacity="0.2" fill="none" />
    <path d="M0,350 L1200,500" stroke="#4a8f5c" strokeWidth="0.5" opacity="0.15" fill="none" />
  </svg>
)

/* ──────────────────────────────────────────────────────────────────
   BOTANICAL DOT GRID BACKGROUND PATTERN
   ────────────────────────────────────────────────────────────────── */

const BotanicalGridPattern = () => (
  <div
    className="fixed inset-0 pointer-events-none z-0"
    style={{
      backgroundImage: `radial-gradient(circle, #2d5a3d 0.5px, transparent 0.5px)`,
      backgroundSize: '24px 24px',
      opacity: 0.03,
    }}
    aria-hidden="true"
  />
)

/* ──────────────────────────────────────────────────────────────────
   LEAF ICON — decorative element next to category labels
   ────────────────────────────────────────────────────────────────── */

const LeafIcon = () => (
  <svg width="12" height="14" viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline-block ml-1 opacity-60" aria-hidden="true">
    <path d="M1,7 C1,3 5,0.5 10,1 C8,5 5,9 1,7 Z" fill="#4a8f5c" opacity="0.6" />
    <path d="M3,8.5 L1,13" stroke="#2d5a3d" strokeWidth="0.5" opacity="0.4" />
  </svg>
)

/* ──────────────────────────────────────────────────────────────────
   UTILITY HOOKS
   ────────────────────────────────────────────────────────────────── */

function useScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scrollPercent = useTransform(scrollYProgress, [0, 1], [0, 100])
  return scrollPercent
}

/* ──────────────────────────────────────────────────────────────────
   DECORATIVE COMPONENTS
   ────────────────────────────────────────────────────────────────── */

const HeaderLines = () => (
  <svg
    className="absolute bottom-0 left-0 right-0 w-full overflow-visible pointer-events-none"
    height="2"
    aria-hidden="true"
  >
    <motion.line
      x1="0%"
      y1="1"
      x2="100%"
      y2="1"
      stroke="#2d5a3d"
      strokeOpacity="0.08"
      strokeWidth="1"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 2, ease: 'easeInOut' }}
      style={{ strokeDasharray: 'none' }}
    />
    <line
      x1="0%"
      y1="1"
      x2="33%"
      y2="1"
      stroke="#4a8f5c"
      strokeOpacity="0.15"
      strokeWidth="1.25"
      strokeLinecap="round"
    />
    <line
      x1="67%"
      y1="1"
      x2="100%"
      y2="1"
      stroke="#2d5a3d"
      strokeOpacity="0.1"
      strokeWidth="0.75"
    />
  </svg>
)

const MonogramWatermark = () => (
  <motion.div
    className="absolute top-8 right-8 md:right-16 pointer-events-none select-none"
    aria-hidden="true"
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 0.03, y: 0 }}
    transition={{ duration: 1.2, delay: 0.8 }}
    style={{ color: '#2d5a3d' }}
  >
    <span className="font-display text-[10rem] md:text-[14rem] lg:text-[18rem] leading-none tracking-tighter">YS</span>
  </motion.div>
)

const CornerMarks = () => (
  <>
    {/* Top-left */}
    <div className="absolute top-3 left-3 z-10 flex gap-1 opacity-50">
      <span className="w-2.5 h-[1px] block" style={{ backgroundColor: '#2d5a3d' }} />
      <span className="w-[1px] h-2.5 block" style={{ backgroundColor: '#2d5a3d' }} />
    </div>
    {/* Top-right */}
    <div className="absolute top-3 right-3 z-10 flex gap-1 opacity-50">
      <span className="w-[1px] h-2.5 block" style={{ backgroundColor: '#2d5a3d' }} />
      <span className="w-2.5 h-[1px] block" style={{ backgroundColor: '#2d5a3d' }} />
    </div>
    {/* Bottom-left */}
    <div className="absolute bottom-3 left-3 z-10 flex gap-1 opacity-50">
      <span className="w-2.5 h-[1px] block" style={{ backgroundColor: '#2d5a3d' }} />
      <span className="w-[1px] h-2.5 block" style={{ backgroundColor: '#2d5a3d' }} />
    </div>
    {/* Bottom-right */}
    <div className="absolute bottom-3 right-3 z-10 flex gap-1 opacity-50">
      <span className="w-2.5 h-[1px] block" style={{ backgroundColor: '#2d5a3d' }} />
      <span className="w-[1px] h-2.5 block" style={{ backgroundColor: '#2d5a3d' }} />
    </div>
  </>
)

const ProgressBar = ({ difficulty, impact }) => (
  <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 mt-4">
    {[
      { label: 'Difficulty', value: difficulty },
      { label: 'Impact', value: impact },
    ].map(({ label, value }) => (
      <div key={label} className="flex-1">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[0.6rem] uppercase tracking-widest font-sans" style={{ color: '#2d5a3d80' }}>{label}</span>
          <span className="text-[0.6rem] page-number">{value}/10</span>
        </div>
        <div className="h-[2px] rounded-full overflow-hidden" style={{ backgroundColor: '#2d5a3d10' }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: value >= 8 ? '#4a8f5c' : '#2d5a3d' }}
            initial={{ width: 0 }}
            whileInView={{ width: `${value * 10}%` }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
      </div>
    ))}
  </div>
)

const SkillTags = ({ skills }) => {
  const primary = skills.filter((_, i) => i % 2 === 0)
  const secondary = skills.filter((_, i) => i % 2 !== 0)
  return (
    <div className="flex flex-wrap gap-2 mt-4">
      {primary.map((s) => (
        <span
          key={s}
          className="page-number px-3 py-1 font-display text-[0.65rem] border text-ink"
          style={{ backgroundColor: '#f5f5f0', borderColor: '#2d5a3d25', color: '#0d1a0f' }}
        >
          {s}
        </span>
      ))}
      {secondary.map((s) => (
        <span
          key={s}
          className="px-3 py-1 text-[0.6rem] page-number border"
          style={{ backgroundColor: '#f5f5f0', borderColor: '#2d5a3d15', color: '#2d5a3d80' }}
        >
          {s}
        </span>
      ))}
    </div>
  )
}

const DropCapParagraph = ({ text, className }) => {
  if (!text) return null
  const firstChar = text.charAt(0)
  const rest = text.slice(1)
  const newlineIdx = rest.indexOf('\n')
  return (
    <p className={className}>
      <span className="float-left font-display text-5xl md:text-6xl leading-[0.8] mr-2 mt-1" style={{ color: '#4a8f5c' }}>
        {firstChar}
      </span>
      {newlineIdx > 0 ? (
        <>
          {rest.slice(0, newlineIdx)}
          {rest.slice(newlineIdx)}
        </>
      ) : (
        rest
      )}
    </p>
  )
}

/* ──────────────────────────────────────────────────────────────────
   OVERVIEW STATS BAR
   ────────────────────────────────────────────────────────────────── */
const OverviewStats = ({ works }) => {
  const stats = useMemo(() => {
    const yearsSet = new Set(works.map(w => w.year))
    const allSkills = works.flatMap(w => w.skillsGained || [])
    const uniqueSkills = [...new Set(allSkills)]
    const categories = [...new Set(works.map(w => w.category))]
    return [
      { label: 'Projects', value: works.length.toString().padStart(2, '0') },
      { label: 'Years Active', value: `${yearsSet.size}` },
      { label: 'Tools Used', value: uniqueSkills.length.toString() },
      { label: 'Mediums', value: categories.length.toString() },
    ]
  }, [works])

  return (
    <section className="px-6 md:px-12 py-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-0 rounded-sm overflow-hidden" style={{ border: '1px solid #2d5a3d15' }}>
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              className={`p-5 md:p-6 text-center ${
                i < stats.length - 1 ? 'border-r' : ''
              }`}
              style={{ borderColor: '#2d5a3d15' }}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <div className="font-display text-2xl md:text-3xl tracking-tight" style={{ color: '#0d1a0f' }}>
                <TextCounter target={parseInt(stat.value, 10)} />
              </div>
              <div className="text-[0.6rem] uppercase tracking-widest mt-1 page-number" style={{ color: '#2d5a3d60' }}>{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ──────────────────────────────────────────────────────────────────
   PROCESS SECTION
   ────────────────────────────────────────────────────────────────── */
const ProcessSection = () => {
  const { t } = useLanguage()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section ref={ref} className="px-6 md:px-12 py-16">
      <div className="mx-auto max-w-7xl">
        <motion.p
          className="page-number mb-6"
          style={{ color: '#2d5a3d60' }}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        >
          Design Methodology
        </motion.p>
        <div className="relative">
          {/* Connecting line */}
          <div className="absolute top-7 left-0 right-0 h-[1px] hidden md:block" style={{ backgroundColor: '#2d5a3d15' }} />
          <motion.div
            className="absolute top-7 left-0 h-[1px] hidden md:block"
            style={{ backgroundColor: '#4a8f5c50' }}
            initial={{ width: 0 }}
            animate={isInView ? { width: '100%' } : { width: 0 }}
            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
          />
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 md:gap-0">
            {PROCESS_STEPS.map((step, i) => (
              <motion.div
                key={step.key}
                className="flex flex-col items-center text-center relative"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0 }}
                transition={{ delay: i * 0.15, duration: 0.6 }}
              >
                <div className="w-14 h-14 rounded-full flex items-center justify-center mb-3 relative z-10" style={{ backgroundColor: '#f5f5f0', border: '1px solid #2d5a3d15' }}>
                  <span style={{ color: '#4a8f5c', fontSize: '1.25rem' }}>{step.icon}</span>
                </div>
                <span className="font-display text-sm" style={{ color: '#0d1a0f' }}>{t(step.key) || step.label}</span>
                <span className="text-[0.6rem] page-number mt-1" style={{ color: '#2d5a3d60' }}>{String(i + 1).padStart(2, '0')}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ──────────────────────────────────────────────────────────────────
   VISUAL PROCESS GALLERY STRIP
   ────────────────────────────────────────────────────────────────── */
const VisualProcessGallery = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  return (
    <section ref={ref} className="px-6 md:px-12 py-16">
      <div className="mx-auto max-w-7xl">
        <p className="page-number mb-8" style={{ color: '#2d5a3d60' }}>Visual Process</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="overflow-hidden rounded-sm"
              style={{ border: '1px solid #2d5a3d15' }}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0 }}
              transition={{ delay: i * 0.15, duration: 0.7 }}
            >
              <ProcessSnapshotSVG variant={i} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ──────────────────────────────────────────────────────────────────
   TECHNIQUES & TOOLS TAG CLOUD
   ────────────────────────────────────────────────────────────────── */
const TechniquesTools = () => {
  const sizeMap = {
    primary: 'text-sm md:text-base font-display',
    secondary: 'text-xs md:text-sm',
    tertiary: 'text-[0.65rem] md:text-xs',
  }
  const borderMap = {
    primary: 'border-ink/15',
    secondary: 'border-ink/10',
    tertiary: 'border-ink/5',
  }
  const colorMap = {
    primary: { color: '#0d1a0f' },
    secondary: { color: '#2d5a3d' },
    tertiary: { color: '#2d5a3d80' },
  }
  const hoverBorderMap = {
    primary: '#4a8f5c',
    secondary: '#2d5a3d',
    tertiary: '#2d5a3d80',
  }

  return (
    <section className="px-6 md:px-12 py-16">
      <div className="mx-auto max-w-7xl">
        <p className="page-number mb-6" style={{ color: '#2d5a3d60' }}>Techniques & Tools</p>
        <div className="flex flex-wrap gap-2 md:gap-3">
          {ALL_TOOLS.map((tool) => (
            <span
              key={tool.name}
              className={`px-3 md:px-4 py-1.5 md:py-2 border rounded-sm page-number ${sizeMap[tool.level]} ${borderMap[tool.level]} cursor-default`}
              style={{
                backgroundColor: '#f5f5f0',
                color: colorMap[tool.level].color,
                borderColor: '#2d5a3d20',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = hoverBorderMap[tool.level]
                e.currentTarget.style.color = '#2d5a3d'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#2d5a3d20'
                e.currentTarget.style.color = colorMap[tool.level].color
              }}
            >
              {tool.name}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ──────────────────────────────────────────────────────────────────
   COLOPHON SECTION
   ────────────────────────────────────────────────────────────────── */
const Colophon = ({ works }) => {
  const { t } = useLanguage()
  const dateRange = useMemo(() => {
    const years = works.map(w => parseInt(w.year, 10)).filter(Boolean)
    if (years.length === 0) return '2024'
    return `${Math.min(...years)}${Math.min(...years) !== Math.max(...years) ? '\u2013' + Math.max(...years) : ''}`
  }, [works])

  return (
    <section className="px-6 md:px-12 py-12 border-t border-b" style={{ borderColor: '#2d5a3d10' }}>
      <div className="mx-auto max-w-7xl">
        <p className="page-number mb-6" style={{ color: '#2d5a3d60' }}>Colophon</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {[
            { label: 'Period', value: dateRange },
            { label: 'Typography', value: 'Fraunces \u00b7 Instrument Serif \u00b7 Syne \u00b7 Manrope' },
            { label: 'Primary Tools', value: COLLEGE_TOOLS.join(', ') },
            { label: 'Mediums', value: works.map(w => w.category).join(', ') },
          ].map(({ label, value }) => (
            <div key={label}>
              <span className="text-[0.6rem] uppercase tracking-widest block mb-1" style={{ color: '#2d5a3d60' }}>{label}</span>
              <span className="text-sm font-light leading-relaxed" style={{ color: '#2d5a3d' }}>{value}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ──────────────────────────────────────────────────────────────────
   WORK ITEM — full-viewport scroll gallery item
   ────────────────────────────────────────────────────────────────── */
const WorkItem = ({ work, index }) => {
  const [showReflection, setShowReflection] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [imageError, setImageError] = useState(false)
  const { t } = useLanguage()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  const meta = PROJECT_META[index] || PROJECT_META[0]
  const FallbackSvg = projectSvgs[index] || projectSvgs[0]

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0 }}
      transition={{ delay: 0.1, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className="relative"
      style={{ minHeight: 'calc(100vh - 12rem)' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Large watermark number */}
      <motion.div
        className="absolute -top-16 -left-4 md:-left-16 pointer-events-none select-none z-0"
        aria-hidden="true"
        style={{ color: '#2d5a3d', opacity: 0.03 }}
      >
        <span className="font-display text-[12rem] md:text-[20rem] lg:text-[28rem] leading-none tracking-tighter">
          {String(index + 1).padStart(2, '0')}
        </span>
      </motion.div>

      <div className="relative z-10 pt-8">
        {/* Category label with leaf icon */}
        <motion.div className="flex items-center gap-3 mb-6">
          <span className="page-number" style={{ color: '#2d5a3d60' }}>{String(index + 1).padStart(2, '0')}</span>
          <div className="h-px flex-1" style={{ backgroundColor: '#2d5a3d10' }} />
          <span className="flex items-center">
            <motion.span
              className="text-[0.6rem] uppercase tracking-widest page-number flex items-center"
              animate={{ y: isHovered ? 0 : 4, opacity: isHovered ? 1 : 0.6 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              style={{ color: '#2d5a3d' }}
            >
              {work.category}
              <LeafIcon />
            </motion.span>
          </span>
          <span className="page-number" style={{ color: '#2d5a3d60' }}>{work.year}</span>
        </motion.div>

        {/* Image or SVG fallback — wrapped with ImageParallax */}
        <ImageParallax speed={0.1}>
          <div className="relative aspect-[4/3] overflow-hidden mb-6">
            <CornerMarks />
          <div className="absolute inset-[11px] overflow-hidden">
            {!imageError && (
              <motion.img
                src={work.media.src}
                alt={work.title}
                className="h-full w-full object-cover"
                animate={{ scale: isHovered ? 1.04 : 1 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                onError={() => setImageError(true)}
              />
            )}
            {imageError && (
              <div className="w-full h-full">
                <FallbackSvg />
              </div>
            )}
            </div>
          </div>
        </ImageParallax>

        {/* Caption */}
        <motion.p
          className="text-[0.65rem] font-light tracking-wide mb-4 italic font-italic"
          style={{ color: '#2d5a3d80' }}
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          {meta.caption}
        </motion.p>

        {/* Title & Description */}
        <h3 className="text-2xl md:text-4xl font-display mb-2 tracking-tight leading-tight" style={{ color: '#0d1a0f' }}>{work.title}</h3>
        <MaskReveal>
          <p className="text-sm leading-relaxed mb-4 font-light max-w-2xl" style={{ color: '#2d5a3d' }}>{work.description}</p>
        </MaskReveal>

        {/* Difficulty & Impact */}
        <ProgressBar difficulty={meta.difficulty} impact={meta.impact} />

        {/* Skills */}
        {work.skillsGained && <SkillTags skills={work.skillsGained} />}

        {/* Pull Quote */}
        <motion.blockquote
          className="mt-8 pl-6 border-l-2"
          style={{ borderColor: '#4a8f5c40' }}
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <p className="font-italic text-lg leading-relaxed" style={{ color: '#2d5a3d90' }}>
            {meta.quote}
          </p>
        </motion.blockquote>

        {/* Reflection toggle */}
        <button
          onClick={() => setShowReflection(!showReflection)}
          className="reflexion-label flex items-center gap-2 mt-6 mb-2 group"
          aria-expanded={showReflection}
        >
          <span
            className="text-sm font-light group-hover:transition-colors"
            style={{ color: '#2d5a3d' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#4a8f5c' }}
            onMouseLeave={(e) => { e.currentTarget.style.color = '#2d5a3d' }}
          >
            {showReflection ? t('closeReflection') : t('reflection')}
          </span>
          <motion.span
            animate={{ rotate: showReflection ? 0 : -90 }}
            transition={{ duration: 0.3 }}
            className="text-sm"
            style={{ color: '#4a8f5c' }}
          >
            &#x2193;
          </motion.span>
        </button>

        {/* Reflection panel */}
        <AnimatePresence initial={false}>
          {showReflection && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div className="reflexion-panel pb-4 pt-2">
                <h4 className="font-display italic text-lg mb-4" style={{ color: '#4a8f5c' }}>
                  {t('reflection')}
                </h4>
                <LineSlideUp>
                  <p className="text-sm leading-relaxed whitespace-pre-line font-light" style={{ color: '#2d5a3d' }}>
                    {work.reflection}
                  </p>
                </LineSlideUp>
                {work.skillsGained && (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {work.skillsGained.map((s) => (
                      <span
                        key={s}
                        className="px-3 py-1 text-[0.65rem] page-number border"
                        style={{ backgroundColor: '#f5f5f0', borderColor: '#2d5a3d15', color: '#2d5a3d' }}
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                )}
                <p className="mt-4 page-number" style={{ color: '#2d5a3d60' }}>
                  {t('learningOutcome')}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom decorative line */}
        <div className="mt-10 h-px bg-gradient-to-r to-transparent" style={{ backgroundImage: 'linear-gradient(to right, #2d5a3d15, transparent)' }} />
      </div>
    </motion.div>
  )
}

/* ──────────────────────────────────────────────────────────────────
   REFLECTIONS — magazine-style with drop caps, connecting lines
   ────────────────────────────────────────────────────────────────── */
const Reflections = () => {
  const { t } = useLanguage()
  const statements = t('reflectionStatements')
  const containerRef = useRef(null)

  if (!statements || statements.length === 0) return null

  return (
    <section ref={containerRef} className="px-6 md:px-12 py-24">
      <div className="mx-auto max-w-7xl">
        {/* Section header */}
        <div className="grid grid-cols-12 gap-12 md:gap-20 mb-16">
          <div className="col-span-12 md:col-span-3 lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="section-number" style={{ color: '#2d5a3d60' }}>07</span>
              <div className="w-6 h-px my-3" style={{ backgroundColor: '#4a8f5c50' }} />
              <p className="page-number" style={{ color: '#2d5a3d60' }}>{t('reflection').toLowerCase()}</p>
            </motion.div>
          </div>
          <div className="col-span-12 md:col-span-9 lg:col-span-10">
            <motion.h2
              className="text-3xl md:text-5xl lg:text-6xl font-display tracking-tight leading-[0.95] mb-3"
              style={{ color: '#0d1a0f' }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
            >
              {t('reflectionTitle')}
            </motion.h2>
            <motion.p
              className="page-number font-light"
              style={{ color: '#2d5a3d60' }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              {t('reflectionSubtitle')}
            </motion.p>
          </div>
        </div>

        {/* Statements with connecting line */}
        <div className="grid grid-cols-12 gap-12 md:gap-20">
          <div className="col-span-12 md:col-start-4 lg:col-start-4 md:col-span-9 lg:col-span-9">
            <div className="relative">
              {/* Connecting vertical line */}
              <div className="absolute left-0 top-0 bottom-0 w-[1px] hidden md:block" style={{ backgroundColor: '#2d5a3d10' }} />
              <motion.div
                className="absolute left-0 w-[1px] hidden md:block"
                style={{ backgroundColor: '#4a8f5c30' }}
                initial={{ height: 0 }}
                whileInView={{ height: '100%' }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              />

              <div className="space-y-16 md:space-y-20">
                {statements.map((stmt, i) => (
                  <motion.div
                    key={stmt.title}
                    className="relative pl-0 md:pl-8"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {/* Timeline dot */}
                    <div className="absolute -left-[3px] top-2 w-[7px] h-[7px] rounded-full hidden md:block" style={{ backgroundColor: '#4a8f5c40' }} />

                    <h3 className="text-xl md:text-2xl font-display mb-4 tracking-tight" style={{ color: '#0d1a0f' }}>
                      {stmt.title}
                    </h3>
                    <LineSlideUp>
                      <DropCapParagraph
                        text={stmt.body}
                        className="text-[0.9rem] leading-[1.85] font-light whitespace-pre-line"
                        style={{ color: '#2d5a3d' }}
                      />
                    </LineSlideUp>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ──────────────────────────────────────────────────────────────────
   MAIN PAGE
   ────────────────────────────────────────────────────────────────── */
function Portfolio() {
  const { t } = useLanguage()
  const { isRTL } = useLanguage()
  const works = t('portfolioWorks')
  const scrollPercent = useScrollProgress()
  const topRef = useRef(null)
  const totalWorks = Array.isArray(works) ? works.length : 0
  const [currentPage, setCurrentPage] = useState(1)

  // Track which project section is most visible
  useEffect(() => {
    const handleScroll = () => {
      if (!Array.isArray(works)) return
      const viewportH = window.innerHeight
      const section = Math.floor(window.scrollY / (viewportH * 0.8)) + 1
      setCurrentPage(Math.min(Math.max(1, section), totalWorks))
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [works, totalWorks])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div
      ref={topRef}
      className="relative min-h-screen cursor-none page-enter"
      dir={isRTL ? 'rtl' : 'ltr'}
      style={{ color: '#0d1a0f' }}
    >
      <Cursor />

      {/* Botanical grid background */}
      <BotanicalGridPattern />

      {/* ───── SCROLL PROGRESS BAR (top of viewport) ───── */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] z-[60] origin-left"
        style={{ scaleX: scrollPercent, backgroundColor: '#4a8f5c' }}
        aria-hidden="true"
      />

      {/* ───── FIXED TOP BAR ───── */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <div className="mx-auto max-w-7xl px-6 md:px-12 py-4 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-3 font-display italic text-xl hover:transition-colors"
            style={{ color: '#0d1a0f' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#4a8f5c' }}
            onMouseLeave={(e) => { e.currentTarget.style.color = '#0d1a0f' }}
          >
            <span className="text-lg" style={{ color: '#4a8f5c' }}>&larr;</span>
            {t('home')}
          </Link>

          {/* Page indicator */}
          <div className="flex items-center gap-3">
            <span className="page-number">
              <span style={{ color: '#2d5a3d' }}>{String(currentPage).padStart(2, '0')}</span>
              {' / '}
              <span style={{ color: '#2d5a3d60' }}>{String(totalWorks).padStart(2, '0')}</span>
            </span>
            <LanguageSelector />
          </div>
        </div>
        <div className="mx-auto max-w-7xl px-6 md:px-12">
          <div className="h-px bg-gradient-to-r from-transparent to-transparent" style={{ backgroundImage: 'linear-gradient(to right, transparent, #2d5a3d20, transparent)' }} />
        </div>
      </div>

      {/* ───── HEADER with botonical watermark ───── */}
      <motion.header
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="pt-24 pb-12 px-6 md:px-12 relative overflow-hidden"
      >
        {/* Botanical SVG watermark background */}
        <BotanicalWatermark />
        <MonogramWatermark />

        <div className="mx-auto max-w-7xl relative z-10">
          <div className="grid grid-cols-12 gap-8 md:gap-16 mb-8">
            {/* Left column */}
            <div className="col-span-12 md:col-span-4 lg:col-span-3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.15 }}
              >
                <span className="section-number" style={{ color: '#2d5a3d60' }}>{t('portfolio')}</span>
                <div className="w-8 h-px my-4" style={{ backgroundColor: '#4a8f5c50' }} />
                <p className="page-number" style={{ color: '#2d5a3d60' }}>{t('selectedWorks')}</p>
              </motion.div>
            </div>

            {/* Right column */}
            <div className="col-span-12 md:col-span-8 lg:col-span-9">
              <motion.h1
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="text-5xl md:text-7xl lg:text-8xl font-display tracking-tight leading-[0.9] mb-6"
                style={{ color: '#0d1a0f' }}
              >
                <GlitchText as="span">{t('portfolioTitle')}</GlitchText>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-base font-light max-w-xl leading-relaxed"
                style={{ color: '#2d5a3d80' }}
              >
                {t('portfolioDescription')}
              </motion.p>
            </div>
          </div>

          {/* Decorative SVG lines */}
          <HeaderLines />
        </div>
      </motion.header>

      {/* ───── OVERVIEW STATS ───── */}
      {Array.isArray(works) && <OverviewStats works={works} />}

      {/* ───── DIVIDER ───── */}
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="h-px" style={{ backgroundImage: 'linear-gradient(to right, #2d5a3d20, #2d5a3d10, transparent)' }} />
      </div>

      {/* ───── PROCESS SECTION ───── */}
      <ProcessSection />

      {/* ───── DIVIDER ───── */}
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="h-px" style={{ backgroundImage: 'linear-gradient(to right, #2d5a3d20, #2d5a3d10, transparent)' }} />
      </div>

      {/* ───── TECHNIQUES & TOOLS ───── */}
      <TechniquesTools />

      {/* ───── DIVIDER ───── */}
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="h-px" style={{ backgroundImage: 'linear-gradient(to right, #2d5a3d20, #2d5a3d10, transparent)' }} />
      </div>

      {/* ───── VISUAL PROCESS GALLERY ───── */}
      <VisualProcessGallery />

      {/* ───── DIVIDER ───── */}
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="h-px" style={{ backgroundImage: 'linear-gradient(to right, #2d5a3d20, #2d5a3d10, transparent)' }} />
      </div>

      {/* ───── WORK GALLERY — vertical scroll sections ───── */}
      <section className="px-6 md:px-12 pt-12 pb-20">
        <div className="mx-auto max-w-7xl">
          <StaggerContainer staggerDelay={0.15}>
            {Array.isArray(works) && works.map((work, i) => (
              <div key={work.id} className="py-12 md:py-20">
                <WorkItem work={work} index={i} />
              </div>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ───── DIVIDER ───── */}
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="h-px" style={{ backgroundImage: 'linear-gradient(to right, #2d5a3d20, #2d5a3d10, transparent)' }} />
      </div>

      {/* ───── COLOPHON ───── */}
      {Array.isArray(works) && <Colophon works={works} />}

      {/* ───── DIVIDER ───── */}
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="h-px" style={{ backgroundImage: 'linear-gradient(to right, #2d5a3d20, #2d5a3d10, transparent)' }} />
      </div>

      {/* ───── WORK DIVIDER ───── */}
      <DividerText text="WORK" />

      {/* ───── REFLECTIONS ───── */}
      <Reflections />

      {/* ───── DIVIDER TEXT: THINK ───── */}
      <DividerText text="THINK" />

      {/* ───── ETHICS NOTICE ───── */}
      <section className="px-6 md:px-12 py-16">
        <div className="mx-auto max-w-3xl">
          <div className="relative border-2 p-8 md:p-12" style={{ borderColor: '#2d5a3d15', backgroundColor: '#f5f5f0' }}>
            {/* Decorative corners */}
            <div className="absolute -top-[1px] -left-[1px] w-4 h-4 border-t-2 border-l-2" style={{ borderColor: '#4a8f5c40' }} />
            <div className="absolute -top-[1px] -right-[1px] w-4 h-4 border-t-2 border-r-2" style={{ borderColor: '#4a8f5c40' }} />
            <div className="absolute -bottom-[1px] -left-[1px] w-4 h-4 border-b-2 border-l-2" style={{ borderColor: '#4a8f5c40' }} />
            <div className="absolute -bottom-[1px] -right-[1px] w-4 h-4 border-b-2 border-r-2" style={{ borderColor: '#4a8f5c40' }} />

            <p className="page-number mb-3 text-center uppercase tracking-widest text-[0.65rem]" style={{ color: '#2d5a3d' }}>
              {t('ethicsNotice')}
            </p>
            <p className="text-sm font-light text-center leading-relaxed max-w-xl mx-auto" style={{ color: '#2d5a3d' }}>
              {t('authorshipAll')}
            </p>
          </div>
        </div>
      </section>

      {/* ───── FOOTER ───── */}
      <footer className="border-t" style={{ borderColor: '#2d5a3d15' }}>
        {/* Row 1 */}
        <div className="mx-auto max-w-7xl px-6 md:px-12 py-10">
          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-12 md:col-span-4">
              <Link
                to="/"
                className="font-display italic text-xl hover:transition-colors"
                style={{ color: '#0d1a0f' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#4a8f5c' }}
                onMouseLeave={(e) => { e.currentTarget.style.color = '#0d1a0f' }}
              >
                YS
              </Link>
              <p className="text-sm font-light mt-2 leading-relaxed" style={{ color: '#2d5a3d60' }}>
                {t('portfolioDescription')}
              </p>
            </div>
            <div className="col-span-12 md:col-span-4">
              <h4 className="page-number text-[0.6rem] uppercase tracking-widest mb-3" style={{ color: '#2d5a3d60' }}>
                {t('portfolio').toLowerCase()}
              </h4>
              <p className="text-sm font-light" style={{ color: '#2d5a3d' }}>
                {Array.isArray(works) ? works.length : 0} {t('projects')}
              </p>
              <p className="text-xs page-number mt-1" style={{ color: '#2d5a3d60' }}>
                {t('selectedWorks')}
              </p>
            </div>
            <div className="col-span-12 md:col-span-4 text-right">
              <button
                onClick={scrollToTop}
                className="page-number text-sm flex items-center gap-2 ml-auto hover:transition-colors"
                style={{ color: '#2d5a3d60' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#4a8f5c' }}
                onMouseLeave={(e) => { e.currentTarget.style.color = '#2d5a3d60' }}
              >
                {t('home')}
                <span className="inline-block" style={{ color: '#4a8f5c' }}>&uarr;</span>
              </button>
              <p className="text-xs page-number mt-2" style={{ color: '#2d5a3d60' }}>
                {new Date().toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>
        </div>

        {/* Row 2 — bottom bar */}
        <div className="border-t" style={{ borderColor: '#2d5a3d10' }}>
          <div className="mx-auto max-w-7xl px-6 md:px-12 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <span className="page-number text-xs" style={{ color: '#2d5a3d60' }}>
              {t('footerText')} — {new Date().getFullYear()}
            </span>
            <span className="page-number text-xs" style={{ color: '#2d5a3d60' }}>
              {t('precision')}
            </span>
          </div>
        </div>
      </footer>

      {/* ───── BACK TO TOP FLOATING BUTTON ───── */}
      <motion.button
        className="fixed bottom-8 right-8 z-40 w-12 h-12 rounded-full border flex items-center justify-center shadow-lg hover:transition-colors"
        style={{
          backgroundColor: '#f5f5f0',
          borderColor: '#2d5a3d15',
          color: '#2d5a3d',
        }}
        onClick={scrollToTop}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        aria-label="Back to top"
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = '#4a8f5c'
          e.currentTarget.style.color = '#4a8f5c'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = '#2d5a3d15'
          e.currentTarget.style.color = '#2d5a3d'
        }}
      >
        <span className="text-lg">&uarr;</span>
      </motion.button>
    </div>
  )
}

export default Portfolio
