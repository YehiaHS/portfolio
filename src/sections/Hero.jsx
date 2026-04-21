/**
 * sections/Hero.jsx
 *
 * The full-screen hero section meticulously designed to match the provided reference.
 * Features an absolute-centered cutout portrait overlapping large, elegant typography
 * on the right, and vertically stacked statistics on the left.
 */

import { useState, useEffect, useRef } from 'react'
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
  const heroY = useTransform(scrollY, [0, 500], [0, 100])
  const imageY = useTransform(scrollY, [0, 500], [0, 150])

  return (
    <section className="relative h-screen min-h-[800px] w-full overflow-hidden bg-[#0d1410] font-body flex items-center justify-center pt-16">
      
      {/* Background ambient glow */}
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[600px] bg-[#4a9f62]/5 rounded-full blur-[120px]" />
      </div>

      {/* Main Container creates ONE stacking context for everything inside it */}
      <motion.div style={{ opacity: heroOpacity, y: heroY }} className="absolute inset-0 w-full h-full flex items-center justify-center">
        
        {/* The Huge 01 */}
        <div className="absolute -right-[2%] top-[5%] opacity-[0.02] font-display font-bold select-none pointer-events-none z-0" style={{ fontSize: 'clamp(15rem, 35vh, 30rem)', lineHeight: 0.8 }}>
          01
        </div>

        {/* Content Wrapper */}
        <div className="relative w-full max-w-[1400px] mx-auto px-6 lg:px-16 h-full flex items-center pointer-events-none">
          
          {/* LEFT COLUMN: Vertically Stacked Stats */}
          <div className="hidden lg:flex flex-col justify-center gap-12 z-30 relative w-[15%] h-full pointer-events-auto">
            {[
              { n: '3', l: 'Languages' },
              { n: '2', l: 'Degrees' },
              { n: '8.5', l: 'IELTS Score' },
              { n: '10+', l: 'Design Tools' }
            ].map((stat, i) => (
              <motion.div 
                key={stat.l} 
                className="text-center"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + (i * 0.1), duration: 0.8 }}
              >
                <div className="text-[3rem] xl:text-[3.5rem] leading-none font-display font-bold text-[#5c9e6a] mb-2">{stat.n}</div>
                <div className="text-[0.65rem] xl:text-[0.75rem] font-body text-ink-faint tracking-widest">{stat.l}</div>
              </motion.div>
            ))}
          </div>

          {/* RIGHT COLUMN: Typography & Content */}
          <div className="flex-1 relative z-10 h-full flex flex-col justify-center">
            
            <div className="relative w-full pl-[5%] lg:pl-[10%] pointer-events-auto">
              {/* "Hello, I'm" - Back layer */}
              <motion.h3 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.8 }}
                className="text-[clamp(1.5rem,3vw,2.5rem)] font-serif-italic text-ink z-10 mb-[-1rem] lg:mb-[-1.5rem] ml-[0.5rem] lg:ml-[1rem] relative"
              >
                Hello, I'm
              </motion.h3>
              
              {/* "Yehia" - Back layer */}
              <motion.h1 
                initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 1 }}
                className="text-[clamp(7rem,12vw,14rem)] xl:text-[16rem] font-bold tracking-tighter text-ink leading-[0.75] font-display m-0 z-10 relative"
              >
                Yehia
              </motion.h1>

              {/* "Salem" - Front layer (z-30) */}
              <motion.h1 
                initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 1 }}
                className="text-[clamp(6.5rem,11.5vw,13.5rem)] xl:text-[15rem] font-serif-italic tracking-tighter text-[#5c9e6a] leading-[0.7] m-0 ml-[10%] relative z-30 mt-[-clamp(1.5rem,3vw,4rem)]"
              >
                Salem
              </motion.h1>
            </div>

            {/* Info Block - Pushed Right & aligned under 'Salem' */}
            <div className="mt-8 ml-[10%] md:ml-[15%] lg:ml-[30%] xl:ml-[35%] max-w-[420px] relative z-30 pointer-events-auto">
              <AnimatedSection delay={0.9}>
                <p className="text-ink-light text-[0.8rem] md:text-[0.85rem] font-body tracking-wide mb-1 opacity-80">
                  Multidisciplinary Designer & Creative Technologist
                </p>
                <p className="text-ink-faint text-[0.7rem] font-body tracking-wider mb-8 opacity-60">
                  Heliopolis, Cairo, Egypt
                </p>
              </AnimatedSection>

              <AnimatedSection delay={1.1}>
                <div className="border-l border-ink/10 pl-6 mb-10">
                  <p className="text-ink-faint italic text-lg lg:text-xl font-serif-italic leading-relaxed opacity-70">
                    “It is only with the heart that one can see rightly; what is essential is invisible to the eye.”
                  </p>
                  <p className="text-right text-ink-faint/50 text-[0.6rem] tracking-widest mt-4 uppercase">
                    — Le Petit Prince
                  </p>
                </div>
              </AnimatedSection>

              {/* Buttons exactly matching reference */}
              <AnimatedSection delay={1.3}>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-wrap items-center gap-4">
                    {/* Pale green solid box button */}
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
            </div>
          </div>
        </div>

        {/* CENTER COLUMN: The Portrait Cutout */}
        {/* 
          Sandwiched between "Yehia" (z-10) and "Salem" (z-30) because it's in the same stacking context!
        */}
        <motion.div 
          style={{ y: imageY }}
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="absolute bottom-0 left-[50%] lg:left-[45%] xl:left-[42%] -translate-x-1/2 h-[80vh] lg:h-[95vh] z-20 pointer-events-none flex items-end"
        >
          <img 
            src={`${import.meta.env.BASE_URL}images/Yehia_Professional.png`}
            alt="Yehia Salem"
            className="w-auto h-full max-h-[1000px] object-contain object-bottom drop-shadow-2xl"
          />
        </motion.div>
      </motion.div>
    </section>
  )
}


