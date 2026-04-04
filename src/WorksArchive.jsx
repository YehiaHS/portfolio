import { useState, useRef, useEffect, useMemo, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence, useScroll, useTransform, useInView } from 'framer-motion'
import { useLanguage } from './LanguageContext'
import LanguageSelector from './LanguageSelector'
import Cursor from './Cursor'
import { prepareWithSegments, layoutWithLines } from '@chenglou/pretext'

/* ──────────────── FEATURED WORKS (from Portfolio showcase) ──────────────── */
const FEATURED_WORKS = [
  {
    id: 'featured-1',
    title: 'BUE Film Festival Poster Banner',
    description: 'Official poster design for the British University in Egypt International Student Film Festival, featuring bold typography and cinematic imagery.',
    category: 'Poster Design',
    src: '/portfolio/festival-posters/New Posters/bue poster banner.png',
    year: '2024',
    reflection: 'This project taught me the importance of visual hierarchy in promotional design. Creating a poster for an actual institution sharpened my ability to interpret client expectations and translate them into a cohesive visual narrative.',
    skillsGained: ['Visual Hierarchy', 'Client Communication', 'Promotional Design', 'IMC Strategy'],
  },
  {
    id: 'featured-2',
    title: 'BUE ISFF Logo',
    description: 'Brand identity design for the International Student Film Festival, combining film reel motifs with modern minimalism.',
    category: 'Logo Design',
    src: '/portfolio/logos/Logo_BUE_Official.png',
    year: '2024',
    reflection: 'Designing a logo forced me to distill complex ideas into a single symbolic mark. The iterative process — from initial sketches through multiple critique rounds — improved my visual problem-solving and resilience.',
    skillsGained: ['Brand Identity', 'Symbolic Design', 'Iterative Critique', 'Visual Problem-Solving'],
  },
  {
    id: 'featured-3',
    title: 'Film Festival Billboard',
    description: 'Large-scale billboard design for campus-wide festival promotion with high-impact visual hierarchy.',
    category: 'Billboard Design',
    src: '/portfolio/design-files/POSTER-COMPRESSED.jpg',
    year: '2024',
    reflection: 'Scaling a design from poster to billboard required understanding how visual legibility changes with distance and environment. This developed my spatial reasoning and technical production skills.',
    skillsGained: ['Large-Format Design', 'Resolution Management', 'Production Readiness'],
  },
  {
    id: 'featured-4',
    title: 'Book Cover Design',
    description: 'Editorial design project featuring typography exploration and narrative-driven composition.',
    category: 'Book Design',
    src: '/portfolio/academic/Book_Cover_Sunset_Oasis_English_V2.jpeg',
    year: '2024',
    descriptionFull: "Editorial design project featuring typography exploration and narrative-driven composition. Capturing the essence of an entire narrative in a single frame.",
    reflection: 'Editorial design pushed me into a different discipline — one where typography, pacing, and narrative structure become the primary tools. Designing a book cover meant capturing the essence of an entire narrative in a single frame.',
    skillsGained: ['Editorial Design', 'Typographic Mastery', 'Narrative Storytelling'],
  },
]

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
function getArchiveCategories() {
  return [
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
        { src: '/portfolio/portraits/Selfie_Male_Curly_Hair_Side.jpg', caption: 'Selfie — Side View' },
        { src: '/portfolio/portraits/Selfie_Male_Curly_Hair_Top_Down.jpg', caption: 'Selfie — Top Down View' },
        { src: '/portfolio/portraits/Selfie_Male_Curly_Hair_Profile.jpg', caption: 'Selfie — Profile' },
        { src: '/portfolio/portraits/Portrait_AI_Anime_Gamer_Girl.jpeg', caption: 'AI Art — Anime Gamer Girl' },
        { src: '/portfolio/portraits/Portrait_AI_Woman_Green_Shirt.png', caption: 'AI Art — Woman Green Shirt' },
        { src: '/portfolio/portraits/Portrait_AI_Woman_Serious_Green_Shirt.png', caption: 'AI Art — Serious Expression' },
        { src: '/portfolio/portraits/Portrait_AI_Woman_Smiling_Green_Shirt_V2.png', caption: 'AI Art — Smiling V2' },
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
        { src: '/portfolio/academic/Asset_News_Header_Khalid_AlAnani.png', caption: 'News Header — Khalid AlAnani' },
        { src: '/portfolio/academic/Slide_Conclusion_PS4_Controller.png', caption: 'Conclusion — PS4 Controller' },
        { src: '/portfolio/academic/Slide_Research_Reason_of_Interest.png', caption: 'Research — Reason of Interest' },
        { src: '/portfolio/academic/Slide_Sunset_Oasis_Summary_Table_Arabic.jpg', caption: 'Sunset Oasis — Arabic Summary Table' },
        { src: '/portfolio/academic/Slide_Unhinged_Panda_Analysis_Title.png', caption: 'Unhinged Panda — Analysis Title' },
        { src: '/portfolio/academic/Slide_Sunset_Oasis_Title_Arabic_V2.jpg', caption: 'Sunset Oasis — Arabic Title V2' },
        { src: '/portfolio/academic/Slide_Sunset_Oasis_Title_Arabic_V3.jpg', caption: 'Sunset Oasis — Arabic Title V3' },
        { src: '/portfolio/academic/Slide_Whats_Next_VR.png', caption: "What's Next — VR" },
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
      id: 'photos',
      label: 'Photography',
      description: 'Documentary photography from events, open days, and cultural experiences',
      items: [
        { src: '/portfolio/photos/chinese-culture/photo13.JPG', caption: 'Chinese Culture Event' },
        { src: '/portfolio/photos/chinese-culture/photo15.JPG', caption: 'Chinese Culture Event' },
        { src: '/portfolio/photos/chinese-culture/photo16.JPG', caption: 'Chinese Culture Event' },
        { src: '/portfolio/photos/chinese-culture/photo21.jpg', caption: 'Chinese Culture Event' },
        { src: '/portfolio/photos/chinese-culture/photo23.jpg', caption: 'Chinese Culture Event' },
        { src: '/portfolio/photos/chinese-culture/photo24.jpg', caption: 'Chinese Culture Event' },
        { src: '/portfolio/photos/chinese-culture/photo25.jpg', caption: 'Chinese Culture Event' },
        { src: '/portfolio/photos/chinese-culture/photo26.jpg', caption: 'Chinese Culture Event' },
        { src: '/portfolio/photos/chinese-culture/photo27.jpg', caption: 'Chinese Culture Event' },
        { src: '/portfolio/photos/chinese-culture/photo28.jpg', caption: 'Chinese Culture Event' },
        { src: '/portfolio/photos/chinese-culture/photo29.jpg', caption: 'Chinese Culture Event' },
        { src: '/portfolio/photos/chinese-culture/photo30.jpg', caption: 'Chinese Culture Event' },
        { src: '/portfolio/photos/chinese-culture/photo31.jpg', caption: 'Chinese Culture Event' },
        { src: '/portfolio/photos/chinese-culture/photo32.jpg', caption: 'Chinese Culture Event' },
        { src: '/portfolio/photos/chinese-culture/photo34.jpg', caption: 'Chinese Culture Event' },
        { src: '/portfolio/photos/chinese-culture/photo35.PNG', caption: 'Chinese Culture Event' },
        { src: '/portfolio/photos/open-day/open-day-129.PNG', caption: 'BUE Open Day' },
        { src: '/portfolio/photos/open-day/open-day-132.jpg', caption: 'BUE Open Day' },
        { src: '/portfolio/photos/open-day/open-day-133.jpg', caption: 'BUE Open Day' },
        { src: '/portfolio/photos/open-day/open-day-37.jpg', caption: 'BUE Open Day' },
        { src: '/portfolio/photos/open-day/open-day-38.jpg', caption: 'BUE Open Day' },
        { src: '/portfolio/photos/open-day/open-day-39.jpg', caption: 'BUE Open Day' },
        { src: '/portfolio/photos/open-day/open-day-40.jpg', caption: 'BUE Open Day' },
        { src: '/portfolio/photos/open-day/open-day-41.jpg', caption: 'BUE Open Day' },
        { src: '/portfolio/photos/open-day/open-day-42.jpg', caption: 'BUE Open Day' },
        { src: '/portfolio/photos/open-day/open-day-43.jpg', caption: 'BUE Open Day' },
        { src: '/portfolio/photos/open-day/open-day-44.jpg', caption: 'BUE Open Day' },
        { src: '/portfolio/photos/open-day/open-day-45.jpg', caption: 'BUE Open Day' },
        { src: '/portfolio/photos/open-day/open-day-46.jpg', caption: 'BUE Open Day' },
        { src: '/portfolio/photos/open-day/open-day-47.jpg', caption: 'BUE Open Day' },
        { src: '/portfolio/photos/open-day/open-day-49.jpg', caption: 'BUE Open Day' },
        { src: '/portfolio/photos/open-day/open-day-50.jpg', caption: 'BUE Open Day' },
      ],
    },
    {
      id: 'presentations',
      label: 'Presentations',
      description: 'Arabic and English academic presentation design',
      items: [
        { src: '/portfolio/presentations/Artboard 2 copy 2-1.jpg', caption: 'Arabic Presentation — Main' },
        { src: '/portfolio/presentations/apps.62159.68326442227858632.03782b23-7f26-4a8e-ba87-177bdf2c3c90.jpg', caption: 'Arabic Presentation — Artboard 2' },
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
        { src: '/portfolio/misc-design/Artboard 1 copy.jpg', caption: 'Creative Design — Artboard 1' },
        { src: '/portfolio/misc-design/Artboard 2 copy-1.jpg', caption: 'Creative Design — Artboard 2 v1' },
        { src: '/portfolio/misc-design/Artboard 2 copy-2.jpg', caption: 'Creative Design — Artboard 2 v2' },
        { src: '/portfolio/misc-design/Artboard 2 copy-3.jpg', caption: 'Creative Design — Artboard 2 v3' },
        { src: '/portfolio/misc-design/Artboard 2 copy-4.jpg', caption: 'Creative Design — Artboard 2 v4' },
        { src: '/portfolio/misc-design/Artboard 2 copy-5.jpg', caption: 'Creative Design — Artboard 2 v5' },
        { src: '/portfolio/misc-design/Artboard 2 copy 2-1.jpg', caption: 'Creative Design — Artboard 2 v6' },
      ],
    },
  ]
}

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
const imageCache = new Map()

function useImageState(src, inView) {
  const [state, setState] = useState(() => imageCache.get(src) || 'idle')

  useEffect(() => {
    const cached = imageCache.get(src)
    if (cached) { setState(cached); return }
    if (!inView) { setState('idle'); return }
    setState('loading')
    let cancelled = false
    const img = new Image()
    const resolve = (ok) => {
      if (cancelled) return
      const s = ok ? 'loaded' : 'error'
      imageCache.set(src, s)
      setState(s)
    }
    if (img.complete && (img.naturalWidth > 0 || img.naturalHeight > 0)) { resolve(true); return }
    if (img.complete && img.naturalWidth === 0 && img.naturalHeight === 0) { resolve(false); return }
    const tid = setTimeout(() => resolve(false), 10000)
    img.onload = () => resolve(true)
    img.onerror = () => resolve(false)
    img.src = src
    return () => { cancelled = true; clearTimeout(tid) }
  }, [src, inView])

  return state
}

/* ──────────────── FEATURED WORK ITEM ──────────────── */
const FeaturedWorkItem = ({ work, index, onClick }) => {
  const { t } = useLanguage()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const [hovered, setHovered] = useState(false)
  const [imgState, setImgState] = useState('idle')
  const [showReflection, setShowReflection] = useState(false)
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    const cached = imageCache.get(work.src)
    if (cached) { setImgState(cached); return }
    setImgState('loading')
    let cancelled = false
    const img = new Image()
    const resolve = (ok) => {
      if (cancelled) return
      const s = ok ? 'loaded' : 'error'
      imageCache.set(work.src, s)
      setImgState(s)
    }
    if (img.complete && (img.naturalWidth > 0 || img.naturalHeight > 0)) { resolve(true); return }
    if (img.complete && img.naturalWidth === 0 && img.naturalHeight === 0) { resolve(false); return }
    const tid = setTimeout(() => resolve(false), 10000)
    img.onload = () => resolve(true)
    img.onerror = () => resolve(false)
    img.src = work.src
    return () => { cancelled = true; clearTimeout(tid) }
  }, [work.src])

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
        <h3 className="text-2xl md:text-4xl font-display mb-2 tracking-tight leading-tight" style={{ color: D.text }}>{work.title}</h3>

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

/* ──────────────── ARCHIVE IMAGE CARD ──────────────── */
const ImageCard = ({ src, caption, index, onClick }) => {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  const imgState = useImageState(src, inView)

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true) }, { threshold: 0, rootMargin: '200px' })
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
      <div className="aspect-[3/2] overflow-hidden relative" style={{ background: D.cardBg }}>
        {(imgState === 'loading' || imgState === 'idle') && (
          <div className="absolute inset-0 flex items-center justify-center" style={{ background: '#162319' }}>
            {imgState === 'loading' && (
              <div className="w-5 h-5 border-2 rounded-full animate-spin" style={{ borderTopColor: D.accent, borderColor: D.faint }} />
            )}
          </div>
        )}
        {imgState === 'loaded' && (
          <img src={src} alt={caption} loading="lazy" decoding="async"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        )}
        {imgState === 'error' && <FallbackSvg />}
      </div>
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end pointer-events-none"
        style={{ background: 'linear-gradient(to top, rgba(13,20,16,0.85), transparent)' }}>
        <p className="p-3 text-sm font-light" style={{ color: D.text }}>{caption}</p>
      </div>
    </motion.div>
  )
}

/* ──────────────── LIGHTBOX ──────────────── */
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
      <div className="absolute top-5 left-0 right-0 z-10 flex items-center justify-between px-6" onClick={e => e.stopPropagation()}>
        <p className="text-sm font-light max-w-md truncate" style={{ color: D.muted }}>{caption}</p>
        <button onClick={onClose} className="text-3xl hover:text-accent transition-colors w-10 h-10 flex items-center justify-center" style={{ color: D.text }}>&times;</button>
      </div>
      <div className="flex items-center justify-center p-12 pt-14" onClick={e => e.stopPropagation()}>
        <img src={src} alt={caption} decoding="async"
          style={{ maxHeight: '80vh', maxWidth: '75vw' }}
          className="object-contain rounded-sm"
          onClick={e => e.stopPropagation()}
        />
      </div>
      {onPrev && (
        <button onClick={e => { e.stopPropagation(); onPrev() }}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-5xl transition-opacity hover:opacity-100 z-20" style={{ color: D.text, opacity: 0.4 }}>←</button>
      )}
      {onNext && (
        <button onClick={e => { e.stopPropagation(); onNext() }}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-5xl transition-opacity hover:opacity-100 z-20" style={{ color: D.text, opacity: 0.4 }}>→</button>
      )}
    </motion.div>
  )
}

/* ──────────────── CATEGORY SECTION ──────────────── */
const CategorySection = ({ category, index, onImageClick }) => {
  const { t } = useLanguage()
  const { scrollYProgress } = useScroll()
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
            <ImageCard key={item.src} src={item.src} caption={item.caption} index={i} onClick={onImageClick} />
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
    const filtered = (activeCategory === 'all' ? allCategories : allCategories.filter(c => c.id === activeCategory))
      .flatMap(cat => cat.items)
      .filter(it => !searchQuery || it.caption.toLowerCase().includes(searchQuery.toLowerCase()))
    const idx = filtered.findIndex(i => i.src === item.src)
    setLightbox({ ...item, index: idx, items: filtered, fromArchive: true })
  }, [activeCategory, allCategories, searchQuery])

  /* Lightbox navigation */
  function navLightbox(delta) {
    if (!lightbox) return
    const items = lightbox.items
    if (!items) return
    const nextIdx = (lightbox.index + delta + items.length) % items.length
    const item = items[nextIdx]
    setLightbox({ src: item.src, caption: item.caption, index: nextIdx, items, fromArchive: lightbox.fromArchive })
  }

  /* Filtered categories */
  const filteredCategories = activeCategory === 'all'
    ? allCategories
    : allCategories.filter(c => c.id === activeCategory)

  const shownItems = searchQuery
    ? filteredCategories.map(cat => ({
        ...cat,
        items: cat.items.filter(item => item.caption.toLowerCase().includes(searchQuery.toLowerCase()))
      })).filter(cat => cat.items.length > 0)
    : filteredCategories

  const shownTotal = shownItems.reduce((s, c) => s + c.items.length, 0)

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
                <p className="page-number" style={{ color: D.muted }}>{viewMode === 'showcase' ? `${FEATURED_WORKS.length} featured works` : `${shownTotal} works across ${shownItems.length} categories`}</p>
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
              <input
                type="text" placeholder="Search works..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2.5 text-sm border outline-none transition-colors"
                style={{ background: D.cardBg, borderColor: D.border, color: D.text }}
              />
              <button onClick={() => { setActiveCategory('all'); setSearchQuery('') }}
                className="mt-3 text-xs underline mr-2" style={{ color: D.faint }}>
                Clear all
              </button>
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
              {shownItems.length > 0 ? (
                shownItems.map((cat, i) => <CategorySection key={cat.id} category={cat} index={activeCategory === 'all' ? i : i} onImageClick={openArchiveLightbox} />)
              ) : (
                <div className="py-24 text-center">
                  <p className="text-lg" style={{ color: D.muted }}>No works found matching "{searchQuery}"</p>
                  <button onClick={() => setSearchQuery('')} className="mt-4 text-sm underline" style={{ color: D.accent }}>Clear search</button>
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
