import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useLanguage } from './LanguageContext'
import LanguageSelector from './LanguageSelector'

const stripArrows = (label) => label.replace(/[←→]/g, '').trim()

function MobileMenuItem({ item, index, onClose }) {
  const itemClassName = 'site-nav__mobile-link'

  if (item.type === 'route') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12 + index * 0.05 }}
      >
        <Link to={item.href} onClick={onClose} className={itemClassName}>
          {item.label}
        </Link>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.12 + index * 0.05 }}
    >
      <a href={item.href} onClick={onClose} className={itemClassName}>
        {item.label}
      </a>
    </motion.div>
  )
}

export default function Nav() {
  const { t } = useLanguage()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (!menuOpen) {
      document.body.style.overflow = ''
      return undefined
    }

    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  const homeHash = (id) => `${import.meta.env.BASE_URL}#${id}`
  const navLinks = [
    { label: t('aboutLabel'), href: homeHash('about'), type: 'anchor' },
    { label: t('skillsTitle'), href: homeHash('skills'), type: 'anchor' },
    { label: t('awardsTitle'), href: homeHash('awards'), type: 'anchor' },
    { label: 'Works', href: '/works', type: 'route' },
    { label: stripArrows(t('viewPortfolio')), href: '/works', type: 'route' },
    { label: 'Behind the Scenes', href: '/behind-the-scenes', type: 'route' },
  ]

  return (
    <>
      <nav className={`site-nav ${scrolled ? 'site-nav--scrolled' : ''}`}>
        <div className="site-nav__inner">
          <div className="site-nav__brand-group">
            <Link to="/" className="site-nav__brand">
              Y.S.
            </Link>
            <span className="site-nav__divider" aria-hidden="true" />
            <span className="site-nav__label">{t('portfolio')}</span>
          </div>

          <div className="site-nav__links">
            {navLinks.map((link) =>
              link.type === 'route' ? (
                <Link key={`${link.href}-${link.label}`} to={link.href} className="site-nav__link">
                  {link.label}
                </Link>
              ) : (
                <a key={`${link.href}-${link.label}`} href={link.href} className="site-nav__link">
                  {link.label}
                </a>
              )
            )}
          </div>

          <div className="site-nav__controls">
            <LanguageSelector />

            <button
              className="site-nav__menu-button"
              onClick={() => setMenuOpen((value) => !value)}
              aria-label="Toggle navigation menu"
              aria-expanded={menuOpen}
            >
              <motion.span
                animate={menuOpen ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.25 }}
              />
              <motion.span
                animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
                transition={{ duration: 0.2 }}
              />
              <motion.span
                animate={menuOpen ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.25 }}
              />
            </button>
          </div>
        </div>

        <div className="site-nav__line" aria-hidden="true" />
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="site-nav__mobile-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMenuOpen(false)}
          >
            <motion.div
              className="site-nav__mobile-panel"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 18 }}
              transition={{ duration: 0.3 }}
              onClick={(event) => event.stopPropagation()}
            >
              {navLinks.map((item, index) => (
                <MobileMenuItem
                  key={`${item.href}-${item.label}`}
                  item={item}
                  index={index}
                  onClose={() => setMenuOpen(false)}
                />
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
