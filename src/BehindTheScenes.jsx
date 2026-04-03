import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { useLanguage } from './LanguageContext'
import LanguageSelector from './LanguageSelector'
import Cursor from './Cursor'
import { DividerText } from './motionEffects.jsx'

/* ───────────────────────── IMAGE DATA ───────────────────────── */
const chineseCulturePhotos = [
  { src: '/portfolio/photos/chinese-culture/photo21.jpg', caption: 'Chinese Culture Day — Main Event' },
  { src: '/portfolio/photos/chinese-culture/photo23.jpg', caption: 'Cultural presentations and performances' },
  { src: '/portfolio/photos/chinese-culture/photo24.jpg', caption: 'Traditional art and calligraphy' },
  { src: '/portfolio/photos/chinese-culture/photo25.jpg', caption: 'Student interactions and activities' },
  { src: '/portfolio/photos/chinese-culture/photo26.jpg', caption: 'Cultural display booths' },
  { src: '/portfolio/photos/chinese-culture/photo27.jpg', caption: 'Food and cultural exchange' },
  { src: '/portfolio/photos/chinese-culture/photo28.jpg', caption: 'Audience engagement' },
  { src: '/portfolio/photos/chinese-culture/photo29.jpg', caption: 'Interactive cultural experiences' },
  { src: '/portfolio/photos/chinese-culture/photo30.jpg', caption: 'Traditional costume display' },
  { src: '/portfolio/photos/chinese-culture/photo31.jpg', caption: 'Cultural exchange moments' },
  { src: '/portfolio/photos/chinese-culture/photo32.jpg', caption: 'Performance stage highlights' },
  { src: '/portfolio/photos/chinese-culture/photo34.jpg', caption: 'Event wrap-up and acknowledgements' },
]

const openDayPhotos = [
  { src: '/portfolio/photos/open-day/dr-adel-27.jpg', caption: 'Open Day with Dr. Adel — Professionals session' },
  { src: '/portfolio/photos/open-day/dr-adel-40.jpg', caption: 'Faculty presentations' },
  { src: '/portfolio/photos/open-day/dr-adel-42.jpg', caption: 'Campus tour and orientation' },
  { src: '/portfolio/photos/open-day/dr-adel-44.jpg', caption: 'Student engagement activities' },
  { src: '/portfolio/photos/open-day/open-day-37.jpg', caption: 'Open Day — Welcome booth' },
  { src: '/portfolio/photos/open-day/open-day-38.jpg', caption: 'University information desks' },
  { src: '/portfolio/photos/open-day/open-day-39.jpg', caption: 'Interactive student workshops' },
  { src: '/portfolio/photos/open-day/open-day-40.jpg', caption: 'Faculty presentations' },
  { src: '/portfolio/photos/open-day/open-day-41.jpg', caption: 'Student testimonials sharing' },
  { src: '/portfolio/photos/open-day/open-day-42.jpg', caption: 'Campus facilities showcase' },
  { src: '/portfolio/photos/open-day/open-day-43.jpg', caption: 'Open Day — Networking sessions' },
  { src: '/portfolio/photos/open-day/open-day-44.jpg', caption: 'Student life displays' },
  { src: '/portfolio/photos/open-day/open-day-45.jpg', caption: 'Campus community activities' },
  { src: '/portfolio/photos/open-day/open-day-46.jpg', caption: 'Academic program showcases' },
  { src: '/portfolio/photos/open-day/open-day-47.jpg', caption: 'Student club presentations' },
  { src: '/portfolio/photos/open-day/open-day-49.jpg', caption: 'Graduate success stories' },
  { src: '/portfolio/photos/open-day/open-day-50.jpg', caption: 'Open Day closing ceremony' },
]

const videoGallery = [
  {
    src: '/portfolio/videos/0218-part2.mp4',
    title: 'Behind the Scenes — 0218',
    description: 'Event production and coordination',
    duration: 'Full clip',
  },
  {
    src: '/portfolio/videos/filming-discussion.mp4',
    title: 'Filming Discussion',
    description: 'Creative planning and direction session',
    duration: 'Full clip',
  },
  {
    src: '/portfolio/videos/imc-discussion.mp4',
    title: 'IMC Strategy Discussion',
    description: 'Integrated marketing campaign planning',
    duration: 'Full clip',
  },
  {
    src: '/portfolio/videos/open-day-tiktok.mp4',
    title: 'Open Day — TikTok',
    description: 'Social media content for campus Open Day',
    duration: 'Short form',
  },
  {
    src: '/portfolio/videos/open-day-tiktok-revised.mp4',
    title: 'Open Day — TikTok (Revised)',
    description: 'Revised social media cut with refined edit',
    duration: 'Short form',
  },
]

/* ───────────────────────── COMPONENTS ───────────────────────── */

const ImageCard = ({ src, caption, index }) => {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const [loaded, setLoaded] = useState(false)

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ delay: (index % 6) * 0.06, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="group relative overflow-hidden rounded-sm border border-ink/5 bg-paper-dark"
    >
      <div className="aspect-[3/2] overflow-hidden bg-[#e0e2d8]">
        {!loaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-accent/20 border-t-accent/60 rounded-full animate-spin" />
          </div>
        )}
        <img
          src={src}
          alt={caption}
          onLoad={() => setLoaded(true)}
          style={{ display: loaded ? 'block' : 'none' }}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
      </div>
      {/* Hover caption overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0d1a0f]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end">
        <p className="p-4 text-[#f5f5f0] text-sm font-light">{caption}</p>
      </div>
    </motion.div>
  )
}

const VideoCard = ({ src, title, description, duration, index }) => {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const [isPlaying, setIsPlaying] = useState(false)
  const videoRef = useRef(null)

  const handleToggle = () => {
    if (!isPlaying) {
      videoRef.current?.play()
      setIsPlaying(true)
    } else {
      videoRef.current?.pause()
      setIsPlaying(false)
    }
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="relative bg-paper-dark rounded-sm border border-ink/5 overflow-hidden"
    >
      <div className="aspect-video bg-[#0d1a0f] flex items-center justify-center relative">
        {/* Video player */}
        <video
          ref={videoRef}
          src={src}
          className="w-full h-full object-cover"
          onClick={handleToggle}
          playsInline
          onEnded={() => setIsPlaying(false)}
        />
        {/* Play button overlay */}
        {!isPlaying && (
          <motion.button
            onClick={handleToggle}
            className="absolute inset-0 flex items-center justify-center z-10"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="w-16 h-16 rounded-full bg-accent/80 flex items-center justify-center backdrop-blur-sm">
              <svg className="w-6 h-6 text-paper ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </motion.button>
        )}
        {/* Duration badge */}
        <div className="absolute top-3 right-3 px-2 py-1 bg-[#0d1a0f]/70 backdrop-blur-sm rounded-sm">
          <span className="text-[0.6rem] page-number text-[#f5f5f0]/70">{duration}</span>
        </div>
      </div>
      <div className="p-4">
        <h4 className="text-sm font-heading font-semibold text-ink">{title}</h4>
        <p className="text-xs text-ink-faint font-light mt-1">{description}</p>
      </div>
    </motion.div>
  )
}

/* ───────────────────────── MASONRY GRID ───────────────────────── */
const MasonryGrid = ({ images }) => {
  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
      {images.map((photo, i) => (
        <div key={photo.src} className="break-inside-avoid">
          <ImageCard src={photo.src} caption={photo.caption} index={i} />
        </div>
      ))}
    </div>
  )
}

/* ───────────────────────── PAGE ───────────────────────── */
function BehindTheScenes() {
  const { t } = useLanguage()

  return (
    <div className="relative min-h-screen text-ink cursor-none page-enter">
      <Cursor />

      {/* Top bar */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <div className="mx-auto max-w-7xl px-6 md:px-12 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="font-display text-xl italic text-ink hover:text-accent transition-colors"
            >
              Y.S.
            </Link>
            <span className="hidden md:block h-4 w-px bg-ink-faint/20" />
            <span className="hidden md:block page-number">{t('portfolio')}</span>
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
        className="pt-28 pb-16 px-6 md:px-12"
      >
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-12 gap-8 md:gap-16">
            <div className="col-span-12 md:col-span-4 lg:col-span-3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <span className="section-number">Event Media</span>
                <div className="w-8 h-px bg-accent/40 my-4" />
                <p className="page-number">Behind the scenes of Yehia's creative work</p>
              </motion.div>
            </div>
            <div className="col-span-12 md:col-span-8 lg:col-span-9">
              <motion.h1
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="text-5xl md:text-7xl lg:text-8xl font-display tracking-tight leading-[0.9] mb-6"
              >
                Behind the Scenes
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-base font-light max-w-xl leading-relaxed text-ink-light"
              >
                Event documentation, behind-the-lens photography, and social media content creation.
                Capturing the moments that define creative storytelling.
              </motion.p>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="h-px bg-gradient-to-r from-ink/10 to-transparent" />
      </div>

      {/* ───── CHINESE CULTURE DAY ───── */}
      <section className="py-24 px-6 md:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14">
            <span className="section-number">Event 01</span>
            <h2 className="text-3xl md:text-4xl font-display mt-2">Chinese Culture Day</h2>
            <p className="text-ink-faint text-sm font-light mt-1">Cultural event documentation — 12 photographs</p>
          </div>
          <MasonryGrid images={chineseCulturePhotos} />
        </div>
      </section>

      <DividerText text="LIFE" />

      {/* ───── OPEN DAY ───── */}
      <section className="py-24 px-6 md:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14">
            <span className="section-number">Event 02</span>
            <h2 className="text-3xl md:text-4xl font-display mt-2">Open Day</h2>
            <p className="text-ink-faint text-sm font-light mt-1">Campus Open Day — 17+ photographs</p>
          </div>
          <MasonryGrid images={openDayPhotos} />
        </div>
      </section>

      <DividerText text="CRAFT" />

      {/* ───── VIDEO GALLERY ───── */}
      <section className="py-24 px-6 md:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14">
            <span className="section-number">Motion</span>
            <h2 className="text-3xl md:text-4xl font-display mt-2">Video Content</h2>
            <p className="text-ink-faint text-sm font-light mt-1">Social media, behind-the-scenes, and campaign videos</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videoGallery.map((video, i) => (
              <VideoCard key={video.src} src={video.src} title={video.title} description={video.description} duration={video.duration} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ───── FOOTER ───── */}
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

export default BehindTheScenes
