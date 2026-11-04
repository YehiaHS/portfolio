import { useState, useRef, useEffect, useMemo, useCallback } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence, useScroll, useInView } from 'framer-motion'
import { useLanguage } from './LanguageContext'
import Nav from './Nav'
import { BackToTop } from './sections/Footer'
import { FitLines } from './components/PretextType'
import Cursor from './Cursor'
import { FEATURED_WORKS, getArchiveCategories } from './data/archiveData'
import ImageCard from './components/ImageCard'
import Lightbox from './components/Lightbox'
import { useImageLoader } from './hooks/useImageLoader'
import { latestItems, mergeCategories, useDriveCategories } from './data/driveContent'
import Fuse from 'fuse.js'

const D = {
  bg: '#0d1410',
  cardBg: '#111c14',
  cardHover: '#162319',
  border: 'rgba(45, 107, 63, 0.1)',
  borderLight: 'rgba(45, 107, 63, 0.05)',
  text: '#c8d8cc',
  muted: '#a8b8ac',
  faint: '#8a9c8e',
  accent: '#4a9f62',
  accentDeep: '#2d6b3f',
  cardBgLight: '#111c14',
}

/* ──────────────── FALLBACK SVG ──────────────── */
const FallbackSvg = () => (
  <svg viewBox="0 0 400 267" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <rect width="400" height="267" fill={D.cardBg} />
    <circle cx="200" cy="100" r="40" fill="none" stroke={D.faint} strokeWidth="1.5" />
    <text x="200" y="180" textAnchor="middle" fill={D.faint} fontSize="11" fontFamily="sans-serif">Image unavailable</text>
  </svg>
)

const TITLE_FONT = '340 "Fraunces"'
const SHOWCASE_TITLE = ['Selected Works']
const ARCHIVE_TITLE = ['Complete Archive']

/* ──────────────── FEATURED WORK ITEM ──────────────── */
const FeaturedWorkItem = ({ work, index, onClick }) => {
  const { t } = useLanguage()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const [hovered, setHovered] = useState(false)
  const imgState = useImageLoader(work.isVideo ? null : work.src, isInView)
  const [showReflection, setShowReflection] = useState(false)


  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: 0.05, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >

      <div className="relative z-10">
        {/* Category label */}
        <div className="flex items-center gap-3 mb-6">
          <span className="page-number" style={{ color: D.faint }}>{String(index + 1).padStart(2, '0')}</span>
          <div className="h-px flex-1" style={{ backgroundColor: '#2d5a3d10' }} />
          <motion.span className="text-[0.6rem] uppercase tracking-widest page-number"
            animate={{ y: hovered ? 0 : 4, opacity: hovered ? 1 : 0.6 }}
            transition={{ duration: 0.4 }}
            style={{ color: D.muted }}
          >
            {work.category}
          </motion.span>
          <span className="page-number" style={{ color: D.faint }}>{work.year}</span>
        </div>

        {/* Image / Video */}
        <div
          className="relative aspect-[16/10] overflow-hidden mb-6 cursor-pointer"
          style={{ background: D.cardBg }}
          role="button"
          tabIndex={0}
          aria-label={work.title}
          onClick={() => onClick(index)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              onClick(index)
            }
          }}
        >
          {work.isVideo ? (
            <video 
              src={work.src} 
              preload="metadata"
              muted 
              loop 
              playsInline 
              className="h-full w-full object-contain"
              onMouseOver={e => e.currentTarget.play()}
              onMouseOut={e => { e.currentTarget.pause(); e.currentTarget.currentTime = 0; }}
            />
          ) : (
            <>
              {imgState === "idle" && (
                <div className="absolute inset-0 flex items-center justify-center" style={{ background: D.cardBg }}>
                  <div className="w-6 h-6 border-2 rounded-full animate-spin" style={{ borderTopColor: D.accent, borderColor: '#2d5a3d30' }} />
                </div>
              )}
              {imgState !== "error" && (
                <motion.img
                  src={work.src} alt={work.title} loading="lazy" decoding="async"
                  className="h-full w-full object-contain"
                  style={{ opacity: imgState === "loaded" ? 1 : 0 }}
                  animate={{ scale: hovered ? 1.04 : 1 }}
                  transition={{ duration: 0.6 }}
                />
              )}
              {imgState === "error" && <FallbackSvg />}
            </>
          )}
          
          {/* Overlay for video */}
          {work.isVideo && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0d1410]/20 backdrop-blur-[2px]">
              <div className="w-12 h-12 rounded-full border border-[#f5f5f0]/30 flex items-center justify-center bg-[#f5f5f0]/10">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#f5f5f0"><path d="M8 5v14l11-7z" /></svg>
              </div>
              <span className="mt-2 text-[0.6rem] uppercase tracking-[0.2em] font-mono text-[#f5f5f0]">Play Recap</span>
            </div>
          )}
        </div>

        {/* Title */}
        <div className="flex items-baseline gap-3 mb-2">
          <h3 className="text-2xl md:text-4xl font-display tracking-tight leading-tight" style={{ color: D.text }}>{work.title}</h3>
        </div>

        {/* Description with expand */}
        <p className="text-sm leading-relaxed font-light max-w-2xl" style={{ color: D.muted }}>
          {work.description}
        </p>

        {/* Reflection toggle */}
        <button onClick={() => setShowReflection(!showReflection)}
          className="flex items-center gap-2 mt-4 mb-2">
          <span className="text-sm font-light hover:transition-colors" style={{ color: D.muted }}
            onMouseEnter={e => e.currentTarget.style.color = D.accent}
            onMouseLeave={e => e.currentTarget.style.color = D.muted}
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
                <p className="text-sm leading-relaxed font-light" style={{ color: D.muted }}>{work.reflection}</p>
                {work.skillsGained && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {work.skillsGained.map(s => (
                      <span key={s} className="px-3 py-1 text-[0.6rem] page-number border rounded-sm"
                        style={{ borderColor: '#2d5a3d15', color: D.muted, background: D.cardBg }}>{s}</span>
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

/* ──────────────── VIEW SWITCH ──────────────── */
const ViewSwitch = ({ viewMode, onChange, summary }) => (
  <div className="px-6 md:px-12 pb-8">
  <div className="mx-auto max-w-7xl flex flex-wrap items-center justify-between gap-4">
    <div className="flex gap-1 p-1 rounded-sm border" style={{ borderColor: D.border }} role="group" aria-label="Choose a view">
      {[['showcase', 'Featured'], ['archive', 'Full archive']].map(([mode, label]) => (
        <button
          key={mode}
          type="button"
          aria-pressed={viewMode === mode}
          onClick={() => onChange(mode)}
          className="px-4 py-2 text-sm rounded-sm transition-colors"
          style={viewMode === mode ? { background: D.accent, color: D.bg } : { color: D.muted }}
        >
          {label}
        </button>
      ))}
    </div>
    <p className="text-sm font-light" style={{ color: D.faint }}>{summary}</p>
  </div>
  </div>
)

/* ──────────────── CATEGORY SECTION ──────────────── */
const CategorySection = ({ category, index, onImageClick, isSearchResult }) => {
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
              {...item}
              fit={category.fit}
              index={i} 
              badge={isSearchResult ? item.categoryLabel : item.isNew ? 'New' : null}
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
  <div className="px-6 md:px-12">
    <div className="mx-auto max-w-7xl h-px" style={{ backgroundImage: 'linear-gradient(to right, #2d5a3d40, #2d5a3d10, transparent)' }} />
  </div>
)

/* ──────────────── UNIFIED WORKS PAGE ──────────────── */
function WorksArchive() {
  const { t } = useLanguage()
  const { scrollYProgress } = useScroll()

  const driveCategories = useDriveCategories()
  const allCategories = useMemo(() => mergeCategories(getArchiveCategories(), driveCategories), [driveCategories])
  const justAdded = useMemo(() => latestItems(driveCategories, 6), [driveCategories])
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
  // Kept in the URL so a filtered view survives a refresh, can be shared, and works with the back button
  const [searchParams, setSearchParams] = useSearchParams()
  const viewMode = searchParams.get('view') === 'archive' ? 'archive' : 'showcase'
  const searchQuery = searchParams.get('q') || ''
  const requestedCategory = searchParams.get('category')
  const activeCategory = allCategories.some((category) => category.id === requestedCategory) ? requestedCategory : 'all'
  const [lightbox, setLightbox] = useState(null)
  const searchRef = useRef(null)
  const filterBarRef = useRef(null)
  const resultsRef = useRef(null)

  const updateParams = useCallback((changes, options) => {
    setSearchParams((current) => {
      const next = new URLSearchParams(current)
      Object.entries(changes).forEach(([key, value]) => {
        if (value) next.set(key, value)
        else next.delete(key)
      })
      return next
    }, options)
  }, [setSearchParams])

  const setViewMode = useCallback((mode) => updateParams({ view: mode === 'archive' ? 'archive' : null }), [updateParams])
  const setActiveCategory = useCallback((id) => updateParams({ category: id === 'all' ? null : id }), [updateParams])
  // Typing replaces the history entry, otherwise back would undo one letter at a time
  const setSearchQuery = useCallback((value) => updateParams({ q: value }, { replace: true }), [updateParams])

  // Press / to jump to the search box from anywhere in the archive
  useEffect(() => {
    if (viewMode !== 'archive') return undefined
    const onKey = (event) => {
      if (event.key !== '/' || /^(INPUT|TEXTAREA|SELECT)$/.test(event.target.tagName)) return
      event.preventDefault()
      searchRef.current?.focus()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [viewMode])

  // Picking a category from far down the page shows its start, just below the sticky filters
  const isFirstCategory = useRef(true)
  useEffect(() => {
    if (isFirstCategory.current) {
      isFirstCategory.current = false
      return
    }
    const results = resultsRef.current
    const bar = filterBarRef.current
    if (!results || !bar) return
    const offset = results.getBoundingClientRect().top - bar.getBoundingClientRect().bottom
    if (offset < 0) window.scrollBy({ top: offset, behavior: 'instant' })
  }, [activeCategory])

  // Switching modes swaps the whole page, so don't leave the reader stranded mid-way down it
  const isFirstRender = useRef(true)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [viewMode])

  /* Featured works lightbox */
  const handleFeaturedClick = useCallback((idx) => {
    const idx_ = idx
    const allFeatured = FEATURED_WORKS.map(w => ({ 
      src: w.src, 
      caption: w.title, 
      isVideo: w.isVideo, 
      driveFallback: w.driveFallback 
    }))
    setLightbox({ 
      ...allFeatured[idx_], 
      index: idx_, 
      items: allFeatured 
    })
  }, [])

  /* Archive lightbox */
  const openArchiveLightbox = useCallback((item) => {
    // Documents have no image preview, so open them directly instead of in the lightbox
    if (item.isDoc) {
      window.open(item.src, '_blank', 'noopener,noreferrer')
      return
    }
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
    // Lightbox navigation skips documents for the same reason
    filtered = filtered.filter(i => !i.isDoc)

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
    setLightbox({ ...item, index: nextIdx, items, fromArchive: lightbox.fromArchive })
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
    <div className="relative min-h-screen cursor-none" style={{ background: D.bg, color: D.text }}>
      <Cursor />
      <Nav />

      {/* Reading progress bar */}
      <motion.div className="fixed top-0 left-0 right-0 h-[2px] z-[90] origin-left"
        style={{ scaleX: scrollYProgress, backgroundColor: D.accent }} aria-hidden="true" />

      <header className="pt-28 md:pt-32 pb-8 px-6 md:px-12">
        <div className="mx-auto max-w-7xl">
          <FitLines key={viewMode} lines={viewMode === 'showcase' ? SHOWCASE_TITLE : ARCHIVE_TITLE} font={TITLE_FONT} as="h1" className="page-title" />
          <p className="text-base font-light max-w-xl leading-relaxed mt-4" style={{ color: D.muted }}>
            {viewMode === 'showcase'
              ? 'Featured projects from my creative process — each piece reflects deliberate practice, iterative critique, and growth across my academic journey.'
              : 'Every design piece, photograph, academic slide, and creative project, organized in one browsable archive.'}
          </p>
        </div>
      </header>

      <ViewSwitch
        viewMode={viewMode}
        onChange={setViewMode}
        summary={searchQuery ? `${resultsCount} results` : `${viewMode === 'archive' ? resultsCount : totalItems} works in ${viewMode === 'archive' && activeCategory !== 'all' ? '1 category' : `${allCategories.length} categories`}`}
      />

      {/* Showcase mode */}
      {viewMode === 'showcase' && (
        <>
          <Divider />
          {justAdded.length > 0 && (
            <section className="px-6 md:px-12 pt-10 pb-4">
              <div className="mx-auto max-w-7xl">
                <h2 className="font-display text-2xl md:text-3xl mb-6" style={{ color: D.text }}>{t('justAdded')}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {justAdded.map((item, i) => (
                    <ImageCard key={item.src} {...item} index={i} onClick={openArchiveLightbox} />
                  ))}
                </div>
              </div>
            </section>
          )}
          <section className="px-6 md:px-12 pt-4 pb-20">
            <div className="mx-auto max-w-7xl">
              {FEATURED_WORKS.map((work, i) => (
                <div key={work.id} className="py-8 md:py-12" data-project>
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
                    onClick={() => updateParams({ view: 'archive', category: cat.id })}
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
          <div ref={filterBarRef} className="sticky top-[60px] md:top-[61px] z-40 border-b" style={{ background: 'rgba(13, 20, 16, 0.95)', backdropFilter: 'blur(8px)', borderColor: D.border }}>
            <div className="px-6 md:px-12 pt-3 pb-2">
            <div className="mx-auto max-w-7xl">
              <div className="relative group">
                <input
                  ref={searchRef}
                  type="search"
                  aria-label="Search works"
                  placeholder="Search works (press / to start typing)"
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
              <div className="flex items-center justify-end mt-2 px-1 empty:hidden">
                { (searchQuery || activeCategory !== 'all') && (
                  <button onClick={() => updateParams({ category: null, q: null })}
                    className="text-sm underline underline-offset-4" style={{ color: D.accent }}>
                    Reset Filters
                  </button>
                )}
              </div>
              <div className="mt-2 overflow-x-auto pb-2">
                <div className="flex gap-2 whitespace-nowrap">
                  <button onClick={() => updateParams({ category: null, q: null })}
                    className="px-4 py-2 text-xs uppercase rounded-sm transition-all"
                    style={activeCategory === 'all' && !searchQuery ? { background: D.accent, color: D.bg } : { background: D.cardBg, color: D.muted }}>
                    All ({totalItems})
                  </button>
                  {allCategories.map((cat) => (
                    <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
                      className="px-4 py-2 text-xs uppercase rounded-sm transition-all"
                      style={activeCategory === cat.id ? { background: D.accent, color: D.bg } : { background: D.cardBg, color: D.muted }}>
                      {cat.label} ({cat.items.length})
                    </button>
                  ))}
                </div>
              </div>
            </div>
            </div>
          </div>

          {/* Archive content */}
          <AnimatePresence mode="wait">
            <motion.div ref={resultsRef} key={activeCategory} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
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
                  <p className="text-xl font-display" style={{ color: D.muted }}>No matches found</p>
                  <p className="text-sm font-light mt-2" style={{ color: D.faint }}>Try searching for a different keyword or category</p>
                  <button onClick={() => updateParams({ category: null, q: null })} 
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

      <BackToTop />

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <Lightbox
            src={lightbox.src} 
            caption={lightbox.caption}
            isVideo={lightbox.isVideo}
            isEmbed={lightbox.isEmbed}
            driveFallback={lightbox.driveFallback}
            onClose={() => setLightbox(null)}
            onPrev={lightbox.items && lightbox.index > 0 ? () => navLightbox(-1) : null}
            onNext={lightbox.items && lightbox.index < lightbox.items.length - 1 ? () => navLightbox(1) : null}
            position={lightbox.items?.length > 1 ? `${lightbox.index + 1} / ${lightbox.items.length}` : null}
            preload={[lightbox.items?.[lightbox.index + 1], lightbox.items?.[lightbox.index - 1]].filter((item) => item && !item.isVideo).map((item) => item.src)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default WorksArchive
