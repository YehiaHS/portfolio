/**
 * sections/Hero.jsx
 *
 * The full-screen hero section with parallax name, live Cairo clock, and CTA buttons.
 * Self-contained — all helpers (FloatingShapes, HeroBotanicalBg, QuoteBlock, MouseSpotlight) live here.
 */

import { useState, useEffect, useRef, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import { MaskReveal, GlitchText, StaggerContainer, TextCounter } from '../motionEffects.jsx'
import { useLanguage } from '../LanguageContext'
import { getQuotes, translations } from '../i18n'

/* ── Shared fade-up variant ──────────────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
}

const AnimatedSection = ({ children, className = '', delay = 0 }) => {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div ref={ref} initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={fadeUp} transition={{ delay }} className={className}>
      {children}
    </motion.div>
  )
}

/* ── FloatingShapes ──────────────────────────────────────────────────────── */
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
          className="absolute opacity-[0.015]"
          style={{ left: s.x, top: s.y }}
          animate={{ y: [0, -20, 0], rotate: [0, 180, 360] }}
          transition={{ duration: s.duration, repeat: Infinity, delay: s.delay, ease: 'linear' }}
        >
          {s.type === 'circle' && (
            <div className="border border-accent/40 rounded-full" style={{ width: s.size, height: s.size }} />
          )}
          {s.type === 'diamond' && (
            <div className="border border-accent/40 rotate-45" style={{ width: s.size, height: s.size }} />
          )}
          {(s.type === 'triangle' || s.type === 'line') && (
            <div className="bg-accent/20" style={{ width: s.type === 'line' ? 1 : s.size, height: s.size }} />
          )}
        </motion.div>
      ))}
    </div>
  )
}

/* ── HeroBotanicalBg ─────────────────────────────────────────────────────── */
const HeroBotanicalBg = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden">
    <svg className="absolute top-[10%] right-[5%] opacity-[0.03]" width="500" height="600" viewBox="0 0 500 600" fill="none">
      <path d="M250 50 C 350 150 400 300 250 550 C 100 300 150 150 250 50Z" fill="#2d5a3d" />
      <path d="M250 100 C 320 180 350 290 250 500 C 150 290 180 180 250 100Z" fill="#4a8f5c" opacity="0.5" />
      <line x1="250" y1="60" x2="250" y2="530" stroke="#2d5a3d" strokeWidth="0.5" opacity="0.4" />
      {[[250,150,310,190],[250,150,190,190],[250,230,320,265],[250,230,180,265],[250,310,315,345],[250,310,185,345]].map(([x1,y1,x2,y2],i) => (
        <path key={i} d={`M${x1} ${y1} Q ${(x1+x2)/2} ${y1-10} ${x2} ${y2}`} stroke="#2d5a3d" strokeWidth="0.4" opacity="0.3" />
      ))}
    </svg>
    <svg className="absolute bottom-[5%] left-[2%] opacity-[0.025]" width="300" height="300" viewBox="0 0 300 300" fill="none">
      {[[120,50,70,30],[180,250,260,220],[80,200,40,240],[220,80,260,50]].map(([cx,cy,ex,ey],i) => (
        <ellipse key={i} cx={cx} cy={cy} rx={35} ry={18} fill="#2d5a3d" transform={`rotate(${45+i*30} ${cx} ${cy})`} opacity="0.12" />
      ))}
    </svg>
    <svg className="absolute top-[30%] left-0 w-full opacity-[0.02]" viewBox="0 0 1440 100" fill="none">
      <path d="M0 50 Q 360 10, 720 50 Q 1080 90, 1440 50" stroke="#2d5a3d" strokeWidth="0.8" />
      <path d="M0 55 Q 360 15, 720 55 Q 1080 95, 1440 55" stroke="#4a8f5c" strokeWidth="0.5" />
    </svg>
  </div>
)

/* ── MouseSpotlight ──────────────────────────────────────────────────────── */
const MouseSpotlight = ({ className = '' }) => {
  const ref = useRef(null)
  const [pos, setPos] = useState({ x: 50, y: 50 })
  const [active, setActive] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const handle = (e) => {
      const rect = el.getBoundingClientRect()
      setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
      setActive(true)
    }
    el.addEventListener('mousemove', handle)
    el.addEventListener('mouseleave', () => setActive(false))
    el.addEventListener('mouseenter', () => setActive(true))
    return () => el.removeEventListener('mousemove', handle)
  }, [])

  return (
    <div ref={ref} className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`} style={{ opacity: active ? 1 : 0, transition: 'opacity 0.6s ease' }}>
      <div className="absolute rounded-full" style={{ width: 600, height: 600, left: pos.x - 300, top: pos.y - 300, background: 'radial-gradient(circle, rgba(74, 159, 98, 0.06) 0%, transparent 70%)' }} />
    </div>
  )
}

/* ── QuoteBlock ──────────────────────────────────────────────────────────── */
const QuoteBlock = () => {
  const { language } = useLanguage()
  const quotes = getQuotes(language)
  const [seed] = useState(() => Math.random())
  const quote = quotes[Math.floor(seed * quotes.length) % quotes.length]
  return (
    <div className="mt-10 md:mt-14">
      <p className="text-xl md:text-2xl lg:text-3xl font-italic italic text-ink-light/60 max-w-lg leading-relaxed">
        &ldquo;{quote.text}&rdquo;
      </p>
      <p className="mt-2 page-number text-ink-faint/50" style={{ textAlign: 'right' }}>
        &mdash; {quote.source}
      </p>
    </div>
  )
}

/* ── Hero ────────────────────────────────────────────────────────────────── */
export default function Hero() {
  const { t, language } = useLanguage()
  const { scrollY } = useScroll()
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0])
  const heroY = useTransform(scrollY, [0, 400], [0, 80])
  const [time, setTime] = useState('')

  useEffect(() => {
    const update = () => {
      const now = new Date()
      setTime(now.toLocaleTimeString('en-US', { timeZone: 'Africa/Cairo', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }))
    }
    update()
    const interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative min-h-screen flex flex-col justify-center pt-20 px-6 md:px-8 lg:px-12 overflow-hidden">
      <MouseSpotlight className="z-0" />
      <motion.div style={{ opacity: heroOpacity, y: heroY }}>
        <FloatingShapes />
        <HeroBotanicalBg />

        <div className="absolute left-6 md:left-8 lg:left-12 top-0 bottom-0 w-px bg-ink/5" />
        <div className="absolute right-6 md:right-8 lg:right-12 top-0 bottom-0 w-px bg-ink/5" />

        <div className="absolute right-4 md:right-8 lg:right-16 opacity-[0.03] font-heading pointer-events-none select-none" style={{ fontSize: 'clamp(8rem, 20vw, 22rem)', lineHeight: '1', top: 'clamp(3rem, 6vh, 8rem)', fontWeight: 700 }}>
          01
        </div>

        <div className="relative mx-auto max-w-7xl w-full">
          {/* Status pill + clock */}
          <div className="flex items-center gap-4 mb-10">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.8 }} className="flex items-center gap-2 px-4 py-2 bg-white/60 border border-ink/8 rounded-full backdrop-blur-sm">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
              </span>
              <span className="text-[0.65rem] font-heading font-semibold tracking-[0.12em] uppercase text-ink-light">{t('available')}</span>
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.0 }} className="flex items-center gap-2 px-3 py-1.5">
              <svg className="w-3.5 h-3.5 text-ink-faint" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
              </svg>
              <span className="page-number font-mono">{time}</span>
              <span className="text-[0.55rem] text-ink-faint/60 -ml-1">Cairo</span>
            </motion.div>
          </div>

          <div className="grid grid-cols-12 gap-6">
            {/* Left column */}
            <div className="col-span-12 md:col-span-6 xl:col-span-5 lg:col-span-4">
              <AnimatedSection delay={0.1}><p className="page-number mb-2">{t('hello')}</p></AnimatedSection>
              <AnimatedSection delay={0.3}><div className="h-px w-16 bg-accent mb-6" /></AnimatedSection>
              <StaggerContainer staggerMs={150}>
                <p className="text-ink-faint text-sm leading-relaxed max-w-xs font-light">{t('tagline')}</p>
                <p className="text-ink-faint/50 text-xs mt-3 font-light">{t('location')}</p>
              </StaggerContainer>
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

            {/* Right column */}
            <div className="col-span-12 md:col-span-6 xl:col-span-7 lg:col-span-8 md:pl-8 lg:pl-12 xl:pl-20">
              <div className="flex flex-col lg:flex-row lg:items-start gap-6 lg:gap-10">
                {/* Portrait */}
                <div className="hidden lg:flex flex-shrink-0">
                  <AnimatedSection delay={0.4}>
                    <div className="relative">
                      <div className="absolute -inset-3 border-2 border-accent/10 rounded-full" />
                      <div className="absolute -inset-6 border border-accent/5 rounded-full" />
                      <svg className="absolute -inset-4 w-[calc(8rem+2rem)] h-[calc(8rem+2rem)] opacity-20" viewBox="0 0 120 120" fill="none">
                        <motion.circle cx="60" cy="60" r="58" stroke="#2d5a3d" strokeWidth="0.5" strokeDasharray="4 8"
                          animate={{ rotate: 360 }} transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
                          style={{ transformOrigin: '60px 60px' }} />
                      </svg>
                      <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#2d5a3d] via-[#1a3526] to-[#4a8f5c] flex items-center justify-center shadow-lg">
                        <span className="block text-3xl font-bold font-display text-[#f5f5f0]/80 tracking-wider">YS</span>
                      </div>
                    </div>
                  </AnimatedSection>
                </div>

                {/* Name */}
                <div className="leading-[0.85]">
                  <motion.div initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}>
                    <h1 className="text-[4.5rem] md:text-[8rem] lg:text-[11rem] font-bold tracking-tight text-ink leading-none">
                      <GlitchText>Yehia</GlitchText>
                    </h1>
                  </motion.div>
                  <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1.2, delay: 0.6, ease: [0.22, 1, 0.36, 1] }} className="pl-4 md:pl-8 lg:pl-12 -mt-2">
                    <h1 className="text-[4rem] md:text-[7rem] lg:text-[10rem] font-normal italic font-italic tracking-tight text-accent leading-none">
                      Salem
                    </h1>
                  </motion.div>
                </div>
              </div>

              <AnimatedSection delay={1.0}><QuoteBlock /></AnimatedSection>

              {/* CTA buttons */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }} className="mt-12 md:mt-14 flex flex-wrap items-center gap-4">
                <motion.a href="#about" className="px-6 py-3 text-[0.7rem] font-heading font-semibold tracking-[0.18em] uppercase text-paper bg-ink hover:bg-accent transition-colors duration-300" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>{t('explore')}</motion.a>
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Link to="/works" className="px-6 py-3 text-[0.7rem] font-heading font-semibold tracking-[0.18em] uppercase border border-ink/20 text-ink hover:border-accent hover:text-accent transition-colors duration-300">{t('viewPortfolio')}</Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Link to="/behind-the-scenes" className="px-6 py-3 text-[0.7rem] font-heading font-semibold tracking-[0.18em] uppercase text-ink-light hover:text-accent transition-colors duration-300">Behind the Scenes</Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Link to="/works" className="px-6 py-3 text-[0.7rem] font-heading font-semibold tracking-[0.18em] uppercase text-ink-light hover:text-accent transition-colors duration-300">Complete Works</Link>
                </motion.div>
              </motion.div>
            </div>
          </div>

          {/* Signature */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.2 }} className="mt-16 md:mt-20">
            <span className="text-3xl md:text-4xl font-italic italic text-ink/20">Yehia Salem</span>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.2 }} className="absolute bottom-8 left-8 md:left-12 lg:left-20 flex items-center gap-3">
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }} className="w-px h-10 bg-accent/40" />
          <span className="page-number">{t('scroll')}</span>
        </motion.div>
      </motion.div>
    </section>
  )
}
