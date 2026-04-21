import { useState, useRef, useEffect, useMemo, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence, useScroll, useTransform, useInView } from 'framer-motion'
import { useLanguage } from './LanguageContext'
import LanguageSelector from './LanguageSelector'
import Cursor from './Cursor'
import { prepareWithSegments, layoutWithLines } from '@chenglou/pretext'
import { FEATURED_WORKS, getArchiveCategories } from './data/archiveData'
import ImageCard from './components/ImageCard'
import Lightbox from './components/Lightbox'
import { useImageLoader } from './hooks/useImageLoader'
import Fuse from 'fuse.js'

/* ──────────────── FEATURED WORKS (from Portfolio showcase) ──────────────── */
/* Removed code block */

const D = {
  bg: '#0d1410',
  cardBg: '#111c14',
  cardHover: '#162319',
  border: 'rgba(45, 107, 63, 0.1)',
  borderLight: 'rgba(45, 107, 63, 0.05)',
  text: '#c8d8cc',
  muted: '#7a8a7e',
  faint: '#3a4a3e',
  accent: '#4a9f62',
  accentDeep: '#2d6b3f',
  cardBgLight: '#111c14',
}

/* ──────────────── ARCHIVE CATEGORIES ──────────────── */
/* Removed code block */

/* ──────────────── FALLBACK SVG ──────────────── */
const FallbackSvg = () => (
  <svg viewBox="0 0 400 267" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <rect width="400" height="267" fill={D.cardBg} />
    <circle cx="200" cy="100" r="40" fill="none" stroke={D.faint} strokeWidth="1.5" />
    <text x="200" y="180" textAnchor="middle" fill={D.faint} fontSize="11" fontFamily="sans-serif">Image unavailable</text>
  </svg>
)

/* ──────────────── BOTANICAL WATERMARK ──────────────── */
const BotanicalWatermark = () => (
  <svg
    className="absolute inset-0 w-full h-full opacity-[0.03] pointer-events-none"
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
    {Array.from({ length: 12 }).map((_, i) => (
      <use key={i} href="#leaf" transform={`translate(${100 + i * 90}, ${150 + Math.sin(i) * 80}) rotate(${i * 15 - 30}) scale(${0.6 + Math.random() * 0.4})`} opacity="0.5" />
    ))}
  </svg>
)

/* ──────────────── IMAGE STATE ──────────────── */
/* Removed code block */

/* ──────────────── FEATURED WORK ITEM ──────────────── */
const FeaturedWorkItem = ({ work, index, onClick }) => {
  const { t } = useLanguage()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const [hovered, setHovered] = useState(false)
  const imgState = useImageLoader(work.src, isInView)
  const [showReflection, setShowReflection] = useState(false)
  const [expanded, setExpanded] = useState(false)

  const titleWidth = useMemo(() => {
    try {
      const p = prepareWithSegments(work.title, '1.25rem "Fraunces"')
      const { lines } = layoutWithLines(p, 2000, 22)
      const w = Math.max(...lines.map(l => l.width), 1)
      return w.toFixed(0)
    } catch { return null }
  }, [work.title])



  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: 0.05, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="relative"
      style={{ minHeight: 'calc(100vh - 12rem)' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* water number */}
      <div className="absolute -top-16 -left-4 md:-left-16 pointer-events-none select-none z-0"
        style={{ color: '#2d5a3d', opacity: 0.03 }}>
        <span className="font-display text-[12rem] md:text-[20rem] lg:text-[28rem] leading-none tracking-tighter">
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>

      <div className="relative z-10 pt-8">
        {/* Category label */}
        <div className="flex items-center gap-3 mb-6">
          <span className="page-number" style={{ color: '#2d5a3d60' }}>{String(index + 1).padStart(2, '0')}</span>
          <div className="h-px flex-1" style={{ backgroundColor: '#2d5a3d10' }} />
          <motion.span className="text-[0.6rem] uppercase tracking-widest page-number"
            animate={{ y: hovered ? 0 : 4, opacity: hovered ? 1 : 0.6 }}
            transition={{ duration: 0.4 }}
            style={{ color: '#2d5a3d' }}
          >
            {work.category}
          </motion.span>
          <span className="page-number" style={{ color: '#2d5a3d60' }}>{work.year}</span>
        </div>

        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden mb-6 cursor-pointer" onClick={() => onClick(index)}>
          {imgState === "idle" && (
            <div className="absolute inset-0 flex items-center justify-center" style={{ background: D.cardBg }}>
              <div className="w-6 h-6 border-2 rounded-full animate-spin" style={{ borderTopColor: D.accent, borderColor: '#2d5a3d30' }} />
            </div>
          )}
          {imgState !== "error" && (
            <motion.img
              src={work.src} alt={work.title} loading="lazy" decoding="async"
              className="h-full w-full object-cover"
              style={{ opacity: imgState === "loaded" ? 1 : 0 }}
              animate={{ scale: hovered ? 1.04 : 1 }}
              transition={{ duration: 0.6 }}
              onLoad={() => setImgState("loaded")}
              onError={() => setImgState("error")}
            />
          )}
          {imgState === "error" && <FallbackSvg />}
        </div>

        {/* Title */}
        <div className="flex items-baseline gap-3 mb-2">
          <h3 className="text-2xl md:text-4xl font-display tracking-tight leading-tight" style={{ color: D.text }}>{work.title}</h3>
          {titleWidth && (
            <span className="page-number hidden md:inline-flex items-center gap-1 px-1.5 py-0.5 border rounded-sm flex-shrink-0"
              style={{ borderColor: '#2d5a3d15', color: '#2d5a3d30', fontSize: '0.5rem' }}
              title={work.title}>
              {titleWidth}px
            </span>
          )}
        </div>

        {/* Description with expand */}
        <p className={`text-sm leading-relaxed mb-3 font-light max-w-2xl ${expanded ? '' : 'line-clamp-3'}`} style={{ color: '#2d5a3d' }}>
          {work.description}
          {work.description.length > 120 && (
            <button onClick={() => setExpanded(!expanded)} className="inline ml-1 underline" style={{ color: D.accent }}>
              {expanded ? 'less' : 'more'}
            </button>
          )}
        </p>

        {/* Reflection toggle */}
        <button onClick={() => setShowReflection(!showReflection)}
          className="flex items-center gap-2 mt-4 mb-2">
          <span className="text-sm font-light hover:transition-colors" style={{ color: '#2d5a3d' }}
            onMouseEnter={e => e.currentTarget.style.color = D.accent}
            onMouseLeave={e => e.currentTarget.style.color = '#2d5a3d'}
          >
            {showReflection ? t('closeReflection') : t('reflection')}
          </span>
          <motion.span animate={{ rotate: showReflection ? 0 : -90 }} transition={{ duration: 0.3 }}
            style={{ color: D.accent }}>↓</motion.span>
        </button>

        <AnimatePresence initial={false}>
          {showReflection && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4 }} className="overflow-hidden">
              <div className="pb-4 pt-2">
                <h4 className="font-display italic text-lg mb-3" style={{ color: D.accent }}>{t('reflection')}</h4>
                <p className="text-sm leading-relaxed font-light" style={{ color: '#2d5a3d' }}>{work.reflection}</p>
                {work.skillsGained && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {work.skillsGained.map(s => (
                      <span key={s} className="px-3 py-1 text-[0.6rem] page-number border rounded-sm"
                        style={{ borderColor: '#2d5a3d15', color: '#2d5a3d', background: D.cardBg }}>{s}</span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Divider */}
        <div className="mt-8 h-px" style={{ backgroundImage: 'linear-gradient(to right, #2d5a3d15, transparent)' }} />
      </div>
    </motion.div>
  )
}

/* Removed code block */

/* ──────────────── WORKS STATS BAR ──────────────── */
const WorksStats = ({ totalItems, totalCategories, featuredCount, viewMode }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.6, duration: 0.5 }}
    className="mx-auto max-w-7xl px-6 md:px-12 py-4"
  >
    <div className="flex items-center justify-between flex-wrap gap-3">
      <div className="flex items-center gap-4 md:gap-6">
        <div className="text-center">
          <div className="font-display text-lg md:text-xl" style={{ color: D.text }}>{featuredCount}</div>
          <div className="text-[0.55rem] uppercase tracking-widest" style={{ color: D.faint }}>Featured</div>
        </div>
        <div className="h-6 w-px" style={{ background: D.border }} />
        <div className="text-center">
          <div className="font-display text-lg md:text-xl" style={{ color: D.text }}>{totalItems}</div>
          <div className="text-[0.55rem] uppercase tracking-widest" style={{ color: D.faint }}>Total</div>
        </div>
        <div className="h-6 w-px" style={{ background: D.border }} />
        <div className="text-center">
          <div className="font-display text-lg md:text-xl" style={{ color: D.text }}>{totalCategories}</div>
          <div className="text-[0.55rem] uppercase tracking-widest" style={{ color: D.faint }}>Categories</div>
        </div>
      </div>
      <div className="page-number hidden md:block" style={{ color: D.faint }}>
        {viewMode === 'showcase' ? 'Scroll to explore' : `Showing ${totalItems} works`}
      </div>
    </div>
  </motion.div>
)

/* ──────────────── CATEGORY SECTION ──────────────── */
const CategorySection = ({ category, index, onImageClick, isSearchResult }) => {
  const { t } = useLanguage()
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-10%' })

  return (
    <section ref={sectionRef}
      className="py-16 px-6 md:px-12 relative"
    >
      <div className="mx-auto max-w-7xl">
        {/* Section header */}
        <div className="mb-10">
          <motion.span className="section-number block mb-3" style={{ color: D.accent }}
            initial={{ opacity: 0, x: -10 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
          >
            {String(index + 1).padStart(2, '0')}
          </motion.span>
          <h2 className="text-3xl md:text-4xl font-display" style={{ color: D.text }}>{category.label}</h2>
          <p className="text-sm font-light mt-1" style={{ color: D.muted }}>{category.description}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {category.items.map((item, i) => (
            <ImageCard 
              key={item.src} 
              src={item.src} 
              caption={item.caption} 
              index={i} 
              isDoc={item.isDoc} 
              badge={isSearchResult ? item.categoryLabel : null}
              onClick={onImageClick} 
            />
          ))}
        </div>
      </div>
    </section>
  )
}

/* ──────────────── DIVIDER ──────────────── */
const Divider = () => (
  <div className="mx-auto max-w-7xl px-6 md:px-12">
    <div className="h-px" style={{ backgroundImage: 'linear-gradient(to right, #2d5a3d20, #2d5a3d10, transparent)' }} />
  </div>
)

/* ──────────────── UNIFIED WORKS PAGE ──────────────── */
function WorksArchive() {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const { scrollYProgress } = useScroll()
  const scrollPercent = useTransform(scrollYProgress, [0, 1], [0, 100])

  const allCategories = useMemo(() => getArchiveCategories(), [])
  const totalItems = allCategories.reduce((s, c) => s + c.items.length, 0)

  // Flattened items for global fuzzy search
  const searchableItems = useMemo(() => {
    return allCategories.flatMap(cat => 
      cat.items.map(item => ({
        ...item,
        categoryLabel: cat.label,
        categoryId: cat.id
      }))
    )
  }, [allCategories])

  const fuse = useMemo(() => new Fuse(searchableItems, {
    keys: ['caption', 'categoryLabel'],
    threshold: 0.35,
    distance: 100,
    ignoreLocation: true,
    useExtendedSearch: true
  }), [searchableItems])

  /* State for archive section */
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [lightbox, setLightbox] = useState(null)
  const [viewMode, setViewMode] = useState('showcase') // 'showcase' or 'archive'

  /* Featured works lightbox */
  const handleFeaturedClick = useCallback((idx) => {
    const idx_ = idx
    const allFeatured = FEATURED_WORKS.map(w => ({ src: w.src, caption: w.title }))
    setLightbox({
      src: allFeatured[idx_].src,
      caption: allFeatured[idx_].caption,
      index: idx_,
      items: allFeatured,
    })
  }, [])

  /* Archive lightbox */
  const openArchiveLightbox = useCallback((item) => {
    let filtered = []
    if (searchQuery) {
      const results = fuse.search(searchQuery)
      filtered = results.map(r => r.item)
      if (activeCategory !== 'all') {
        filtered = filtered.filter(i => i.categoryId === activeCategory)
      }
    } else {
      filtered = (activeCategory === 'all' ? allCategories : allCategories.filter(c => c.id === activeCategory))
        .flatMap(cat => cat.items)
    }
    
    const idx = filtered.findIndex(i => i.src === item.src)
    setLightbox({ ...item, index: idx, items: filtered, fromArchive: true })
  }, [activeCategory, allCategories, searchQuery, fuse])

  /* Lightbox navigation */
  function navLightbox(delta) {
    if (!lightbox) return
    const items = lightbox.items
    if (!items) return
    const nextIdx = (lightbox.index + delta + items.length) % items.length
    const item = items[nextIdx]
    setLightbox({ src: item.src, caption: item.caption, index: nextIdx, items, fromArchive: lightbox.fromArchive })
  }

  /* Filtered categories/items */
  const { filteredContent, resultsCount } = useMemo(() => {
    if (!searchQuery) {
      const cats = activeCategory === 'all' 
        ? allCategories 
        : allCategories.filter(c => c.id === activeCategory)
      return { 
        filteredContent: cats.map(c => ({ ...c, isSearchResult: false })), 
        resultsCount: cats.reduce((acc, curr) => acc + curr.items.length, 0) 
      }
    }

    // Fuzzy search mode
    const results = fuse.search(searchQuery)
    let filteredItems = results.map(r => r.item)

    if (activeCategory !== 'all') {
      filteredItems = filteredItems.filter(item => item.categoryId === activeCategory)
    }

    // If searching, we show a flat list if it's "all" categories, or keep it themed
    return {
      filteredContent: [{
        id: 'search-results',
        label: activeCategory === 'all' ? 'Search Results' : `${allCategories.find(c => c.id === activeCategory)?.label} Results`,
        description: `Found ${filteredItems.length} matching items`,
        items: filteredItems,
        isSearchResult: true
      }],
      resultsCount: filteredItems.length
    }
  }, [searchQuery, activeCategory, allCategories, fuse])

  return (
    <div className="relative min-h-screen cursor-none page-enter" style={{ background: D.bg, color: D.text }}>
      <Cursor />

      {/* Reading progress bar */}
      <motion.div className="fixed top-0 left-0 right-0 h-[2px] z-[60] origin-left"
        style={{ scaleX: scrollYProgress, backgroundColor: D.accent }} aria-hidden="true" />

      {/* Top bar */}
      <div className="fixed top-0 left-0 right-0 z-50" style={{ background: 'rgba(13, 20, 16, 0.92)', backdropFilter: 'blur(12px)' }}>
        <div className="mx-auto max-w-7xl px-6 md:px-12 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" style={{ color: D.text }} className="font-display text-xl italic hover:transition-colors"
              onMouseEnter={e => e.currentTarget.style.color = D.accent}
              onMouseLeave={e => e.currentTarget.style.color = D.text}>
              Y.S.
            </Link>
            <span className="hidden md:block h-4 w-px" style={{ background: D.faint }} />
            <span className="hidden md:block page-number" style={{ color: D.muted }}>Portfolio & Archive</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setViewMode(v => v === 'showcase' ? 'archive' : 'showcase')}
              className="page-number text-xs px-3 py-1.5 border rounded-sm transition-colors"
              style={{ borderColor: D.border, color: D.muted, background: viewMode === 'showcase' ? D.cardBg : 'transparent' }}
              onMouseEnter={e => e.currentTarget.style.color = D.accent}
              onMouseLeave={e => e.currentTarget.style.color = D.muted}
            >
              {viewMode === 'showcase' ? 'Showcase' : 'Archive'}
            </button>
            <LanguageSelector />
          </div>
        </div>
        <div className="mx-auto max-w-7xl px-6 md:px-12">
          <div className="h-px" style={{ background: `linear-gradient(to right, transparent, ${D.border}, transparent)` }} />
        </div>
      </div>

      {/* Header */}
      <motion.header initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }} className="pt-24 pb-8 px-6 md:px-12 relative overflow-hidden">
        <BotanicalWatermark />
        <div className="mx-auto max-w-7xl relative z-10">
          <div className="grid grid-cols-12 gap-8 md:gap-16">
            <div className="col-span-12 md:col-span-4 lg:col-span-3">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
                <span className="section-number" style={{ color: D.accent }}>Works</span>
                <div className="w-8 h-px my-4" style={{ background: `${D.accent}66` }} />
                <p className="page-number" style={{ color: D.muted }}>{viewMode === 'showcase' ? `${FEATURED_WORKS.length} featured works` : `${resultsCount} works across ${filteredContent.length} sections`}</p>
              </motion.div>
            </div>
            <div className="col-span-12 md:col-span-8 lg:col-span-9">
              <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.25 }} className="text-5xl md:text-7xl lg:text-8xl font-display tracking-tight leading-[0.9] mb-6" style={{ color: D.text }}>
                {viewMode === 'showcase' ? 'Selected Works' : 'Complete Archive'}
              </motion.h1>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-base font-light max-w-xl leading-relaxed" style={{ color: D.muted }}>
                {viewMode === 'showcase'
                  ? 'Featured projects from my creative process — each piece reflects deliberate practice, iterative critique, and growth across my academic journey.'
                  : 'Every design piece, photograph, academic slide, and creative project — organized in one browsable archive.'}
              </motion.p>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Stats bar */}
      <WorksStats totalItems={totalItems} totalCategories={allCategories.length} featuredCount={FEATURED_WORKS.length} viewMode={viewMode} />

      {/* Showcase mode */}
      {viewMode === 'showcase' && (
        <>
          <Divider />
          <div className="mx-auto max-w-7xl px-6 md:px-12 pt-8">
            <div className="flex items-center justify-between">
              <p className="page-number text-sm" style={{ color: D.muted }}>Featured Projects</p>
              <button onClick={() => setViewMode('archive')}
                className="page-number text-sm flex items-center gap-2 hover:transition-colors"
                style={{ color: D.accent }}
                onMouseEnter={e => e.currentTarget.style.color = '#63b476'}
                onMouseLeave={e => e.currentTarget.style.color = D.accent}
              >
                View All Works <span>→</span>
              </button>
            </div>
          </div>
          <section className="px-6 md:px-12 pt-8 pb-20">
            <div className="mx-auto max-w-7xl">
              {FEATURED_WORKS.map((work, i) => (
                <div key={work.id} className="py-8 md:py-16" data-project>
                  <div id={`project-${work.id}`}>
                    <FeaturedWorkItem work={work} index={i} onClick={handleFeaturedClick} />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Divider */}
          <Divider />

          {/* Quick preview of archive categories */}
          <section className="px-6 md:px-12 py-16">
            <div className="mx-auto max-w-7xl">
              <div className="flex items-center justify-between mb-10">
                <p className="page-number text-sm" style={{ color: D.muted }}>Complete Archive</p>
                <p className="page-number text-xs" style={{ color: D.faint }}>{totalItems} items across {allCategories.length} categories</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {allCategories.map((cat, i) => (
                  <motion.button
                    key={cat.id}
                    onClick={() => { setActiveCategory(cat.id); setViewMode('archive') }}
                    className="group text-left p-4 rounded-sm border transition-colors"
                    style={{ borderColor: D.border, background: D.cardBg }}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = D.accent }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = D.border }}
                  >
                    <span className="page-number text-[0.55rem] block mb-2" style={{ color: D.faint }}>
                      {cat.items.length} items
                    </span>
                    <span className="text-sm font-display block mb-1 group-hover:transition-colors" style={{ color: D.text }}>
                      {cat.label}
                    </span>
                    <span className="text-[0.6rem] font-light" style={{ color: D.muted }}>
                      {cat.description}
                    </span>
                  </motion.button>
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      {/* Archive mode */}
      {viewMode === 'archive' && (
        <>
          {/* Sticky filter bar */}
          <div className="sticky top-[57px] z-40 border-b" style={{ background: 'rgba(13, 20, 16, 0.95)', backdropFilter: 'blur(8px)', borderColor: D.border }}>
            <div className="mx-auto max-w-7xl px-6 md:px-12 pt-4 pb-2">
              <div className="relative group">
                <input
                  type="text" 
                  placeholder="Thorough search (typos allowed)..." 
                  value={searchQuery} 
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-4 pr-12 py-3.5 text-sm border outline-none transition-all duration-300 focus:ring-1 focus:ring-[#4a9f6240]"
                  style={{ 
                    background: 'rgba(17, 28, 20, 0.4)', 
                    backdropFilter: 'blur(4px)',
                    borderColor: searchQuery ? D.accent : D.border, 
                    color: D.text,
                    borderRadius: '2px'
                  }}
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-xs hover:transition-colors"
                    style={{ color: D.muted }}
                    onMouseEnter={e => e.currentTarget.style.color = D.accent}
                    onMouseLeave={e => e.currentTarget.style.color = D.muted}
                  >
                    CLEAR
                  </button>
                )}
              </div>
              <div className="flex items-center justify-between mt-3 px-1">
                <div className="flex items-center gap-1.5 opacity-60">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: searchQuery ? D.accent : D.muted }} />
                  <span className="text-[0.65rem] uppercase tracking-widest" style={{ color: D.muted }}>
                    {searchQuery ? `Fuzzy Match: ${resultsCount} found` : 'Standard Filter'}
                  </span>
                </div>
                { (searchQuery || activeCategory !== 'all') && (
                  <button onClick={() => { setActiveCategory('all'); setSearchQuery('') }}
                    className="text-[0.6rem] uppercase tracking-tighter opacity-50 hover:opacity-100 hover:transition-opacity" style={{ color: D.accent }}>
                    Reset Filters
                  </button>
                )}
              </div>
              <div className="mt-2 overflow-x-auto pb-2">
                <div className="flex gap-2 whitespace-nowrap">
                  <button onClick={() => { setActiveCategory('all'); setSearchQuery('') }}
                    className="px-4 py-2 text-xs uppercase rounded-sm transition-all"
                    style={activeCategory === 'all' && !searchQuery ? { background: D.accent, color: '#fff' } : { background: D.cardBg, color: D.faint }}>
                    All ({totalItems})
                  </button>
                  {allCategories.map((cat) => (
                    <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
                      className="px-4 py-2 text-xs uppercase rounded-sm transition-all"
                      style={activeCategory === cat.id ? { background: D.accent, color: '#fff' } : { background: D.cardBg, color: D.faint }}>
                      {cat.label} ({cat.items.length})
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Archive content */}
          <AnimatePresence mode="wait">
            <motion.div key={activeCategory + '__' + searchQuery} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
              {filteredContent.length > 0 && resultsCount > 0 ? (
                filteredContent.map((cat, i) => (
                  <CategorySection 
                    key={cat.id} 
                    category={cat} 
                    index={i} 
                    onImageClick={openArchiveLightbox}
                    isSearchResult={searchQuery !== ''}
                  />
                ))
              ) : (
                <div className="py-24 text-center">
                  <BotanicalWatermark />
                  <p className="text-xl font-display" style={{ color: D.muted }}>No matches found</p>
                  <p className="text-sm font-light mt-2" style={{ color: D.faint }}>Try searching for a different keyword or category</p>
                  <button onClick={() => { setSearchQuery(''); setActiveCategory('all') }} 
                    className="mt-6 px-6 py-2 border rounded-sm text-xs uppercase tracking-widest transition-colors"
                    style={{ borderColor: D.border, color: D.accent }}
                  >
                    Reset Archive
                  </button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </>
      )}

      {/* Footer */}
      <footer className="py-8 px-6 md:px-12 border-t" style={{ borderColor: D.border }}>
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <Link to="/" className="font-display italic text-xl" style={{ color: D.text }}>Y.S.</Link>
          <span className="page-number text-sm" style={{ color: D.faint }}>
            {totalItems} works · {allCategories.length} categories · {new Date().getFullYear()}
          </span>
        </div>
      </footer>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <Lightbox
            src={lightbox.src} caption={lightbox.caption}
            onClose={() => setLightbox(null)}
            onPrev={lightbox.items && lightbox.index > 0 ? () => navLightbox(-1) : null}
            onNext={lightbox.items && lightbox.index < lightbox.items.length - 1 ? () => navLightbox(1) : null}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default WorksArchive
