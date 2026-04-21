/**
 * sections/Hero.jsx
 *
 * Wix-Style Interactive Hero Editor
 * All elements are absolute-positioned and draggable.
 * You can drag the elements into the perfect layout, and the coordinates
 * will be shown in the bottom right corner for saving!
 */

import { useState, useRef } from 'react'
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

  // Track live positions of dragged elements
  const [positions, setPositions] = useState({
    hello: { x: 0, y: 0 },
    yehia: { x: 0, y: 0 },
    salem: { x: 0, y: 0 },
    portrait: { x: 0, y: 0 },
    info: { x: 0, y: 0 },
    stats: { x: 0, y: 0 },
  });

  const handleDrag = (key, event, info) => {
    setPositions(prev => ({
      ...prev,
      [key]: { x: prev[key].x + info.delta.x, y: prev[key].y + info.delta.y }
    }));
  };

  return (
    <section className="relative h-screen min-h-[800px] w-full overflow-hidden bg-[#0d1410] font-body flex items-center justify-center pt-16">
      
      {/* Background ambient glow */}
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[600px] bg-[#4a9f62]/5 rounded-full blur-[120px]" />
      </div>

      <motion.div style={{ opacity: heroOpacity }} className="absolute inset-0 w-full h-full max-w-[1400px] mx-auto">
        
        {/* The Huge 01 */}
        <div className="absolute -right-[2%] top-[5%] opacity-[0.02] font-display font-bold select-none pointer-events-none z-0" style={{ fontSize: 'clamp(15rem, 35vh, 30rem)', lineHeight: 0.8 }}>
          01
        </div>

        {/* 
          PURE CANVAS LAYOUT 
          All elements are direct siblings to guarantee z-index parity. 
        */}

        {/* 1. STATS (z-30) */}
        <motion.div 
          drag dragMomentum={false} onDrag={(e, i) => handleDrag('stats', e, i)}
          className="absolute left-[5%] top-[20%] hidden lg:flex flex-col justify-center gap-12 z-30 cursor-move"
        >
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
        </motion.div>

        {/* 2. "Hello I'm" (z-10) */}
        <motion.h3 
          drag dragMomentum={false} onDrag={(e, i) => handleDrag('hello', e, i)}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          className="absolute left-[28%] top-[20%] text-[clamp(1.5rem,3vw,2.5rem)] font-serif-italic text-ink z-10 cursor-move"
        >
          Hello, I'm
        </motion.h3>

        {/* 3. "Yehia" (z-10) */}
        <motion.h1 
          drag dragMomentum={false} onDrag={(e, i) => handleDrag('yehia', e, i)}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
          className="absolute left-[25%] top-[25%] text-[clamp(7rem,12vw,14rem)] xl:text-[16rem] font-bold tracking-tighter text-ink leading-[0.75] font-display m-0 z-10 cursor-move"
        >
          Yehia
        </motion.h1>

        {/* 4. THE PORTRAIT (z-20) */}
        <motion.div 
          drag dragMomentum={false} onDrag={(e, i) => handleDrag('portrait', e, i)}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.5, delay: 0.7 }}
          className="absolute bottom-0 left-[35%] h-[80vh] lg:h-[88vh] z-20 cursor-move flex items-end"
        >
          <img 
            src={`${import.meta.env.BASE_URL}images/Yehia_Professional.png`}
            alt="Yehia Salem"
            className="w-auto h-full max-h-[1000px] object-contain object-bottom drop-shadow-2xl pointer-events-none"
          />
        </motion.div>

        {/* 5. "Salem" (z-30) */}
        <motion.h1 
          drag dragMomentum={false} onDrag={(e, i) => handleDrag('salem', e, i)}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
          className="absolute left-[35%] top-[45%] text-[clamp(6.5rem,11.5vw,13.5rem)] xl:text-[15rem] font-serif-italic tracking-tighter text-[#4a9f62] leading-[0.7] m-0 z-30 cursor-move"
        >
          Salem
        </motion.h1>

        {/* 6. INFO BLOCK & BUTTONS (z-30) */}
        <motion.div 
          drag dragMomentum={false} onDrag={(e, i) => handleDrag('info', e, i)}
          className="absolute left-[55%] top-[65%] max-w-[420px] z-30 cursor-move bg-[#0d1410]/50 p-4 rounded backdrop-blur-sm"
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
                <Link to="#about" className="w-[80px] h-[32px] bg-[#d4e4d8] hover:bg-white transition-colors duration-300 rounded-sm pointer-events-auto"></Link>
                <Link to="/works" className="text-[0.6rem] font-heading font-bold tracking-[0.2em] uppercase text-ink hover:text-accent flex items-center gap-2 transition-colors pointer-events-auto">
                  VIEW PORTFOLIO <span className="text-sm">→</span>
                </Link>
                <Link to="/behind-the-scenes" className="text-[0.6rem] font-heading font-bold tracking-[0.2em] uppercase text-ink-faint hover:text-ink transition-colors ml-2 pointer-events-auto">
                  BEHIND THE SCENES
                </Link>
              </div>
              <div className="ml-[96px]">
                <Link to="/works" className="text-[0.6rem] font-heading font-bold tracking-[0.2em] uppercase text-ink-faint hover:text-ink transition-colors pointer-events-auto">
                  COMPLETE WORKS
                </Link>
              </div>
            </div>
          </AnimatedSection>
        </motion.div>

      </motion.div>

      {/* FLOATING WIX-STYLE EDITOR DASHBOARD */}
      <div className="fixed bottom-4 right-4 bg-black/90 border border-[#4a9f62] text-[#d4e4d8] p-4 rounded-lg z-50 shadow-2xl font-mono text-xs backdrop-blur-md pointer-events-none">
        <h4 className="text-[#4a9f62] font-bold mb-2 uppercase tracking-widest border-b border-[#4a9f62]/30 pb-2">🛠️ Drag & Drop Editor</h4>
        <p className="mb-4 text-white/50 max-w-[250px]">Drag any element on the screen to position it perfectly. Give me these exact offset values when you are done!</p>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
          {Object.entries(positions).map(([key, pos]) => (
            <div key={key} className="flex flex-col">
              <span className="uppercase text-[#4a9f62]/70 text-[10px]">{key}</span>
              <span>X: {Math.round(pos.x)} | Y: {Math.round(pos.y)}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
