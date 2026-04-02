import { useState, useRef, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence, useScroll, useTransform, useInView } from 'framer-motion'
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
      stroke="var(--color-ink)"
      strokeOpacity="0.06"
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
      stroke="var(--color-accent)"
      strokeOpacity="0.12"
      strokeWidth="1.25"
      strokeLinecap="round"
    />
    <line
      x1="67%"
      y1="1"
      x2="100%"
      y2="1"
      stroke="var(--color-ink)"
      strokeOpacity="0.08"
      strokeWidth="0.75"
    />
  </svg>
)

const MonogramWatermark = () => (
  <motion.div
    className="absolute top-8 right-8 md:right-16 pointer-events-none select-none opacity-[0.04]"
    aria-hidden="true"
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 0.04, y: 0 }}
    transition={{ duration: 1.2, delay: 0.8 }}
  >
    <span className="font-display text-[10rem] md:text-[14rem] lg:text-[18rem] leading-none tracking-tighter">YS</span>
  </motion.div>
)

const CornerMarks = () => (
  <>
    {/* Top-left */}
    <div className="absolute top-3 left-3 z-10 flex gap-1 opacity-50">
      <span className="w-2.5 h-[1px] bg-ink/40 block" />
      <span className="w-[1px] h-2.5 bg-ink/40 block" />
    </div>
    {/* Top-right */}
    <div className="absolute top-3 right-3 z-10 flex gap-1 opacity-50">
      <span className="w-[1px] h-2.5 bg-ink/40 block" />
      <span className="w-2.5 h-[1px] bg-ink/40 block" />
    </div>
    {/* Bottom-left */}
    <div className="absolute bottom-3 left-3 z-10 flex gap-1 opacity-50">
      <span className="w-2.5 h-[1px] bg-ink/40 block" />
      <span className="w-[1px] h-2.5 bg-ink/40 block" />
    </div>
    {/* Bottom-right */}
    <div className="absolute bottom-3 right-3 z-10 flex gap-1 opacity-50">
      <span className="w-2.5 h-[1px] bg-ink/40 block" />
      <span className="w-[1px] h-2.5 bg-ink/40 block" />
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
          <span className="text-[0.6rem] uppercase tracking-widest text-ink-faint font-sans">{label}</span>
          <span className="text-[0.6rem] page-number">{value}/10</span>
        </div>
        <div className="h-[2px] bg-ink/5 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: value >= 8 ? 'var(--color-accent)' : 'var(--color-ink-light)' }}
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
          className="page-number px-3 py-1 font-display text-[0.65rem] bg-paper border border-ink/10 text-ink"
        >
          {s}
        </span>
      ))}
      {secondary.map((s) => (
        <span
          key={s}
          className="px-3 py-1 text-[0.6rem] page-number bg-paper border border-ink/5 text-ink-faint"
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
      <span className="float-left font-display text-5xl md:text-6xl text-accent leading-[0.8] mr-2 mt-1">
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-0 border border-ink/8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              className={`p-5 md:p-6 text-center ${
                i < stats.length - 1 ? 'border-r border-ink/8' : ''
              }`}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <div className="font-display text-2xl md:text-3xl tracking-tight text-ink">{stat.value}</div>
              <div className="text-[0.6rem] uppercase tracking-widest text-ink-faint mt-1 page-number">{stat.label}</div>
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
          className="page-number text-ink-faint mb-6"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        >
          Design Methodology
        </motion.p>
        <div className="relative">
          {/* Connecting line */}
          <div className="absolute top-7 left-0 right-0 h-[1px] bg-ink/10 hidden md:block" />
          <motion.div
            className="absolute top-7 left-0 h-[1px] bg-accent/40 hidden md:block"
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
                <div className="w-14 h-14 rounded-full bg-paper border border-ink/10 flex items-center justify-center mb-3 relative z-10">
                  <span className="text-accent text-xl">{step.icon}</span>
                </div>
                <span className="font-display text-sm text-ink">{t(step.key) || step.label}</span>
                <span className="text-[0.6rem] page-number mt-1">{String(i + 1).padStart(2, '0')}</span>
              </motion.div>
            ))}
          </div>
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
    tertiary: 'text-[0.65rem] md:text-xs text-ink-faint',
  }
  const borderMap = {
    primary: 'border-ink/15',
    secondary: 'border-ink/10',
    tertiary: 'border-ink/5',
  }

  return (
    <section className="px-6 md:px-12 py-16">
      <div className="mx-auto max-w-7xl">
        <p className="page-number text-ink-faint mb-6">Techniques & Tools</p>
        <div className="flex flex-wrap gap-2 md:gap-3">
          {ALL_TOOLS.map((tool) => (
            <span
              key={tool.name}
              className={`px-3 md:px-4 py-1.5 md:py-2 border rounded-sm page-number ${sizeMap[tool.level]} ${borderMap[tool.level]} bg-paper hover:border-accent/30 hover:text-accent transition-colors cursor-default`}
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
    return `${Math.min(...years)}${Math.min(...years) !== Math.max(...years) ? '–' + Math.max(...years) : ''}`
  }, [works])

  return (
    <section className="px-6 md:px-12 py-12 border-t border-b border-ink/5">
      <div className="mx-auto max-w-7xl">
        <p className="page-number text-ink-faint mb-6">Colophon</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {[
            { label: 'Period', value: dateRange },
            { label: 'Typography', value: 'Fraunces · Instrument Serif · Syne · Manrope' },
            { label: 'Primary Tools', value: COLLEGE_TOOLS.join(', ') },
            { label: 'Mediums', value: works.map(w => w.category).join(', ') },
          ].map(({ label, value }) => (
            <div key={label}>
              <span className="text-[0.6rem] uppercase tracking-widest text-ink-faint block mb-1">{label}</span>
              <span className="text-sm font-light text-ink-light leading-relaxed">{value}</span>
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
  const { t } = useLanguage()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  const meta = PROJECT_META[index] || PROJECT_META[0]

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
        className="absolute -top-16 -left-4 md:-left-16 pointer-events-none select-none z-0 opacity-[0.03]"
        aria-hidden="true"
      >
        <span className="font-display text-[12rem] md:text-[20rem] lg:text-[28rem] leading-none tracking-tighter">
          {String(index + 1).padStart(2, '0')}
        </span>
      </motion.div>

      <div className="relative z-10 pt-8">
        {/* Category label */}
        <motion.div className="flex items-center gap-3 mb-6">
          <span className="page-number text-ink-faint">{String(index + 1).padStart(2, '0')}</span>
          <div className="h-px flex-1 bg-ink/5" />
          <motion.span
            className="text-[0.6rem] uppercase tracking-widest page-number"
            animate={{ y: isHovered ? 0 : 4, opacity: isHovered ? 1 : 0.6 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            {work.category}
          </motion.span>
          <span className="page-number">{work.year}</span>
        </motion.div>

        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden mb-6">
          <CornerMarks />
          <div className="absolute inset-[11px] overflow-hidden bg-paper-dark">
            <motion.img
              src={work.media.src}
              alt={work.title}
              className="h-full w-full object-cover"
              animate={{ scale: isHovered ? 1.04 : 1 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              onError={(e) => {
                e.target.style.display = 'none'
                const ph = e.target.nextElementSibling
                if (ph) ph.style.display = 'flex'
              }}
            />
            <div className="placeholder absolute inset-0 z-20 items-center justify-center bg-paper-dark hidden">
              <span className="text-6xl font-display italic text-accent/15">
                {String(index + 1).padStart(2, '0')}
              </span>
            </div>
          </div>
        </div>

        {/* Caption */}
        <motion.p
          className="text-[0.65rem] text-ink-faint font-light tracking-wide mb-4 italic font-italic"
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          {meta.caption}
        </motion.p>

        {/* Title & Description */}
        <h3 className="text-2xl md:text-4xl font-display mb-2 tracking-tight leading-tight">{work.title}</h3>
        <p className="text-ink-light text-sm leading-relaxed mb-4 font-light max-w-2xl">{work.description}</p>

        {/* Difficulty & Impact */}
        <ProgressBar difficulty={meta.difficulty} impact={meta.impact} />

        {/* Skills */}
        {work.skillsGained && <SkillTags skills={work.skillsGained} />}

        {/* Pull Quote */}
        <motion.blockquote
          className="mt-8 pl-6 border-l-2 border-accent/30"
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <p className="font-italic text-lg text-ink/70 leading-relaxed">
            {meta.quote}
          </p>
        </motion.blockquote>

        {/* Reflection toggle */}
        <button
          onClick={() => setShowReflection(!showReflection)}
          className="reflexion-label flex items-center gap-2 mt-6 mb-2 group"
          aria-expanded={showReflection}
        >
          <span className="text-sm font-light text-ink-light group-hover:text-accent transition-colors">
            {showReflection ? t('closeReflection') : t('reflection')}
          </span>
          <motion.span
            animate={{ rotate: showReflection ? 0 : -90 }}
            transition={{ duration: 0.3 }}
            className="text-sm"
          >
            ↓
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
                <h4 className="font-display italic text-lg text-accent mb-4">
                  {t('reflection')}
                </h4>
                <p className="text-ink-light text-sm leading-relaxed whitespace-pre-line font-light">
                  {work.reflection}
                </p>
                {work.skillsGained && (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {work.skillsGained.map((s) => (
                      <span
                        key={s}
                        className="px-3 py-1 text-[0.65rem] page-number bg-paper border border-ink/5"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                )}
                <p className="mt-4 page-number text-ink-faint">
                  {t('learningOutcome')}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom decorative line */}
        <div className="mt-10 h-px bg-gradient-to-r from-ink/10 to-transparent" />
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
              <span className="section-number">07</span>
              <div className="w-6 h-px bg-accent/40 my-3" />
              <p className="page-number text-ink-faint">{t('reflection').toLowerCase()}</p>
            </motion.div>
          </div>
          <div className="col-span-12 md:col-span-9 lg:col-span-10">
            <motion.h2
              className="text-3xl md:text-5xl lg:text-6xl font-display tracking-tight leading-[0.95] mb-3"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
            >
              {t('reflectionTitle')}
            </motion.h2>
            <motion.p
              className="text-ink-faint page-number font-light"
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
              <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-ink/5 hidden md:block" />
              <motion.div
                className="absolute left-0 w-[1px] bg-accent/20 hidden md:block"
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
                    <div className="absolute -left-[3px] top-2 w-[7px] h-[7px] rounded-full bg-accent/30 hidden md:block" />

                    <h3 className="text-xl md:text-2xl font-display mb-4 tracking-tight text-ink">
                      {stmt.title}
                    </h3>
                    <DropCapParagraph
                      text={stmt.body}
                      className="text-ink-light text-[0.9rem] leading-[1.85] font-light whitespace-pre-line"
                    />
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
      className="relative min-h-screen text-ink cursor-none page-enter"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <Cursor />

      {/* ───── SCROLL PROGRESS BAR (top of viewport) ───── */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] bg-accent z-[60] origin-left"
        style={{ scaleX: scrollPercent }}
        aria-hidden="true"
      />

      {/* ───── FIXED TOP BAR ───── */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <div className="mx-auto max-w-7xl px-6 md:px-12 py-4 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-3 font-display italic text-xl text-ink hover:text-accent transition-colors"
          >
            <span className="text-lg">←</span>
            {t('home')}
          </Link>

          {/* Page indicator */}
          <div className="flex items-center gap-3">
            <span className="page-number text-ink-faint">
              <span className="text-ink">{String(currentPage).padStart(2, '0')}</span>
              {' / '}
              {String(totalWorks).padStart(2, '0')}
            </span>
            <LanguageSelector />
          </div>
        </div>
        <div className="mx-auto max-w-7xl px-6 md:px-12">
          <div className="h-px bg-gradient-to-r from-transparent via-ink/10 to-transparent" />
        </div>
      </div>

      {/* ───── HEADER ───── */}
      <motion.header
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="pt-24 pb-12 px-6 md:px-12 relative overflow-hidden"
      >
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
                <span className="section-number">{t('portfolio')}</span>
                <div className="w-8 h-px bg-accent/40 my-4" />
                <p className="page-number">{t('selectedWorks')}</p>
              </motion.div>
            </div>

            {/* Right column */}
            <div className="col-span-12 md:col-span-8 lg:col-span-9">
              <motion.h1
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="text-5xl md:text-7xl lg:text-8xl font-display tracking-tight leading-[0.9] mb-6"
              >
                {t('portfolioTitle')}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-ink-faint text-base font-light max-w-xl leading-relaxed"
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
        <div className="h-px bg-gradient-to-r from-ink/10 via-ink/5 to-transparent" />
      </div>

      {/* ───── PROCESS SECTION ───── */}
      <ProcessSection />

      {/* ───── DIVIDER ───── */}
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="h-px bg-gradient-to-r from-ink/10 via-ink/5 to-transparent" />
      </div>

      {/* ───── TECHNIQUES & TOOLS ───── */}
      <TechniquesTools />

      {/* ───── DIVIDER ───── */}
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="h-px bg-gradient-to-r from-ink/10 via-ink/5 to-transparent" />
      </div>

      {/* ───── WORK GALLERY — vertical scroll sections ───── */}
      <section className="px-6 md:px-12 pt-12 pb-20">
        <div className="mx-auto max-w-7xl">
          {Array.isArray(works) && works.map((work, i) => (
            <div key={work.id} className="py-12 md:py-20">
              <WorkItem work={work} index={i} />
            </div>
          ))}
        </div>
      </section>

      {/* ───── DIVIDER ───── */}
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="h-px bg-gradient-to-r from-ink/10 via-ink/5 to-transparent" />
      </div>

      {/* ───── COLOPHON ───── */}
      {Array.isArray(works) && <Colophon works={works} />}

      {/* ───── DIVIDER ───── */}
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="h-px bg-gradient-to-r from-ink/10 via-ink/5 to-transparent" />
      </div>

      {/* ───── REFLECTIONS ───── */}
      <Reflections />

      {/* ───── DIVIDER ───── */}
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="h-px bg-gradient-to-r from-ink/10 via-ink/5 to-transparent" />
      </div>

      {/* ───── ETHICS NOTICE ───── */}
      <section className="px-6 md:px-12 py-16">
        <div className="mx-auto max-w-3xl">
          <div className="relative border-2 border-accent/10 p-8 md:p-12 bg-[#f7f3ee]">
            {/* Decorative corners */}
            <div className="absolute -top-[1px] -left-[1px] w-4 h-4 border-t-2 border-l-2 border-accent/30" />
            <div className="absolute -top-[1px] -right-[1px] w-4 h-4 border-t-2 border-r-2 border-accent/30" />
            <div className="absolute -bottom-[1px] -left-[1px] w-4 h-4 border-b-2 border-l-2 border-accent/30" />
            <div className="absolute -bottom-[1px] -right-[1px] w-4 h-4 border-b-2 border-r-2 border-accent/30" />

            <p className="page-number text-accent mb-3 text-center uppercase tracking-widest text-[0.65rem]">
              {t('ethicsNotice')}
            </p>
            <p className="text-ink-light text-sm font-light text-center leading-relaxed max-w-xl mx-auto">
              {t('authorshipAll')}
            </p>
          </div>
        </div>
      </section>

      {/* ───── FOOTER ───── */}
      <footer className="border-t border-ink/5">
        {/* Row 1 */}
        <div className="mx-auto max-w-7xl px-6 md:px-12 py-10">
          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-12 md:col-span-4">
              <Link
                to="/"
                className="font-display italic text-xl text-ink hover:text-accent transition-colors"
              >
                YS
              </Link>
              <p className="text-ink-faint text-sm font-light mt-2 leading-relaxed">
                {t('portfolioDescription')}
              </p>
            </div>
            <div className="col-span-12 md:col-span-4">
              <h4 className="page-number text-[0.6rem] uppercase tracking-widest text-ink-faint mb-3">
                {t('portfolio').toLowerCase()}
              </h4>
              <p className="text-ink-light text-sm font-light">
                {Array.isArray(works) ? works.length : 0} {t('projects')}
              </p>
              <p className="text-ink-faint text-xs page-number mt-1">
                {t('selectedWorks')}
              </p>
            </div>
            <div className="col-span-12 md:col-span-4 text-right">
              <button
                onClick={scrollToTop}
                className="page-number text-sm text-ink-faint hover:text-accent transition-colors flex items-center gap-2 ml-auto"
              >
                {t('home')}
                <span className="inline-block">↑</span>
              </button>
              <p className="text-ink-faint text-xs page-number mt-2">
                {new Date().toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>
        </div>

        {/* Row 2 — bottom bar */}
        <div className="border-t border-ink/5">
          <div className="mx-auto max-w-7xl px-6 md:px-12 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <span className="page-number text-ink-faint text-xs">
              {t('footerText')} — {new Date().getFullYear()}
            </span>
            <span className="page-number text-ink-faint text-xs">
              {t('precision')}
            </span>
          </div>
        </div>
      </footer>

      {/* ───── BACK TO TOP FLOATING BUTTON ───── */}
      <motion.button
        className="fixed bottom-8 right-8 z-40 w-12 h-12 rounded-full bg-[#f7f3ee] border border-ink/10 flex items-center justify-center shadow-lg hover:border-accent/30 hover:text-accent transition-colors"
        onClick={scrollToTop}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        aria-label="Back to top"
      >
        <span className="text-lg">↑</span>
      </motion.button>
    </div>
  )
}

export default Portfolio
