import { createContext, useContext, useState, useEffect } from 'react';
import { translations, languages } from './i18n';

const LanguageContext = createContext();

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be within LanguageProvider');
  return ctx;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    try {
      const s = localStorage.getItem('lang');
      if (s && translations[s]) return s;
    } catch { /* noop */ }
    return 'en';
  });

  const current = languages.find(l => l.code === language);
  const isRTL = current?.rtl || false;

  useEffect(() => {
    try { localStorage.setItem('lang', language); } catch {}
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language, isRTL]);

  const t = (k) => translations[language]?.[k] || translations.en[k] || k;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL, languages }}>
      {children}
    </LanguageContext.Provider>
  );
};
