/**
 * sections/VisualMoments.jsx — Abstract SVG gallery strip ("Behind the Scenes")
 */
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { ColoredPanel } from '../C2Patterns.jsx'
import { TextSampleDensity } from '../pretextUtils.jsx'
import AnimatedSection from '../components/AnimatedSection'



const CARDS = [
  {
    caption: 'Work in Progress',
    sub: 'Iterative design exploration',
    svg: (
      <svg viewBox="0 0 300 200" className="w-full h-full" fill="none">
        <defs>
          <linearGradient id="vm-g1" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#1a3526" /><stop offset="50%" stopColor="#2d5a3d" /><stop offset="100%" stopColor="#4a8f5c" />
          </linearGradient>
        </defs>
        <rect width="300" height="200" fill="#0d1a0f" />
        <circle cx="100" cy="80" r="60" fill="url(#vm-g1)" opacity="0.5" />
        <circle cx="180" cy="100" r="50" fill="url(#vm-g1)" opacity="0.4" />
        <circle cx="150" cy="130" r="45" fill="#2d5a3d" opacity="0.3" />
        <path d="M220 30 Q 250 60 230 100 Q 200 70 220 30Z" fill="#4a8f5c" opacity="0.3" />
        {Array.from({ length: 8 }).map((_, i) => (
          <line key={`v${i}`} x1={i * 43} y1="0" x2={i * 43} y2="200" stroke="#2d5a3d" strokeWidth="0.3" opacity="0.2" />
        ))}
      </svg>
    ),
  },
  {
    caption: 'Creative Process',
    sub: 'From concept to composition',
    svg: (
      <svg viewBox="0 0 300 200" className="w-full h-full" fill="none">
        <defs>
          <radialGradient id="vm-g2" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="#4a8f5c" stopOpacity="0.6" /><stop offset="100%" stopColor="#0d1a0f" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="300" height="200" fill="#0d1a0f" />
        <circle cx="150" cy="100" r="80" fill="url(#vm-g2)" />
        {[30, 50, 70, 90].map((r, i) => (
          <circle key={i} cx="150" cy="100" r={r} stroke="#2d5a3d" strokeWidth="0.5" opacity={0.3 - i * 0.05} />
        ))}
        {[0,45,90,135,180,225,270,315].map((angle, i) => (
          <ellipse key={i} cx={150 + 35 * Math.cos(angle * Math.PI / 180)} cy={100 + 35 * Math.sin(angle * Math.PI / 180)}
            rx="18" ry="8" fill="#2d5a3d" opacity="0.3"
            transform={`rotate(${angle} ${150 + 35 * Math.cos(angle * Math.PI / 180)} ${100 + 35 * Math.sin(angle * Math.PI / 180)})`} />
        ))}
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
        <path d="M150 20 C 200 50 230 100 150 180 C 70 100 100 50 150 20Z" fill="#2d5a3d" opacity="0.25" stroke="#4a8f5c" strokeWidth="0.5" />
        <line x1="150" y1="30" x2="150" y2="170" stroke="#4a8f5c" strokeWidth="0.5" opacity="0.5" />
        <path d="M150 50 Q 185 65 200 85" stroke="#4a8f5c" strokeWidth="0.4" opacity="0.4" />
        <path d="M150 50 Q 115 65 100 85" stroke="#4a8f5c" strokeWidth="0.4" opacity="0.4" />
        <path d="M150 80 Q 180 95 195 110" stroke="#4a8f5c" strokeWidth="0.4" opacity="0.4" />
        <path d="M150 80 Q 120 95 105 110" stroke="#4a8f5c" strokeWidth="0.4" opacity="0.4" />
      </svg>
    ),
  },
  {
    caption: 'Abstract Composition',
    sub: 'Digital canvas explorations',
    svg: (
      <svg viewBox="0 0 300 200" className="w-full h-full" fill="none">
        <defs>
          <linearGradient id="vm-g4" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#1a3526" /><stop offset="100%" stopColor="#2d5a3d" />
          </linearGradient>
        </defs>
        <rect width="300" height="200" fill="#0d1a0f" />
        <path d="M0 100 C 50 50, 100 150, 150 100 C 200 50, 250 150, 300 100" stroke="#2d5a3d" strokeWidth="1" opacity="0.3" />
        <path d="M0 120 C 60 70, 110 170, 160 120 C 210 70, 260 170, 300 120" stroke="#4a8f5c" strokeWidth="0.5" opacity="0.2" />
        <rect x="50" y="40" width="60" height="30" rx="2" fill="url(#vm-g4)" opacity="0.4" />
        <rect x="180" y="120" width="80" height="40" rx="2" fill="#2d5a3d" opacity="0.3" />
        {Array.from({ length: 5 }).map((_, row) =>
          Array.from({ length: 8 }).map((_, col) => (
            <circle key={`${row}-${col}`} cx={25 + col * 35} cy={30 + row * 35} r="1.5" fill="#4a8f5c" opacity={0.1 + (row + col) % 3 * 0.05} />
          ))
        )}
      </svg>
    ),
  },
]

export default function VisualMoments() {
  return (
    <ColoredPanel variant="dark" className="!py-0 !px-0">
      <section className="relative py-20 md:py-28 lg:py-40 px-6 md:px-8 lg:px-12 overflow-hidden">
        <div className="hidden lg:block absolute left-0 top-0 bottom-0 w-24 pointer-events-none select-none opacity-[0.04]">
          <svg className="absolute top-20 left-3" viewBox="0 0 40 40" fill="none" stroke="#2d5a3d" strokeWidth="1">
            <rect x="4" y="4" width="32" height="32" rx="2" />
            <path d="M4 28l10-10 8 8 6-6 8 8" strokeWidth="1.5" />
            <circle cx="14" cy="14" r="4" />
          </svg>
        </div>

        <div className="relative mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <AnimatedSection><p className="section-number">Visual Moments</p></AnimatedSection>
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
            <TextSampleDensity />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {CARDS.map((card, i) => (
              <AnimatedSection key={card.caption} delay={0.15 + i * 0.1}>
                <motion.div whileHover={{ y: -6, scale: 1.02 }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="group relative overflow-hidden border border-ink/5 bg-paper-dark">
                  <div className="aspect-[3/2] overflow-hidden relative">
                    {card.svg}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0d1a0f]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                  <div className="absolute inset-x-0 bottom-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                    <p className="text-[#f5f5f0] text-sm font-heading font-semibold">{card.caption}</p>
                    <p className="text-[#f5f5f0]/50 text-xs font-light mt-0.5">{card.sub}</p>
                  </div>
                  <div className="p-3">
                    <p className="text-xs font-heading font-semibold text-ink group-hover:text-accent transition-colors">{card.caption}</p>
                    <p className="text-[0.6rem] text-ink-faint font-light mt-0.5">{card.sub}</p>
                  </div>
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
