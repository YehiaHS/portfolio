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
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="relative"
    >
      {/* Image container */}
      <div className="relative aspect-[4/3] overflow-hidden mb-6 group">
        <div className="absolute inset-0 border border-ink/5 bg-paper-dark" />
        <img
          src={work.media.src}
          alt={work.title}
          className="h-full w-full object-cover relative z-10 transition-all duration-700 group-hover:scale-[1.02]"
          onError={(e) => {
            e.target.parentElement.querySelectorAll('img, .placeholder').forEach(el => el.style.display = 'none')
            const ph = document.createElement('div')
            ph.className = 'placeholder absolute inset-0 z-20 flex flex-col items-center justify-center bg-paper-dark'
            ph.innerHTML = `
              <span class="text-6xl font-display italic text-accent/15">${String(index + 1).padStart(2, '0')}</span>
              <span class="mt-2 page-number">Image unavailable</span>
            `
            e.target.parentElement.appendChild(ph)
          }}
        />
        {/* Category overlay */}
        <div className="absolute top-4 left-4 z-20">
          <span className="section-number">{work.category}</span>
        </div>
        {/* Year badge */}
        <div className="absolute top-4 right-4 z-20 page-number">
          {work.year}
        </div>
      </div>

      {/* Title & description */}
      <h3 className="text-2xl md:text-3xl font-display mb-2 tracking-tight">{work.title}</h3>
      <p className="text-ink-light text-sm leading-relaxed mb-4 font-light">{work.description}</p>

      {/* Reflection toggle */}
      <button
        onClick={() => setShowReflection(!showReflection)}
        className="reflexion-label flex items-center gap-2"
      >
        <span>{showReflection ? t('closeReflection') : t('reflection')}</span>
        <motion.span
          animate={{ rotate: showReflection ? 0 : -90 }}
          transition={{ duration: 0.3 }}
          className="text-sm"
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
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="overflow-hidden"
      >
        <div className="reflexion-panel">
          <h4 className="font-display italic text-lg text-accent mb-4">
            {t('reflection')}
          </h4>
          <p className="text-ink-light text-sm leading-relaxed font-light whitespace-pre-line">
            {work.reflection}
          </p>

          {/* Skills gained */}
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

          <p className="mt-4 page-number">
            {t('learningOutcome')}
          </p>
        </div>
      </motion.div>
    </motion.div>
  )
}

/* ──────────────────────── REFLECTIONS ──────────────────────── */
const Reflections = () => {
  const { t } = useLanguage()
  const statements = t('reflectionStatements')

  if (!statements || statements.length === 0) return null

  return (
    <section className="py-24 px-6 md:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-12 gap-12 md:gap-20 mb-14">
          <div className="col-span-12 md:col-span-3 lg:col-span-2">
            <span className="section-number">07</span>
            <p className="page-number mt-2">{t('reflection').toLowerCase()}</p>
          </div>
          <div className="col-span-12 md:col-span-9 lg:col-span-10">
            <h2 className="text-3xl md:text-4xl lg:text-5xl mb-2">{t('reflectionTitle')}</h2>
            <p className="text-ink-faint page-number">{t('reflectionSubtitle')}</p>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-12 md:gap-20">
          <div className="col-span-12 md:col-start-4 lg:col-start-4 md:col-span-9 lg:col-span-9">
            <div className="space-y-12">
              {statements.map((stmt, i) => (
                <motion.div
                  key={stmt.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                >
                  <h3 className="text-2xl font-display mb-4 tracking-tight">
                    {stmt.title}
                  </h3>
                  <p className="text-ink-light text-sm leading-relaxed whitespace-pre-line font-light">
                    {stmt.body}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
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
    <div className="relative min-h-screen text-ink cursor-none page-enter">
      <Cursor />

      {/* Top bar */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <div className="mx-auto max-w-7xl px-6 md:px-12 py-5 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-3 font-display italic text-xl text-ink hover:text-accent transition-colors"
          >
            <span className="text-lg">←</span>
            {t('home')}
          </Link>
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
                <span className="section-number">{t('portfolio')}</span>
                <div className="w-8 h-px bg-accent/40 my-4" />
                <p className="page-number">{t('selectedWorks')}</p>
              </motion.div>
            </div>

            <div className="col-span-12 md:col-span-8 lg:col-span-9">
              <motion.h1
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="text-5xl md:text-7xl lg:text-8xl font-display tracking-tight leading-[0.9]"
              >
                {t('portfolioTitle')}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-6 text-ink-faint text-base font-light max-w-xl"
              >
                {t('portfolioDescription')}
              </motion.p>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Divider */}
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="h-px bg-gradient-to-r from-ink/10 to-transparent" />
      </div>

      {/* Work carousel */}
      <section className="py-24 px-6 md:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between mb-14">
            <h2 className="text-xl font-display tracking-tight">
              {t('category')}: <span className="italic font-italic text-accent">{t('portfolio')}</span>
            </h2>
            <span className="page-number">{works.length} {t('projects')}</span>
          </div>

          <Swiper
            modules={[Navigation, Keyboard, Mousewheel]}
            spaceBetween={40}
            slidesPerView={1}
            navigation={true}
            keyboard={{ enabled: true }}
            mousewheel={{ forceToAxis: true }}
            className="editorial-swiper"
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

      {/* Divider */}
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="h-px bg-gradient-to-r from-ink/10 to-transparent" />
      </div>

      {/* Reflections */}
      <Reflections />

      {/* Divider */}
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="h-px bg-gradient-to-r from-ink/10 to-transparent" />
      </div>

      {/* Authorship Notice */}
      <section className="py-16 px-6 md:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <p className="page-number mb-3 text-accent">
              {t('ethicsNotice')}
            </p>
            <p className="text-ink-faint text-sm font-light max-w-2xl mx-auto leading-relaxed">
              {t('authorshipAll')}
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 md:px-12 border-t border-ink/5">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <span className="page-number">
            {t('footerText')} — {new Date().getFullYear()}
          </span>
          <span className="page-number">{t('precision')}</span>
        </div>
      </footer>
    </div>
  )
}

export default Portfolio
