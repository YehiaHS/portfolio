/**
 * sections/Awards.jsx — Awards & Recognition section
 */
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useLanguage } from '../LanguageContext'
import AnimatedSection from '../components/AnimatedSection'



export default function Awards() {
  const { t } = useLanguage()
  const profile = t('profile')

  return (
    <section id="awards" className="relative py-20 md:py-28 lg:py-40 px-6 md:px-8 lg:px-12">
      <div className="absolute left-6 md:left-8 lg:left-12 top-0 bottom-0 w-px bg-ink/5" />
      <div className="absolute right-6 md:right-8 lg:right-12 top-0 bottom-0 w-px bg-ink/5" />
      <div className="hidden lg:block absolute left-0 top-0 bottom-0 w-24 pointer-events-none select-none opacity-[0.04]">
        <svg className="absolute top-20 left-3" viewBox="0 0 40 40" fill="none" stroke="#2d5a3d" strokeWidth="1">
          <path d="M12 15l8-10 8 10-8 5-8-5z" />
          <path d="M8 17h24v10c0 3-3 6-6 6H14c-3 0-6-3-6-6V17z" />
          <rect x="17" y="27" width="6" height="6" />
          <rect x="13" y="33" width="14" height="3" rx="1" />
        </svg>
      </div>
      <div className="absolute bottom-10 right-8 md:right-20 opacity-[0.025] font-heading text-[10rem] font-bold leading-none select-none pointer-events-none">05</div>

      <div className="relative mx-auto max-w-7xl">
        <div className="grid grid-cols-12 gap-8 md:gap-16 lg:gap-20">
          <div className="col-span-12 md:col-span-3 lg:col-span-2">
            <AnimatedSection>
              <span className="section-number">05</span>
              <p className="page-number mt-2">{t('recognition')}</p>
            </AnimatedSection>
          </div>

          <div className="col-span-12 md:col-span-9 lg:col-span-10">
            <AnimatedSection delay={0.1}>
              <h2 className="text-3xl md:text-4xl lg:text-5xl mb-4">{t('awardsTitle')}</h2>
            </AnimatedSection>
            <AnimatedSection delay={0.2}>
              <p className="text-ink-light font-light leading-relaxed max-w-2xl mb-14">
                Milestones along the journey &mdash; from early competition wins to professional certifications that validate years of continuous growth across languages, business, and creative fields.
              </p>
            </AnimatedSection>

            <div className="space-y-0">
              {profile.awards.map((award, i) => {
                const isIelts = award.name.toLowerCase().includes('ielts')
                return (
                  <AnimatedSection key={award.name} delay={i * 0.08}>
                    <motion.div
                      initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
                      className={`group py-6 border-b transition-colors duration-300 ${isIelts ? 'border-accent/30 bg-accent/[0.02] -mx-4 px-4 rounded-sm' : 'border-ink/5 hover:border-accent/20'}`}
                    >
                      <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-2">
                        <div className="flex items-start gap-4">
                          {isIelts && (
                            <span className="text-lg mt-0.5">
                              <svg className="w-5 h-5 text-accent" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                              </svg>
                            </span>
                          )}
                          <span className={`page-number mt-1 ${isIelts ? 'text-accent/70' : 'opacity-40 group-hover:opacity-100 transition-opacity'}`}>
                            {String(i + 1).padStart(2, '0')}
                          </span>
                          <div>
                            <h4 className={`text-lg md:text-xl font-medium transition-colors ${isIelts ? 'text-accent font-semibold' : 'text-ink group-hover:text-accent'}`}>
                              {award.name}
                            </h4>
                            {isIelts && <p className="text-xs text-accent/60 font-light mt-1">Highest recognition &mdash; exceptional English proficiency</p>}
                          </div>
                        </div>
                        <span className={`page-number flex-shrink-0 ${isIelts ? 'text-accent/60' : ''}`}>{award.year}</span>
                      </div>
                    </motion.div>
                  </AnimatedSection>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
