/**
 * sections/Hero.jsx
 *
 * Finalized Editorial Hero Section
 * Coordinates have been meticulously locked-in from the visual editor payload.
 */

import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'

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

/* ── Hero ────────────────────────────────────────────────────────────────── */
export default function Hero() {
  const { scrollY } = useScroll()
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0])

  const statsOffsets = [
    { vw: 8.98, vh: 21.68 }, // stat0
    { vw: 10.34, vh: -9.14 }, // stat1
    { vw: 9.45, vh: -7.51 },  // stat2
    { vw: 12.25, vh: -16.79 } // stat3
  ];

  return (
    <section className="relative h-screen min-h-[800px] w-full overflow-hidden bg-[#0d1410] font-body flex items-center justify-center pt-16">
      
      {/* Background ambient glow */}
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[600px] bg-[#4a9f62]/5 rounded-full blur-[120px]" />
      </div>

      <motion.div style={{ opacity: heroOpacity }} className="absolute inset-0 w-full h-full max-w-[1400px] mx-auto pointer-events-none">
        
        {/* The Huge 01 */}
        <div className="absolute -right-[2%] top-[5%] opacity-[0.02] font-display font-bold select-none pointer-events-none z-0" style={{ fontSize: 'clamp(15rem, 35vh, 30rem)', lineHeight: 0.8 }}>
          01
        </div>

        {/* 1. STATS (z-30) */}
        {[
          { n: '3', l: 'Languages' },
          { n: '2', l: 'Degrees' },
          { n: '8.5', l: 'IELTS Score' },
          { n: '10+', l: 'Design Tools' }
        ].map((stat, i) => (
          <motion.div 
            key={stat.l}
            className="absolute z-30 hidden lg:block text-center pointer-events-auto"
            style={{ 
              left: `calc(5% + ${statsOffsets[i].vw}vw)`, 
              top: `calc(${20 + i * 15}% + ${statsOffsets[i].vh}vh)` 
            }}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 + (i * 0.1), duration: 0.8 }}
          >
            <div className="text-[3rem] xl:text-[3.5rem] leading-none font-display font-bold text-[#5c9e6a] mb-2">{stat.n}</div>
            <div className="text-[0.65rem] xl:text-[0.75rem] font-body text-ink-faint tracking-widest">{stat.l}</div>
          </motion.div>
        ))}

        {/* 2. "Hello I'm" (z-10) */}
        <motion.h3 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          className="absolute text-[clamp(1.5rem,3vw,2.5rem)] font-serif-italic text-ink z-10 pointer-events-none"
          style={{ left: 'calc(28% + 13.74vw)', top: 'calc(20% + 13.95vh)' }}
        >
          Hello, I'm
        </motion.h3>

        {/* 3. "Yehia" (z-10) */}
        <motion.h1 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
          className="absolute text-[clamp(7rem,12vw,14rem)] xl:text-[16rem] font-bold tracking-tighter text-ink leading-[0.75] font-display m-0 z-10 pointer-events-none"
          style={{ left: 'calc(25% + 14.21vw)', top: 'calc(25% + 11.69vh)' }}
        >
          Yehia
        </motion.h1>

        {/* 4. THE PORTRAIT (z-20) */}
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.5, delay: 0.7 }}
          className="absolute z-20 flex items-end pointer-events-none"
          style={{ left: 'calc(35% - 7.64vw)', bottom: 'calc(0% - 1.28vh)', height: '88vh' }}
        >
          <img 
            src={`${import.meta.env.BASE_URL}images/Yehia_Professional.png`}
            alt="Yehia Salem"
            className="w-auto h-full max-h-[1000px] object-contain object-bottom drop-shadow-2xl"
          />
        </motion.div>

        {/* 5. "Salem" (z-30) */}
        <motion.h1 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
          className="absolute text-[clamp(6.5rem,11.5vw,13.5rem)] xl:text-[15rem] font-serif-italic tracking-tighter text-[#4a9f62] leading-[0.7] m-0 z-30 pointer-events-none"
          style={{ left: 'calc(35% + 11.75vw)', top: 'calc(45% + 6.86vh)' }}
        >
          Salem
        </motion.h1>

        {/* 6. INFO BLOCK & BUTTONS (z-30) */}
        <motion.div 
          className="absolute max-w-[420px] z-30 bg-[#0d1410]/20 p-6 rounded-lg backdrop-blur-md pointer-events-auto shadow-2xl border border-[#4a9f62]/10"
          style={{ left: 'calc(55% + 8.09vw)', top: 'calc(65% + 3.11vh)' }}
        >
          <AnimatedSection delay={0.9}>
            <p className="text-ink-light text-[0.8rem] md:text-[0.85rem] font-body tracking-wide mb-1 opacity-80 pointer-events-none">
              Multidisciplinary Designer & Creative Technologist
            </p>
            <p className="text-ink-faint text-[0.7rem] font-body tracking-wider mb-8 opacity-60 pointer-events-none">
              Heliopolis, Cairo, Egypt
            </p>
          </AnimatedSection>

          <AnimatedSection delay={1.1}>
            <div className="border-l border-ink/10 pl-6 mb-10 pointer-events-none">
              <p className="text-ink-faint italic text-lg lg:text-xl font-serif-italic leading-relaxed opacity-70">
                “It is only with the heart that one can see rightly; what is essential is invisible to the eye.”
              </p>
              <p className="text-right text-ink-faint/50 text-[0.6rem] tracking-widest mt-4 uppercase">
                — Le Petit Prince
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={1.3}>
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap items-center gap-4">
                <Link to="#about" className="w-[80px] h-[32px] bg-[#d4e4d8] hover:bg-white transition-colors duration-300 rounded-sm"></Link>
                <Link to="/works" className="text-[0.6rem] font-heading font-bold tracking-[0.2em] uppercase text-ink hover:text-accent flex items-center gap-2 transition-colors">
                  VIEW PORTFOLIO <span className="text-sm">→</span>
                </Link>
                <Link to="/behind-the-scenes" className="text-[0.6rem] font-heading font-bold tracking-[0.2em] uppercase text-ink-faint hover:text-ink transition-colors ml-2">
                  BEHIND THE SCENES
                </Link>
              </div>
              <div className="ml-[96px]">
                <Link to="/works" className="text-[0.6rem] font-heading font-bold tracking-[0.2em] uppercase text-ink-faint hover:text-ink transition-colors">
                  COMPLETE WORKS
                </Link>
              </div>
            </div>
          </AnimatedSection>
        </motion.div>

      </motion.div>
    </section>
  )
}
