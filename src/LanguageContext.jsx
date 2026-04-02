import { createContext, useContext, useState, useEffect } from 'react';
import { translations, languages } from './i18n';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    try {
      const saved = localStorage.getItem('language');
      if (saved && translations[saved]) return saved;
    } catch (e) {}
    return 'en';
  });

  const currentLang = languages.find(l => l.code === language);
  const isRTL = currentLang?.rtl || false;

  useEffect(() => {
    try { localStorage.setItem('language', language); } catch (e) {}
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language, isRTL]);

  const t = (key) => translations[language]?.[key] || translations.en[key] || key;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL, languages }}>
      {children}
    </LanguageContext.Provider>
  );
};
