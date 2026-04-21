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
import { useLanguage } from '../LanguageContext'

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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0d1410]">
      
      {/* Background ambient glow */}
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[600px] bg-[#4a9f62]/5 rounded-full blur-[120px]" />
      </div>

      {/* The Huge 01 */}
      <div className="absolute right-4 md:right-16 opacity-[0.02] font-heading font-bold select-none pointer-events-none" style={{ fontSize: 'clamp(12rem, 30vh, 25rem)', top: '5%', lineHeight: 1 }}>
        01
      </div>

      <motion.div style={{ opacity: heroOpacity, y: heroY }} className="relative z-10 w-full max-w-[1400px] mx-auto px-6 md:px-12 grid grid-cols-12 h-full items-center min-h-[80vh] pt-20 pb-10">
        
        {/* LEFT COLUMN: Vertically Stacked Stats */}
        <div className="col-span-12 md:col-span-3 lg:col-span-3 hidden md:flex flex-col items-center justify-center gap-12 z-10 relative">
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
              <div className="text-4xl lg:text-5xl xl:text-[3.5rem] font-display font-bold text-[#4a9f62] mb-2">{stat.n}</div>
              <div className="text-[0.7rem] lg:text-[0.8rem] font-body text-ink-faint tracking-wider">{stat.l}</div>
            </motion.div>
          ))}
        </div>

        {/* RIGHT COLUMN: Typography & Content */}
        <div className="col-span-12 md:col-span-9 lg:col-span-8 lg:col-start-5 flex flex-col justify-center relative z-10">
          
          <div className="relative">
            {/* "Hello, I'm" */}
            <motion.h3 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.8 }}
              className="text-2xl md:text-[2rem] lg:text-[2.5rem] font-serif-italic text-ink mb-[-1rem] md:mb-[-1.5rem] ml-2 md:ml-12"
            >
              Hello, I'm
            </motion.h3>
            
            {/* Name */}
            <div className="relative">
              <motion.h1 
                initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 1 }}
                className="text-[6rem] md:text-[10rem] lg:text-[13rem] xl:text-[15rem] font-bold tracking-tighter text-ink leading-[0.85] font-display m-0"
              >
                Yehia
              </motion.h1>
              <motion.h1 
                initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 1 }}
                className="text-[5.5rem] md:text-[9rem] lg:text-[11.5rem] xl:text-[13rem] font-serif-italic tracking-tighter text-[#2d5a3d] leading-[0.8] m-0 ml-12 md:ml-24 lg:ml-32"
              >
                Salem
              </motion.h1>
            </div>
          </div>

          {/* Info Block */}
          <div className="mt-10 ml-2 md:ml-24 lg:ml-32 max-w-xl relative z-30">
            <AnimatedSection delay={0.9}>
              <p className="text-ink-light text-sm md:text-base font-body tracking-wide mb-1">
                Multidisciplinary Designer & Creative Technologist
              </p>
              <p className="text-ink-faint text-xs font-body tracking-wider mb-8">
                Heliopolis, Cairo, Egypt
              </p>
            </AnimatedSection>

            <AnimatedSection delay={1.1}>
              <div className="border-l border-ink/10 pl-6 mb-12 max-w-md">
                <p className="text-ink-faint italic text-lg md:text-xl font-serif-italic leading-relaxed">
                  “It is only with the heart that one can see rightly; what is essential is invisible to the eye.”
                </p>
                <p className="text-right text-ink-faint/60 text-[0.65rem] tracking-widest mt-4 uppercase">
                  — Le Petit Prince
                </p>
              </div>
            </AnimatedSection>

            {/* Buttons exactly matching reference */}
            <AnimatedSection delay={1.3}>
              <div className="flex flex-col gap-6">
                <div className="flex flex-wrap items-center gap-6">
                  {/* Pale green solid box */}
                  <a href="#about" className="w-[100px] h-[36px] bg-[#d4e4d8] hover:bg-white transition-colors duration-300 rounded-sm"></a>
                  
                  <Link to="/works" className="text-[0.65rem] font-heading font-bold tracking-[0.2em] uppercase text-ink hover:text-accent flex items-center gap-2 transition-colors">
                    VIEW PORTFOLIO <span className="text-sm">→</span>
                  </Link>
                  
                  <Link to="/behind-the-scenes" className="text-[0.65rem] font-heading font-bold tracking-[0.2em] uppercase text-ink-faint hover:text-ink transition-colors md:ml-4">
                    BEHIND THE SCENES
                  </Link>
                </div>
                
                <div className="md:ml-[124px]">
                  <Link to="/works" className="text-[0.65rem] font-heading font-bold tracking-[0.2em] uppercase text-ink-faint hover:text-ink transition-colors">
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
        Positioned absolute so it perfectly overlaps the text behind it (z-10) 
        and slides under the interactive buttons (z-30)
      */}
      <motion.div 
        style={{ y: imageY }}
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="absolute bottom-0 left-[50%] md:left-[45%] lg:left-[42%] -translate-x-1/2 w-[95%] md:w-[65%] lg:w-[48%] xl:w-[45%] max-w-[800px] z-20 pointer-events-none"
      >
        <img 
          src={`${import.meta.env.BASE_URL}images/Yehia_Professional.png`}
          alt="Yehia Salem"
          className="w-full h-auto object-contain object-bottom drop-shadow-2xl"
          style={{ maxHeight: '90vh' }}
        />
      </motion.div>

    </section>
  )
}

