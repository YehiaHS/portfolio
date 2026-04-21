/**
 * sections/Education.jsx — Education & Academic History section
 */
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useLanguage } from '../LanguageContext'
import AnimatedSection from '../components/AnimatedSection'



export default function Education() {
  const { t } = useLanguage()
  const profile = t('profile')

  return (
    <section id="education" className="relative py-20 md:py-28 lg:py-40 px-6 md:px-8 lg:px-12">
      <div className="absolute inset-0 bg-paper-dark pointer-events-none" />
      <div className="absolute left-6 md:left-8 lg:left-12 top-0 bottom-0 w-px bg-ink/5" />
      <div className="absolute right-6 md:right-8 lg:right-12 top-0 bottom-0 w-px bg-ink/5" />
      <div className="hidden lg:block absolute left-0 top-0 bottom-0 w-24 pointer-events-none select-none opacity-[0.04]">
        <svg className="absolute top-20 left-3" viewBox="0 0 40 40" fill="none" stroke="#2d5a3d" strokeWidth="1">
          <path d="M20 4L4 14l16 10 16-10L20 4z" />
          <path d="M8 17v11c0 3 5 5 12 5s12-2 12-5V17" />
          <path d="M32 17v8" />
        </svg>
      </div>

      <div className="relative mx-auto max-w-7xl">
        <div className="grid grid-cols-12 gap-8 md:gap-16 lg:gap-20">
          <div className="col-span-12 md:col-span-3 lg:col-span-2">
            <AnimatedSection>
              <span className="section-number">08</span>
              <p className="page-number mt-2">{t('educationLabel')}</p>
            </AnimatedSection>
          </div>

          <div className="col-span-12 md:col-span-9 lg:col-span-10">
            <AnimatedSection delay={0.1}>
              <h2 className="text-3xl md:text-4xl lg:text-5xl mb-4">{t('educationTitle')}</h2>
            </AnimatedSection>
            <AnimatedSection delay={0.2}>
              <p className="text-ink-light font-light leading-relaxed max-w-2xl mb-14">
                Two complementary degrees spanning creative communication and technical problem-solving &mdash; a deliberate pairing for integrated expertise.
              </p>
            </AnimatedSection>

            <div className="grid md:grid-cols-2 gap-6">
              {profile.education.map((item, i) => (
                <AnimatedSection key={item.degree} delay={i * 0.15}>
                  <motion.div whileHover={{ y: -3 }} className="editorial-card p-8 md:p-10">
                    <div className="flex items-center gap-3 mb-6">
                      <span className="section-number">{String(i + 1).padStart(2, '0')}</span>
                      <span className="page-number">{item.period}</span>
                    </div>
                    <h3 className="text-xl md:text-2xl text-ink mb-3 leading-tight">{item.degree}</h3>
                    <p className="text-sm text-ink-faint font-light">{item.institution}</p>
                    {item.location && <p className="text-xs text-ink-faint/60 mt-2 font-light">{item.location}</p>}
                    <div className="mt-6 h-px bg-ink/5 relative">
                      <motion.div
                        className="absolute left-0 top-0 bottom-0 bg-accent/40"
                        initial={{ width: 0 }}
                        whileInView={{ width: i === 0 ? '80%' : '60%' }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, delay: 0.5 }}
                      />
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
