import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from './LanguageContext'
import LanguageSelector from './LanguageSelector'
import Cursor from './Cursor'

/* ──────────────── PROJECT CATEGORIES ──────────────── */

const categories = [
  {
    id: 'posters',
    label: 'Posters & Banners',
    description: 'Festival posters, event banners, and promotional designs',
    items: [
      { src: '/portfolio/festival-posters/New Posters/Film Festival Poster.png', caption: 'BUE Film Festival — Main Poster' },
      { src: '/portfolio/festival-posters/New Posters/Film Festival Poster 2.png', caption: 'BUE Film Festival — Poster Variation 2' },
      { src: '/portfolio/festival-posters/New Posters/Film Festival Poster 3.png', caption: 'BUE Film Festival — Poster Variation 3' },
      { src: '/portfolio/festival-posters/New Posters/Film Festival Poster 4.png', caption: 'BUE Film Festival — Poster Variation 4' },
      { src: '/portfolio/festival-posters/New Posters/Film Festival  5.png', caption: 'BUE Film Festival — Poster Variation 5' },
      { src: '/portfolio/festival-posters/New Posters/bue poster banner.png', caption: 'BUE Banner Design' },
      { src: '/portfolio/misc-design/Poster_BUE_Film_Festival_V3.png', caption: 'BUE Film Festival — Version 3' },
      { src: '/portfolio/misc-design/Poster_BUE_International_Film_Festival.png', caption: 'BUE International Film Festival' },
      { src: '/portfolio/misc-design/Poster_BUEclipse_eSports_Recruitment.png', caption: 'BUEclipse eSports Recruitment' },
      { src: '/portfolio/misc-design/Poster_Game_Development_Course_Signup.png', caption: 'Game Development Course Signup' },
    ],
  },
  {
    id: 'logos',
    label: 'Logos & Brand Identity',
    description: 'Brand marks and logo design explorations',
    items: [
      { src: '/portfolio/logos/Logo_BUE_Gamers_Club.jpeg', caption: 'BUE Gamers Club Logo' },
      { src: '/portfolio/logos/Logo_BUE_Official.png', caption: 'BUE Official Logo' },
      { src: '/portfolio/logos/Logo_Icon_Creations_Upscaled.png', caption: 'Icon Creations — Upscaled' },
      { src: '/portfolio/logos/Logo_Icon_Creations.png', caption: 'Icon Creations' },
      { src: '/portfolio/logos/Logo_Red_Bull_Decaf.png', caption: 'Red Bull Decaf Brand Concept' },
    ],
  },
  {
    id: 'product',
    label: 'Product Photography',
    description: 'Professional product and commercial photography',
    items: [
      { src: '/portfolio/product-photography/Product_Canon_EOS_4000D_Camera.jpg', caption: 'Canon EOS 4000D — Product Shot' },
      { src: '/portfolio/product-photography/Product_Vintage_Cinekon_Eight_Camera_V2.jpg', caption: 'Vintage Cinekon Eight Camera V2' },
      { src: '/portfolio/product-photography/Product_Vintage_Cinekon_Eight_Camera.jpg', caption: 'Vintage Cinekon Eight Camera' },
      { src: '/portfolio/product-photography/Product_Bath_And_Body_Works_Lotion_Into_The_Night.jpg', caption: 'Bath & Body Works — Into The Night' },
      { src: '/portfolio/product-photography/Product_White_Coffee_Mugs_Stack.jpg', caption: 'White Coffee Mugs — Stack' },
      { src: '/portfolio/product-photography/Product_Bath_And_Body_Works_Lotion_Unedited.jpg', caption: 'Bath & Body Works — Unedited' },
    ],
  },
  {
    id: 'portraits',
    label: 'Portraits & AI Art',
    description: 'Studio portraits, AI-generated art, and character design',
    items: [
      { src: '/portfolio/portraits/Portrait_Woman_Glasses_Outdoor_Smiling.jpg', caption: 'Outdoor Portrait — Woman with Glasses' },
      { src: '/portfolio/portraits/Portrait_Woman_Glasses_Outdoor_Unedited.jpg', caption: 'Outdoor Portrait — Unedited' },
      { src: '/portfolio/portraits/Portrait_Woman_Hijab_Outdoor.jpg', caption: 'Outdoor Portrait — Hijab' },
      { src: '/portfolio/portraits/Portrait_Woman_Pink_Hijab_Smiling_V2.jpg', caption: 'Portrait — Pink Hijab V2' },
      { src: '/portfolio/portraits/Portrait_Woman_Pink_Hijab_Smiling.jpg', caption: 'Portrait — Pink Hijab' },
      { src: '/portfolio/portraits/Portrait_Low_Key_Male.jpg', caption: 'Low Key Male Portrait' },
      { src: '/portfolio/portraits/Portrait_Male_Curly_Hair_Black_BG_V2.jpg', caption: 'Male Portrait — Curly Hair V2' },
      { src: '/portfolio/portraits/Portrait_Male_Curly_Hair_Black_BG.jpg', caption: 'Male Portrait — Curly Hair' },
      { src: '/portfolio/portraits/Selfie_Male_Curly_Hair_Front.jpg', caption: 'Selfie — Front View' },
      { src: '/portfolio/portraits/Selfie_Male_Curly_Hair_Looking_Up.jpg', caption: 'Selfie — Looking Up' },
      { src: '/portfolio/portraits/Selfie_Male_Curly_Hair_Plushie.jpg', caption: 'Selfie with Plushie' },
      { src: '/portfolio/portraits/Selfie_Male_Curly_Hair_Profile.jpg', caption: 'Selfie — Profile' },
      { src: '/portfolio/portraits/Portrait_AI_Anime_Gamer_Girl.jpeg', caption: 'AI Art — Anime Gamer Girl' },
      { src: '/portfolio/portraits/Portrait_AI_Woman_Green_Shirt.png', caption: 'AI Art — Woman Green Shirt' },
      { src: '/portfolio/portraits/Portrait_AI_Woman_Serious_Green_Shirt.png', caption: 'AI Art — Serious Expression' },
      { src: '/portfolio/portraits/Portrait_AI_Woman_Smiling_Green_Shirt_V3.png', caption: 'AI Art — Smiling V3' },
      { src: '/portfolio/portraits/Portrait_AI_Woman_Smiling_Green_Shirt_V4.png', caption: 'AI Art — Smiling V4' },
      { src: '/portfolio/portraits/Portrait_AI_Woman_Smiling_Green_Shirt_V5.jpg', caption: 'AI Art — Smiling V5' },
    ],
  },
  {
    id: 'academic',
    label: 'Academic Projects',
    description: 'Media studies, book covers, research infographics',
    items: [
      { src: '/portfolio/academic/Slide_Egypt_Vision_2030.png', caption: 'Egypt Vision 2030 — Corporate Sustainability' },
      { src: '/portfolio/academic/Slide_Corporate_Sustainability_Title.png', caption: 'Corporate Sustainability — Title Slide' },
      { src: '/portfolio/academic/Slide_Corporate_Sustainability_Strategy.png', caption: 'Corporate Sustainability — Strategy' },
      { src: '/portfolio/academic/Slide_Corporate_Sustainability_Vision.png', caption: 'Corporate Sustainability — Vision' },
      { src: '/portfolio/academic/Slide_Corporate_Sustainability_Vision_V2.png', caption: 'Corporate Sustainability — Vision V2' },
      { src: '/portfolio/academic/Slide_Critical_Review_Lebanon.png', caption: 'Media Critical Review — Lebanon' },
      { src: '/portfolio/academic/Slide_Heavy_Viewing_Media_Logic.jpg', caption: 'Heavy Viewing — Media Logic' },
      { src: '/portfolio/academic/Slide_Mass_Media_Consolidation_Factors.jpg', caption: 'Mass Media Consolidation' },
      { src: '/portfolio/academic/Slide_Print_vs_Digital_Media.png', caption: 'Print vs Digital Media' },
      { src: '/portfolio/academic/Slide_WSJ_Device_Mockup.png', caption: 'WSJ — Device Mockup' },
      { src: '/portfolio/academic/Slide_Research_Introduction.png', caption: 'Video Games Research — Introduction' },
      { src: '/portfolio/academic/Slide_Research_Methodology_Infographic.png', caption: 'Video Games — Methodology Infographic' },
      { src: '/portfolio/academic/Slide_Hypothesis_Table.png', caption: 'Research — Hypothesis Table' },
      { src: '/portfolio/academic/Slide_Summary_of_Findings_V2.png', caption: 'Video Games — Summary of Findings' },
      { src: '/portfolio/academic/Infographic_Conclusion_Controller.png', caption: 'Conclusion — Controller Infographic' },
      { src: '/portfolio/academic/Slide_Video_Games_Escapism.jpg', caption: 'Video Games — Escapism' },
      { src: '/portfolio/academic/Book_Cover_Sunset_Oasis_English_V2.jpeg', caption: 'Sunset Oasis — Book Cover English V2' },
      { src: '/portfolio/academic/Slide_Sunset_Oasis_Introduction_Arabic.jpg', caption: 'Sunset Oasis — Arabic Introduction' },
      { src: '/portfolio/academic/Slide_Unhinged_Panda_Analysis_Title_V2.png', caption: 'Unhinged Panda — Analysis Title V2' },
      { src: '/portfolio/academic/Slide_Unhinged_Panda_Analysis_Title_V3.png', caption: 'Unhinged Panda — Analysis Title V3' },
    ],
  },
  {
    id: 'code',
    label: 'Code Projects',
    description: 'Web apps, mobile PWAs, and full-stack projects',
    items: [
      { src: '/portfolio/code-projects/salam_desktop.png', caption: 'Salam — Prayer Tracker & Islamic Toolkit' },
      { src: '/portfolio/code-projects/salam_mobile.png', caption: 'Salam — Mobile PWA Experience' },
      { src: '/portfolio/code-projects/42pedia_desktop.png', caption: '4²pedia — Custom Wikipedia Encyclopedia' },
      { src: '/portfolio/code-projects/42pedia_mobile.png', caption: '4²pedia — Mobile View' },
      { src: '/portfolio/code-projects/streamer_desktop.png', caption: 'Streamer — Movie & TV Streaming Platform' },
      { src: '/portfolio/code-projects/streamer_mobile.png', caption: 'Streamer — Mobile Interface' },
    ],
  },
  {
    id: 'bisco',
    label: 'Bisco Misr France',
    description: 'Crisis communication campaign — storyboards, strategy, and cultural presentation',
    items: [
      { src: '/portfolio/bisco-misr/consumer-egypt.jpg', caption: 'Target Market — Egypt Consumers' },
      { src: '/portfolio/bisco-misr/consumer-france.jpg', caption: 'Target Market — France Consumers' },
      { src: '/portfolio/bisco-misr/egypt-city.jpg', caption: 'Egypt — Cultural Context' },
      { src: '/portfolio/bisco-misr/france-paris.jpg', caption: 'France — Cultural Context' },
      { src: '/portfolio/bisco-misr/hero-paris-cafe.jpg', caption: 'Paris Café — Hero Shot' },
      { src: '/portfolio/bisco-misr/language-customs.jpg', caption: 'Language & Customs Research' },
      { src: '/portfolio/bisco-misr/strategy-mountains.jpg', caption: 'Strategic Mountains — Campaign Strategy' },
    ],
  },
  {
    id: 'presentations',
    label: 'Presentations',
    description: 'Arabic and English academic presentation design',
    items: [
      { src: '/portfolio/presentations/Artboard 1 copy.jpg', caption: 'Arabic Presentation — Main' },
      { src: '/portfolio/presentations/Artboard 2 copy.jpg', caption: 'Arabic Presentation — Artboard 2' },
    ],
  },
  {
    id: 'design',
    label: 'Creative Designs',
    description: 'Poster explorations, cover designs, editorial compositions',
    items: [
      { src: '/portfolio/misc-design/Cover_Salem_Nothing_But_Cringe.png', caption: '"Nothing But Cringe" — Salem Cover' },
      { src: '/portfolio/misc-design/Cover_Assistant_Shot_Analysis.png', caption: 'Shot Analysis Cover' },
      { src: '/portfolio/misc-design/Asset_Blurry_Code_Background.png', caption: 'Blurry Code Background' },
      { src: '/portfolio/misc-design/Asset_Skyrim_Logo_Leather.jpeg', caption: 'Skyrim Logo on Leather' },
      { src: '/portfolio/misc-design/Asset_Mariams_Book_Quotes_Mockup.png', caption: "Mariam's Book Quotes Mockup" },
    ],
  },
]

/* ──────────────── DARK THEME TOKENS ──────────────── */
const D = {
  bg: '#0d1410',
  card: '#111c14',
  border: 'rgba(45, 107, 63, 0.1)',
  text: '#c8d8cc',
  muted: '#7a8a7e',
  faint: '#3a4a3e',
  accent: '#4a9f62',
  topBg: 'rgba(13, 20, 16, 0.92)',
  stickyBg: 'rgba(13, 20, 16, 0.95)',
  filterBarBg: '#111c14',
  skeleton: '#162319',
}

/* ──────────────── FALLBACK SVG ──────────────── */
const Fallback = () => (
  <svg viewBox="0 0 400 267" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <rect width="400" height="267" fill={D.card} />
    <circle cx="200" cy="100" r="40" fill="none" stroke={D.faint} strokeWidth="1.5" />
    <text x="200" y="180" textAnchor="middle" fill={D.faint} fontSize="11" fontFamily="sans-serif">Image unavailable</text>
  </svg>
)

/* ──────────────── IMAGE STATE ──────────────── */
function useImageState(src) {
  const [state, setState] = useState('loading')
  useEffect(() => {
    let cancelled = false
    const img = new Image()
    img.src = src
    const tid = setTimeout(() => { if (!cancelled) setState('error') }, 5000)
    img.onload = () => { if (!cancelled) { setState('loaded'); clearTimeout(tid) } }
    img.onerror = () => { if (!cancelled) { setState('error'); clearTimeout(tid) } }
    return () => { cancelled = true; clearTimeout(tid) }
  }, [src])
  return state
}

/* ──────────────── IMAGE CARD ──────────────── */
const ImageCard = ({ src, caption, index, onClick }) => {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  const imgState = useImageState(src)

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true) }, { threshold: 0.05 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  if (['psd', 'zip', 'rar', 'ai', 'sketch'].includes(src.split('.').pop().toLowerCase())) return null

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: Math.min(index * 0.03, 0.3), duration: 0.4 }}
      className="group relative overflow-hidden rounded-sm border cursor-pointer"
      style={{ borderColor: D.border }}
      onClick={() => onClick && onClick({ src, caption })}
    >
      <div className="aspect-[3/2] overflow-hidden relative" style={{ background: D.card }}>
        {imgState === 'loading' && (
          <div className="absolute inset-0 flex items-center justify-center" style={{ background: D.skeleton }}>
            <div className="w-5 h-5 border-2 rounded-full animate-spin" style={{ borderTopColor: D.accent, borderColor: D.faint }} />
          </div>
        )}
        {imgState === 'error' ? <Fallback /> : (
          <img src={src} alt={caption} loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        )}
      </div>
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end pointer-events-none"
        style={{ background: 'linear-gradient(to top, rgba(13,20,16,0.85), transparent)' }}>
        <p className="p-3 text-sm font-light" style={{ color: D.text }}>{caption}</p>
      </div>
    </motion.div>
  )
}

/* ──────────────── LIGHTBOX MODAL ──────────────── */
const Lightbox = ({ src, caption, onClose, onPrev, onNext }) => {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft' && onPrev) onPrev()
      if (e.key === 'ArrowRight' && onNext) onNext()
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [onClose, onPrev, onNext])

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{ background: 'rgba(5, 8, 6, 0.95)', backdropFilter: 'blur(20px)' }}
      onClick={onClose}
    >
      {/* Top bar */}
      <div className="absolute top-5 left-0 right-0 z-10 flex items-center justify-between px-6" onClick={e => e.stopPropagation()}>
        <p className="text-sm font-light" style={{ color: D.muted }}>{caption}</p>
        <button onClick={onClose} className="text-3xl hover:text-accent transition-colors w-10 h-10 flex items-center justify-center" style={{ color: D.text }}>&times;</button>
      </div>
      {/* Image container */}
      <div className="flex items-center justify-center p-12 pt-14" onClick={e => e.stopPropagation()}>
        <img
          src={src} alt={caption}
          style={{ maxHeight: '80vh', maxWidth: '75vw' }}
          className="object-contain rounded-sm"
          onClick={e => e.stopPropagation()}
        />
      </div>
      {/* Navigation */}
      {onPrev && (
        <button onClick={e => { e.stopPropagation(); onPrev() }}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-5xl transition-opacity hover:opacity-100 z-20" style={{ color: D.text, opacity: 0.4 }}>
          &larr;
        </button>
      )}
      {onNext && (
        <button onClick={e => { e.stopPropagation(); onNext() }}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-5xl transition-opacity hover:opacity-100 z-20" style={{ color: D.text, opacity: 0.4 }}>
          &rarr;
        </button>
      )}
    </motion.div>
  )
}

/* ──────────────── CATEGORY SECTION ──────────────── */
const CategorySection = ({ category, onImageClick }) => (
  <motion.section
    initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="py-16 px-6 md:px-12"
  >
    <div className="mx-auto max-w-7xl">
      <div className="mb-10">
        <span className="section-number" style={{ color: D.accent }}>
          {categories.findIndex(c => c.id === category.id) + 1}
        </span>
        <h2 className="text-3xl md:text-4xl font-display mt-2" style={{ color: D.text }}>{category.label}</h2>
        <p className="text-sm font-light mt-1" style={{ color: D.muted }}>{category.description}</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {category.items.map((item, i) => (
          <ImageCard key={item.src} src={item.src} caption={item.caption} index={i} onClick={onImageClick} />
        ))}
      </div>
    </div>
  </motion.section>
)

/* ──────────────── PAGE ──────────────── */
function WorksArchive() {
  const { t } = useLanguage()
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [lightbox, setLightbox] = useState(null)

  const totalItems = categories.reduce((s, c) => s + c.items.length, 0)

  // Collect all items currently shown (for lightbox navigation)
  const allShownItems = (activeCategory === 'all' ? categories : categories.filter(c => c.id === activeCategory))
    .flatMap(cat => cat.items)
    .filter(item => !searchQuery || item.caption.toLowerCase().includes(searchQuery.toLowerCase()))

  const filteredCategories = activeCategory === 'all'
    ? categories
    : categories.filter(c => c.id === activeCategory)

  const shownItems = searchQuery
    ? filteredCategories.map(cat => ({
        ...cat,
        items: cat.items.filter(item => item.caption.toLowerCase().includes(searchQuery.toLowerCase()))
      })).filter(cat => cat.items.length > 0)
    : filteredCategories

  function openLightbox(item) {
    const idx = allShownItems.findIndex(i => i.src === item.src)
    setLightbox({ ...item, index: idx })
  }

  function closeLightbox() { setLightbox(null) }

  function navLightbox(delta) {
    if (!lightbox) return
    const nextIdx = (lightbox.index + delta + allShownItems.length) % allShownItems.length
    const item = allShownItems[nextIdx]
    setLightbox({ src: item.src, caption: item.caption, index: nextIdx })
  }

  return (
    <div className="relative min-h-screen cursor-none page-enter" style={{ background: D.bg, color: D.text }}>
      <Cursor />

      {/* Top bar */}
      <div className="fixed top-0 left-0 right-0 z-50" style={{ background: D.topBg, backdropFilter: 'blur(12px)' }}>
        <div className="mx-auto max-w-7xl px-6 md:px-12 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" style={{ color: D.text }} className="font-display text-xl italic hover:transition-colors"
              onMouseEnter={e => e.currentTarget.style.color = D.accent}
              onMouseLeave={e => e.currentTarget.style.color = D.text}>
              Y.S.
            </Link>
            <span className="hidden md:block h-4 w-px" style={{ background: D.faint }} />
            <span className="hidden md:block page-number" style={{ color: D.muted }}>Projects Archive</span>
          </div>
          <LanguageSelector />
        </div>
        <div className="mx-auto max-w-7xl px-6 md:px-12">
          <div className="h-px" style={{ background: `linear-gradient(to right, transparent, ${D.border}, transparent)` }} />
        </div>
      </div>

      {/* Header */}
      <motion.header initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }} className="pt-28 pb-8 px-6 md:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-12 gap-8 md:gap-16">
            <div className="col-span-12 md:col-span-4 lg:col-span-3">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
                <span className="section-number" style={{ color: D.accent }}>Archive</span>
                <div className="w-8 h-px my-4" style={{ background: `${D.accent}66` }} />
                <p className="page-number" style={{ color: D.muted }}>{totalItems} works across {categories.length} categories</p>
              </motion.div>
            </div>
            <div className="col-span-12 md:col-span-8 lg:col-span-9">
              <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.25 }} className="text-5xl md:text-7xl lg:text-8xl font-display tracking-tight leading-[0.9] mb-6" style={{ color: D.text }}>
                Complete Works
              </motion.h1>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-base font-light max-w-xl leading-relaxed" style={{ color: D.muted }}>
                Every design piece, photograph, academic slide, and creative project — organized in one browsable archive.
              </motion.p>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Search + Filter Bar */}
      <div className="sticky top-[73px] z-40 border-b" style={{ background: D.stickyBg, backdropFilter: 'blur(8px)', borderColor: D.border }}>
        <div className="mx-auto max-w-7xl px-6 md:px-12 pt-4 pb-2">
          <input
            type="text" placeholder="Search works..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2.5 text-sm rounded-sm border outline-none transition-colors"
            style={{ background: D.card, borderColor: D.border, color: D.text }}
          />
          <div className="mt-3 overflow-x-auto pb-2">
            <div className="flex gap-2 whitespace-nowrap">
              <button onClick={() => { setActiveCategory('all'); setSearchQuery('') }}
                className="px-4 py-2 text-xs font-heading tracking-[0.1em] uppercase rounded-sm transition-all duration-300"
                style={activeCategory === 'all' && !searchQuery ? { background: D.accent, color: '#fff' } : { background: D.filterBarBg, color: D.faint }}>
                All ({totalItems})
              </button>
              {categories.map((cat) => (
                <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
                  className="px-4 py-2 text-xs font-heading tracking-[0.1em] uppercase rounded-sm transition-all duration-300"
                  style={activeCategory === cat.id ? { background: D.accent, color: '#fff' } : { background: D.filterBarBg, color: D.faint }}>
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div key={activeCategory + '__' + searchQuery} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
          {shownItems.length > 0 ? (
            shownItems.map(cat => <CategorySection key={cat.id} category={cat} onImageClick={openLightbox} />)
          ) : (
            <div className="py-24 text-center">
              <p className="text-lg" style={{ color: D.muted }}>No works found matching &ldquo;{searchQuery}&rdquo;</p>
              <button onClick={() => setSearchQuery('')} className="mt-4 text-sm" style={{ color: D.accent, textDecoration: 'underline' }}>Clear search</button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Footer */}
      <footer className="py-8 px-6 md:px-12 border-t" style={{ borderColor: D.border }}>
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <Link to="/" className="font-display italic text-xl" style={{ color: D.text }}>Y.S.</Link>
          <span className="page-number" style={{ color: D.faint }}>{t('precision')}</span>
        </div>
      </footer>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <Lightbox
            src={lightbox.src} caption={lightbox.caption}
            onClose={closeLightbox}
            onPrev={lightbox.index > 0 ? () => navLightbox(-1) : null}
            onNext={lightbox.index < allShownItems.length - 1 ? () => navLightbox(1) : null}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default WorksArchive
