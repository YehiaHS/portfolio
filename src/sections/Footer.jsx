/**
 * sections/Footer.jsx
 *
 * Site-wide footer with nav links, contact info, social links, back-to-top button,
 * and the decorative green gradient bar.
 */

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { useLanguage } from '../LanguageContext'

/* ── Scroll-visibility hook ──────────────────────────────────────────────── */
function useScrollBottom(threshold = 600) {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > threshold)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [threshold])
  return visible
}

/* ── BackToTopButton ─────────────────────────────────────────────────────── */
function BackToTopButton() {
  const { scrollYProgress } = useScroll()
  const progress = useTransform(scrollYProgress, [0, 1], [0, 1])
  const circumference = 2 * Math.PI * 18

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-5 right-5 md:bottom-6 md:right-6 z-50 flex items-center justify-center"
      title="Back to top"
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
    >
      <svg viewBox="0 0 44 44" className="w-11 h-11 md:w-12 md:h-12" fill="none">
        <circle cx="22" cy="22" r="18" strokeWidth="1.5" fill="#0d1410" stroke="#5a6a5e" strokeOpacity="0.3" />
        <motion.circle
          cx="22" cy="22" r="18"
          strokeWidth="1.5"
          strokeLinecap="round"
          stroke="#4a9f62"
          fill="none"
          strokeDasharray={circumference}
          style={{ strokeDashoffset: useTransform(progress, (v) => circumference * (1 - v)) }}
          transform="rotate(-90 22 22)"
        />
        <polyline points="28,24 22,18 16,24" stroke="#c8d8cc" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </motion.button>
  )
}

/* ── Footer ──────────────────────────────────────────────────────────────── */
export default function Footer() {
  const { t } = useLanguage()
  const profile = t('profile')
  const showBackToTop = useScrollBottom(600)

  const navLinks = [
    { label: 'About', href: '#about' },
    { label: t('skillsTitle'), href: '#skills' },
    { label: t('awardsTitle'), href: '#awards' },
    { label: t('educationTitle'), href: '#education' },
    { label: t('contactMe'), href: '#contact' },
  ]

  return (
    <footer className="relative bg-ink text-paper/70">
      {/* Top accent line */}
      <div className="h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />

      <div className="mx-auto max-w-7xl px-6 md:px-8 lg:px-12 py-12 md:py-16 lg:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-8 md:gap-12">
          {/* Brand column */}
          <div className="md:col-span-4">
            <h3 className="font-display text-2xl italic text-white mb-4">Yehia Salem</h3>
            <p className="text-sm text-paper/40 font-light leading-relaxed max-w-xs">{t('tagline')}</p>
          </div>

          {/* Nav links */}
          <div className="md:col-span-3">
            <p className="section-number mb-4">Navigate</p>
            <div className="space-y-2">
              {navLinks.map((link) => (
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
              <a href="https://github.com/yehiasalem" target="_blank" rel="noreferrer" className="block text-sm text-paper/50 hover:text-accent transition-colors font-light">GitHub</a>
              <a href="https://linkedin.com/in/yehiahatemsalem" target="_blank" rel="noreferrer" className="block text-sm text-paper/50 hover:text-accent transition-colors font-light">LinkedIn</a>
              <Link to="/works" className="block text-sm text-paper/50 hover:text-accent transition-colors font-light">Works Archive</Link>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 pt-6 border-t border-paper/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[0.65rem] text-paper/30 tracking-wider font-light">
            {t('footerText')} &mdash; {new Date().getFullYear()}
          </p>
          <p className="text-[0.65rem] text-paper/30 tracking-wider font-light">{t('precision')}</p>
        </div>
      </div>

      {/* Green gradient bar */}
      <div className="relative h-3 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#1a3526] via-[#2d5a3d] to-[#4a8f5c]" />
        <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 720 12" preserveAspectRatio="none">
          {Array.from({ length: 30 }).map((_, i) => (
            <rect key={i} x={i * 24 + 6} y="2" width="6" height="8" transform={`rotate(45 ${i * 24 + 9} 6)`}
              fill="#f5f5f0" opacity={i % 3 === 0 ? '0.4' : i % 3 === 1 ? '0.25' : '0.15'} />
          ))}
        </svg>
      </div>

      {/* Back to top */}
      <AnimatePresence>{showBackToTop && <BackToTopButton />}</AnimatePresence>
    </footer>
  )
}
