import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { useLanguage } from './LanguageContext'
import LanguageSelector from './LanguageSelector'
import Cursor from './Cursor'

/* ──────────────────────── STAGGER VARIANTS ──────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (delay = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.7, delay, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
}

const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: (delay = 0) => ({
    opacity: 1, scale: 1,
    transition: { duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
}

/* ──────────────────────── SECTION WRAPPER ──────────────────────── */
const AnimatedSection = ({ children, className = '', delay = 0 }) => {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={fadeUp(0)}
      transition={fadeUp.visible(delay).transition}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/* ──────────────────────── HERO ──────────────────────── */
const Hero = () => {
  const { t } = useLanguage()

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6">
      {/* Floating orbs */}
      <motion.div
        animate={{ y: [-20, 20, -20], opacity: [0.25, 0.4, 0.25] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute right-[12%] top-[18%] h-64 w-64 rounded-full bg-amber/10 blur-3xl"
      />
      <motion.div
        animate={{ y: [15, -25, 15], opacity: [0.15, 0.3, 0.15] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        className="absolute left-[8%] bottom-[20%] h-80 w-80 rounded-full bg-dusk/10 blur-3xl"
      />
      <motion.div
        animate={{ y: [-10, 18, -10], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
        className="absolute left-[35%] top-[10%] h-48 w-48 rounded-full bg-rose/10 blur-3xl"
      />

      {/* Thin decorative cross-lines */}
      <div className="pointer-events-none absolute inset-0" style={{
        backgroundImage: `
          linear-gradient(90deg, rgba(245,166,35,0.06) 1px, transparent 1px),
          linear-gradient(0deg, rgba(245,166,35,0.04) 1px, transparent 1px)
        `,
        backgroundSize: '120px 120px',
        opacity: 0.5,
      }} />

      <div className="relative z-10 mx-auto max-w-5xl text-center">
        {/* Top label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8 inline-flex items-center gap-3"
        >
          <span className="section-badge">{t('portfolio')}</span>
        </motion.div>

        {/* Greeting */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-4 font-mono text-sm tracking-[0.2em] text-cream/40 uppercase"
        >
          {t('hello')}
        </motion.p>

        {/* Name — massive serif */}
        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="leading-[0.9] tracking-tight"
        >
          <span className="block text-6xl font-bold md:text-8xl lg:text-9xl text-pearl">
            Yehia
          </span>
          <span className="block text-5xl font-medium md:text-7xl lg:text-8xl font-accent italic text-amber/80">
            Salem
          </span>
        </motion.h1>

        {/* Thin amber divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 1, ease: 'easeOut' }}
          className="my-8 h-px w-32 mx-auto origin-left bg-gradient-to-r from-amber to-transparent"
        />

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="mx-auto max-w-xl font-accent text-xl md:text-2xl italic text-cream/60 leading-relaxed"
        >
          {t('tagline')}
        </motion.p>

        {/* Location pill */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.5 }}
          className="mt-6 font-mono text-xs tracking-widest text-wheat/50"
        >
          {t('location')}
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.7 }}
          className="mt-10 flex flex-wrap justify-center gap-6"
        >
          <a
            href="#work"
            className="glow-link inline-block border border-amber/30 px-8 py-3 font-mono text-xs tracking-[0.2em] uppercase text-amber hover:border-amber"
          >
            View Work
          </a>
          <Link
            to="/portfolio"
            className="glow-link inline-block bg-amber/10 border border-amber/20 px-8 py-3 font-mono text-xs tracking-[0.2em] uppercase text-pearl hover:bg-amber/20"
          >
            {t('viewPortfolio')}
          </Link>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="w-px h-12 bg-gradient-to-b from-amber/40 to-transparent"
        />
      </motion.div>
    </section>
  )
}

/* ──────────────────────── ABOUT ──────────────────────── */
const About = () => {
  const { t } = useLanguage()
  const profile = t('profile')

  return (
    <section id="about" className="relative py-28 px-6">
      <div className="mx-auto max-w-5xl">
        <div className="grid gap-16 lg:grid-cols-[1fr_1.2fr]">
          {/* Left — visual block */}
          <AnimatedSection className="relative flex items-center">
            <div className="relative w-full aspect-[3/4] max-w-xs mx-auto">
              <div className="absolute inset-0 bg-gradient-to-br from-amber/20 to-dusk/10 rounded-lg" />
              <div className="absolute inset-[2px] bg-noir rounded-lg flex items-center justify-center p-8">
                <div className="text-center">
                  <span className="block text-8xl font-bold text-amber/30 font-serif">YS</span>
                  <div className="w-12 h-px bg-amber/30 mx-auto my-4" />
                  <p className="font-mono text-[0.6rem] tracking-[0.3em] uppercase text-cream/30">
                    Est. {new Date().getFullYear() - 2}
                  </p>
                </div>
              </div>
              {/* Corner accent */}
              <div className="absolute -top-3 -right-3 w-6 h-6 border-t border-r border-amber/40" />
              <div className="absolute -bottom-3 -left-3 w-6 h-6 border-b border-l border-amber/40" />
            </div>
          </AnimatedSection>

          {/* Right — text */}
          <div className="space-y-8">
            <AnimatedSection delay={0.15}>
              <span className="section-badge">About</span>
            </AnimatedSection>
            <AnimatedSection delay={0.3}>
              <h2 className="text-4xl md:text-5xl font-semibold leading-tight">
                Bridging <span className="italic text-amber/80 font-serif">creativity</span>
                <br />and <span className="italic text-copper/80 font-serif">technology</span>
              </h2>
            </AnimatedSection>
            <AnimatedSection delay={0.45}>
              <p className="text-pearl/60 text-lg leading-relaxed max-w-lg">
                {profile.summary}
              </p>
            </AnimatedSection>

            {/* Highlights as tags */}
            <AnimatedSection delay={0.6}>
              <div className="flex flex-wrap gap-3">
                {profile.highlights.map((item, i) => (
                  <motion.span
                    key={item}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ y: -2, borderColor: 'rgba(245,166,35,0.5)' }}
                    className="px-4 py-2 text-sm text-cream/70 border border-pearl/10 rounded-full cursor-default transition-colors"
                  >
                    {item}
                  </motion.span>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ──────────────────────── SKILLS ──────────────────────── */
const Skills = () => {
  const { t } = useLanguage()
  const profile = t('profile')

  return (
    <section id="skills" className="relative py-28 px-6">
      {/* Background accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-graphite/50 to-transparent pointer-events-none" />

      <div className="relative mx-auto max-w-5xl">
        <AnimatedSection>
          <div className="mb-16">
            <span className="section-highlight mb-4">
              {/* Section title */}
            </span>
            <span className="section-badge mb-4 inline-block">{t('capabilities')}</span>
            <h2 className="text-4xl md:text-5xl font-semibold">{t('skillsTitle')}</h2>
          </div>
        </AnimatedSection>

        <div className="grid gap-6 md:grid-cols-2">
          {profile.skills.map((skill, i) => (
            <AnimatedSection key={skill.title} delay={i * 0.1}>
              <motion.div
                whileHover={{ y: -4, borderColor: 'rgba(245,166,35,0.15)' }}
                className="card rounded-lg p-8 border border-pearl/4 h-full transition-all duration-300"
              >
                <h3 className="text-lg font-semibold mb-5 text-amber/90">{skill.title}</h3>
                <ul className="space-y-3">
                  {skill.items.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-cream/60 text-sm">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-amber/40 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ──────────────────────── AWARDS TIMELINE ──────────────────────── */
const Awards = () => {
  const { t } = useLanguage()
  const profile = t('profile')
  const accentColors = [
    'bg-amber',
    'bg-copper',
    'bg-rose',
    'bg-dusk',
    'bg-amber/70',
  ]

  return (
    <section id="awards" className="relative py-28 px-6">
      <div className="mx-auto max-w-5xl">
        <AnimatedSection>
          <span className="section-badge mb-4 inline-block">{t('recognition')}</span>
          <h2 className="text-4xl md:text-5xl font-semibold mb-4">{t('awardsTitle')}</h2>
        </AnimatedSection>

        <AnimatedSection delay={0.2}>
          <div className="relative mt-12 border-l border-pearl/10">
            {profile.awards.map((award, i) => (
              <motion.div
                key={award.name}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                className="relative pl-8 pb-10 last:pb-0 group cursor-default"
              >
                {/* Timeline dot */}
                <span className={`absolute -left-[7px] top-1 h-3 w-3 rounded-full ${accentColors[i % accentColors.length]} transition-shadow group-hover:shadow-glow`} />

                {/* Year badge */}
                <span className="inline-block mb-2 font-mono text-xs tracking-widest text-wheat/40">
                  {award.year}
                </span>

                {/* Award name */}
                <h4 className="text-xl font-medium text-pearl/80 group-hover:text-amber/90 transition-colors">
                  {award.name}
                </h4>
              </motion.div>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}

/* ──────────────────────── EDUCATION ──────────────────────── */
const Education = () => {
  const { t } = useLanguage()
  const profile = t('profile')

  return (
    <section id="education" className="relative py-28 px-6">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-graphite/40 to-transparent pointer-events-none" />

      <div className="relative mx-auto max-w-5xl">
        <AnimatedSection>
          <span className="section-badge mb-4 inline-block">{t('educationLabel')}</span>
          <h2 className="text-4xl md:text-5xl font-semibold mb-12">{t('educationTitle')}</h2>
        </AnimatedSection>

        <div className="space-y-6">
          {profile.education.map((item, i) => (
            <AnimatedSection key={item.degree} delay={i * 0.15}>
              <motion.div
                whileHover={{ y: -4 }}
                className="card rounded-xl p-8 md:p-10 border border-pearl/5 transition-all duration-300"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div>
                    <h3 className="text-xl md:text-2xl font-semibold text-pearl/90 mb-2">
                      {item.degree}
                    </h3>
                    <p className="font-mono text-sm tracking-wider uppercase text-cream/40">
                      {item.institution}
                    </p>
                  </div>
                  <div className="flex flex-col items-start md:items-end gap-2">
                    {item.location && (
                      <span className="text-sm text-cream/60">{item.location}</span>
                    )}
                    <span className="section-badge">{item.period}</span>
                  </div>
                </div>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ──────────────────────── CONTACT ──────────────────────── */
const Contact = () => {
  const { t } = useLanguage()
  const profile = t('profile')

  return (
    <section id="contact" className="relative py-28 px-6">
      <div className="mx-auto max-w-5xl">
        <AnimatedSection>
          <h2 className="text-4xl md:text-5xl font-semibold mb-4 text-center">
            {t('contactTitle')}
          </h2>
          <p className="text-pearl/40 text-center font-mono text-sm tracking-widest uppercase mb-14">
            {t('available')}
          </p>
        </AnimatedSection>

        <div className="grid gap-6 md:grid-cols-3">
          {([
            { label: t('email'), value: profile.contact.email, href: `mailto:${profile.contact.email}`, accent: 'hover:text-amber' },
            { label: t('whatsapp'), value: profile.contact.whatsapp, href: `https://wa.me/${profile.contact.whatsapp.replace(/[^0-9]/g, '')}`, accent: 'hover:text-amber' },
            { label: t('phone'), value: profile.contact.phone, href: `tel:${profile.contact.phone}`, accent: 'hover:text-amber' },
          ]).map(({ label, value, href, accent }) => (
            <AnimatedSection key={label}>
              <motion.a
                href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel={href.startsWith('http') ? 'noreferrer' : undefined}
                whileHover={{ y: -4 }}
                className="card block rounded-xl p-6 text-center border border-pearl/5 transition-all duration-300"
              >
                <p className="text-xs font-mono tracking-[0.2em] uppercase text-cream/30 mb-3">{label}</p>
                <p className={`text-sm text-pearl/80 transition-colors ${accent} break-all`}>{value}</p>
              </motion.a>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ──────────────────────── FOOTER ──────────────────────── */
const Footer = () => {
  const { t } = useLanguage()

  return (
    <footer className="py-8 px-6 text-center border-t border-pearl/5">
      <div className="authorship">
        {t('footerText')} — {new Date().getFullYear()}
      </div>
    </footer>
  )
}

/* ──────────────────────── APP ──────────────────────── */
function App() {
  const { t } = useLanguage()

  return (
    <div className="relative min-h-screen text-pearl cursor-none">
      <Cursor />
      <div className="fixed top-6 right-6 z-50">
        <LanguageSelector />
      </div>

      {/* Top nav */}
      <nav className="fixed top-6 left-0 z-50 flex items-center gap-6 px-8">
        <span className="text-amber font-serif text-xl font-bold">YS</span>
        <span className="text-wheat/30">/</span>
        <span className="hidden md:block font-mono text-xs tracking-widest text-cream/30 uppercase">
          Portfolio
        </span>
      </nav>

      <Hero />
      <About />
      <Skills />
      <Awards />
      <Education />
      <Contact />
      <Footer />
    </div>
  )
}

export default App
