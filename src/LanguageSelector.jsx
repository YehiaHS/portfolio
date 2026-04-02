import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from './LanguageContext';

const LANGUAGES = [
  { code: 'en', label: 'EN', name: 'English', flag: '\uD83C\uDDFA\uD83C\uDDF8', dir: 'ltr' },
  { code: 'ar', label: 'AR', name: '\u0627\u0644\u0639\u0631\u0628\u064A\u0629', flag: '\uD83C\uDDF8\uD83C\uDDE6', dir: 'rtl' },
  { code: 'fr', label: 'FR', name: 'Fran\u00E7ais', flag: '\uD83C\uDDEB\uD83C\uDDF7', dir: 'ltr' },
];

const LanguageSelector = () => {
  const { language, setLanguage } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const outside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', outside);
    return () => document.removeEventListener('mousedown', outside);
  }, []);

  const current = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];

  return (
    <div className="relative" ref={ref}>
      {/* Elegant button — just the code + small chevron */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Select language"
        aria-expanded={open}
        className="group flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-ink/10 text-ink-light hover:text-accent hover:border-accent/30 transition-colors duration-300 select-none"
        style={{ cursor: 'pointer' }}
      >
        <span
          className="text-[13px] font-semibold tracking-widest tabular-nums"
          style={{ fontVariantNumeric: 'tabular-nums' }}
        >
          {current.label}
        </span>
        <motion.svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="text-ink-light/40 group-hover:text-accent/60 transition-colors duration-300"
        >
          <path
            d="M2 3.5L5 6.5L8 3.5"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </motion.svg>
      </motion.button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={() => setOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.96 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="absolute right-0 top-full mt-2 z-50 min-w-[200px] overflow-hidden rounded-xl border border-pearl/10 bg-[#fefcf9] shadow-[0_8px_32px_rgba(0,0,0,0.08)] backdrop-blur-sm"
              role="listbox"
              aria-label="Languages"
            >
              <div className="py-2">
                {/* Header */}
                <div
                  className="px-5 pb-2 pt-1 text-[10px] font-semibold tracking-[0.14em] uppercase text-ink-light/30"
                  style={{ borderBottom: '1px solid rgba(26,26,26,0.06)' }}
                >
                  Language
                </div>

                {LANGUAGES.map((lang, index) => {
                  const active = language === lang.code;
                  return (
                    <motion.button
                      key={lang.code}
                      role="option"
                      aria-selected={active}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.04, ease: [0.22, 1, 0.36, 1] }}
                      onClick={() => {
                        setLanguage(lang.code);
                        setOpen(false);
                      }}
                      className="flex w-full items-center gap-3 px-5 py-[10px] text-sm transition-colors duration-200 hover:bg-accent/[0.04]"
                    >
                      <span className="text-base leading-none" role="img">
                        {lang.flag}
                      </span>

                      <span
                        className={`flex-1 text-left font-medium transition-colors duration-200 ${
                          active ? 'text-accent' : 'text-ink-light/60 group-hover:text-ink-light'
                        }`}
                        dir={lang.dir}
                        lang={lang.code}
                      >
                        {lang.name}
                      </span>

                      {/* Checkmark */}
                      <AnimatePresence>
                        {active && (
                          <motion.svg
                            width="14"
                            height="14"
                            viewBox="0 0 14 14"
                            fill="none"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{ duration: 0.2, ease: [0.34, 1.56, 0.64, 1] }}
                            className="flex-shrink-0 text-accent"
                          >
                            <path
                              d="M3 7.5L5.5 10L11 4"
                              stroke="currentColor"
                              strokeWidth="1.6"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </motion.svg>
                        )}
                      </AnimatePresence>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LanguageSelector;
