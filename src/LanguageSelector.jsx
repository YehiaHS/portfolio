import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from './LanguageContext';

const LanguageSelector = () => {
  const { language, setLanguage, languages } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const outside = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false);
    document.addEventListener('mousedown', outside);
    return () => document.removeEventListener('mousedown', outside);
  }, []);

  const current = languages.find(l => l.code === language);

  return (
    <div className="relative" ref={ref}>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-4 py-2 border border-pearl/10 rounded-full backdrop-blur-sm bg-noir/60 text-cream/60 hover:text-amber hover:border-amber/30 transition-all duration-300"
      >
        <span className="text-lg">{current?.flag}</span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-full mt-3 glass rounded-xl overflow-hidden min-w-[160px]"
          >
            {languages.map(lang => (
              <button
                key={lang.code}
                onClick={() => { setLanguage(lang.code); setOpen(false); }}
                className="flex w-full items-center gap-3 px-5 py-3 text-sm font-sans hover:bg-pearl/5 transition-colors"
              >
                <span className="text-lg">{lang.flag}</span>
                <span className={language === lang.code ? 'text-amber' : 'text-cream/60'}>
                  {lang.name}
                </span>
                {language === lang.code && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-amber" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LanguageSelector;
