/**
 * sections/DecorativeBreaks.jsx
 *
 * All the visual "break" dividers used between sections:
 *   - BotanicalBreak (between About & Skills)
 *   - MarqueeStrip (scrolling text band)
 *   - GeometricPatternBand (between Skills & Awards)
 *   - DecorativeEmblem (between Awards & Education)
 *   - DecorativeBreak (generic letter splitter)
 */
import { motion } from 'framer-motion'

/* ── BotanicalBreak ──────────────────────────────────────────────────────── */
export function BotanicalBreak() {
  return (
    <div className="relative py-16 md:py-24 flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#2d5a3d]/[0.02] to-transparent" />
      <svg className="relative w-32 md:w-48 lg:w-64 opacity-20" viewBox="0 0 200 200" fill="none">
        <path d="M100 15 C 140 50 170 90 100 185 C 30 90 60 50 100 15Z" fill="url(#bb-leaf1)" stroke="#2d5a3d" strokeWidth="0.8" />
        <line x1="100" y1="25" x2="100" y2="175" stroke="#2d5a3d" strokeWidth="0.5" opacity="0.6" />
        <path d="M100 50 Q 130 60 145 80" stroke="#2d5a3d" strokeWidth="0.4" opacity="0.4" />
        <path d="M100 80 Q 75 90 60 110" stroke="#2d5a3d" strokeWidth="0.4" opacity="0.4" />
        <path d="M100 110 Q 125 115 135 135" stroke="#2d5a3d" strokeWidth="0.4" opacity="0.4" />
        <path d="M100 140 Q 78 145 70 160" stroke="#2d5a3d" strokeWidth="0.4" opacity="0.4" />
        <path d="M100 30 C 120 50 150 60 100 100 C 70 60 90 50 100 30Z" fill="url(#bb-leaf2)" opacity="0.5" transform="rotate(-30 100 50)" />
        <defs>
          <linearGradient id="bb-leaf1" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#2d5a3d" stopOpacity="0.3" /><stop offset="100%" stopColor="#4a8f5c" stopOpacity="0.1" />
          </linearGradient>
          <linearGradient id="bb-leaf2" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#4a8f5c" stopOpacity="0.2" /><stop offset="100%" stopColor="#2d5a3d" stopOpacity="0.05" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute left-0 right-0 flex justify-center">
        <div className="w-px h-full bg-gradient-to-b from-transparent via-accent/10 to-transparent" />
      </div>
    </div>
  )
}

/* ── MarqueeStrip ────────────────────────────────────────────────────────── */
export function MarqueeStrip() {
  const text = 'INTEGRATED MARKETING  \u2022  COMPUTER SCIENCE  \u2022  DESIGN  \u2022  STORYTELLING  \u2022  CREATIVE TECHNOLOGY  \u2022  VISUAL COMMUNICATION  \u2022  '
  const doubled = text.repeat(6)
  return (
    <div className="relative border-y border-ink/10 bg-paper-dark py-3 overflow-hidden">
      <motion.div className="flex whitespace-nowrap" animate={{ x: [0, -1500] }} transition={{ x: { duration: 40, repeat: Infinity, ease: 'linear' } }}>
        <span className="text-[0.65rem] font-heading font-semibold tracking-[0.2em] text-ink-faint/50 uppercase">{doubled}</span>
      </motion.div>
    </div>
  )
}

/* ── GeometricPatternBand ────────────────────────────────────────────────── */
export function GeometricPatternBand() {
  return (
    <div className="relative h-32 md:h-40 overflow-hidden bg-[#1a3526]">
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1440 160" fill="none" preserveAspectRatio="none">
        {Array.from({ length: 36 }).map((_, i) => (
          <line key={`v${i}`} x1={i * 40} y1="0" x2={i * 40} y2="160" stroke="#2d5a3d" strokeWidth="0.3" opacity="0.3" />
        ))}
        {Array.from({ length: 5 }).map((_, i) => (
          <line key={`h${i}`} x1="0" y1={i * 40} x2="1440" y2={i * 40} stroke="#2d5a3d" strokeWidth="0.3" opacity="0.3" />
        ))}
        {Array.from({ length: 18 }).map((_, i) => (
          <rect key={`d${i}`} x={i * 80 + 30} y={i % 2 === 0 ? 10 : 50} width="20" height="20"
            transform={`rotate(45 ${i * 80 + 40} ${i % 2 === 0 ? 20 : 60})`}
            fill="#4a8f5c" opacity={i % 3 === 0 ? '0.25' : i % 3 === 1 ? '0.15' : '0.08'} />
        ))}
        <circle cx="200" cy="80" r="50" stroke="#4a8f5c" strokeWidth="0.5" opacity="0.15" />
        <circle cx="720" cy="80" r="60" stroke="#4a8f5c" strokeWidth="0.5" opacity="0.12" />
        <circle cx="1240" cy="80" r="45" stroke="#4a8f5c" strokeWidth="0.5" opacity="0.15" />
        <path d="M0 100 Q 360 40, 720 100 Q 1080 160, 1440 100" stroke="#4a8f5c" strokeWidth="1" opacity="0.2" />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-[#f5f5f0]/30 text-[0.6rem] font-heading font-semibold tracking-[0.3em] uppercase">
          Craft &middot; Code &middot; Create
        </span>
      </div>
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#4a8f5c]/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#4a8f5c]/30 to-transparent" />
    </div>
  )
}

/* ── DecorativeEmblem ────────────────────────────────────────────────────── */
export function DecorativeEmblem() {
  return (
    <div className="relative py-16 md:py-20 flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#2d5a3d]/[0.015] to-transparent" />
      <motion.div initial={{ scale: 0.8, opacity: 0 }} whileInView={{ scale: 1, opacity: 0.25 }} viewport={{ once: true }} transition={{ duration: 1 }} className="relative">
        <svg className="w-28 md:w-40" viewBox="0 0 120 120" fill="none">
          <circle cx="60" cy="60" r="55" stroke="#2d5a3d" strokeWidth="0.8" strokeDasharray="3 5" />
          <circle cx="60" cy="60" r="48" stroke="#4a8f5c" strokeWidth="0.5" />
          <circle cx="60" cy="60" r="42" stroke="#2d5a3d" strokeWidth="0.3" />
          <path d="M60 18 L64 52 L98 60 L64 68 L60 102 L56 68 L22 60 L56 52Z" fill="#2d5a3d" opacity="0.2" stroke="#2d5a3d" strokeWidth="0.5" />
          <rect x="48" y="48" width="24" height="24" transform="rotate(45 60 60)" stroke="#4a8f5c" strokeWidth="0.6" fill="#4a8f5c" fillOpacity="0.08" />
          <circle cx="60" cy="60" r="3" fill="#2d5a3d" opacity="0.3" />
          {[0, 90, 180, 270].map((angle, i) => (
            <line key={i}
              x1={60 + 38 * Math.cos(angle * Math.PI / 180)} y1={60 + 38 * Math.sin(angle * Math.PI / 180)}
              x2={60 + 44 * Math.cos(angle * Math.PI / 180)} y2={60 + 44 * Math.sin(angle * Math.PI / 180)}
              stroke="#2d5a3d" strokeWidth="1" />
          ))}
        </svg>
        <div className="absolute -top-2 -left-2 w-3 h-3 border-t border-l border-accent/20" />
        <div className="absolute -bottom-2 -right-2 w-3 h-3 border-b border-r border-accent/20" />
      </motion.div>
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-40 md:w-80 h-px bg-gradient-to-r from-transparent via-accent/10 to-transparent" />
    </div>
  )
}

/* ── DecorativeBreak ─────────────────────────────────────────────────────── */
export function DecorativeBreak({ letter }) {
  return (
    <div className="flex items-center justify-center py-6 md:py-10 lg:py-14">
      <div className="h-px flex-1 bg-gradient-to-r from-transparent to-ink/10" />
      <motion.span
        initial={{ scale: 0.5, opacity: 0 }} whileInView={{ scale: 1, opacity: 0.06 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
        className="px-8 md:px-12 lg:px-16 font-display italic text-accent" style={{ fontSize: 'clamp(2.5rem, 8vw, 6rem)' }}>
        {letter}
      </motion.span>
      <div className="h-px flex-1 bg-gradient-to-l from-transparent to-ink/10" />
    </div>
  )
}

/* ── Grain Overlay ───────────────────────────────────────────────────────── */
export function Grain() {
  return (
    <svg className="fixed inset-0 w-full h-full pointer-events-none z-[9998] opacity-[0.035] mix-blend-overlay" style={{ pointerEvents: 'none' }}>
      <filter id="noiseFilter">
        <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch">
          <animate attributeName="baseFrequency" values="0.8;0.82;0.79;0.8" dur="0.3s" repeatCount="indefinite" />
        </feTurbulence>
      </filter>
      <rect width="100%" height="100%" filter="url(#noiseFilter)" />
    </svg>
  )
}

/* ── SectionNav dots ─────────────────────────────────────────────────────── */
const SECTIONS = [
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'values', label: 'Values' },
  { id: 'awards', label: 'Awards' },
  { id: 'tools', label: 'Tools' },
  { id: 'education', label: 'Education' },
  { id: 'contact', label: 'Contact' },
]

import { useState, useEffect } from 'react'

export function SectionNav() {
  const [active, setActive] = useState(SECTIONS[0].id)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting)
        if (visible.length > 0) setActive(visible[0].target.id)
      },
      { rootMargin: '-40% 0px -40% 0px' }
    )
    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <motion.div className="fixed right-4 top-[50%] -translate-y-[50%] -translate-x-8 z-40 hidden lg:flex pointer-events-none" key={active} initial={{ x: -4, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.3 }}>
        <span className="page-number text-[0.5rem] tracking-widest rotate-90 whitespace-nowrap" style={{ color: '#2d5a3d' }}>{active.toUpperCase()}</span>
      </motion.div>
      <div className="fixed right-4 md:right-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col gap-3 items-center">
        {SECTIONS.map((s) => (
          <button key={s.id} onClick={() => document.getElementById(s.id)?.scrollIntoView({ behavior: 'smooth' })} className="group flex items-center gap-1.5" title={s.label}>
            <motion.span className={`block rounded-full transition-all duration-300 ${active === s.id ? 'bg-accent w-2 h-2' : 'bg-ink-faint/30 w-1.5 h-1.5 group-hover:bg-ink-faint/60'}`} whileHover={{ scale: 1.5 }} />
          </button>
        ))}
      </div>
    </>
  )
}

/* ── KeyboardShortcuts ───────────────────────────────────────────────────── */
const ALL_SECTIONS = [
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'values', label: 'Values' },
  { id: 'awards', label: 'Awards' },
  { id: 'tools', label: 'Tools' },
  { id: 'education', label: 'Education' },
  { id: 'interests', label: 'Interests' },
  { id: 'contact', label: 'Contact' },
]

import { AnimatePresence } from 'framer-motion'

export function KeyboardShortcuts() {
  const [open, setOpen] = useState(false)
  useEffect(() => {
    const handler = (e) => {
      if (e.key === '?' || (e.key === '/' && e.shiftKey)) { e.preventDefault(); setOpen((p) => !p) }
      else if (e.key === 'Escape') setOpen(false)
      else if (e.key === 'Home') window.scrollTo({ top: 0, behavior: 'smooth' })
      else {
        const num = parseInt(e.key)
        if (num >= 1 && num <= ALL_SECTIONS.length) { e.preventDefault(); document.getElementById(ALL_SECTIONS[num - 1].id)?.scrollIntoView({ behavior: 'smooth' }) }
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setOpen(false)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }} onClick={(e) => e.stopPropagation()} className="bg-paper border border-ink/10 rounded-lg shadow-2xl max-w-sm w-full mx-4 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-heading font-semibold tracking-wider uppercase text-accent">Keyboard Shortcuts</h3>
                <button onClick={() => setOpen(false)} className="text-ink-faint hover:text-ink transition-colors" aria-label="Close">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>
              <div className="space-y-3">
                {ALL_SECTIONS.map((s, i) => (
                  <button key={s.id} onClick={() => { setOpen(false); document.getElementById(s.id)?.scrollIntoView({ behavior: 'smooth' }) }} className="flex items-center justify-between w-full group">
                    <span className="text-sm text-ink/80 group-hover:text-accent transition-colors">{s.label}</span>
                    <kbd className="px-2 py-0.5 text-xs font-mono bg-paper-dark border border-ink/10 rounded text-ink-faint">{i + 1}</kbd>
                  </button>
                ))}
              </div>
              <button onClick={() => setOpen(false)} className="mt-5 w-full py-2 text-xs font-heading tracking-wider uppercase border border-ink/20 rounded-sm text-ink-faint hover:text-ink hover:border-accent transition-colors">Close</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="fixed bottom-5 left-5 z-50 hidden md:flex items-center gap-1.5">
        <kbd className="px-1.5 py-0.5 text-[0.55rem] font-mono bg-paper/80 border border-ink/10 rounded-sm text-ink-faint/60 backdrop-blur-sm">?</kbd>
        <span className="text-[0.55rem] text-ink-faint/40">Shortcuts</span>
      </div>
    </>
  )
}
