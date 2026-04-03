import { useState, useRef, useCallback, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView, AnimatePresence } from 'framer-motion'
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
      { src: '/portfolio/academic/Slide_Critical_Review_Lebanon.png', caption: 'Media Crittical Review — Lebanon' },
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
      { src: '/portfolio/bisco-misr/Roughly_drawn_storyboard__panel_1storyboard_panel__delpmaspu.png', caption: 'Storyboard Panel 1' },
      { src: '/portfolio/bisco-misr/Adapt_the_all_the_product_design_to_the_french_mar_delpmaspu.png', caption: 'Product Design Adaptation — French Market' },
    ],
  },
  {
    id: 'presentations',
    label: 'Presentations',
    description: 'Arabic and English academic presentation design',
    items: [
      { src: '/portfolio/presentations/Artboard 1.jpg', caption: 'Arabic Presentation — Main' },
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
      { src: '/portfolio/misc-design/IMG_mkk1026.psd', caption: 'Creative edit — original' },
    ],
  },
]

/* ──────────────── IMAGE CARD ──────────────── */
const ImageCard = ({ src, caption, index }) => {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-30px' })
  const [loaded, setLoaded] = useState(false)

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.04, duration: 0.4 }}
      className="group relative overflow-hidden rounded-sm border border-ink/5 bg-paper-dark"
    >
      <div className="aspect-[3/2] overflow-hidden bg-[#e0e2d8] flex items-center justify-center">
        {!loaded && (
          <div className="w-6 h-6 border-2 border-accent/20 border-t-accent/60 rounded-full animate-spin" />
        )}
        {src.endsWith('.psd') ? (
          <div className="w-full h-full flex items-center justify-center bg-accent/5">
            <span className="page-number text-accent/60">PSD File</span>
          </div>
        ) : (
          <img
            src={src}
            alt={caption}
            onLoad={() => setLoaded(true)}
            style={{ display: loaded ? 'block' : 'none' }}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
        )}
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-[#0d1a0f]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end">
        <p className="p-4 text-[#f5f5f0] text-sm font-light">{caption}</p>
      </div>
    </motion.div>
  )
}

/* ──────────────── CATEGORY SECTION ──────────────── */
const CategorySection = ({ category, isActive }) => {
  return (
    <AnimatePresence mode="wait">
      {isActive && (
        <motion.section
          key={category.id}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="py-16 px-6 md:px-12"
        >
          <div className="mx-auto max-w-7xl">
            <div className="mb-10">
              <span className="section-number">
                {categories.findIndex(c => c.id === category.id) + 1}
              </span>
              <h2 className="text-3xl md:text-4xl font-display mt-2">{category.label}</h2>
              <p className="text-ink-faint text-sm font-light mt-1">{category.description}</p>
            </div>
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
              {category.items.map((item, i) => (
                <div key={item.src} className="break-inside-avoid">
                  <ImageCard src={item.src} caption={item.caption} index={i} />
                </div>
              ))}
            </div>
          </div>
        </motion.section>
      )}
    </AnimatePresence>
  )
}

/* ──────────────── PAGE ──────────────── */
function WorksArchive() {
  const { t } = useLanguage()
  const [activeCategory, setActiveCategory] = useState('all')

  const totalItems = categories.reduce((sum, c) => sum + c.items.length, 0)

  return (
    <div className="relative min-h-screen text-ink cursor-none page-enter">
      <Cursor />

      {/* Top bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-paper/90 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-6 md:px-12 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="font-display text-xl italic text-ink hover:text-accent transition-colors">
              Y.S.
            </Link>
            <span className="hidden md:block h-4 w-px bg-ink-faint/20" />
            <span className="hidden md:block page-number">Projects Archive</span>
          </div>
          <LanguageSelector />
        </div>
        <div className="mx-auto max-w-7xl px-6 md:px-12">
          <div className="h-px bg-gradient-to-r from-transparent via-ink/10 to-transparent" />
        </div>
      </div>

      {/* Header */}
      <motion.header
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="pt-28 pb-8 px-6 md:px-12"
      >
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-12 gap-8 md:gap-16">
            <div className="col-span-12 md:col-span-4 lg:col-span-3">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
                <span className="section-number">Archive</span>
                <div className="w-8 h-px bg-accent/40 my-4" />
                <p className="page-number">{totalItems} works across {categories.length} categories</p>
              </motion.div>
            </div>
            <div className="col-span-12 md:col-span-8 lg:col-span-9">
              <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.25 }} className="text-5xl md:text-7xl lg:text-8xl font-display tracking-tight leading-[0.9] mb-6">
                Complete Works
              </motion.h1>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-base font-light max-w-xl leading-relaxed text-ink-light">
                Every design piece, photograph, academic slide, and creative project — organized holistically in one browsable archive.
              </motion.p>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Category Filter */}
      <div className="sticky top-[73px] z-40 bg-paper/95 backdrop-blur-sm border-b border-ink/5">
        <div className="mx-auto max-w-7xl px-6 md:px-12 py-4 overflow-x-auto">
          <div className="flex gap-2 whitespace-nowrap">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-4 py-2 text-xs font-heading tracking-[0.1em] uppercase rounded-sm transition-all duration-300 ${
                activeCategory === 'all' ? 'bg-ink text-paper' : 'bg-paper-dark text-ink-faint hover:bg-accent/10 hover:text-accent'
              }`}
            >
              All ({totalItems})
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 text-xs font-heading tracking-[0.1em] uppercase rounded-sm transition-all duration-300 ${
                  activeCategory === cat.id ? 'bg-ink text-paper' : 'bg-paper-dark text-ink-faint hover:bg-accent/10 hover:text-accent'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Categories */}
      {activeCategory === 'all' ? (
        categories.map((cat) => <CategorySection key={cat.id} category={cat} isActive={true} />)
      ) : (
        <CategorySection category={categories.find(c => c.id === activeCategory)} isActive={true} />
      )}

      {/* Footer */}
      <footer className="py-8 px-6 md:px-12 border-t border-ink/5">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <Link to="/" className="font-display italic text-xl text-ink hover:text-accent transition-colors">
            Y.S.
          </Link>
          <span className="page-number">{t('precision')}</span>
        </div>
      </footer>
    </div>
  )
}

export default WorksArchive
