import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion, useInView, useScroll } from 'framer-motion'
import { useLanguage } from './LanguageContext'
import Nav from './Nav'
import Lightbox from './components/Lightbox'
import { FitLines } from './components/PretextType'
import { BackToTop } from './sections/Footer'
import Cursor from './Cursor'
import ImageCard from './components/ImageCard'

/* ───────────────────────── IMAGE DATA ───────────────────────── */
const chineseCulturePhotos = [
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
  // Kept last: a motion-blurred candid, a weak opener for the set
  { src: '/portfolio/photos/chinese-culture/photo21.jpg', caption: 'Chinese Culture Day — Main Event' },
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
]

const PAGE_TITLE = ['Behind the Scenes']

/* ───────────────────────── COMPONENTS ───────────────────────── */

/* Removed internal ImageCard */

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
          src={`${src}#t=0.5`}
          preload="metadata"
          className="w-full h-full object-cover"
          onClick={handleToggle}
          playsInline
          onEnded={() => setIsPlaying(false)}
        />
        {/* Play button overlay */}
        {!isPlaying && (
          <motion.button
            onClick={handleToggle}
            aria-label={`Play ${title}`}
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

/* ───────────────────────── PHOTO GRID ───────────────────────── */
const PhotoGrid = ({ images }) => {
  const [openIndex, setOpenIndex] = useState(null)

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-4">
        {images.map((photo, i) => (
          <ImageCard key={photo.src} src={photo.src} caption={photo.caption} index={i} onClick={() => setOpenIndex(i)} />
        ))}
      </div>
      <AnimatePresence>
        {openIndex !== null && (
          <Lightbox
            src={images[openIndex].src}
            caption={images[openIndex].caption}
            position={`${openIndex + 1} / ${images.length}`}
            preload={[images[openIndex + 1]?.src, images[openIndex - 1]?.src].filter(Boolean)}
            onClose={() => setOpenIndex(null)}
            onPrev={openIndex > 0 ? () => setOpenIndex(openIndex - 1) : null}
            onNext={openIndex < images.length - 1 ? () => setOpenIndex(openIndex + 1) : null}
          />
        )}
      </AnimatePresence>
    </>
  )
}

/* ───────────────────────── PAGE ───────────────────────── */
function BehindTheScenes() {
  const { t } = useLanguage()
  const { scrollYProgress } = useScroll()

  return (
    <div className="relative min-h-screen text-ink cursor-none">
      <Cursor />

      {/* Scroll progress bar */}
      <motion.div className="fixed top-0 left-0 right-0 h-[2px] z-[90] origin-left" style={{ scaleX: scrollYProgress, backgroundColor: '#4a9f62' }} aria-hidden="true" />
      <Nav />
      <BackToTop />

      <header className="pt-28 md:pt-32 pb-12 md:pb-16 px-6 md:px-12">
        <div className="mx-auto max-w-7xl">
          <FitLines lines={PAGE_TITLE} font={'340 "Fraunces"'} as="h1" className="page-title" />
          <p className="text-base font-light max-w-xl leading-relaxed text-ink-light mt-4">
            Event documentation, behind-the-lens photography, and social media content creation.
          </p>
        </div>
      </header>

      <div className="px-6 md:px-12">
        <div className="mx-auto max-w-7xl h-px bg-gradient-to-r from-ink/10 to-transparent" />
      </div>

      {/* ───── CHINESE CULTURE DAY ───── */}
      <section className="py-16 md:py-24 px-6 md:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14">
            <span className="section-number">Event 01</span>
            <h2 className="text-3xl md:text-4xl font-display mt-2">Chinese Culture Day</h2>
            <p className="text-ink-faint text-sm font-light mt-1">Cultural event documentation — 12 photographs</p>
          </div>
          <PhotoGrid images={chineseCulturePhotos} />
        </div>
      </section>

      {/* ───── OPEN DAY ───── */}
      <section className="py-16 md:py-24 px-6 md:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14">
            <span className="section-number">Event 02</span>
            <h2 className="text-3xl md:text-4xl font-display mt-2">Open Day</h2>
            <p className="text-ink-faint text-sm font-light mt-1">Campus Open Day — 17 photographs</p>
          </div>
          <PhotoGrid images={openDayPhotos} />
        </div>
      </section>

      {/* ───── VIDEO GALLERY ───── */}
      <section className="py-16 md:py-24 px-6 md:px-12">
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
