import { useState, useRef, useEffect } from 'react';
import { useLanguage } from './LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';

const LanguageSelector = () => {
  const { language, setLanguage, languages, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  const current = languages.find(l => l.code === language);

  useEffect(() => {
    const outside = (e) => { if (ref.current && !ref.current.contains(e.target)) setIsOpen(false); };
    document.addEventListener('mousedown', outside);
    return () => document.removeEventListener('mousedown', outside);
  }, []);

  return (
    <div className="fixed top-6 right-6 z-50" ref={ref}>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 border-4 border-ink bg-white px-4 py-2 font-display text-sm font-bold uppercase shadow-brutalSm"
        aria-label={t('language')}
      >
        <span className="text-2xl">{current?.flag}</span>
        <svg animate={{ rotate: isOpen ? 180 : 0 }} className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
        </svg>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute right-0 top-full mt-2 w-48 overflow-hidden border-4 border-ink bg-white shadow-brutal"
          >
            {languages.map((lang) => (
              <button key={lang.code} onClick={() => setLanguage(lang.code)}
                className={`flex w-full items-center gap-3 px-4 py-3 text-left font-display text-sm font-bold uppercase hover:bg-brutalYellow ${language === lang.code ? 'bg-alabaster' : 'text-ink/60'}`}>
                <span className="text-xl">{lang.flag}</span>{lang.name}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LanguageSelector;
