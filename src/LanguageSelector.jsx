import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useLanguage } from './LanguageContext'

const LANGUAGES = [
  { code: 'en', label: 'EN', name: 'English' },
  { code: 'ar', label: 'AR', name: 'العربية' },
  { code: 'fr', label: 'FR', name: 'Français' },
]

export default function LanguageSelector() {
  const { language, setLanguage } = useLanguage()
  const [open, setOpen] = useState(false)
  const containerRef = useRef(null)
  const currentLanguage = LANGUAGES.find((item) => item.code === language) || LANGUAGES[0]

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [])

  return (
    <div className="language-switcher" ref={containerRef}>
      <motion.button
        type="button"
        className="language-toggle"
        whileHover={{ y: -1 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setOpen((value) => !value)}
        aria-label="Select language"
        aria-expanded={open}
      >
        <span>{currentLanguage.label}</span>
        <motion.span
          className="language-toggle__chevron"
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25 }}
          aria-hidden="true"
        >
          ∨
        </motion.span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="language-menu"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.22 }}
            role="listbox"
            aria-label="Languages"
          >
            {LANGUAGES.map((item) => {
              const active = item.code === language
              return (
                <button
                  key={item.code}
                  type="button"
                  role="option"
                  aria-selected={active}
                  className={`language-menu__item ${active ? 'language-menu__item--active' : ''}`}
                  onClick={() => {
                    setLanguage(item.code)
                    setOpen(false)
                  }}
                >
                  <span>{item.name}</span>
                  {active && <span aria-hidden="true">•</span>}
                </button>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
