import { useRef, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { LineSlideUp, MaskReveal, GlitchText, DividerText, StaggerContainer, TextCounter } from './motionEffects.jsx'
import { ColoredPanel, ContentGrid, SplitLayout, GhostButton, StackedCard } from './C2Patterns.jsx'
import { useLanguage } from './LanguageContext'
import LanguageSelector from './LanguageSelector'
import Cursor from './Cursor'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
}

const AnimatedSection = ({ children, className = '', delay = 0 }) => {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={fadeUp}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/* ───────────────────────────── NAV ───────────────────────────── */
const Nav = () => {
  const { t } = useLanguage()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-[#f7f3ee]/90 backdrop-blur-md' : ''}`}>
      <div className="mx-auto max-w-7xl px-6 md:px-12 py-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/" className="font-display text-xl italic text-ink hover:text-accent transition-colors">
            Y.S.
          </Link>
          <span className="hidden md:block h-4 w-px bg-ink-faint/20" />
          <span className="hidden md:block page-number">{t('portfolio')}</span>
        </div>
        <div className="flex items-center gap-6">
          <a href="#about" className="page-number hover:text-accent transition-colors hidden md:inline-block">{t('aboutLabel')}</a>
          <a href="#skills" className="page-number hover:text-accent transition-colors hidden md:inline-block">{t('skillsTitle')}</a>
          <a href="#awards" className="page-number hover:text-accent transition-colors hidden md:inline-block">{t('awardsTitle')}</a>
          <Link to="/works" className="page-number hover:text-accent transition-colors">Works</Link>
          <Link to="/portfolio" className="page-number hover:text-accent transition-colors">{t('viewPortfolio')}</Link>
          <Link to="/behind-the-scenes" className="page-number hover:text-accent transition-colors hidden md:inline-block">Behind the Scenes</Link>
          <LanguageSelector />
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="h-px bg-gradient-to-r from-transparent via-ink/10 to-transparent" />
      </div>
    </nav>
  )
}

/* ──────────────────────── FLOATING SHAPES ──────────────────────── */
const FloatingShapes = () => {
  const shapes = [
    { id: 1, type: 'circle', x: '10%', y: '20%', size: 60, duration: 25, delay: 0 },
    { id: 2, type: 'triangle', x: '75%', y: '15%', size: 50, duration: 30, delay: 2 },
    { id: 3, type: 'line', x: '85%', y: '60%', size: 80, duration: 20, delay: 1 },
    { id: 4, type: 'circle', x: '20%', y: '70%', size: 35, duration: 22, delay: 3 },
    { id: 5, type: 'triangle', x: '60%', y: '75%', size: 45, duration: 28, delay: 4 },
    { id: 6, type: 'diamond', x: '45%', y: '30%', size: 30, duration: 35, delay: 5 },
    { id: 7, type: 'circle', x: '90%', y: '40%', size: 20, duration: 18, delay: 2 },
    { id: 8, type: 'line', x: '5%', y: '50%', size: 60, duration: 24, delay: 1 },
  ]

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {shapes.map((s) => (
        <motion.div
          key={s.id}
          className="absolute opacity-[0.04]"
          style={{ left: s.x, top: s.y }}
          animate={{
            rotate: [0, 360],
            y: [0, -15, 0],
          }}
          transition={{
            rotate: { duration: s.duration, repeat: Infinity, ease: 'linear' },
            y: { duration: s.duration * 0.6 + 4, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' },
            delay: s.delay,
          }}
        >
          {s.type === 'circle' && (
            <svg width={s.size} height={s.size} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-ink">
              <circle cx="50" cy="50" r="48" />
            </svg>
          )}
          {s.type === 'triangle' && (
            <svg width={s.size} height={s.size} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-ink">
              <polygon points="50,5 95,90 5,90" />
            </svg>
          )}
          {s.type === 'line' && (
            <svg width={s.size} height={s.size} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-accent">
              <line x1="10" y1="50" x2="90" y2="50" />
              <line x1="50" y1="10" x2="50" y2="90" />
            </svg>
          )}
          {s.type === 'diamond' && (
            <svg width={s.size} height={s.size} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-ink">
              <rect x="15" y="15" width="70" height="70" transform="rotate(45 50 50)" />
            </svg>
          )}
        </motion.div>
      ))}
    </div>
  )
}

/* ──────────────────────── HERO BOTANICAL BACKGROUND ──────────────────────── */
const HeroBotanicalBg = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
    {/* Layer 1: large sweeping vine curves - very faint */}
    <svg className="absolute top-0 right-0 w-[60%] h-full opacity-[0.03]" viewBox="0 0 600 900" fill="none">
      <path d="M500 0 C 450 100, 550 200, 400 350 C 300 450, 500 500, 450 650 C 400 800, 500 850, 450 900"
        stroke="#2d5a3d" strokeWidth="2" fill="none" />
      <path d="M520 50 C 470 150, 570 250, 420 380 C 320 480, 520 530, 470 670 C 420 810, 520 860, 470 900"
        stroke="#4a8f5c" strokeWidth="1" fill="none" />
      {/* Leaf shapes along vine */}
      <ellipse cx="440" cy="180" rx="35" ry="15" fill="#2d5a3d" opacity="0.15" transform="rotate(-30 440 180)" />
      <ellipse cx="380" cy="320" rx="30" ry="12" fill="#4a8f5c" opacity="0.1" transform="rotate(20 380 320)" />
      <ellipse cx="470" cy="480" rx="28" ry="10" fill="#2d5a3d" opacity="0.12" transform="rotate(-15 470 480)" />
      <ellipse cx="430" cy="600" rx="25" ry="11" fill="#4a8f5c" opacity="0.08" transform="rotate(25 430 600)" />
      <ellipse cx="480" cy="750" rx="32" ry="14" fill="#2d5a3d" opacity="0.1" transform="rotate(-20 480 750)" />
    </svg>

    {/* Layer 2: left side organic curves */}
    <svg className="absolute bottom-0 left-0 w-[50%] h-[70%] opacity-[0.025]" viewBox="0 0 500 700" fill="none">
      <path d="M50 700 C 100 600, 0 500, 100 400 C 200 300, 50 200, 150 100 C 200 50, 150 20, 200 0"
        stroke="#1a3526" strokeWidth="1.5" fill="none" />
      <path d="M70 700 C 120 580, 20 480, 120 380 C 220 280, 70 180, 170 80 C 220 30, 170 10, 220 0"
        stroke="#4a8f5c" strokeWidth="1" fill="none" />
      {/* Leaves */}
      <path d="M100 400 Q 140 350 120 300 Q 80 340 100 400Z" fill="#2d5a3d" opacity="0.1" />
      <path d="M150 100 Q 190 60 170 10 Q 130 50 150 100Z" fill="#4a8f5c" opacity="0.08" />
      <path d="M70 550 Q 110 500 90 450 Q 50 490 70 550Z" fill="#2d5a3d" opacity="0.07" />
    </svg>

    {/* Layer 3: scattered small leaf silhouettes */}
    <svg className="absolute inset-0 w-full h-full opacity-[0.02]" viewBox="0 0 1440 900" fill="none">
      {[
        [200, 100, -25, 40, 18],
        [700, 200, 15, 35, 15],
        [1100, 300, -10, 45, 20],
        [300, 500, 30, 30, 14],
        [900, 450, -20, 38, 16],
        [1200, 600, 10, 42, 19],
        [100, 700, -15, 36, 17],
        [600, 750, 20, 33, 15],
        [1300, 150, -5, 28, 12],
        [450, 350, 25, 40, 18],
      ].map(([cx, cy, rot, rx, ry], i) => (
        <ellipse key={i} cx={cx} cy={cy} rx={rx} ry={ry} fill="#2d5a3d"
          transform={`rotate(${rot} ${cx} ${cy})`} opacity="0.12" />
      ))}
    </svg>

    {/* Layer 4: flowing horizontal lines - editorial style */}
    <svg className="absolute top-[30%] left-0 w-full opacity-[0.02]" viewBox="0 0 1440 100" fill="none">
      <path d="M0 50 Q 360 10, 720 50 Q 1080 90, 1440 50" stroke="#2d5a3d" strokeWidth="0.8" />
      <path d="M0 55 Q 360 15, 720 55 Q 1080 95, 1440 55" stroke="#4a8f5c" strokeWidth="0.5" />
      <path d="M0 60 Q 360 20, 720 60 Q 1080 100, 1440 60" stroke="#1a3526" strokeWidth="0.3" />
    </svg>
  </div>
)

/* ──────────────────────── HERO ──────────────────────── */
const Hero = () => {
  const { t } = useLanguage()
  const { scrollY } = useScroll()
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0])
  const heroY = useTransform(scrollY, [0, 400], [0, 80])
  const [time, setTime] = useState('')

  useEffect(() => {
    const update = () => {
      const now = new Date()
      const options = { timeZone: 'Africa/Cairo', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }
      setTime(now.toLocaleTimeString('en-US', options))
    }
    update()
    const interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative min-h-screen flex flex-col justify-center pt-20 px-6 md:px-12 overflow-hidden">
      <motion.div style={{ opacity: heroOpacity, y: heroY }}>
        <FloatingShapes />
        <HeroBotanicalBg />

        {/* Sidebar border edges */}
        <div className="absolute left-6 md:left-12 top-0 bottom-0 w-px bg-ink/5" />
        <div className="absolute right-6 md:right-12 top-0 bottom-0 w-px bg-ink/5" />

        {/* Watermark 01 */}
        <div className="absolute top-32 right-8 md:right-16 opacity-[0.03] font-heading text-[14rem] md:text-[22rem] font-bold leading-none select-none pointer-events-none">
          01
        </div>

        <div className="relative mx-auto max-w-7xl w-full">
          {/* Top row: status pill + clock */}
          <div className="flex items-center gap-4 mb-10">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.8 }}
              className="flex items-center gap-2 px-4 py-2 bg-white/60 border border-ink/8 rounded-full backdrop-blur-sm"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
              </span>
              <span className="text-[0.65rem] font-heading font-semibold tracking-[0.12em] uppercase text-ink-light">
                {t('available')}
              </span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.0 }}
              className="flex items-center gap-2 px-3 py-1.5"
            >
              <svg className="w-3.5 h-3.5 text-ink-faint" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <span className="page-number font-mono">{time}</span>
              <span className="text-[0.55rem] text-ink-faint/60 -ml-1">Cairo</span>
            </motion.div>
          </div>

          <div className="grid grid-cols-12 gap-6">
            {/* Left column */}
            <div className="col-span-12 md:col-span-5 lg:col-span-4">
              <AnimatedSection delay={0.1}>
                <p className="page-number mb-2">{t('hello')}</p>
              </AnimatedSection>
              <AnimatedSection delay={0.3}>
                <div className="h-px w-16 bg-accent mb-6" />
              </AnimatedSection>
              <StaggerContainer staggerMs={150}>
                <p className="text-ink-faint text-sm leading-relaxed max-w-xs font-light">
                  {t('tagline')}
                </p>
                <p className="text-ink-faint/50 text-xs mt-3 font-light">{t('location')}</p>
              </StaggerContainer>

              {/* Quick stats */}
              <AnimatedSection delay={0.9}>
                <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-3">
                  {[
                    { num: <TextCounter end={3} />, label: 'Languages' },
                    { num: <TextCounter end={10} suffix="+" />, label: 'Design Tools' },
                    { num: <TextCounter end={8} suffix=".5" />, label: 'IELTS Score' },
                    { num: <TextCounter end={2} />, label: 'Degrees' },
                  ].map((stat) => (
                    <div key={stat.label}>
                      <span className="block text-2xl font-display font-bold text-accent">{stat.num}</span>
                      <span className="page-number">{stat.label}</span>
                    </div>
                  ))}
                </div>
              </AnimatedSection>
            </div>

            {/* Right column - Name + Portrait */}
            <div className="col-span-12 md:col-span-7 lg:col-span-8 md:pl-12 lg:pl-20">
              <div className="flex flex-col lg:flex-row lg:items-start gap-8 lg:gap-12">
                {/* Portrait placeholder - visible on lg+ */}
                <div className="hidden lg:flex flex-shrink-0">
                  <AnimatedSection delay={0.4}>
                    <div className="relative">
                      {/* Decorative outer frame */}
                      <div className="absolute -inset-3 border-2 border-accent/10 rounded-full" />
                      <div className="absolute -inset-6 border border-accent/5 rounded-full" />
                      {/* Rotating accent ring */}
                      <svg className="absolute -inset-4 w-[calc(8rem+2rem)] h-[calc(8rem+2rem)] opacity-20" viewBox="0 0 120 120" fill="none">
                        <motion.circle cx="60" cy="60" r="58" stroke="#2d5a3d" strokeWidth="0.5" strokeDasharray="4 8"
                          animate={{ rotate: 360 }} transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
                          style={{ transformOrigin: '60px 60px' }} />
                      </svg>
                      {/* Main circle with gradient */}
                      <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#2d5a3d] via-[#1a3526] to-[#4a8f5c] flex items-center justify-center shadow-lg">
                        <div className="text-center">
                          <span className="block text-3xl font-bold font-display text-[#f5f5f0]/80 tracking-wider">YS</span>
                        </div>
                      </div>
                      {/* Corner decorative marks */}
                      <div className="absolute top-1 left-1 w-2 h-2 border-t border-l border-accent/30 rounded-tl-sm" />
                      <div className="absolute bottom-1 right-1 w-2 h-2 border-b border-r border-accent/30 rounded-br-sm" />
                    </div>
                  </AnimatedSection>
                </div>

                {/* Name (full width on mobile/tablet) */}
                <div className="leading-[0.85]">
                  <motion.div
                    initial={{ opacity: 0, y: 60 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <h1 className="text-[4.5rem] md:text-[8rem] lg:text-[11rem] font-bold tracking-tight text-ink leading-none">
                      <GlitchText>Yehia</GlitchText>
                    </h1>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1.2, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="pl-4 md:pl-8 lg:pl-12 -mt-2"
                  >
                    <h1 className="text-[4rem] md:text-[7rem] lg:text-[10rem] font-normal italic font-italic tracking-tight text-accent leading-none">
                      Salem
                    </h1>
                  </motion.div>
                </div>
              </div>

              {/* Quote */}
              <AnimatedSection delay={1.0}>
                <p className="mt-10 md:mt-14 text-xl md:text-2xl lg:text-3xl font-italic italic text-ink-light/60 max-w-lg leading-relaxed">
                  &ldquo;Where code meets canvas &mdash; building at the intersection of logic and imagination.&rdquo;
                </p>
              </AnimatedSection>

              {/* CTA buttons */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="mt-12 md:mt-14 flex flex-wrap items-center gap-4"
              >
                <motion.a href="#about" className="px-6 py-3 text-[0.7rem] font-heading font-semibold tracking-[0.18em] uppercase text-paper bg-ink hover:bg-accent transition-colors duration-300" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  {t('explore')}
                </motion.a>
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Link to="/portfolio" className="px-6 py-3 text-[0.7rem] font-heading font-semibold tracking-[0.18em] uppercase border border-ink/20 text-ink hover:border-accent hover:text-accent transition-colors duration-300">
                    {t('viewPortfolio')}
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Link to="/behind-the-scenes" className="px-6 py-3 text-[0.7rem] font-heading font-semibold tracking-[0.18em] uppercase text-ink-light hover:text-accent transition-colors duration-300">
                    Behind the Scenes
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Link to="/works" className="px-6 py-3 text-[0.7rem] font-heading font-semibold tracking-[0.18em] uppercase text-ink-light hover:text-accent transition-colors duration-300">
                    Complete Works
                  </Link>
                </motion.div>
              </motion.div>
            </div>
          </div>

          {/* Signature */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.2 }}
            className="mt-16 md:mt-20"
          >
            <span className="text-3xl md:text-4xl font-italic italic text-ink/20">Yehia Salem</span>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2 }}
          className="absolute bottom-8 left-14 md:left-20 flex items-center gap-3"
        >
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-px h-10 bg-accent/40"
          />
          <span className="page-number">{t('scroll')}</span>
        </motion.div>
      </motion.div>
    </section>
  )
}

/* ──────────────────────── TICKER ──────────────────────── */
const Ticker = () => {
  const { t } = useLanguage()
  const tickerItems = [t('ticker.item1'), t('ticker.item2'), t('ticker.item3'), t('ticker.item4')]
  const doubled = [...tickerItems, ...tickerItems, ...tickerItems]

  return (
    <div className="relative bg-ink text-paper py-4 overflow-hidden">
      <motion.div
        className="flex whitespace-nowrap gap-8 md:gap-14"
        animate={{ x: [0, -3000] }}
        transition={{ x: { duration: 25, repeat: Infinity, ease: 'linear' } }}
      >
        {doubled.map((item, i) => (
          <span key={i} className="flex items-center gap-8 md:gap-14 text-sm md:text-base font-heading font-medium tracking-[0.15em] uppercase">
            <span>{item}</span>
            <span className="text-accent opacity-50">*</span>
          </span>
        ))}
      </motion.div>
    </div>
  )
}

/* ──────────────────────── MARQUEE STRIP ──────────────────────── */
const MarqueeStrip = () => {
  const text = 'INTEGRATED MARKETING  \u2022  COMPUTER SCIENCE  \u2022  DESIGN  \u2022  STORYTELLING  \u2022  CREATIVE TECHNOLOGY  \u2022  VISUAL COMMUNICATION  \u2022  '
  const doubled = text.repeat(6)

  return (
    <div className="relative border-y border-ink/10 bg-paper-dark py-3 overflow-hidden">
      <motion.div
        className="flex whitespace-nowrap"
        animate={{ x: [0, -1500] }}
        transition={{ x: { duration: 40, repeat: Infinity, ease: 'linear' } }}
      >
        <span className="text-[0.65rem] font-heading font-semibold tracking-[0.2em] text-ink-faint/50 uppercase">
          {doubled}
        </span>
      </motion.div>
    </div>
  )
}

/* ──────────────────────── DECORATIVE BREAK ──────────────────────── */
const DecorativeBreak = ({ letter }) => (
  <div className="flex items-center justify-center py-8 md:py-14">
    <div className="h-px flex-1 bg-gradient-to-r from-transparent to-ink/10" />
    <motion.span
      initial={{ scale: 0.5, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 0.06 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="px-8 md:px-16 font-display text-6xl md:text-8xl italic text-accent"
    >
      {letter}
    </motion.span>
    <div className="h-px flex-1 bg-gradient-to-l from-transparent to-ink/10" />
  </div>
)

/* ──────────────────────── BOTANICAL BREAK (Between About and Skills) ──────────────────────── */
const BotanicalBreak = () => (
  <div className="relative py-16 md:py-24 flex items-center justify-center overflow-hidden">
    {/* Faint background wash */}
    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#2d5a3d]/[0.02] to-transparent" />
    <svg className="relative w-40 md:w-64 opacity-20" viewBox="0 0 200 200" fill="none">
      {/* Central leaf */}
      <path d="M100 15 C 140 50 170 90 100 185 C 30 90 60 50 100 15Z"
        fill="url(#leafGrad1)" stroke="#2d5a3d" strokeWidth="0.8" />
      {/* Vein lines */}
      <line x1="100" y1="25" x2="100" y2="175" stroke="#2d5a3d" strokeWidth="0.5" opacity="0.6" />
      <path d="M100 50 Q 130 60 145 80" stroke="#2d5a3d" strokeWidth="0.4" opacity="0.4" />
      <path d="M100 80 Q 75 90 60 110" stroke="#2d5a3d" strokeWidth="0.4" opacity="0.4" />
      <path d="M100 110 Q 125 115 135 135" stroke="#2d5a3d" strokeWidth="0.4" opacity="0.4" />
      <path d="M100 140 Q 78 145 70 160" stroke="#2d5a3d" strokeWidth="0.4" opacity="0.4" />
      {/* Small secondary leaves */}
      <path d="M100 30 C 120 50 150 60 100 100 C 70 60 90 50 100 30Z"
        fill="url(#leafGrad2)" opacity="0.5" transform="rotate(-30 100 50)" />
      <defs>
        <linearGradient id="leafGrad1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#2d5a3d" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#4a8f5c" stopOpacity="0.1" />
        </linearGradient>
        <linearGradient id="leafGrad2" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#4a8f5c" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#2d5a3d" stopOpacity="0.05" />
        </linearGradient>
      </defs>
    </svg>
    {/* Accent line through center */}
    <div className="absolute left-0 right-0 flex justify-center">
      <div className="w-px h-full bg-gradient-to-b from-transparent via-accent/10 to-transparent" />
    </div>
  </div>
)

/* ──────────────────────── GEOMETRIC PATTERN BAND (Between Skills and Awards) ──────────────────────── */
const GeometricPatternBand = () => (
  <div className="relative h-32 md:h-40 overflow-hidden bg-[#1a3526]">
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1440 160" fill="none" preserveAspectRatio="none">
      {/* Grid pattern */}
      {Array.from({ length: 36 }).map((_, i) => (
        <line key={`v${i}`} x1={i * 40} y1="0" x2={i * 40} y2="160" stroke="#2d5a3d" strokeWidth="0.3" opacity="0.3" />
      ))}
      {Array.from({ length: 5 }).map((_, i) => (
        <line key={`h${i}`} x1="0" y1={i * 40} x2="1440" y2={i * 40} stroke="#2d5a3d" strokeWidth="0.3" opacity="0.3" />
      ))}
      {/* Diamond shapes in alternating cells */}
      {Array.from({ length: 18 }).map((_, i) => (
        <rect key={`d${i}`}
          x={i * 80 + 30} y={i % 2 === 0 ? 10 : 50}
          width="20" height="20" transform={`rotate(45 ${i * 80 + 40} ${i % 2 === 0 ? 20 : 60})`}
          fill="#4a8f5c" opacity={i % 3 === 0 ? '0.25' : i % 3 === 1 ? '0.15' : '0.08'} />
      ))}
      {/* Large decorative circles */}
      <circle cx="200" cy="80" r="50" stroke="#4a8f5c" strokeWidth="0.5" opacity="0.15" />
      <circle cx="720" cy="80" r="60" stroke="#4a8f5c" strokeWidth="0.5" opacity="0.12" />
      <circle cx="1240" cy="80" r="45" stroke="#4a8f5c" strokeWidth="0.5" opacity="0.15" />
      {/* Flowing wave */}
      <path d="M0 100 Q 360 40, 720 100 Q 1080 160, 1440 100" stroke="#4a8f5c" strokeWidth="1" opacity="0.2" />
      <path d="M0 110 Q 360 50, 720 110 Q 1080 170, 1440 110" stroke="#2d5a3d" strokeWidth="0.5" opacity="0.15" />
    </svg>
    {/* Center text overlay */}
    <div className="absolute inset-0 flex items-center justify-center">
      <span className="text-[#f5f5f0]/30 text-[0.6rem] font-heading font-semibold tracking-[0.3em] uppercase">
        Craft &middot; Code &middot; Create
      </span>
    </div>
    {/* Top/bottom accent lines */}
    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#4a8f5c]/30 to-transparent" />
    <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#4a8f5c]/30 to-transparent" />
  </div>
)

/* ──────────────────────── DECORATIVE EMBLEM (Between Awards and Education) ──────────────────────── */
const DecorativeEmblem = () => (
  <div className="relative py-16 md:py-20 flex items-center justify-center overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#2d5a3d]/[0.015] to-transparent" />
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 0.25 }}
      viewport={{ once: true }}
      transition={{ duration: 1 }}
      className="relative"
    >
      <svg className="w-28 md:w-40" viewBox="0 0 120 120" fill="none">
        {/* Outer circle with dashed ring */}
        <circle cx="60" cy="60" r="55" stroke="#2d5a3d" strokeWidth="0.8" strokeDasharray="3 5" />
        <circle cx="60" cy="60" r="48" stroke="#4a8f5c" strokeWidth="0.5" />
        <circle cx="60" cy="60" r="42" stroke="#2d5a3d" strokeWidth="0.3" />
        {/* Star / compass */}
        <path d="M60 18 L64 52 L98 60 L64 68 L60 102 L56 68 L22 60 L56 52Z"
          fill="#2d5a3d" opacity="0.2" stroke="#2d5a3d" strokeWidth="0.5" />
        {/* Inner diamond */}
        <rect x="48" y="48" width="24" height="24" transform="rotate(45 60 60)"
          stroke="#4a8f5c" strokeWidth="0.6" fill="#4a8f5c" fillOpacity="0.08" />
        {/* Center dot */}
        <circle cx="60" cy="60" r="3" fill="#2d5a3d" opacity="0.3" />
        {/* Cardinal tick marks */}
        {[0, 90, 180, 270].map((angle, i) => (
          <line key={i}
            x1={60 + 38 * Math.cos(angle * Math.PI / 180)}
            y1={60 + 38 * Math.sin(angle * Math.PI / 180)}
            x2={60 + 44 * Math.cos(angle * Math.PI / 180)}
            y2={60 + 44 * Math.sin(angle * Math.PI / 180)}
            stroke="#2d5a3d" strokeWidth="1" />
        ))}
      </svg>
      <div className="absolute -top-2 -left-2 w-3 h-3 border-t border-l border-accent/20" />
      <div className="absolute -bottom-2 -right-2 w-3 h-3 border-b border-r border-accent/20" />
    </motion.div>
    {/* Horizontal accent lines from emblem */}
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-40 md:w-80 h-px bg-gradient-to-r from-transparent via-accent/10 to-transparent" />
  </div>
)

/* ──────────────────────── SECTION NAV DOTS ──────────────────────── */
const SectionNav = () => {
  const sections = [
    { id: 'about', label: 'About' },
    { id: 'skills', label: 'Skills' },
    { id: 'values', label: 'Values' },
    { id: 'awards', label: 'Awards' },
    { id: 'tools', label: 'Tools' },
    { id: 'education', label: 'Education' },
    { id: 'contact', label: 'Contact' },
  ]
  const [active, setActive] = useState(sections[0].id)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting)
        if (visible.length > 0) setActive(visible[0].target.id)
      },
      { rootMargin: '-40% 0px -40% 0px' }
    )
    sections.forEach((s) => {
      const el = document.getElementById(s.id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  return (
    <div className="fixed right-4 md:right-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col gap-3 items-center">
      {sections.map((s) => (
        <button
          key={s.id}
          onClick={() => document.getElementById(s.id)?.scrollIntoView({ behavior: 'smooth' })}
          className="group flex items-center gap-2"
          title={s.label}
        >
          <span className="page-number opacity-0 group-hover:opacity-100 transition-opacity text-[0.55rem] tracking-wider">
            {s.label}
          </span>
          <motion.span
            className={`block rounded-full transition-all duration-300 ${
              active === s.id ? 'bg-accent w-2 h-2' : 'bg-ink-faint/30 w-1.5 h-1.5 group-hover:bg-ink-faint/60'
            }`}
            whileHover={{ scale: 1.5 }}
          />
        </button>
      ))}
    </div>
  )
}

/* ──────────────────────── ABOUT ──────────────────────── */
const About = () => {
  const { t, isRTL } = useLanguage()
  const profile = t('profile')

  const getGreeting = () => {
    const now = new Date()
    const options = { timeZone: 'Africa/Cairo', hour: 'numeric', hour12: false }
    const hour = parseInt(new Intl.DateTimeFormat('en-US', options).format(now))
    if (hour < 12) return 'Good Morning'
    if (hour < 17) return 'Good Afternoon'
    return 'Good Evening'
  }

  return (
    <section id="about" className="relative py-28 md:py-40 px-6 md:px-12">
      <div className="absolute left-6 md:left-12 top-0 bottom-0 w-px bg-ink/5" />
      <div className="absolute right-6 md:right-12 top-0 bottom-0 w-px bg-ink/5" />

      {/* Decorative sidebar imagery on wide screens */}
      <div className="hidden lg:block absolute left-0 top-0 bottom-0 w-24 pointer-events-none select-none opacity-[0.04]">
        <svg className="absolute top-20 left-2" viewBox="0 0 40 40" fill="none" stroke="#2d5a3d" strokeWidth="1">
          <circle cx="20" cy="14" r="8" />
          <path d="M6 36c0-8 6-14 14-14s14 6 14 14" />
        </svg>
      </div>

      {/* Greeting watermark */}
      <div className="absolute top-10 right-6 md:right-20 opacity-[0.03] font-display text-[6rem] md:text-[10rem] font-bold italic select-none pointer-events-none">
        {getGreeting().split(' ')[0]}
      </div>

      <div className="relative mx-auto max-w-7xl">
        <div className="grid grid-cols-12 gap-12 md:gap-20">
          {/* Section label */}
          <div className="col-span-12 md:col-span-3 lg:col-span-2">
            <AnimatedSection>
              <span className="section-number">02</span>
              <p className="page-number mt-2">{t('aboutLabel')}</p>
            </AnimatedSection>
          </div>

          <div className="col-span-12 md:col-span-9 lg:col-span-10">
            <div className="grid md:grid-cols-5 gap-12 md:gap-16">
              {/* Left: Editorial portrait + highlights */}
              <div className="md:col-span-2">
                <AnimatedSection delay={0.2}>
                  <div className="relative">
                    {/* Elapsed editorial portrait panel */}
                    <div className="aspect-[4/5] bg-paper-dark flex items-center justify-center border border-ink/5 overflow-hidden relative">
                      {/* Diagonal gradient lines */}
                      <svg className="absolute inset-0 w-full h-full opacity-[0.06]" viewBox="0 0 100 125" preserveAspectRatio="none">
                        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
                          <line key={i} x1={i * 10 - 20} y1="125" x2={i * 10 + 30} y2="0"
                            stroke="#2d5a3d" strokeWidth="1.5" />
                        ))}
                      </svg>
                      {/* Gradient wash */}
                      <div className="absolute inset-0 bg-gradient-to-br from-[#2d5a3d]/[0.05] via-transparent to-[#4a8f5c]/[0.08]" />
                      {/* Corner ornaments */}
                      <svg className="absolute top-3 left-3 w-8 h-8 opacity-20" viewBox="0 0 32 32" fill="none">
                        <path d="M0 0h12v2H2v10H0V0z" fill="#2d5a3d" />
                        <circle cx="18" cy="18" r="2" fill="#2d5a3d" />
                      </svg>
                      <svg className="absolute bottom-3 right-3 w-8 h-8 opacity-20" viewBox="0 0 32 32" fill="none">
                        <path d="M32 32H20v-2h10V20h2v12z" fill="#2d5a3d" />
                        <circle cx="14" cy="14" r="2" fill="#2d5a3d" />
                      </svg>
                      {/* Center YS monogram */}
                      <div className="text-center relative z-10">
                        <span className="block text-[5rem] font-bold font-display italic bg-gradient-to-br from-[#2d5a3d] to-[#4a8f5c] bg-clip-text text-transparent leading-none select-none">YS</span>
                        <div className="w-16 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent mx-auto my-6" />
                        <p className="page-number text-accent/30">Est. {new Date().getFullYear() - 4}</p>
                      </div>
                      {/* Pulsing vignette */}
                      <motion.div
                        className="absolute inset-0"
                        animate={{ opacity: [0, 0.15, 0] }}
                        transition={{ duration: 6, repeat: Infinity }}
                        style={{ background: 'radial-gradient(ellipse at center, transparent 30%, rgba(45,90,61,0.06) 100%)' }}
                      />
                    </div>
                    {/* Decorative border corners */}
                    <div className="absolute -top-2 -left-2 w-6 h-6 border-t-2 border-l-2 border-accent/20" />
                    <div className="absolute -top-2 -right-2 w-6 h-6 border-t-2 border-r-2 border-accent/20" />
                    <div className="absolute -bottom-2 -left-2 w-6 h-6 border-b-2 border-l-2 border-accent/20" />
                    <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b-2 border-r-2 border-accent/20" />
                  </div>
                </AnimatedSection>

                {/* Highlights */}
                <AnimatedSection delay={0.6}>
                  <div className="mt-8 space-y-3">
                    {profile.highlights.map((item, i) => (
                      <motion.div
                        key={item}
                        initial={{ opacity: 0, x: -8 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.08 }}
                        className="flex items-start gap-3"
                      >
                        <span className="w-1.5 h-1.5 bg-accent/60 mt-1.5 flex-shrink-0" />
                        <span className="text-sm text-ink-light font-light">{item}</span>
                      </motion.div>
                    ))}
                  </div>
                </AnimatedSection>
              </div>

              {/* Right: bio + languages + quick facts */}
              <div className="md:col-span-3 space-y-8">
                <AnimatedSection delay={0.3}>
                  <h2 className="text-3xl md:text-4xl lg:text-5xl leading-tight">
                    <span className="italic font-italic text-accent">Creativity</span>
                    <br />meets code
                  </h2>
                </AnimatedSection>

                <MaskReveal delay={0.5}>
                  <p className="text-ink-light text-base leading-relaxed font-light">
                    {profile.summary}
                  </p>
                </MaskReveal>

                {/* Quick Facts row */}
                <AnimatedSection delay={0.6}>
                  <div className="flex flex-wrap gap-3 pt-2">
                    {[
                      { icon: (
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3v4l3 3" />
                        </svg>
                      ), text: `${getGreeting()}` },
                      { icon: (
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <circle cx="12" cy="12" r="10" />
                          <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                        </svg>
                      ), text: 'UTC+2 Cairo' },
                      { icon: (
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                          <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                      ), text: `Age ~22` },
                    ].map((fact) => (
                      <span key={fact.text} className="inline-flex items-center gap-2 px-3 py-2 bg-white border border-ink/8 text-xs text-ink-light font-light rounded-sm">
                        {fact.icon}
                        {fact.text}
                      </span>
                    ))}
                  </div>
                </AnimatedSection>

                {/* Languages bar */}
                <AnimatedSection delay={0.7}>
                  <div className="border-t border-ink/5 pt-6">
                    <p className="section-number mb-4">Languages</p>
                    <div className="flex gap-3">
                      {[
                        { name: 'Arabic', color: 'bg-ink' },
                        { name: 'English', color: 'bg-ink' },
                        { name: 'French', color: 'bg-ink' },
                      ].map((lang) => (
                        <div key={lang.name} className="flex-1">
                          <div className="h-1 bg-paper-dark mb-1.5">
                            <motion.div
                              initial={{ width: 0 }}
                              whileInView={{ width: '100%' }}
                              viewport={{ once: true }}
                              transition={{ duration: 1, delay: 0.5 }}
                              className={`h-1 ${lang.color}`}
                            />
                          </div>
                          <p className="page-number">{lang.name}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </AnimatedSection>

                {/* Education mini-card */}
                <AnimatedSection delay={0.8}>
                  <a href="#education" className="group flex items-start gap-4 p-4 bg-paper-dark border border-ink/5 hover:border-accent/30 transition-colors duration-300 cursor-pointer">
                    <svg className="w-5 h-5 text-accent mt-0.5 flex-shrink-0 group-hover:text-accent-deep transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M12 14l9-5-9-5-9 5 9 5z" />
                      <path d="M12 14l6.16-3.422A12.083 12.083 0 0 1 21.16 14 12.083 12.083 0 0 1 12 17.578 12.083 12.083 0 0 1 2.84 14 12.083 12.083 0 0 1 12 14z" />
                      <path d="M6 9v3a6 6 0 0 0 12 0V9" />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-ink group-hover:text-accent transition-colors">Dual Bachelor&apos;s Degrees</p>
                      <p className="text-xs text-ink-faint font-light mt-1">BUE + University of the People &rarr;</p>
                    </div>
                  </a>
                </AnimatedSection>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative pull-quote */}
      <div className="mt-24 md:mt-32 text-center">
        <AnimatedSection>
          <p className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-italic italic text-ink/15 leading-tight max-w-4xl mx-auto">
            &ldquo;The best work lives where disciplines collide.&rdquo;
          </p>
        </AnimatedSection>
      </div>
    </section>
  )
}

/* ──────────────────────── SKILLS ──────────────────────── */
const Skills = () => {
  const { t } = useLanguage()
  const profile = t('profile')

  const toolTags = [
    'Photoshop', 'DaVinci Resolve', 'Premiere Pro', 'Krita',
    'Affinity Photo', 'Affinity Designer', 'Affinity Publisher',
    'GIMP', 'Sony Vegas', 'Paint Tool SAI', 'Illustrator', 'Figma',
  ]

  const skillLevels = [92, 88, 95, 85]

  return (
    <ColoredPanel variant="sage" className="!py-0 !px-0">
    <section id="skills" className="relative py-28 md:py-40 px-6 md:px-12">
      <div className="absolute left-6 md:left-12 top-0 bottom-0 w-px bg-ink/5" />
      <div className="absolute right-6 md:right-12 top-0 bottom-0 w-px bg-ink/5" />

      {/* Decorative sidebar imagery */}
      <div className="hidden lg:block absolute left-0 top-0 bottom-0 w-24 pointer-events-none select-none opacity-[0.04]">
        <svg className="absolute top-20 left-3" viewBox="0 0 40 40" fill="none" stroke="#2d5a3d" strokeWidth="1">
          <path d="M14 6h4v10H14zM24 12h4v24h-4zM24 6l8 6-8 6z" />
          <path d="M6 20h28" strokeWidth="0.5" />
        </svg>
      </div>

      <div className="relative mx-auto max-w-7xl">
        <div className="grid grid-cols-12 gap-12 md:gap-20">
          <div className="col-span-12 md:col-span-3 lg:col-span-2">
            <AnimatedSection>
              <span className="section-number">03</span>
              <p className="page-number mt-2">{t('capabilities')}</p>
            </AnimatedSection>
          </div>

          <div className="col-span-12 md:col-span-9 lg:col-span-10">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-14 gap-4">
              <AnimatedSection delay={0.1}>
                <h2 className="text-3xl md:text-4xl lg:text-5xl">{t('skillsTitle')}</h2>
              </AnimatedSection>
              <AnimatedSection delay={0.2}>
                <p className="page-number text-right md:text-left">
                  Proficiency across {profile.skills.length} domains
                </p>
              </AnimatedSection>
            </div>

            {/* Skills as editorial list */}
            <div className="grid gap-px bg-ink/5">
              {profile.skills.map((skill, i) => (
                <AnimatedSection key={skill.title} delay={i * 0.12}>
                  <div className="bg-paper p-8 md:p-10 group hover:bg-white transition-colors duration-500">
                    <div className="flex flex-col md:flex-row md:items-start gap-6">
                      <div className="flex items-start gap-4 md:min-w-[200px]">
                        <span className="page-number mt-1">{String(i + 1).padStart(2, '0')}</span>
                        <div className="flex-1">
                          <h3 className="text-lg font-heading font-semibold text-ink mb-2">{skill.title}</h3>
                          {/* Progress bar */}
                          <div className="h-1 bg-paper-dark w-full md:w-32">
                            <motion.div
                              className="h-full bg-accent/60"
                              initial={{ width: 0 }}
                              whileInView={{ width: `${skillLevels[i] || 80}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 1.2, delay: 0.3 + i * 0.1 }}
                            />
                          </div>
                        </div>
                      </div>
                      <ul className="space-y-2 flex-1">
                        {skill.items.map((item) => (
                          <li key={item} className="text-sm text-ink-light font-light leading-relaxed pl-6 relative before:absolute before:left-0 before:top-2.5 before:w-1 before:h-1 before:bg-accent/40 before:rounded-full">
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>

            {/* Tools tag grid */}
            <AnimatedSection delay={0.7}>
              <div className="mt-12">
                <p className="section-number mb-4">Tools &amp; Software</p>
                <div className="flex flex-wrap gap-2">
                  {toolTags.map((tool, i) => (
                    <motion.span
                      key={tool}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.03 }}
                      className="px-3 py-1.5 bg-white border border-ink/8 text-xs font-light text-ink-light hover:border-accent/40 hover:text-accent hover:bg-accent/[0.03] transition-all duration-300 cursor-default"
                    >
                      {tool}
                    </motion.span>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </section>
    </ColoredPanel>
  )
}

/* ──────────────────────── VALUES ──────────────────────── */
const Values = () => {
  const { t } = useLanguage()

  const values = [
    {
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5" />
          <path d="M2 12l10 5 10-5" />
        </svg>
      ),
      title: 'Interdisciplinary Thinking',
      desc: 'Blending art and technology, design and code, to create solutions that neither could achieve alone.',
    },
    {
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M8 14s1.5 2 4 2 4-2 4-2" />
          <line x1="9" y1="9" x2="9.01" y2="9" />
          <line x1="15" y1="9" x2="15.01" y2="9" />
        </svg>
      ),
      title: 'Empathy-Driven Design',
      desc: 'Every pixel serves a person. Understanding the audience is the starting point, never an afterthought.',
    },
    {
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
      ),
      title: 'Relentless Craft',
      desc: 'From film editing to code reviews, the details carry the weight. Precision is not optional.',
    },
    {
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
          <line x1="12" y1="22.08" x2="12" y2="12" />
        </svg>
      ),
      title: 'Open Collaboration',
      desc: 'The best ideas emerge from shared spaces. Languages, cultures, disciplines &mdash; all are welcome.',
    },
  ]

  return (
    <section id="values" className="relative py-28 md:py-40 px-6 md:px-12">
      <div className="absolute left-6 md:left-12 top-0 bottom-0 w-px bg-ink/5" />
      <div className="absolute right-6 md:right-12 top-0 bottom-0 w-px bg-ink/5" />

      <div className="relative mx-auto max-w-7xl">
        <div className="grid grid-cols-12 gap-12 md:gap-20">
          <div className="col-span-12 md:col-span-3 lg:col-span-2">
            <AnimatedSection>
              <span className="section-number">04</span>
              <p className="page-number mt-2">Values</p>
              <p className="page-number mt-1">Core beliefs</p>
            </AnimatedSection>
          </div>

          <div className="col-span-12 md:col-span-9 lg:col-span-10">
            <AnimatedSection delay={0.1}>
              <h2 className="text-3xl md:text-4xl lg:text-5xl mb-4">Guiding <span className="italic font-italic text-accent">Principles</span></h2>
            </AnimatedSection>
            <AnimatedSection delay={0.2}>
              <p className="text-ink-light font-light leading-relaxed max-w-xl mb-14">
                The compass that shapes every project, every line of code, and every design decision.
              </p>
            </AnimatedSection>

            <div className="grid sm:grid-cols-2 gap-4 md:gap-6">
              {values.map((v, i) => (
                <AnimatedSection key={v.title} delay={0.15 + i * 0.1}>
                  <motion.div
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.3 }}
                    className="editorial-card p-8 md:p-10 flex flex-col gap-4 group"
                  >
                    <div className="text-accent/60 group-hover:text-accent transition-colors duration-300">
                      {v.icon}
                    </div>
                    <h3 className="text-lg font-heading font-semibold text-ink">{v.title}</h3>
                    <p className="text-sm text-ink-light font-light leading-relaxed">{v.desc}</p>
                  </motion.div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ──────────────────────── AWARDS ──────────────────────── */
const Awards = () => {
  const { t } = useLanguage()
  const profile = t('profile')

  return (
    <section id="awards" className="relative py-28 md:py-40 px-6 md:px-12">
      <div className="absolute left-6 md:left-12 top-0 bottom-0 w-px bg-ink/5" />
      <div className="absolute right-6 md:right-12 top-0 bottom-0 w-px bg-ink/5" />

      {/* Decorative sidebar imagery */}
      <div className="hidden lg:block absolute left-0 top-0 bottom-0 w-24 pointer-events-none select-none opacity-[0.04]">
        <svg className="absolute top-20 left-3" viewBox="0 0 40 40" fill="none" stroke="#2d5a3d" strokeWidth="1">
          <path d="M12 15l8-10 8 10-8 5-8-5z" />
          <path d="M8 17h24v10c0 3-3 6-6 6H14c-3 0-6-3-6-6V17z" />
          <rect x="17" y="27" width="6" height="6" />
          <rect x="13" y="33" width="14" height="3" rx="1" />
        </svg>
      </div>

      {/* Large watermark */}
      <div className="absolute bottom-10 right-8 md:right-20 opacity-[0.025] font-heading text-[10rem] font-bold leading-none select-none pointer-events-none">
        05
      </div>

      <div className="relative mx-auto max-w-7xl">
        <div className="grid grid-cols-12 gap-12 md:gap-20">
          <div className="col-span-12 md:col-span-3 lg:col-span-2">
            <AnimatedSection>
              <span className="section-number">05</span>
              <p className="page-number mt-2">{t('recognition')}</p>
            </AnimatedSection>
          </div>

          <div className="col-span-12 md:col-span-9 lg:col-span-10">
            <AnimatedSection delay={0.1}>
              <h2 className="text-3xl md:text-4xl lg:text-5xl mb-4">{t('awardsTitle')}</h2>
            </AnimatedSection>
            <AnimatedSection delay={0.2}>
              <p className="text-ink-light font-light leading-relaxed max-w-2xl mb-14">
                Milestones along the journey &mdash; from early competition wins to professional certifications that validate years of continuous growth across languages, business, and creative fields.
              </p>
            </AnimatedSection>

            <div className="space-y-0">
              {profile.awards.map((award, i) => {
                const isIelts = award.name.toLowerCase().includes('ielts')
                return (
                  <AnimatedSection key={award.name} delay={i * 0.08}>
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      className={`group py-6 border-b transition-colors duration-300 ${
                        isIelts
                          ? 'border-accent/30 bg-accent/[0.02] -mx-4 px-4 rounded-sm'
                          : 'border-ink/5 hover:border-accent/20'
                      }`}
                    >
                      <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-2">
                        <div className="flex items-start gap-4">
                          {isIelts && (
                            <span className="text-lg mt-0.5">
                              <svg className="w-5 h-5 text-accent" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                              </svg>
                            </span>
                          )}
                          <span className={`page-number mt-1 ${isIelts ? 'text-accent/70' : 'opacity-40 group-hover:opacity-100 transition-opacity'}`}>
                            {String(i + 1).padStart(2, '0')}
                          </span>
                          <div>
                            <h4 className={`text-lg md:text-xl font-medium transition-colors ${
                              isIelts ? 'text-accent font-semibold' : 'text-ink group-hover:text-accent'
                            }`}>
                              {award.name}
                            </h4>
                            {isIelts && (
                              <p className="text-xs text-accent/60 font-light mt-1">Highest recognition &mdash; exceptional English proficiency</p>
                            )}
                          </div>
                        </div>
                        <span className={`page-number flex-shrink-0 ${isIelts ? 'text-accent/60' : ''}`}>{award.year}</span>
                      </div>
                    </motion.div>
                  </AnimatedSection>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ──────────────────────── TOOLS & SOFTWARE ──────────────────────── */
const ToolsSection = () => {
  const { t } = useLanguage()

  const toolCategories = [
    {
      category: 'Visual Design',
      tools: [
        { name: 'Affinity Photo', role: 'Photo Editing' },
        { name: 'Adobe Photoshop', role: 'Image Manipulation' },
        { name: 'Affinity Designer', role: 'Vector Graphics' },
        { name: 'Affinity Publisher', role: 'Layout Design' },
        { name: 'GIMP', role: 'Open-Source Editing' },
      ],
    },
    {
      category: 'Video & Motion',
      tools: [
        { name: 'DaVinci Resolve', role: 'Color & Editing' },
        { name: 'Adobe Premiere', role: 'Video Editing' },
        { name: 'Sony Vegas', role: 'Timeline Editing' },
        { name: 'Krita', role: 'Animation & Painting' },
      ],
    },
    {
      category: 'Digital Art',
      tools: [
        { name: 'Krita', role: 'Digital Painting' },
        { name: 'Paint Tool SAI', role: 'Illustration' },
        { name: 'Affinity Photo', role: 'Compositing' },
      ],
    },
  ]

  return (
    <section id="tools" className="relative py-28 md:py-40 px-6 md:px-12">
      <div className="absolute inset-0 bg-paper-dark pointer-events-none" />
      <div className="absolute left-6 md:left-12 top-0 bottom-0 w-px bg-ink/5" />
      <div className="absolute right-6 md:right-12 top-0 bottom-0 w-px bg-ink/5" />

      <div className="relative mx-auto max-w-7xl">
        <div className="grid grid-cols-12 gap-12 md:gap-20">
          <div className="col-span-12 md:col-span-3 lg:col-span-2">
            <AnimatedSection>
              <span className="section-number">06</span>
              <p className="page-number mt-2">Toolkit</p>
            </AnimatedSection>
          </div>

          <div className="col-span-12 md:col-span-9 lg:col-span-10">
            <AnimatedSection delay={0.1}>
              <h2 className="text-3xl md:text-4xl lg:text-5xl mb-4">Tools &amp; <span className="italic font-italic text-accent">Software</span></h2>
            </AnimatedSection>
            <AnimatedSection delay={0.2}>
              <p className="text-ink-light font-light leading-relaxed max-w-2xl mb-14">
                The creative arsenal &mdash; industry-standard tools and beloved open-source alternatives used daily to bring ideas to life.
              </p>
            </AnimatedSection>

            <div className="space-y-12">
              {toolCategories.map((cat, ci) => (
                <AnimatedSection key={cat.category} delay={0.3 + ci * 0.15}>
                  <div>
                    <p className="page-number mb-4">{cat.category}</p>
                    <div className="flex flex-wrap gap-2">
                      {cat.tools.map((tool, ti) => (
                        <motion.div
                          key={tool.name}
                          initial={{ opacity: 0, y: 10 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: ti * 0.05 }}
                          className="group flex items-center gap-3 px-4 py-3 bg-white border border-ink/6 hover:border-accent/30 transition-all duration-300"
                        >
                          <div className="w-2 h-2 bg-accent/40 group-hover:bg-accent transition-colors" />
                          <div>
                            <p className="text-sm font-medium text-ink group-hover:text-accent transition-colors">{tool.name}</p>
                            <p className="text-[0.6rem] text-ink-faint font-light">{tool.role}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>

            {/* All tags cloud */}
            <AnimatedSection delay={0.8}>
              <div className="mt-12 pt-8 border-t border-ink/5">
                <p className="page-number mb-4">Complete Tag Cloud</p>
                <div className="flex flex-wrap gap-x-4 gap-y-2">
                  {[
                    'Photoshop', 'Premiere', 'DaVinci Resolve', 'Krita', 'SAI',
                    'Affinity Designer', 'Affinity Photo', 'Affinity Publisher',
                    'GIMP', 'Sony Vegas', 'HTML', 'CSS', 'JavaScript',
                    'React', 'Python', 'Git', 'VS Code', 'Figma',
                    'Canva', 'Lightroom', 'After Effects', 'Blender',
                  ].map((tool, i) => {
                    const sizes = ['text-xs', 'text-sm', 'text-xs', 'text-base', 'text-xs']
                    const opacities = ['text-ink-light/50', 'text-ink-light/70', 'text-ink-light/40', 'text-ink-light', 'text-ink-light/60']
                    return (
                      <motion.span
                        key={tool}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.02 }}
                        className={`${sizes[i % 5]} ${opacities[i % 5]} hover:text-accent transition-colors cursor-default font-light`}
                      >
                        {tool}
                      </motion.span>
                    )
                  })}
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ──────────────────────── INTERESTS ──────────────────────── */
const Interests = () => {
  const { t } = useLanguage()

  const interests = [
    'Visual Storytelling', 'Creative Coding', 'Film & Cinema',
    'Typography', 'Brand Strategy', 'UI/UX Design',
    'Motion Graphics', 'Digital Art', 'Interactive Media',
    'Marketing Psychology', 'User Research', 'Content Strategy',
    'AI & Creativity', 'Photography', 'Open Source',
    'Multilingual Communication', 'Cultural Design', 'Data Visualization',
  ]

  return (
    <section id="interests" className="relative py-28 md:py-32 px-6 md:px-12">
      <div className="absolute left-6 md:left-12 top-0 bottom-0 w-px bg-ink/5" />
      <div className="absolute right-6 md:right-12 top-0 bottom-0 w-px bg-ink/5" />

      <div className="relative mx-auto max-w-7xl">
        <div className="grid grid-cols-12 gap-12 md:gap-20">
          <div className="col-span-12 md:col-span-3 lg:col-span-2">
            <AnimatedSection>
              <span className="section-number">07</span>
              <p className="page-number mt-2">Interests</p>
            </AnimatedSection>
          </div>

          <div className="col-span-12 md:col-span-9 lg:col-span-10">
            <AnimatedSection delay={0.1}>
              <h2 className="text-3xl md:text-4xl lg:text-5xl mb-4">Areas of <span className="italic font-italic text-accent">Interest</span></h2>
            </AnimatedSection>
            <AnimatedSection delay={0.2}>
              <p className="text-ink-light font-light leading-relaxed max-w-2xl mb-14">
                The topics, disciplines, and creative territories I return to again and again &mdash; each one a source of inspiration and growth.
              </p>
            </AnimatedSection>

            <div className="flex flex-wrap gap-2 md:gap-3">
              {interests.map((interest, i) => (
                <motion.span
                  key={interest}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.03 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="px-4 py-2 border border-ink/10 text-sm text-ink-light font-light hover:border-accent/40 hover:text-accent hover:bg-accent/[0.03] transition-all duration-300 cursor-default"
                >
                  {interest}
                </motion.span>
              ))}
            </div>

            {/* Mini testimonial */}
            <AnimatedSection delay={0.6}>
              <div className="mt-16 p-8 md:p-10 bg-white border border-ink/6">
                <svg className="w-8 h-8 text-accent/20 mb-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                <p className="text-lg md:text-xl font-italic italic text-ink-light/70 leading-relaxed">
                  &ldquo;Design is not just what it looks like and feels like. Design is how it works.&rdquo;
                </p>
                <p className="mt-4 page-number">&mdash; Steve Jobs</p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ──────────────────────── EDUCATION ──────────────────────── */
const Education = () => {
  const { t } = useLanguage()
  const profile = t('profile')

  return (
    <section id="education" className="relative py-28 md:py-40 px-6 md:px-12">
      <div className="absolute inset-0 bg-paper-dark pointer-events-none" />
      <div className="absolute left-6 md:left-12 top-0 bottom-0 w-px bg-ink/5" />
      <div className="absolute right-6 md:right-12 top-0 bottom-0 w-px bg-ink/5" />

      {/* Decorative sidebar imagery */}
      <div className="hidden lg:block absolute left-0 top-0 bottom-0 w-24 pointer-events-none select-none opacity-[0.04]">
        <svg className="absolute top-20 left-3" viewBox="0 0 40 40" fill="none" stroke="#2d5a3d" strokeWidth="1">
          <path d="M20 4L4 14l16 10 16-10L20 4z" />
          <path d="M8 17v11c0 3 5 5 12 5s12-2 12-5V17" />
          <path d="M32 17v8" />
        </svg>
      </div>

      <div className="relative mx-auto max-w-7xl">
        <div className="grid grid-cols-12 gap-12 md:gap-20">
          <div className="col-span-12 md:col-span-3 lg:col-span-2">
            <AnimatedSection>
              <span className="section-number">08</span>
              <p className="page-number mt-2">{t('educationLabel')}</p>
            </AnimatedSection>
          </div>

          <div className="col-span-12 md:col-span-9 lg:col-span-10">
            <AnimatedSection delay={0.1}>
              <h2 className="text-3xl md:text-4xl lg:text-5xl mb-4">{t('educationTitle')}</h2>
            </AnimatedSection>
            <AnimatedSection delay={0.2}>
              <p className="text-ink-light font-light leading-relaxed max-w-2xl mb-14">
                Two complementary degrees spanning creative communication and technical problem-solving &mdash; a deliberate pairing for integrated expertise.
              </p>
            </AnimatedSection>

            <div className="grid md:grid-cols-2 gap-6">
              {profile.education.map((item, i) => (
                <AnimatedSection key={item.degree} delay={i * 0.15}>
                  <motion.div
                    whileHover={{ y: -3 }}
                    className="editorial-card p-8 md:p-10"
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <span className="section-number">{String(i + 1).padStart(2, '0')}</span>
                      <span className="page-number">{item.period}</span>
                    </div>
                    <h3 className="text-xl md:text-2xl text-ink mb-3 leading-tight">{item.degree}</h3>
                    <p className="text-sm text-ink-faint font-light">{item.institution}</p>
                    {item.location && (
                      <p className="text-xs text-ink-faint/60 mt-2 font-light">{item.location}</p>
                    )}
                    {/* Timeline bar */}
                    <div className="mt-6 h-px bg-ink/5 relative">
                      <motion.div
                        className="absolute left-0 top-0 bottom-0 bg-accent/40"
                        initial={{ width: 0 }}
                        whileInView={{ width: i === 0 ? '80%' : '60%' }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, delay: 0.5 }}
                      />
                    </div>
                  </motion.div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ──────────────────────── VISUAL MOMENTS GALLERY ──────────────────────── */
const VisualMoments = () => {
  const cards = [
    {
      caption: 'Work in Progress',
      sub: 'Iterative design exploration',
      svg: (
        <svg viewBox="0 0 300 200" className="w-full h-full" fill="none">
          <defs>
            <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#1a3526" />
              <stop offset="50%" stopColor="#2d5a3d" />
              <stop offset="100%" stopColor="#4a8f5c" />
            </linearGradient>
          </defs>
          <rect width="300" height="200" fill="#0d1a0f" />
          {/* Overlapping circles with gradient */}
          <circle cx="100" cy="80" r="60" fill="url(#g1)" opacity="0.5" />
          <circle cx="180" cy="100" r="50" fill="url(#g1)" opacity="0.4" />
          <circle cx="150" cy="130" r="45" fill="#2d5a3d" opacity="0.3" />
          {/* Leaf motif */}
          <path d="M220 30 Q 250 60 230 100 Q 200 70 220 30Z" fill="#4a8f5c" opacity="0.3" />
          <path d="M50 140 Q 80 110 90 150 Q 60 170 50 140Z" fill="#2d5a3d" opacity="0.4" />
          {/* Grid lines */}
          {Array.from({ length: 8 }).map((_, i) => (
            <line key={`v${i}`} x1={i * 43} y1="0" x2={i * 43} y2="200" stroke="#2d5a3d" strokeWidth="0.3" opacity="0.2" />
          ))}
          <line x1="0" y1="100" x2="300" y2="100" stroke="#4a8f5c" strokeWidth="0.5" opacity="0.15" />
        </svg>
      ),
    },
    {
      caption: 'Creative Process',
      sub: 'From concept to composition',
      svg: (
        <svg viewBox="0 0 300 200" className="w-full h-full" fill="none">
          <defs>
            <radialGradient id="g2" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0%" stopColor="#4a8f5c" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#0d1a0f" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="g3" x1="0" y1="0" x2="0.3" y2="1">
              <stop offset="0%" stopColor="#2d5a3d" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#1a3526" stopOpacity="0.3" />
            </linearGradient>
          </defs>
          <rect width="300" height="200" fill="#0d1a0f" />
          <circle cx="150" cy="100" r="80" fill="url(#g2)" />
          {/* Concentric rings */}
          {[30, 50, 70, 90].map((r, i) => (
            <circle key={i} cx="150" cy="100" r={r} stroke="#2d5a3d" strokeWidth="0.5" opacity={0.3 - i * 0.05} />
          ))}
          {/* Geometric petals */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
            <ellipse key={i} cx={150 + 35 * Math.cos(angle * Math.PI / 180)} cy={100 + 35 * Math.sin(angle * Math.PI / 180)}
              rx="18" ry="8" fill="url(#g3)" opacity="0.3"
              transform={`rotate(${angle} ${150 + 35 * Math.cos(angle * Math.PI / 180)} ${100 + 35 * Math.sin(angle * Math.PI / 180)})`} />
          ))}
          {/* Center */}
          <circle cx="150" cy="100" r="12" fill="#2d5a3d" opacity="0.5" />
          <circle cx="150" cy="100" r="4" fill="#4a8f5c" opacity="0.8" />
        </svg>
      ),
    },
    {
      caption: 'Botanical Studies',
      sub: 'Nature-inspired geometry',
      svg: (
        <svg viewBox="0 0 300 200" className="w-full h-full" fill="none">
          <rect width="300" height="200" fill="#0d1a0f" />
          {/* Large leaf shape */}
          <path d="M150 20 C 200 50 230 100 150 180 C 70 100 100 50 150 20Z"
            fill="#2d5a3d" opacity="0.25" stroke="#4a8f5c" strokeWidth="0.5" />
          {/* Veins */}
          <line x1="150" y1="30" x2="150" y2="170" stroke="#4a8f5c" strokeWidth="0.5" opacity="0.5" />
          <path d="M150 50 Q 185 65 200 85" stroke="#4a8f5c" strokeWidth="0.4" opacity="0.4" />
          <path d="M150 50 Q 115 65 100 85" stroke="#4a8f5c" strokeWidth="0.4" opacity="0.4" />
          <path d="M150 80 Q 180 95 195 110" stroke="#4a8f5c" strokeWidth="0.4" opacity="0.4" />
          <path d="M150 80 Q 120 95 105 110" stroke="#4a8f5c" strokeWidth="0.4" opacity="0.4" />
          <path d="M150 110 Q 175 125 185 140" stroke="#4a8f5c" strokeWidth="0.4" opacity="0.4" />
          <path d="M150 110 Q 125 125 115 140" stroke="#4a8f5c" strokeWidth="0.4" opacity="0.4" />
          {/* Small surrounding leaves */}
          <path d="M60 30 Q 80 10 90 30 Q 70 50 60 30Z" fill="#4a8f5c" opacity="0.2" />
          <path d="M230 160 Q 250 140 260 160 Q 240 180 230 160Z" fill="#4a8f5c" opacity="0.2" />
          <path d="M40 150 Q 55 135 65 150 Q 50 165 40 150Z" fill="#2d5a3d" opacity="0.25" />
          <path d="M250 50 Q 265 35 275 50 Q 260 65 250 50Z" fill="#2d5a3d" opacity="0.25" />
        </svg>
      ),
    },
    {
      caption: 'Abstract Composition',
      sub: 'Digital canvas explorations',
      svg: (
        <svg viewBox="0 0 300 200" className="w-full h-full" fill="none">
          <defs>
            <linearGradient id="g4" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#1a3526" />
              <stop offset="100%" stopColor="#2d5a3d" />
            </linearGradient>
            <linearGradient id="g5" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#4a8f5c" />
              <stop offset="100%" stopColor="#1a3526" />
            </linearGradient>
          </defs>
          <rect width="300" height="200" fill="#0d1a0f" />
          {/* Flowing curves */}
          <path d="M0 100 C 50 50, 100 150, 150 100 C 200 50, 250 150, 300 100" stroke="#2d5a3d" strokeWidth="1" opacity="0.3" />
          <path d="M0 120 C 60 70, 110 170, 160 120 C 210 70, 260 170, 300 120" stroke="#4a8f5c" strokeWidth="0.5" opacity="0.2" />
          <path d="M0 80 C 70 30, 130 130, 180 80 C 230 30, 270 130, 300 80" stroke="#1a3526" strokeWidth="0.8" opacity="0.2" />
          {/* Abstract rectangles */}
          <rect x="50" y="40" width="60" height="30" rx="2" fill="url(#g4)" opacity="0.4" />
          <rect x="180" y="120" width="80" height="40" rx="2" fill="url(#g5)" opacity="0.3" />
          <rect x="100" y="150" width="40" height="20" rx="2" fill="#2d5a3d" opacity="0.3" />
          {/* Dots grid */}
          {Array.from({ length: 5 }).map((_, row) =>
            Array.from({ length: 8 }).map((_, col) => (
              <circle key={`${row}-${col}`}
                cx={25 + col * 35} cy={30 + row * 35}
                r="1.5" fill="#4a8f5c" opacity={0.1 + (row + col) % 3 * 0.05} />
            ))
          )}
        </svg>
      ),
    },
  ]

  return (
    <ColoredPanel variant="dark" className="!py-0 !px-0">
    <section className="relative py-28 md:py-40 px-6 md:px-12 overflow-hidden">
      {/* Decorative sidebar imagery */}
      <div className="hidden lg:block absolute left-0 top-0 bottom-0 w-24 pointer-events-none select-none opacity-[0.04]">
        <svg className="absolute top-20 left-3" viewBox="0 0 40 40" fill="none" stroke="#2d5a3d" strokeWidth="1">
          <rect x="4" y="4" width="32" height="32" rx="2" />
          <path d="M4 28l10-10 8 8 6-6 8 8" strokeWidth="1.5" />
          <circle cx="14" cy="14" r="4" />
        </svg>
      </div>

      {/* Background wash */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#1a3526]/[0.02] to-transparent pointer-events-none" />

      <div className="relative mx-auto max-w-7xl">
        {/* Section header */}
        <div className="text-center mb-16">
          <AnimatedSection>
            <p className="section-number">Visual Moments</p>
          </AnimatedSection>
          <AnimatedSection delay={0.1}>
            <h2 className="text-3xl md:text-4xl lg:text-5xl mt-2 mb-4">
              Behind the <span className="italic font-italic text-accent">Scenes</span>
            </h2>
          </AnimatedSection>
          <AnimatedSection delay={0.2}>
            <p className="text-ink-light font-light max-w-xl mx-auto">
              Abstract compositions in green &mdash; echoes of the creative process, digital canvases, and botanical inspirations.
            </p>
          </AnimatedSection>
        </div>

        {/* Gallery strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {cards.map((card, i) => (
            <AnimatedSection key={card.caption} delay={0.15 + i * 0.1}>
              <motion.div
                whileHover={{ y: -6, scale: 1.02 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="group relative overflow-hidden border border-ink/5 bg-paper-dark"
              >
                {/* SVG image */}
                <div className="aspect-[3/2] overflow-hidden">
                  {card.svg}
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0d1a0f]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
                {/* Caption */}
                <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <p className="text-[#f5f5f0] text-sm font-heading font-semibold">{card.caption}</p>
                  <p className="text-[#f5f5f0]/50 text-xs font-light mt-0.5">{card.sub}</p>
                </div>
                {/* Caption below (always visible) */}
                <div className="p-3 group-hover:p-4 transition-all duration-300">
                  <p className="text-xs font-heading font-semibold text-ink group-hover:text-accent transition-colors">{card.caption}</p>
                  <p className="text-[0.6rem] text-ink-faint font-light mt-0.5">{card.sub}</p>
                </div>
                {/* Corner accent */}
                <div className="absolute top-2 right-2 w-3 h-3 border-t border-r border-accent/0 group-hover:border-accent/30 transition-colors duration-500" />
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
    </ColoredPanel>
  )
}

/* ──────────────────────── CONTACT ──────────────────────── */
const Contact = () => {
  const { t } = useLanguage()
  const profile = t('profile')

  const socials = [
    {
      name: 'GitHub',
      href: 'https://github.com/yehiasalem',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
        </svg>
      ),
    },
    {
      name: 'LinkedIn',
      href: 'https://linkedin.com/in/yehiahatemsalem',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      ),
    },
  ]

  return (
    <section id="contact" className="relative py-28 md:py-40 px-6 md:px-12">
      <div className="absolute left-6 md:left-12 top-0 bottom-0 w-px bg-ink/5" />
      <div className="absolute right-6 md:right-12 top-0 bottom-0 w-px bg-ink/5" />

      {/* Decorative sidebar imagery */}
      <div className="hidden lg:block absolute left-0 top-0 bottom-0 w-24 pointer-events-none select-none opacity-[0.04]">
        <svg className="absolute top-20 left-3" viewBox="0 0 40 40" fill="none" stroke="#2d5a3d" strokeWidth="1">
          <rect x="3" y="8" width="34" height="24" rx="2" />
          <path d="M3 8l17 14L37 8" />
          <line x1="3" y1="32" x2="37" y2="32" />
        </svg>
      </div>

      {/* Large watermark */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.02] font-heading text-[16rem] md:text-[24rem] font-bold leading-none select-none pointer-events-none whitespace-nowrap">
        Let&apos;s Talk
      </div>

      <div className="relative mx-auto max-w-7xl">
        <div className="grid grid-cols-12 gap-12 md:gap-20">
          <div className="col-span-12 md:col-span-3 lg:col-span-2">
            <AnimatedSection>
              <span className="section-number">09</span>
              <p className="page-number mt-2">{t('contactMe')}</p>
            </AnimatedSection>
          </div>

          <div className="col-span-12 md:col-span-9 lg:col-span-10">
            <AnimatedSection delay={0.1}>
              <h2 className="text-4xl md:text-5xl lg:text-7xl mb-4 leading-none">
                Let&apos;s <span className="italic font-italic text-accent">connect</span>
              </h2>
            </AnimatedSection>
            <AnimatedSection delay={0.2}>
              <p className="page-number mb-4">{t('available')}</p>
            </AnimatedSection>
            <AnimatedSection delay={0.3}>
              <p className="text-ink-light font-light text-lg max-w-xl mb-14 leading-relaxed">
                Whether you have an exciting project in mind, want to collaborate, or simply wish to say hello &mdash; my inbox is always open.
              </p>
            </AnimatedSection>

            {/* Contact cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-ink/5 mb-10">
              {([
                {
                  label: t('email'),
                  value: profile.contact.email,
                  href: `mailto:${profile.contact.email}`,
                  icon: (
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="2" y="4" width="20" height="16" rx="2" />
                      <path d="m22 4-10 8L2 4" />
                    </svg>
                  ),
                },
                {
                  label: t('whatsapp'),
                  value: profile.contact.whatsapp,
                  href: `https://wa.me/${profile.contact.whatsapp.replace(/[^0-9]/g, '')}`,
                  icon: (
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
                    </svg>
                  ),
                },
                {
                  label: t('phone'),
                  value: profile.contact.phone,
                  href: `tel:${profile.contact.phone}`,
                  icon: (
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                  ),
                },
              ]).map(({ label, value, href, icon }) => (
                <AnimatedSection key={label}>
                  <motion.a
                    href={href}
                    target={href.startsWith('http') ? '_blank' : undefined}
                    rel={href.startsWith('http') ? 'noreferrer' : undefined}
                    className="block bg-paper p-8 hover:bg-white transition-colors group"
                    whileHover={{ y: -6, rotate: -0.5 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                  >
                    <div className="flex items-center gap-2 mb-3 text-ink-faint group-hover:text-accent transition-colors">
                      {icon}
                      <p className="page-number">{label}</p>
                    </div>
                    <p className="text-sm text-ink font-light group-hover:text-accent transition-colors break-all">
                      {value}
                    </p>
                  </motion.a>
                </AnimatedSection>
              ))}
            </div>

            {/* Social links */}
            <AnimatedSection delay={0.7}>
              <div className="flex items-center gap-6 mb-8">
                <p className="page-number">Find me on</p>
                {socials.map((s) => (
                  <a
                    key={s.name}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    className="text-ink-faint hover:text-accent transition-colors duration-300"
                    title={s.name}
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </AnimatedSection>

            {/* Why reach out */}
            <AnimatedSection delay={0.6}>
              <div className="pt-8 border-t border-ink/5">
                <p className="section-number mb-3">{t('whyReachOut')}</p>
                <p className="text-ink-light text-sm font-light leading-relaxed max-w-xl">
                  {t('reachOutText')}
                </p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ──────────────────────── FOOTER ──────────────────────── */
const Footer = () => {
  const { t } = useLanguage()
  const profile = t('profile')
  const [showBackToTop, setShowBackToTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 600)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <footer className="relative bg-ink text-paper/70">
      {/* Top accent line */}
      <div className="h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />

      <div className="mx-auto max-w-7xl px-6 md:px-12 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12">
          {/* Brand column */}
          <div className="md:col-span-4">
            <h3 className="font-display text-2xl italic text-white mb-4">Yehia Salem</h3>
            <p className="text-sm text-paper/40 font-light leading-relaxed max-w-xs">
              {t('tagline')}
            </p>
          </div>

          {/* Nav links */}
          <div className="md:col-span-3">
            <p className="section-number mb-4">Navigate</p>
            <div className="space-y-2">
              {[
                { label: 'About', href: '#about' },
                { label: t('skillsTitle'), href: '#skills' },
                { label: t('awardsTitle'), href: '#awards' },
                { label: t('educationTitle'), href: '#education' },
                { label: t('contactMe'), href: '#contact' },
              ].map((link) => (
                <a key={link.label} href={link.href} className="block text-sm text-paper/50 hover:text-accent transition-colors font-light">
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Contact info */}
          <div className="md:col-span-3">
            <p className="section-number mb-4">Contact</p>
            <div className="space-y-2 text-sm font-light text-paper/50">
              <p>{profile.contact.email}</p>
              <p>{profile.contact.whatsapp}</p>
              <p>{profile.contact.phone}</p>
            </div>
          </div>

          {/* Social */}
          <div className="md:col-span-2">
            <p className="section-number mb-4">Social</p>
            <div className="space-y-2">
              <a href="https://github.com/yehiasalem" target="_blank" rel="noreferrer" className="block text-sm text-paper/50 hover:text-accent transition-colors font-light">
                GitHub
              </a>
              <a href="https://linkedin.com/in/yehiahatemsalem" target="_blank" rel="noreferrer" className="block text-sm text-paper/50 hover:text-accent transition-colors font-light">
                LinkedIn
              </a>
              <Link to="/portfolio" className="block text-sm text-paper/50 hover:text-accent transition-colors font-light">
                Portfolio
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 pt-6 border-t border-paper/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[0.65rem] text-paper/30 tracking-wider font-light">
            {t('footerText')} &mdash; {new Date().getFullYear()}
          </p>
          <p className="text-[0.65rem] text-paper/30 tracking-wider font-light">
            {t('precision')}
          </p>
        </div>
      </div>

      {/* Green gradient footer bar with pattern */}
      <div className="relative h-3 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#1a3526] via-[#2d5a3d] to-[#4a8f5c]" />
        {/* Geometric pattern overlay */}
        <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 720 12" preserveAspectRatio="none">
          {Array.from({ length: 30 }).map((_, i) => (
            <rect key={i} x={i * 24 + 6} y="2" width="6" height="8" transform={`rotate(45 ${i * 24 + 9} 6)`}
              fill="#f5f5f0" opacity={i % 3 === 0 ? '0.4' : i % 3 === 1 ? '0.25' : '0.15'} />
          ))}
        </svg>
      </div>

      {/* Back to top */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-6 right-6 z-50 w-12 h-12 bg-ink text-paper flex items-center justify-center border border-paper/10 hover:border-accent hover:text-accent transition-colors duration-300"
            title="Back to top"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="18 15 12 9 6 15" />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>
    </footer>
  )
}

/* ──────────────────────── APP ──────────────────────── */
function App() {
  return (
    <div className="relative min-h-screen text-ink cursor-none page-enter">
      <Cursor />
      <Nav />
      <SectionNav />
      <Hero />
      <Ticker />
      <About />
      <BotanicalBreak />
      <MarqueeStrip />
      <Skills />
      <GeometricPatternBand />
      <DividerText text="CRAFT" />
      <DecorativeBreak letter="A" />
      <Awards />
      <DecorativeEmblem />
      <DividerText text="CREATE" />
      <ToolsSection />
      <Interests />
      <Education />
      <VisualMoments />
      <Contact />
      <Footer />
    </div>
  )
}

export default App
