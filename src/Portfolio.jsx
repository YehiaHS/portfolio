import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Keyboard, Mousewheel } from 'swiper/modules'
import { useLanguage } from './LanguageContext'
import LanguageSelector from './LanguageSelector'
import Cursor from './Cursor'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

const WorkItem = ({ work, index }) => {
  const [showReflection, setShowReflection] = useState(false)
  const { t } = useLanguage()

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="relative"
    >
      {/* Image container */}
      <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-pearl/5 mb-6 group">
        <img
          src={work.media.src}
          alt={work.title}
          className="h-full w-full object-cover transition-all duration-700 group-hover:scale-105"
          onError={(e) => {
            e.target.parentElement.innerHTML = `
              <div class="flex flex-col items-center justify-center h-full bg-graphite">
                <span class="text-6xl text-amber/20 font-serif italic">P${index + 1}</span>
                <span class="mt-2 font-mono text-xs tracking-widest text-cream/20 uppercase">Project Work</span>
              </div>
            `
          }}
        />
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-noir/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
          <span className="section-badge mb-3">{work.category}</span>
        </div>
        {/* Year badge */}
        <div className="absolute top-4 right-4 font-mono text-xs tracking-widest text-pearl/50 bg-noir/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
          {work.year}
        </div>
      </div>

      {/* Title & description */}
      <h3 className="text-2xl font-serif text-pearl/90 mb-2">{work.title}</h3>
      <p className="text-cream/50 text-sm leading-relaxed mb-4">{work.description}</p>

      {/* Reflection toggle */}
      <button
        onClick={() => setShowReflection(!showReflection)}
        className="font-mono text-xs tracking-[0.15em] uppercase text-amber/60 hover:text-amber transition-colors flex items-center gap-2"
      >
        <span>{showReflection ? t('closeReflection') : t('reflection')}</span>
        <motion.span
          animate={{ rotate: showReflection ? 0 : -90 }}
          transition={{ duration: 0.3 }}
          className="text-lg"
        >
          ↓
        </motion.span>
      </button>

      {/* Reflection panel */}
      <motion.div
        initial={false}
        animate={{
          height: showReflection ? 'auto' : 0,
          opacity: showReflection ? 1 : 0,
          marginTop: showReflection ? 20 : 0,
        }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="overflow-hidden"
      >
        <div className="reflection-panel rounded-r-lg">
          <h4 className="font-serif text-lg italic text-amber/80 mb-4">
            {t('reflection')}
          </h4>
          <p className="text-cream/60 text-sm leading-relaxed whitespace-pre-line">
            {work.reflection}
          </p>

          {/* Skills gained */}
          {work.skillsGained && (
            <div className="mt-5 flex flex-wrap gap-2">
              {work.skillsGained.map((s) => (
                <span
                  key={s}
                  className="px-3 py-1 text-xs bg-pearl/5 text-cream/40 rounded-full border border-pearl/10"
                >
                  {s}
                </span>
              ))}
            </div>
          )}

          {/* Learning outcome */}
          <p className="mt-4 font-mono text-[0.65rem] tracking-wider uppercase text-amber/30">
            {t('learningOutcome')}
          </p>
        </div>
      </motion.div>
    </motion.div>
  )
}

/* ──────────────────────── REFLECTIVE JOURNEY ──────────────────────── */
const Reflections = () => {
  const { t } = useLanguage()
  const statements = t('reflectionStatements')

  if (!statements || statements.length === 0) return null

  return (
    <section className="py-24 px-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-14">
          <span className="section-badge mb-4 inline-block">{t('reflection').toLowerCase()}</span>
          <h2 className="text-4xl md:text-5xl font-serif">{t('reflectionTitle')}</h2>
          <p className="text-cream/40 mt-3 font-mono text-sm tracking-widest">{t('reflectionSubtitle')}</p>
        </div>

        <div className="grid gap-8">
          {statements.map((stmt, i) => (
            <motion.div
              key={stmt.title}
              initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="card rounded-xl p-8 md:p-10 border-l-3 border-l-amber/40 border border-pearl/5"
            >
              <h3 className="text-2xl font-serif text-pearl/90 mb-4">{stmt.title}</h3>
              <p className="text-cream/50 text-sm leading-relaxed whitespace-pre-line">
                {stmt.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ──────────────────────── MAIN PAGE ──────────────────────── */
function Portfolio() {
  const { t } = useLanguage()
  const works = t('portfolioWorks')
  const isRTL = useLanguage().isRTL

  return (
    <div className="relative min-h-screen text-pearl cursor-none">
      <Cursor />

      {/* Top bar */}
      <div className="fixed top-6 left-0 right-0 z-50 flex items-center justify-between px-8 pointer-events-none">
        <Link
          to="/"
          className="pointer-events-auto flex items-center gap-3 font-mono text-xs tracking-[0.15em] uppercase text-cream/40 hover:text-amber transition-colors"
        >
          <span className="text-xl">←</span>
          {t('home')}
        </Link>
        <LanguageSelector />
      </div>

      {/* Header */}
      <motion.header
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="pt-28 pb-16 px-8 pb-22"
      >
        <div className="mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <span className="section-highlight mb-4">
              {/* decorative accent */}
            </span>
            <div className="w-12 h-px bg-amber/40 mb-6" />
            <h1 className="text-5xl md:text-7xl font-serif leading-tight">
              {t('portfolioTitle')}
            </h1>
            <p className="mt-4 text-cream/40 text-lg font-accent italic">
              {t('portfolioSubtitle')}
            </p>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 text-cream/50 max-w-xl text-sm leading-relaxed"
          >
            {t('portfolioDescription')}
          </motion.p>
        </div>
      </motion.header>

      <div className="divider mx-auto max-w-5xl" />

      {/* Work carousel */}
      <section className="py-24 px-8">
        <div className="mx-auto max-w-5xl">
          <div className="flex items-center justify-between mb-14">
            <h2 className="text-2xl font-serif text-pearl/80">
              {t('category')}: <span className="italic text-amber/60">{t('portfolio')}</span>
            </h2>
          </div>

          <Swiper
            modules={[Navigation, Keyboard, Mousewheel]}
            spaceBetween={40}
            slidesPerView={1}
            navigation={true}
            keyboard={{ enabled: true }}
            mousewheel={{ forceToAxis: true }}
            className="brutalist-swiper"
            breakpoints={{
              768: { slidesPerView: 1.15, spaceBetween: 40 },
              1024: { slidesPerView: 1.3, spaceBetween: 48 },
            }}
            dir={isRTL ? 'rtl' : 'ltr'}
          >
            {works.map((work, i) => (
              <SwiperSlide key={work.id}>
                <WorkItem work={work} index={i} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* Reflective Journey */}
      <div className="divider mx-auto max-w-5xl" />
      <Reflections />

      {/* Authorship & Ethics Notice */}
      <div className="divider mx-auto max-w-5xl" />
      <section className="py-16 px-6">
        <div className="mx-auto max-w-5xl">
          <div className="card rounded-xl p-8 border border-pearl/5 text-center">
            <p className="font-mono text-xs tracking-widest uppercase text-amber/50 mb-3">
              {t('ethicsNotice')}
            </p>
            <p className="text-cream/40 text-sm leading-relaxed">
              {t('authorshipAll')}
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6">
        <div className="authorship">
          {t('footerText')} — {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  )
}

export default Portfolio
