import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useLanguage } from './LanguageContext'
import LanguageSelector from './LanguageSelector'
import Cursor from './Cursor'

const SectionShell = ({ id, label, title, children }) => (
  <motion.section
    id={id}
    aria-labelledby={`${id}-title`}
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.6, ease: "easeOut" }}
    className="group relative border-4 border-ink bg-white p-8 shadow-brutal transition hover:-translate-y-1 hover:shadow-[12px_12px_0_0_#0e0e10]"
  >
    <div className="absolute -top-3 -left-3 h-6 w-6 bg-ink" />
    <div className="absolute -top-3 -right-3 h-6 w-6 bg-ink" />
    <div className="absolute -bottom-3 -left-3 h-6 w-6 bg-ink" />
    <div className="absolute -bottom-3 -right-3 h-6 w-6 bg-ink" />
    <div className="flex flex-col gap-8">
      <div className="border-b-4 border-ink pb-4">
        <div className="flex items-center gap-4">
          <div className="h-6 w-6 bg-brutalMagenta shadow-brutalSm animate-flicker" />
          <p className="font-mono text-lg uppercase tracking-widest text-ink font-bold">{label}</p>
        </div>
        <h2 id={`${id}-title`} className="mt-2 text-5xl font-black uppercase md:text-6xl">
          {title}
        </h2>
      </div>
      {children}
    </div>
  </motion.section>
)

SectionShell.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
}

const Hero = () => {
  const { t } = useLanguage()
  const profile = t('profile')

  return (
    <motion.header
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden border-4 border-ink bg-gradient-to-br from-alabaster via-white to-brutalYellow/10 p-10 shadow-brutalLg md:p-20"
    >
      {/* Floating geometric shapes */}
      <motion.div
        animate={{ rotate: 360, scale: [1, 1.1, 1] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute -right-24 top-20 h-72 w-72 border-4 border-ink bg-brutalYellow opacity-90 shadow-brutalLg pointer-events-none"
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="absolute -left-24 bottom-16 h-52 w-52 border-4 border-ink bg-brutalCyan opacity-80 shadow-brutal pointer-events-none"
      />
      <motion.div
        animate={{ y: [-8, 8, -8], rotate: 45 }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute right-16 bottom-20 h-20 w-20 border-4 border-ink bg-brutalMagenta shadow-brutalSm"
      />
      <motion.div
        animate={{ y: [8, -8, 8], rotate: -30 }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-1/3 top-10 h-14 w-14 border-4 border-ink bg-brutalLime rotate-12 shadow-brutalSm"
      />

      <div className="relative z-10 grid gap-12 md:grid-cols-[1.5fr_1fr]">
        <div className="space-y-8">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-block border-4 border-ink bg-brutalLime px-6 py-2 font-mono text-sm uppercase tracking-widest shadow-brutalSm font-bold transform -rotate-2"
          >
            {t('portfolio')}
          </motion.div>

          <div className="space-y-2">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-bold text-ink md:text-4xl font-mono"
            >
              {t('hello')}
            </motion.div>
            <motion.h1
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-6xl font-black leading-[0.9] md:text-8xl lg:text-9xl tracking-tighter mix-blend-darken hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-brutalMagenta hover:to-brutalYellow transition-all duration-300 cursor-default"
            >
              {profile.name.split(' ')[0]}
            </motion.h1>
            <motion.p
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.45 }}
              className="text-3xl font-black text-brutalMagenta leading-tight md:text-4xl lg:text-5xl"
            >
              {profile.name.split(' ').slice(1).join(' ')}
            </motion.p>
          </div>

          <motion.p
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="max-w-xl text-2xl font-bold text-ink border-l-8 border-brutalMagenta pl-6 py-2 bg-alabaster"
          >
            {t('tagline')}
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="max-w-2xl text-lg font-mono leading-relaxed bg-white border-2 border-ink p-4 shadow-brutalSm"
          >
            {profile.summary}
          </motion.p>

          <div className="flex flex-wrap gap-4">
            {profile.highlights.map((item, i) => (
              <motion.span
                key={item}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.7 + (i * 0.1) }}
                whileHover={{ scale: 1.1, rotate: -2 }}
                className="border-2 border-ink bg-brutalCyan px-4 py-2 font-mono text-sm uppercase tracking-widest shadow-brutalSm hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all cursor-crosshair font-bold"
              >
                {item}
              </motion.span>
            ))}
          </div>
        </div>

        {/* Contact sidebar */}
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="relative flex flex-col gap-6 border-4 border-ink bg-ink p-8 text-alabaster shadow-brutalReverse"
        >
          <div className="flex items-center justify-between border-b-4 border-dashed border-alabaster pb-6">
            <span className="font-mono text-sm uppercase tracking-widest text-brutalYellow">{t('contactMe')}</span>
            <span className="bg-brutalLime px-3 py-1 font-mono text-xs uppercase tracking-widest text-ink font-bold animate-pulse">
              {t('available')}
            </span>
          </div>
          <div className="space-y-6 font-mono text-sm">
            <div className="flex flex-col gap-2">
              <span className="text-brutalCyan">{t('whatsapp')}</span>
              <a href={`https://wa.me/${profile.contact.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="bg-brutalYellow text-ink p-2 text-center font-bold hover:bg-white transition-colors">
                {profile.contact.whatsapp}
              </a>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-brutalCyan">{t('phone')}</span>
              <a href={`tel:${profile.contact.phone}`} className="bg-alabaster text-ink p-2 text-center font-bold hover:bg-brutalMagenta hover:text-white transition-colors">
                {profile.contact.phone}
              </a>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-brutalCyan">{t('email')}</span>
              <a href={`mailto:${profile.contact.email}`} className="bg-brutalMagenta text-white p-2 text-center font-bold hover:bg-brutalCyan hover:text-ink transition-colors">
                {profile.contact.email}
              </a>
            </div>
            <div className="flex items-center justify-between border-t-4 border-dashed border-alabaster pt-6">
              <span className="text-brutalYellow">{t('location')}</span>
              <span className="bg-white text-ink px-2 py-1 font-bold text-xs text-right">
                {profile.location}
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.header>
  )
}

const BrutalistTicker = () => {
  const { t } = useLanguage()
  const profile = t('profile')
  const ticker = t('ticker')

  const tickerItems = [
    ticker.item1,
    ticker.item2,
    ...profile.highlights,
    ticker.item3,
    ticker.item4,
  ]

  const loopItems = [...tickerItems, ...tickerItems]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative overflow-hidden border-y-4 border-ink bg-ink text-brutalLime py-6 rotate-1 my-10 shadow-brutal"
    >
      <div className="absolute inset-0 opacity-10">
        <div className="h-full w-full" style={{
          backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)',
        }} />
      </div>
      <div className="flex whitespace-nowrap relative z-10">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="flex min-w-[200%] items-center gap-16"
        >
          {loopItems.map((item, index) => (
            <span
              key={`${item}-${index}`}
              className="flex items-center gap-6 font-display text-4xl uppercase font-black tracking-tighter"
            >
              <span className="text-brutalMagenta">///</span>
              {item}
            </span>
          ))}
        </motion.div>
      </div>
    </motion.div>
  )
}

const SkillsSection = () => {
  const { t } = useLanguage()
  const profile = t('profile')
  return (
    <SectionShell id="skills" label={t('capabilities')} title={t('skillsTitle')}>
      <div className="grid gap-8 md:grid-cols-2">
        {profile.skills.map(({ title, items, accent }, i) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.2 }}
            whileHover={{ scale: 1.02, rotate: 1 }}
            className="flex h-full flex-col gap-6 border-4 border-ink bg-white p-8 shadow-brutalSm hover:bg-ink hover:text-white transition-colors group"
          >
            <div className={`inline-block border-2 border-ink px-4 py-2 font-mono text-sm uppercase tracking-widest shadow-brutalSm ${accent} group-hover:bg-white group-hover:text-ink`}>
              {title}
            </div>
            <ul className="space-y-4 text-lg font-medium">
              {items.map((item) => (
                <li key={item} className="flex items-center gap-4">
                  <span className="h-3 w-3 bg-brutalMagenta group-hover:bg-brutalCyan" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </SectionShell>
  )
}

const AwardsSection = () => {
  const { t } = useLanguage()
  const profile = t('profile')
  const accents = ['bg-brutalYellow', 'bg-brutalCyan', 'bg-brutalMagenta', 'bg-brutalLime', 'bg-ink']
  return (
    <SectionShell id="awards" label={t('recognition')} title={t('awardsTitle')}>
      <div className="grid gap-6 md:grid-cols-2">
        {profile.awards.map((award, i) => (
          <motion.div
            key={award.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ x: 5 }}
            className="flex items-center justify-between border-4 border-ink bg-alabaster px-8 py-6 font-mono text-sm font-bold shadow-brutalSm hover:bg-brutalCyan transition-colors"
          >
            <span className="flex items-center gap-3">
              <span className={`h-3 w-3 ${accents[i % accents.length]}`} />
              {award.name}
            </span>
            <span className="border-2 border-ink bg-white px-4 py-2 text-xs uppercase shadow-brutalSm">
              {award.year}
            </span>
          </motion.div>
        ))}
      </div>
    </SectionShell>
  )
}

const EducationSection = () => {
  const { t } = useLanguage()
  const profile = t('profile')
  return (
    <SectionShell id="education" label={t('educationLabel')} title={t('educationTitle')}>
      <div className="space-y-8">
        {profile.education.map((item, i) => (
          <motion.div
            key={item.degree}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.2 }}
            className="relative border-4 border-ink bg-white p-8 shadow-brutal hover:bg-ink hover:text-white transition-colors group"
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-2xl font-black">{item.degree}</p>
                <p className="text-sm font-mono uppercase tracking-widest text-ink/60 group-hover:text-white/60">{item.institution}</p>
              </div>
              <div className="flex flex-col items-start gap-3 md:items-end">
                {item.location ? (
                  <span className="border-2 border-ink bg-brutalMagenta px-4 py-2 font-mono text-xs uppercase text-white shadow-brutalSm">
                    {item.location}
                  </span>
                ) : null}
                <span className="border-2 border-ink bg-brutalYellow px-4 py-2 font-mono text-xs uppercase shadow-brutalSm text-ink">
                  {item.period}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </SectionShell>
  )
}

const ContactSection = () => {
  const { t } = useLanguage()
  const profile = t('profile')
  return (
    <SectionShell id="contact" label={t('stayInTouch')} title={t('contactTitle')}>
      <div className="grid gap-8 md:grid-cols-[1.2fr_1fr]">
        <div className="border-4 border-ink bg-alabaster p-8 shadow-brutal">
          <h3 className="mb-6 font-mono text-sm uppercase tracking-widest text-ink font-bold">{t('whyReachOut')}</h3>
          <p className="text-xl font-medium leading-relaxed">
            {t('reachOutText')}
          </p>
        </div>
        <div className="flex flex-col gap-6">
          {([
            { href: `mailto:${profile.contact.email}`, text: profile.contact.email, label: t('email'), bg: 'bg-brutalCyan', hoverBg: 'group-hover:bg-ink', hoverText: 'group-hover:text-brutalCyan' },
            { href: `https://wa.me/${profile.contact.whatsapp.replace(/[^0-9]/g, '')}`, text: profile.contact.whatsapp, label: t('whatsapp'), bg: 'bg-brutalMagenta text-white', hoverBg: 'group-hover:bg-ink', hoverText: '' },
            { href: `tel:${profile.contact.phone}`, text: profile.contact.phone, label: t('phone'), bg: 'bg-brutalYellow', hoverBg: 'group-hover:bg-ink', hoverText: 'group-hover:text-brutalYellow' },
          ]).map(({ href, text, label, bg, hoverBg, hoverText }) => (
            <motion.a
              key={label}
              whileHover={{ scale: 1.02, x: 5 }}
              href={href}
              target={href.startsWith('http') ? '_blank' : undefined}
              rel={href.startsWith('http') ? 'noreferrer' : undefined}
              className={`flex items-center justify-between border-4 border-ink ${bg} px-8 py-6 font-mono text-sm uppercase shadow-brutal transition-all hover:-translate-y-2 hover:shadow-brutalLg ${hoverBg} ${hoverText} group`}
            >
              <span className="font-bold">{label}</span>
              <span className={`text-right text-xs normal-case ${hoverText}`}>{text}</span>
            </motion.a>
          ))}
        </div>
      </div>
    </SectionShell>
  )
}

function App() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-alabaster pb-24 cursor-none">
      <Cursor />
      <LanguageSelector />
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-20 px-4 pt-20 md:gap-24 md:px-10">
        <Hero />
        <BrutalistTicker />

        <Link
          to="/portfolio"
          className="group relative block border-4 border-ink bg-ink p-2 shadow-brutal transition-all hover:-translate-y-2 hover:shadow-brutalLg"
        >
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="flex items-center justify-between border-2 border-ink bg-brutalYellow px-10 py-8 transition-colors group-hover:bg-brutalLime"
          >
            <div className="flex items-center gap-6">
              <div className="flex h-16 w-16 items-center justify-center border-4 border-ink bg-white shadow-brutalSm">
                <span className="text-4xl">→</span>
              </div>
              <div>
                <p className="font-mono text-sm uppercase tracking-widest text-ink font-bold">{t('explore')}</p>
                <h3 className="text-4xl font-black uppercase">{t('viewPortfolio')}</h3>
              </div>
            </div>
            <motion.span
              animate={{ x: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="text-6xl font-black"
            >
              →
            </motion.span>
          </motion.div>
        </Link>

        <SkillsSection />
        <AwardsSection />
        <EducationSection />
        <ContactSection />
      </div>
      <footer className="mx-auto mt-24 w-full max-w-7xl px-4 md:px-10">
        <div className="border-4 border-ink bg-ink px-8 py-6 font-mono text-sm uppercase tracking-widest text-alabaster shadow-brutalSm text-center">
          {t('footerText')}
        </div>
      </footer>
    </div>
  )
}

export default App
