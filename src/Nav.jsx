/**
 * Nav.jsx
 *
 * Site-wide navigation bar with mobile hamburger menu and scroll-shadow behaviour.
 * Extracted from App.jsx to keep it independently testable and maintainable.
 */

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from './LanguageContext'
import LanguageSelector from './LanguageSelector'

/* ── Mobile menu item ─────────────────────────────────────────────────────── */
function MobileMenuItem({ item, index, onClose }) {
  const isRoute = item.href.startsWith('/')
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 + index * 0.06 }}
    >
      {isRoute ? (
        <Link
          to={item.href}
          onClick={onClose}
          className="block text-2xl font-display py-4 text-ink hover:text-accent transition-colors"
        >
          {item.label}
        </Link>
      ) : (
        <a
          href={item.href}
          onClick={(e) => {
            e.preventDefault()
            onClose()
            document.querySelector(item.href)?.scrollIntoView({ behavior: 'smooth' })
          }}
          className="block text-2xl font-display py-4 text-ink hover:text-accent transition-colors"
        >
          {item.label}
        </a>
      )}
    </motion.div>
  )
}

/* ── Nav ──────────────────────────────────────────────────────────────────── */
export default function Nav() {
  const { t } = useLanguage()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  // Scroll shadow
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
      return () => { document.body.style.overflow = '' }
    }
  }, [menuOpen])

  const navLinks = [
    { label: t('aboutLabel'), href: '#about' },
    { label: t('skillsTitle'), href: '#skills' },
    { label: t('awardsTitle'), href: '#awards' },
    { label: 'Works', href: '/works' },
    { label: t('viewPortfolio'), href: '/works' },
    { label: 'Behind the Scenes', href: '/behind-the-scenes' },
  ]

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-[#f7f3ee]/90 backdrop-blur-md' : ''}`}>
        <div className="mx-auto max-w-7xl px-6 md:px-12 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="font-display text-xl italic text-ink hover:text-accent transition-colors">
              Y.S.
            </Link>
            <span className="hidden md:block h-4 w-px bg-ink-faint/20" />
            <span className="hidden md:block page-number">{t('portfolio')}</span>
          </div>

          <div className="flex items-center gap-6">
            {navLinks.map((link) =>
              link.href.startsWith('/') ? (
                <Link
                  key={link.href + link.label}
                  to={link.href}
                  className="page-number hover:text-accent transition-colors hidden md:inline-block"
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.href + link.label}
                  href={link.href}
                  className="page-number hover:text-accent transition-colors hidden md:inline-block"
                >
                  {link.label}
                </a>
              )
            )}

            <LanguageSelector />

            {/* Mobile hamburger */}
            <button
              className="md:hidden flex flex-col gap-1.5 p-2 z-50"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              <motion.span className="block w-5 h-px bg-ink" animate={menuOpen ? { rotate: 45, y: 3.5 } : { rotate: 0, y: 0 }} transition={{ duration: 0.3 }} />
              <motion.span className="block w-5 h-px bg-ink" animate={menuOpen ? { opacity: 0 } : { opacity: 1 }} transition={{ duration: 0.2 }} />
              <motion.span className="block w-5 h-px bg-ink" animate={menuOpen ? { rotate: -45, y: -3.5 } : { rotate: 0, y: 0 }} transition={{ duration: 0.3 }} />
            </button>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-6 md:px-12">
          <div className="h-px bg-gradient-to-r from-transparent via-ink/10 to-transparent" />
        </div>
      </nav>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-[#f7f3ee]/95 backdrop-blur-xl flex items-center justify-center"
            onClick={() => setMenuOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="text-center"
              onClick={(e) => e.stopPropagation()}
            >
              {navLinks.map((item, i) => (
                <MobileMenuItem key={item.label + i} item={item} index={i} onClose={() => setMenuOpen(false)} />
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
