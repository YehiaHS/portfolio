/**
 * sections/Hero.jsx
 *
 * The full-screen hero section redesigned to match a premium, modern aesthetic
 * featuring massive typography and a prominent professional headshot.
 */

import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import { GlitchText, StaggerContainer, TextCounter } from '../motionEffects.jsx'
import { useLanguage } from '../LanguageContext'
import { getQuotes } from '../i18n'

/* ── Shared fade-up variant ──────────────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } },
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

/* ── Minimal Grid Background ──────────────────────────────────────────────────────── */
const MinimalGrid = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.02] z-0">
    <div className="w-full h-full" style={{ backgroundImage: 'linear-gradient(to right, var(--ink) 1px, transparent 1px), linear-gradient(to bottom, var(--ink) 1px, transparent 1px)', backgroundSize: '4rem 4rem' }}></div>
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
      <div className="absolute rounded-full" style={{ width: 800, height: 800, left: pos.x - 400, top: pos.y - 400, background: 'radial-gradient(circle, rgba(74, 159, 98, 0.08) 0%, transparent 60%)' }} />
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
    <div className="mt-8 md:mt-12 border-l border-accent/30 pl-6">
      <p className="text-lg md:text-xl font-italic italic text-ink-light/80 max-w-md leading-relaxed">
        &ldquo;{quote.text}&rdquo;
      </p>
      <p className="mt-3 text-[0.65rem] font-heading tracking-widest uppercase text-accent">
        &mdash; {quote.source}
      </p>
    </div>
  )
}

/* ── Hero ────────────────────────────────────────────────────────────────── */
export default function Hero() {
  const { t, language } = useLanguage()
  const { scrollY } = useScroll()
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0])
  const heroY = useTransform(scrollY, [0, 500], [0, 100])
  const imageY = useTransform(scrollY, [0, 500], [0, 150])
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
    <section className="relative min-h-screen flex flex-col justify-center pt-24 pb-12 px-6 md:px-12 lg:px-20 overflow-hidden bg-paper">
      <MinimalGrid />
      <MouseSpotlight className="z-0" />
      
      <motion.div style={{ opacity: heroOpacity, y: heroY }} className="relative z-10 w-full max-w-[1400px] mx-auto h-full flex flex-col justify-center">
        
        {/* Top Bar: Status & Time */}
        <div className="flex items-center justify-between mb-8 md:mb-16">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.8 }} className="flex items-center gap-3">
            <div className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-60" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-accent" />
            </div>
            <span className="text-xs md:text-sm font-heading tracking-[0.2em] uppercase text-ink-light">Available for work</span>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8 }} className="hidden md:flex items-center gap-3 text-ink-faint">
            <span className="text-xs tracking-widest uppercase">Cairo, EG</span>
            <span className="w-1 h-1 rounded-full bg-ink/20"></span>
            <span className="font-mono text-sm tracking-wider">{time}</span>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Huge Typography & Info */}
          <div className="col-span-1 lg:col-span-7 flex flex-col justify-center order-2 lg:order-1 z-20">
            <div className="leading-[0.85] mb-8 lg:mb-12">
              <motion.div initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}>
                <h1 className="text-[5rem] md:text-[9rem] lg:text-[11rem] xl:text-[13rem] font-bold tracking-tighter text-ink uppercase m-0 p-0">
                  <GlitchText>Yehia</GlitchText>
                </h1>
              </motion.div>
              <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1.2, delay: 0.6, ease: [0.16, 1, 0.3, 1] }} className="pl-2 md:pl-8 lg:pl-16">
                <h1 className="text-[4.5rem] md:text-[8rem] lg:text-[10rem] xl:text-[11.5rem] font-normal italic font-italic tracking-tighter text-accent m-0 p-0">
                  Salem
                </h1>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 pl-2 md:pl-8">
              <div>
                <AnimatedSection delay={0.8}>
                  <p className="text-ink-light text-base md:text-lg leading-relaxed max-w-sm font-light mb-8">
                    {t('tagline')} Crafting aesthetic digital experiences blending deep psychology with elegant code.
                  </p>
                </AnimatedSection>

                <AnimatedSection delay={1.0}>
                  <div className="flex flex-wrap items-center gap-4">
                    <Link to="/works" className="px-8 py-4 text-xs font-heading font-bold tracking-[0.2em] uppercase text-paper bg-ink hover:bg-accent hover:text-paper transition-all duration-300 rounded-sm">
                      {t('viewPortfolio')}
                    </Link>
                    <a href="#about" className="px-8 py-4 text-xs font-heading font-bold tracking-[0.2em] uppercase text-ink border border-ink/20 hover:border-accent hover:text-accent transition-all duration-300 rounded-sm">
                      {t('explore')}
                    </a>
                  </div>
                </AnimatedSection>
              </div>

              <div className="hidden md:block">
                <AnimatedSection delay={1.1}>
                  <QuoteBlock />
                </AnimatedSection>
              </div>
            </div>
          </div>

          {/* Right Column: Professional Headshot */}
          <div className="col-span-1 lg:col-span-5 order-1 lg:order-2">
            <motion.div 
              style={{ y: imageY }}
              initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }} 
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }} 
              transition={{ duration: 1.5, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full aspect-[4/5] md:aspect-[3/4] rounded-2xl md:rounded-[2rem] overflow-hidden group shadow-2xl shadow-black/50 border border-ink/10"
            >
              <div className="absolute inset-0 bg-accent/10 mix-blend-overlay z-10 group-hover:bg-transparent transition-colors duration-700"></div>
              <img 
                src={`${import.meta.env.BASE_URL}images/headshot.jpeg`} 
                alt="Yehia Salem" 
                className="w-full h-full object-cover object-center grayscale opacity-90 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000 ease-out"
                onError={(e) => {
                  // Fallback if local headshot.jpeg isn't found
                  e.target.onerror = null;
                  e.target.src = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop";
                }}
              />

              
              {/* Glassmorphism Badge */}
              <div className="absolute bottom-6 left-6 right-6 lg:bottom-8 lg:left-8 lg:right-8 p-4 rounded-xl bg-paper/40 backdrop-blur-md border border-white/10 z-20 flex justify-between items-center transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                <div>
                  <p className="text-ink font-heading font-bold text-sm tracking-wider uppercase">Senior Strategist</p>
                  <p className="text-ink-light text-xs mt-1">Creative Director & Developer</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-paper">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
                </div>
              </div>
            </motion.div>
          </div>
          
        </div>

        {/* Scroll indicator */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.2 }} className="absolute bottom-4 lg:bottom-0 left-0 flex items-center gap-4">
          <div className="w-px h-16 bg-gradient-to-b from-accent to-transparent">
            <motion.div animate={{ y: [0, 64, 0] }} transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }} className="w-full h-1/3 bg-ink" />
          </div>
          <span className="text-[0.65rem] font-heading tracking-[0.2em] uppercase text-ink-faint origin-left transform -rotate-90 translate-y-12 block">{t('scroll')}</span>
        </motion.div>
      </motion.div>
    </section>
  )
}

