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

const WorkItem = ({ work }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    whileHover={{ y: -10, rotate: 0.5 }}
    transition={{ type: "spring", stiffness: 300, damping: 20 }}
    className="relative flex h-full flex-col overflow-hidden border-4 border-ink bg-white shadow-brutal"
  >
    <div className="relative aspect-video overflow-hidden border-b-4 border-ink bg-alabaster group">
      <img
        src={work.media.src}
        alt={work.title}
        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        onError={(e) => {
          e.target.style.display = 'none';
          e.target.parentElement.innerHTML = '<div class="flex items-center justify-center h-full text-6xl font-mono text-ink/20">IMAGE</div>';
        }}
      />
      <div className="pointer-events-none absolute inset-0 border-4 border-dashed border-ink/20" aria-hidden />
    </div>
    <div className="flex flex-1 flex-col gap-4 p-8">
      <div className="flex items-center justify-between gap-4">
        <span className="inline-flex border-2 border-ink bg-brutalYellow px-3 py-1 font-mono text-xs uppercase tracking-[0.2em] shadow-brutalSm">
          {work.category}
        </span>
        <span className="font-mono text-sm text-ink/60">{work.year}</span>
      </div>
      <div>
        <h3 className="text-2xl font-semibold">{work.title}</h3>
        <p className="mt-3 text-base leading-relaxed text-ink/70">{work.description}</p>
      </div>
    </div>
  </motion.div>
)

function Portfolio() {
  const { t } = useLanguage()
  const portfolioWorks = t('portfolioWorks')

  return (
    <div className="min-h-screen bg-alabaster pb-24 cursor-none">
      <Cursor />
      <LanguageSelector />
      <div className="mx-auto w-full max-w-7xl px-4 pt-16 md:px-10">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 flex flex-col gap-6 md:flex-row md:items-center md:justify-between"
        >
          <div>
            <Link
              to="/"
              className="mb-4 inline-flex items-center gap-2 font-mono text-sm uppercase tracking-[0.2em] text-ink/70 transition hover:text-ink"
            >
              <span className="text-xl">←</span>
              {t('backToHome')}
            </Link>
            <h1 className="text-4xl font-semibold md:text-5xl">{t('portfolioTitle')}</h1>
            <p className="mt-2 text-lg text-ink/70">{t('portfolioSubtitle')}</p>
            <p className="mt-3 max-w-2xl text-lg text-ink/70">
              {t('portfolioDescription')}
            </p>
          </div>
        </motion.header>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="relative"
        >
          <Swiper
            modules={[Navigation, Pagination, Keyboard, Mousewheel]}
            spaceBetween={40}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            keyboard={{ enabled: true }}
            mousewheel={{ forceToAxis: true }}
            className="brutalist-swiper"
            breakpoints={{
              768: { slidesPerView: 1.2, spaceBetween: 40 },
            }}
          >
            {portfolioWorks.map((work) => (
              <SwiperSlide key={work.id}>
                <WorkItem work={work} />
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>
      </div>
    </div>
  )
}

export default Portfolio
