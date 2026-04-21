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
import { GlitchText } from '../motionEffects.jsx'

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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0d1410] font-body pt-16">
      
      {/* Background ambient glow */}
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[600px] bg-[#4a9f62]/5 rounded-full blur-[120px]" />
      </div>

      {/* The Huge 01 */}
      <div className="absolute right-8 md:right-24 opacity-[0.02] font-display font-bold select-none pointer-events-none" style={{ fontSize: 'clamp(15rem, 40vh, 30rem)', top: '5%', lineHeight: 1 }}>
        01
      </div>

      <motion.div style={{ opacity: heroOpacity, y: heroY }} className="relative z-10 w-full max-w-[1500px] mx-auto px-6 md:px-12 flex h-full items-center min-h-[85vh]">
        
        {/* LEFT COLUMN: Vertically Stacked Stats */}
        <div className="hidden lg:flex flex-col items-center justify-center gap-10 z-30 relative w-1/4 pt-10">
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
              <div className="text-4xl xl:text-5xl font-display font-bold text-[#3d7a4f] mb-1">{stat.n}</div>
              <div className="text-[0.65rem] xl:text-[0.75rem] font-body text-ink-faint tracking-wider">{stat.l}</div>
            </motion.div>
          ))}
        </div>

        {/* RIGHT COLUMN: Typography & Content */}
        <div className="flex-1 flex flex-col justify-center relative z-10 w-full lg:w-3/4">
          
          <div className="relative pl-4 lg:pl-12">
            {/* "Hello, I'm" - Back layer */}
            <motion.h3 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.8 }}
              className="text-2xl md:text-[2.2rem] lg:text-[2.8rem] font-serif-italic text-ink mb-[-1.5rem] md:mb-[-2rem] ml-16 md:ml-32 z-10 relative"
            >
              Hello, I'm
            </motion.h3>
            
            {/* "Yehia" - Back layer */}
            <motion.h1 
              initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 1 }}
              className="text-[7rem] md:text-[11rem] lg:text-[14rem] xl:text-[16rem] font-bold tracking-tighter text-ink leading-[0.8] font-display m-0 z-10 relative"
            >
              Yehia
            </motion.h1>

            {/* "Salem" - Front layer (z-30) */}
            <motion.h1 
              initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 1 }}
              className="text-[6.5rem] md:text-[10rem] lg:text-[13rem] xl:text-[15rem] font-serif-italic tracking-tighter text-[#3d7a4f] leading-[0.7] m-0 ml-16 md:ml-40 lg:ml-56 relative z-30 mt-[-2rem] md:mt-[-3rem] lg:mt-[-4rem]"
            >
              Salem
            </motion.h1>
          </div>

          {/* Info Block - Pushed Right */}
          <div className="mt-16 ml-auto mr-4 lg:mr-24 xl:mr-32 max-w-[380px] relative z-30">
            <AnimatedSection delay={0.9}>
              <p className="text-ink-light text-[0.8rem] md:text-[0.85rem] font-body tracking-wide mb-1 opacity-80">
                Multidisciplinary Designer & Creative Technologist
              </p>
              <p className="text-ink-faint text-[0.7rem] font-body tracking-wider mb-8 opacity-60">
                Heliopolis, Cairo, Egypt
              </p>
            </AnimatedSection>

            <AnimatedSection delay={1.1}>
              <div className="border-l border-ink/10 pl-6 mb-12">
                <p className="text-ink-faint italic text-lg md:text-xl font-serif-italic leading-relaxed opacity-70">
                  “It is only with the heart that one can see rightly; what is essential is invisible to the eye.”
                </p>
                <p className="text-right text-ink-faint/50 text-[0.6rem] tracking-widest mt-4 uppercase">
                  — Le Petit Prince
                </p>
              </div>
            </AnimatedSection>

            {/* Buttons exactly matching reference */}
            <AnimatedSection delay={1.3}>
              <div className="flex flex-col gap-5">
                <div className="flex flex-wrap items-center gap-4">
                  {/* Pale green solid box button */}
                  <Link to="#about" className="w-[80px] h-[32px] bg-[#d4e4d8] hover:bg-white transition-colors duration-300 rounded-sm"></Link>
                  
                  <Link to="/works" className="text-[0.6rem] font-heading font-bold tracking-[0.2em] uppercase text-ink hover:text-accent flex items-center gap-2 transition-colors">
                    VIEW PORTFOLIO <span className="text-sm">→</span>
                  </Link>
                  
                  <Link to="/behind-the-scenes" className="text-[0.6rem] font-heading font-bold tracking-[0.2em] uppercase text-ink-faint hover:text-ink transition-colors md:ml-4">
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
      </motion.div>

      {/* CENTER COLUMN: The Portrait Cutout */}
      {/* 
        Positioned absolute so it is sandwiched between "Yehia" (z-10) and "Salem" (z-30)
      */}
      <motion.div 
        style={{ y: imageY }}
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="absolute bottom-0 left-[50%] md:left-[45%] lg:left-[42%] -translate-x-1/2 w-[90%] md:w-[60%] lg:w-[45%] xl:w-[42%] max-w-[700px] z-20 pointer-events-none"
      >
        <img 
          src={`${import.meta.env.BASE_URL}images/Yehia_Professional.png`}
          alt="Yehia Salem"
          className="w-full h-auto object-contain object-bottom drop-shadow-2xl"
          style={{ maxHeight: '85vh' }}
        />
      </motion.div>

    </section>
  )
}


