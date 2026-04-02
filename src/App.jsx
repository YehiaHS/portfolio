import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { useLanguage } from './LanguageContext'
import LanguageSelector from './LanguageSelector'
import Cursor from './Cursor'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
}

const AnimatedSection = ({ children, className = '', delay = 0 }) => {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={fadeUp}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/* ──────────────────────── NAV ──────────────────────── */
const Nav = () => {
  const { t } = useLanguage()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div className="mx-auto max-w-7xl px-6 md:px-12 py-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/" className="font-display text-xl italic text-ink">
            Y.S.
          </Link>
          <span className="hidden md:block h-4 w-px bg-ink-faint/20" />
          <span className="hidden md:block page-number">{t('portfolio')}</span>
        </div>

        <div className="flex items-center gap-6">
          <a href="#skills" className="page-number hover:text-accent transition-colors hidden md:inline-block">
            {t('skillsTitle')}
          </a>
          <a href="#awards" className="page-number hover:text-accent transition-colors hidden md:inline-block">
            {t('awardsTitle')}
          </a>
          <Link to="/portfolio" className="page-number hover:text-accent transition-colors">
            {t('viewPortfolio')}
          </Link>
          <LanguageSelector />
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="h-px bg-gradient-to-r from-transparent via-ink/10 to-transparent" />
      </div>
    </nav>
  )
}

/* ──────────────────────── HERO ──────────────────────── */
const Hero = () => {
  const { t } = useLanguage()

  return (
    <section className="relative min-h-screen flex flex-col justify-center pt-20 px-6 md:px-12">
      {/* Decorative border edge */}
      <div className="absolute left-6 md:left-12 top-0 bottom-0 w-px bg-ink/5" />
      <div className="absolute right-6 md:right-12 top-0 bottom-0 w-px bg-ink/5" />

      {/* Watermark */}
      <div className="absolute top-32 right-8 md:right-16 opacity-[0.04] font-heading text-[12rem] md:text-[20rem] font-bold leading-none select-none">
        01
      </div>

      <div className="relative mx-auto max-w-7xl w-full">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-5 lg:col-span-4">
            <AnimatedSection delay={0.1}>
              <p className="page-number mb-2">{t('hello')}</p>
            </AnimatedSection>
            <AnimatedSection delay={0.3}>
              <div className="h-px w-16 bg-accent mb-6" />
            </AnimatedSection>
            <AnimatedSection delay={0.5}>
              <p className="text-ink-faint text-sm leading-relaxed max-w-xs font-light">
                {t('tagline')}
              </p>
            </AnimatedSection>
            <AnimatedSection delay={0.7}>
              <p className="text-ink-faint/50 text-xs mt-3 font-light">
                {t('location')}
              </p>
            </AnimatedSection>
            {/* Quick stats */}
            <AnimatedSection delay={0.9}>
              <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-3">
                {[
                  { num: '3', label: 'Languages' },
                  { num: '4+', label: 'Design Tools' },
                  { num: '8.5', label: 'IELTS Score' },
                  { num: '2', label: 'Degrees' },
                ].map((stat) => (
                  <div key={stat.label}>
                    <span className="block text-2xl font-display font-bold text-accent">{stat.num}</span>
                    <span className="page-number">{stat.label}</span>
                  </div>
                ))}
              </div>
            </AnimatedSection>
          </div>

          <div className="col-span-12 md:col-span-7 lg:col-span-8 md:pl-12 lg:pl-20">
            <div className="leading-[0.85]">
              <motion.div
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                <h1 className="text-[4.5rem] md:text-[8rem] lg:text-[11rem] font-bold tracking-tight text-ink leading-none">
                  Yehia
                </h1>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1.2, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="pl-4 md:pl-8 lg:pl-12 -mt-2"
              >
                <h1 className="text-[4rem] md:text-[7rem] lg:text-[10rem] font-normal italic font-italic tracking-tight text-accent leading-none">
                  Salem
                </h1>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="mt-12 md:mt-16 flex flex-wrap items-center gap-4"
            >
              <a
                href="#about"
                className="px-6 py-3 text-[0.7rem] font-heading font-semibold tracking-[0.18em] uppercase text-paper bg-ink hover:bg-accent transition-colors duration-300"
              >
                {t('explore')}
              </a>
              <Link
                to="/portfolio"
                className="px-6 py-3 text-[0.7rem] font-heading font-semibold tracking-[0.18em] uppercase border border-ink/20 text-ink hover:border-accent hover:text-accent transition-colors duration-300"
              >
                {t('viewPortfolio')}
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2 }}
        className="absolute bottom-8 left-14 md:left-20 flex items-center gap-3"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="w-px h-10 bg-accent/40"
        />
        <span className="page-number">{t('scroll')}</span>
      </motion.div>
    </section>
  )
}

/* ──────────────────────── ABOUT ──────────────────────── */
const About = () => {
  const { t } = useLanguage()
  const profile = t('profile')

  return (
    <section id="about" className="relative py-28 md:py-40 px-6 md:px-12">
      {/* Decorative border */}
      <div className="absolute left-6 md:left-12 top-0 bottom-0 w-px bg-ink/5" />
      <div className="absolute right-6 md:right-12 top-0 bottom-0 w-px bg-ink/5" />

      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-12 gap-12 md:gap-20">
          <div className="col-span-12 md:col-span-3 lg:col-span-2">
            <AnimatedSection>
              <span className="section-number">02</span>
              <p className="page-number mt-2">{t('aboutLabel')}</p>
            </AnimatedSection>
          </div>

          <div className="col-span-12 md:col-span-9 lg:col-span-10">
            <div className="grid md:grid-cols-5 gap-12 md:gap-16">
              {/* Left column: monogram + highlights */}
              <div className="md:col-span-2">
                <AnimatedSection delay={0.2}>
                  <div className="relative">
                    <div className="aspect-[4/5] bg-paper-dark flex items-center justify-center border border-ink/5">
                      <div className="text-center">
                        <span className="block text-8xl md:text-9xl font-bold font-display italic text-accent/15">
                          YS
                        </span>
                        <div className="w-12 h-px bg-accent/20 mx-auto my-6" />
                        <p className="page-number">Est. {new Date().getFullYear() - 2}</p>
                      </div>
                    </div>
                    <div className="absolute -top-1 -left-1 w-4 h-4 border-t border-l border-accent/30" />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b border-r border-accent/30" />
                  </div>
                </AnimatedSection>

                {/* Highlights */}
                <AnimatedSection delay={0.6}>
                  <div className="mt-8 space-y-3">
                    {profile.highlights.map((item, i) => (
                      <motion.div
                        key={item}
                        initial={{ opacity: 0, x: -8 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.08 }}
                        className="flex items-start gap-3"
                      >
                        <span className="w-1.5 h-1.5 bg-accent/60 mt-1.5 flex-shrink-0" />
                        <span className="text-sm text-ink-light font-light">{item}</span>
                      </motion.div>
                    ))}
                  </div>
                </AnimatedSection>
              </div>

              {/* Right column: bio + languages bar */}
              <div className="md:col-span-3 space-y-8">
                <AnimatedSection delay={0.3}>
                  <h2 className="text-3xl md:text-4xl lg:text-5xl leading-tight">
                    <span className="italic font-italic text-accent">Creativity</span>
                    <br />meets code
                  </h2>
                </AnimatedSection>

                <AnimatedSection delay={0.5}>
                  <p className="text-ink-light text-base leading-relaxed font-light">
                    {profile.summary}
                  </p>
                </AnimatedSection>

                {/* Languages bar */}
                <AnimatedSection delay={0.7}>
                  <div className="border-t border-ink/5 pt-6">
                    <p className="section-number mb-4">Languages</p>
                    <div className="flex gap-3">
                      {[
                        { name: 'Arabic', level: 'Fluent', color: 'bg-ink' },
                        { name: 'English', level: 'Fluent', color: 'bg-ink' },
                        { name: 'French', level: 'Fluent', color: 'bg-ink' },
                      ].map((lang) => (
                        <div key={lang.name} className="flex-1">
                          <div className="h-1 bg-paper-dark mb-1.5">
                            <motion.div
                              initial={{ width: 0 }}
                              whileInView={{ width: '100%' }}
                              viewport={{ once: true }}
                              transition={{ duration: 1, delay: 0.5 }}
                              className={`h-1 ${lang.color}`}
                            />
                          </div>
                          <p className="page-number">{lang.name}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </AnimatedSection>
              </div>
            </div>
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
    <section id="skills" className="relative py-28 md:py-40 px-6 md:px-12">
      <div className="absolute inset-0 bg-paper-dark pointer-events-none" />
      <div className="absolute left-6 md:left-12 top-0 bottom-0 w-px bg-ink/5" />
      <div className="absolute right-6 md:right-12 top-0 bottom-0 w-px bg-ink/5" />

      <div className="relative mx-auto max-w-7xl">
        <div className="grid grid-cols-12 gap-12 md:gap-20">
          <div className="col-span-12 md:col-span-3 lg:col-span-2">
            <AnimatedSection>
              <span className="section-number">03</span>
              <p className="page-number mt-2">{t('capabilities')}</p>
            </AnimatedSection>
          </div>

          <div className="col-span-12 md:col-span-9 lg:col-span-10">
            <AnimatedSection delay={0.1}>
              <h2 className="text-3xl md:text-4xl lg:text-5xl mb-14">{t('skillsTitle')}</h2>
            </AnimatedSection>

            <div className="grid gap-px bg-ink/5">
              {profile.skills.map((skill, i) => (
                <AnimatedSection key={skill.title} delay={i * 0.12}>
                  <div className="bg-paper p-8 md:p-10 group hover:bg-white transition-colors duration-500">
                    <div className="flex flex-col md:flex-row md:items-start gap-6">
                      <div className="flex items-start gap-4 md:min-w-[200px]">
                        <span className="page-number mt-1">{String(i + 1).padStart(2, '0')}</span>
                        <h3 className="text-lg font-heading font-semibold text-ink">{skill.title}</h3>
                      </div>
                      <ul className="space-y-2">
                        {skill.items.map((item) => (
                          <li key={item} className="text-sm text-ink-light font-light leading-relaxed pl-6 relative before:absolute before:left-0 before:top-2.5 before:w-1 before:h-1 before:bg-accent/40 before:rounded-full">
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ──────────────────────── AWARDS ──────────────────────── */
const Awards = () => {
  const { t } = useLanguage()
  const profile = t('profile')

  return (
    <section id="awards" className="relative py-28 md:py-40 px-6 md:px-12">
      <div className="absolute left-6 md:left-12 top-0 bottom-0 w-px bg-ink/5" />
      <div className="absolute right-6 md:right-12 top-0 bottom-0 w-px bg-ink/5" />

      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-12 gap-12 md:gap-20">
          <div className="col-span-12 md:col-span-3 lg:col-span-2">
            <AnimatedSection>
              <span className="section-number">04</span>
              <p className="page-number mt-2">{t('recognition')}</p>
            </AnimatedSection>
          </div>

          <div className="col-span-12 md:col-span-9 lg:col-span-10">
            <AnimatedSection delay={0.1}>
              <h2 className="text-3xl md:text-4xl lg:text-5xl mb-14">{t('awardsTitle')}</h2>
            </AnimatedSection>

            <div className="space-y-0">
              {profile.awards.map((award, i) => (
                <AnimatedSection key={award.name} delay={i * 0.08}>
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="group py-6 border-b border-ink/5 hover:border-accent/30 transition-colors duration-300"
                  >
                    <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-2">
                      <div className="flex items-start gap-4">
                        <span className="page-number mt-1 opacity-40 group-hover:opacity-100 transition-opacity">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <h4 className="text-lg md:text-xl font-medium text-ink group-hover:text-accent transition-colors">
                          {award.name}
                        </h4>
                      </div>
                      <span className="page-number flex-shrink-0">{award.year}</span>
                    </div>
                  </motion.div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ──────────────────────── EDUCATION ──────────────────────── */
const Education = () => {
  const { t } = useLanguage()
  const profile = t('profile')

  return (
    <section id="education" className="relative py-28 md:py-40 px-6 md:px-12">
      <div className="absolute inset-0 bg-paper-dark pointer-events-none" />
      <div className="absolute left-6 md:left-12 top-0 bottom-0 w-px bg-ink/5" />
      <div className="absolute right-6 md:right-12 top-0 bottom-0 w-px bg-ink/5" />

      <div className="relative mx-auto max-w-7xl">
        <div className="grid grid-cols-12 gap-12 md:gap-20">
          <div className="col-span-12 md:col-span-3 lg:col-span-2">
            <AnimatedSection>
              <span className="section-number">05</span>
              <p className="page-number mt-2">{t('educationLabel')}</p>
            </AnimatedSection>
          </div>

          <div className="col-span-12 md:col-span-9 lg:col-span-10">
            <AnimatedSection delay={0.1}>
              <h2 className="text-3xl md:text-4xl lg:text-5xl mb-14">{t('educationTitle')}</h2>
            </AnimatedSection>

            <div className="grid md:grid-cols-2 gap-6">
              {profile.education.map((item, i) => (
                <AnimatedSection key={item.degree} delay={i * 0.15}>
                  <div className="editorial-card p-8 md:p-10">
                    <div className="flex items-center gap-3 mb-6">
                      <span className="section-number">{String(i + 1).padStart(2, '0')}</span>
                      <span className="page-number">{item.period}</span>
                    </div>
                    <h3 className="text-xl md:text-2xl text-ink mb-3 leading-tight">{item.degree}</h3>
                    <p className="text-sm text-ink-faint font-light">{item.institution}</p>
                    {item.location && (
                      <p className="text-xs text-ink-faint/60 mt-2 font-light">{item.location}</p>
                    )}
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
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
    <section id="contact" className="relative py-28 md:py-40 px-6 md:px-12">
      <div className="absolute left-6 md:left-12 top-0 bottom-0 w-px bg-ink/5" />
      <div className="absolute right-6 md:right-12 top-0 bottom-0 w-px bg-ink/5" />

      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-12 gap-12 md:gap-20">
          <div className="col-span-12 md:col-span-3 lg:col-span-2">
            <AnimatedSection>
              <span className="section-number">06</span>
              <p className="page-number mt-2">{t('contactMe')}</p>
            </AnimatedSection>
          </div>

          <div className="col-span-12 md:col-span-9 lg:col-span-10">
            <AnimatedSection delay={0.1}>
              <h2 className="text-3xl md:text-4xl lg:text-5xl mb-4">
                Let&apos;s <span className="italic font-italic text-accent">connect</span>
              </h2>
              <p className="page-number mb-14">{t('available')}</p>
            </AnimatedSection>

            <div className="grid md:grid-cols-3 gap-px bg-ink/5">
              {([
                { label: t('email'), value: profile.contact.email, href: `mailto:${profile.contact.email}` },
                { label: t('whatsapp'), value: profile.contact.whatsapp, href: `https://wa.me/${profile.contact.whatsapp.replace(/[^0-9]/g, '')}` },
                { label: t('phone'), value: profile.contact.phone, href: `tel:${profile.contact.phone}` },
              ]).map(({ label, value, href }) => (
                <AnimatedSection key={label}>
                  <a
                    href={href}
                    target={href.startsWith('http') ? '_blank' : undefined}
                    rel={href.startsWith('http') ? 'noreferrer' : undefined}
                    className="block bg-paper p-8 hover:bg-white transition-colors group"
                  >
                    <p className="page-number mb-2">{label}</p>
                    <p className="text-sm text-ink font-light group-hover:text-accent transition-colors">
                      {value}
                    </p>
                  </a>
                </AnimatedSection>
              ))}
            </div>

            {/* Why reach out */}
            <AnimatedSection delay={0.6}>
              <div className="mt-8 border-t border-ink/5 pt-8">
                <p className="section-number mb-3">{t('whyReachOut')}</p>
                <p className="text-ink-light text-sm font-light leading-relaxed">
                  {t('reachOutText')}
                </p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ──────────────────────── FOOTER ──────────────────────── */
const Footer = () => {
  const { t } = useLanguage()
  return (
    <footer className="py-8 px-6 md:px-12 border-t border-ink/5">
      <div className="mx-auto max-w-7xl flex items-center justify-between">
        <span className="page-number">{t('footerText')} — {new Date().getFullYear()}</span>
        <span className="page-number">{t('precision')}</span>
      </div>
    </footer>
  )
}

/* ──────────────────────── APP ──────────────────────── */
function App() {
  return (
    <div className="relative min-h-screen text-ink cursor-none page-enter">
      <Cursor />
      <Nav />
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
