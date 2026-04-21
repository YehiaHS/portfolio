/**
 * sections/About.jsx
 *
 * The "About" section — editorial portrait monogram, bio summary, languages bar,
 * quick-facts row, and pull-quote. Powered by pretext for text metrics.
 */

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { MaskReveal } from '../motionEffects.jsx'
import { useLanguage } from '../LanguageContext'
import { ReadingBadge, TextDensityBar } from '../pretextUtils.jsx'
import AnimatedSection from '../components/AnimatedSection'



function getGreeting() {
  const now = new Date()
  const hour = parseInt(new Intl.DateTimeFormat('en-US', { timeZone: 'Africa/Cairo', hour: 'numeric', hour12: false }).format(now))
  if (hour < 12) return 'Good Morning'
  if (hour < 17) return 'Good Afternoon'
  return 'Good Evening'
}

export default function About() {
  const { t } = useLanguage()
  const profile = t('profile')
  const greeting = getGreeting()

  return (
    <section id="about" className="relative py-20 md:py-28 lg:py-40 px-6 md:px-8 lg:px-12">
      <div className="absolute left-6 md:left-8 lg:left-12 top-0 bottom-0 w-px bg-ink/5" />
      <div className="absolute right-6 md:right-8 lg:right-12 top-0 bottom-0 w-px bg-ink/5" />

      {/* Decorative sidebar imagery */}
      <div className="hidden lg:block absolute left-0 top-0 bottom-0 w-24 pointer-events-none select-none opacity-[0.04]">
        <svg className="absolute top-20 left-2" viewBox="0 0 40 40" fill="none" stroke="#2d5a3d" strokeWidth="1">
          <circle cx="20" cy="14" r="8" />
          <path d="M6 36c0-8 6-14 14-14s14 6 14 14" />
        </svg>
      </div>

      {/* Greeting watermark */}
      <div className="absolute top-8 right-4 md:right-12 lg:right-20 opacity-[0.03] font-display pointer-events-none select-none" style={{ fontSize: 'clamp(4rem, 8vw, 10rem)', lineHeight: '1', fontWeight: 'bold', fontStyle: 'italic' }}>
        {greeting.split(' ')[0]}
      </div>

      <div className="relative mx-auto max-w-7xl">
        <div className="grid grid-cols-12 gap-8 md:gap-16 lg:gap-20">
          {/* Section label */}
          <div className="col-span-12 md:col-span-3 lg:col-span-2">
            <AnimatedSection>
              <span className="section-number">02</span>
              <p className="page-number mt-2">{t('aboutLabel')}</p>
            </AnimatedSection>
          </div>

          <div className="col-span-12 md:col-span-9 lg:col-span-10">
            <div className="grid md:grid-cols-5 gap-6 md:gap-10 lg:gap-14">
              {/* Left: editorial portrait + highlights */}
              <div className="md:col-span-2">
                <AnimatedSection delay={0.2}>
                  <div className="relative">
                    <div className="aspect-[4/5] bg-paper-dark flex items-center justify-center border border-ink/5 overflow-hidden relative" style={{ maxWidth: '100%' }}>
                      <svg className="absolute inset-0 w-full h-full opacity-[0.06]" viewBox="0 0 100 125" preserveAspectRatio="none">
                        {[0,1,2,3,4,5,6,7,8,9,10,11,12].map((i) => (
                          <line key={i} x1={i * 10 - 20} y1="125" x2={i * 10 + 30} y2="0" stroke="#2d5a3d" strokeWidth="1.5" />
                        ))}
                      </svg>
                      <div className="absolute inset-0 bg-gradient-to-br from-[#2d5a3d]/[0.05] via-transparent to-[#4a8f5c]/[0.08]" />
                      <svg className="absolute top-3 left-3 w-8 h-8 opacity-20" viewBox="0 0 32 32" fill="none">
                        <path d="M0 0h12v2H2v10H0V0z" fill="#2d5a3d" />
                        <circle cx="18" cy="18" r="2" fill="#2d5a3d" />
                      </svg>
                      <svg className="absolute bottom-3 right-3 w-8 h-8 opacity-20" viewBox="0 0 32 32" fill="none">
                        <path d="M32 32H20v-2h10V20h2v12z" fill="#2d5a3d" />
                        <circle cx="14" cy="14" r="2" fill="#2d5a3d" />
                      </svg>
                      <div className="text-center relative z-10 px-2">
                        <span className="block font-bold font-display italic bg-gradient-to-br from-[#2d5a3d] to-[#4a8f5c] bg-clip-text text-transparent leading-none select-none" style={{ fontSize: 'clamp(3rem, 8vw, 5rem)' }}>YS</span>
                        <div className="w-16 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent mx-auto my-6" />
                        <p className="page-number text-accent/30">Est. {new Date().getFullYear() - 4}</p>
                      </div>
                      <motion.div className="absolute inset-0" animate={{ opacity: [0, 0.15, 0] }} transition={{ duration: 6, repeat: Infinity }} style={{ background: 'radial-gradient(ellipse at center, transparent 30%, rgba(45,90,61,0.06) 100%)' }} />
                    </div>
                    <div className="absolute -top-2 -left-2 w-6 h-6 border-t-2 border-l-2 border-accent/20" />
                    <div className="absolute -top-2 -right-2 w-6 h-6 border-t-2 border-r-2 border-accent/20" />
                    <div className="absolute -bottom-2 -left-2 w-6 h-6 border-b-2 border-l-2 border-accent/20" />
                    <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b-2 border-r-2 border-accent/20" />
                  </div>
                </AnimatedSection>

                {/* Highlights */}
                <AnimatedSection delay={0.6}>
                  <div className="mt-8 space-y-3">
                    {profile.highlights.map((item, i) => (
                      <motion.div key={item} initial={{ opacity: 0, x: -8 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="flex items-start gap-3">
                        <span className="w-1.5 h-1.5 bg-accent/60 mt-1.5 flex-shrink-0" />
                        <span className="text-sm text-ink-light font-light">{item}</span>
                      </motion.div>
                    ))}
                  </div>
                </AnimatedSection>
              </div>

              {/* Right: bio + languages + quick facts */}
              <div className="md:col-span-3 space-y-8">
                <AnimatedSection delay={0.3}>
                  <h2 className="leading-tight" style={{ fontSize: 'clamp(1.5rem, 4vw, 3rem)' }}>
                    <span className="italic font-italic text-accent">Creativity</span>
                    <br />meets code
                  </h2>
                </AnimatedSection>

                <MaskReveal delay={0.5}>
                  <p className="text-ink-light text-base leading-relaxed font-light">{profile.summary}</p>
                </MaskReveal>

                <ReadingBadge text={profile.summary} className="border-ink/10 text-ink-faint mt-3" />
                <TextDensityBar text={profile.summary} className="mt-4" />

                {/* Quick Facts */}
                <AnimatedSection delay={0.6}>
                  <div className="flex flex-wrap gap-3 pt-2">
                    {[
                      { icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3v4l3 3" /></svg>, text: greeting },
                      { icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>, text: 'UTC+2 Cairo' },
                      { icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>, text: 'Age ~22' },
                    ].map((fact) => (
                      <span key={fact.text} className="inline-flex items-center gap-2 px-3 py-2 bg-white border border-ink/8 text-xs text-ink-light font-light rounded-sm">
                        {fact.icon}{fact.text}
                      </span>
                    ))}
                  </div>
                </AnimatedSection>

                {/* Languages bar */}
                <AnimatedSection delay={0.7}>
                  <div className="border-t border-ink/5 pt-6">
                    <p className="section-number mb-4">Languages</p>
                    <div className="flex gap-3">
                      {['Arabic', 'English', 'French'].map((lang) => (
                        <div key={lang} className="flex-1">
                          <div className="h-1 bg-paper-dark mb-1.5">
                            <motion.div initial={{ width: 0 }} whileInView={{ width: '100%' }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.5 }} className="h-1 bg-ink" />
                          </div>
                          <p className="page-number">{lang}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </AnimatedSection>

                {/* Education mini-card */}
                <AnimatedSection delay={0.8}>
                  <a href="#education" className="group flex items-start gap-4 p-4 bg-paper-dark border border-ink/5 hover:border-accent/30 transition-colors duration-300 cursor-pointer">
                    <svg className="w-5 h-5 text-accent mt-0.5 flex-shrink-0 group-hover:text-accent-deep transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M12 14l9-5-9-5-9 5 9 5z" />
                      <path d="M12 14l6.16-3.422A12.083 12.083 0 0 1 21.16 14 12.083 12.083 0 0 1 12 17.578 12.083 12.083 0 0 1 2.84 14 12.083 12.083 0 0 1 12 14z" />
                      <path d="M6 9v3a6 6 0 0 0 12 0V9" />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-ink group-hover:text-accent transition-colors">Dual Bachelor&apos;s Degrees</p>
                      <p className="text-xs text-ink-faint font-light mt-1">BUE + University of the People &rarr;</p>
                    </div>
                  </a>
                </AnimatedSection>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative pull-quote */}
      <div className="mt-24 md:mt-32 text-center">
        <AnimatedSection>
          <p className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-italic italic text-ink/15 leading-tight max-w-4xl mx-auto">
            &ldquo;The best work lives where disciplines collide.&rdquo;
          </p>
        </AnimatedSection>
      </div>
    </section>
  )
}
