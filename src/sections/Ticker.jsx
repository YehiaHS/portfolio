/**
 * sections/Ticker.jsx — Animated skills ticker bar below the hero
 */
import { motion } from 'framer-motion'
import { useLanguage } from '../LanguageContext'
import { translations } from '../i18n'

export default function Ticker() {
  const { language } = useLanguage()
  const tkr = translations[language]?.ticker || translations.en.ticker
  const items = [tkr.item1, tkr.item2, tkr.item3, tkr.item4]
  const doubled = [...items, ...items, ...items]

  return (
    <div className="relative bg-ink text-paper py-4 overflow-hidden">
      <motion.div
        className="flex whitespace-nowrap gap-8 md:gap-14"
        animate={{ x: [0, -3000] }}
        transition={{ x: { duration: 25, repeat: Infinity, ease: 'linear' } }}
      >
        {doubled.map((item, i) => (
          <span key={i} className="flex items-center gap-8 md:gap-14 text-sm md:text-base font-heading font-medium tracking-[0.15em] uppercase">
            <span>{item}</span>
            <span className="text-accent opacity-50">*</span>
          </span>
        ))}
      </motion.div>
    </div>
  )
}
