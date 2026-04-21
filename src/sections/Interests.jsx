/**
 * sections/Interests.jsx — Areas of interest / passion tags
 */
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useLanguage } from '../LanguageContext'
import AnimatedSection from '../components/AnimatedSection'



const INTERESTS = [
  'Visual Storytelling', 'Creative Coding', 'Film & Cinema',
  'Typography', 'Brand Strategy', 'UI/UX Design',
  'Motion Graphics', 'Digital Art', 'Interactive Media',
  'Marketing Psychology', 'User Research', 'Content Strategy',
  'AI & Creativity', 'Photography', 'Open Source',
  'Multilingual Communication', 'Cultural Design', 'Data Visualization',
]

export default function Interests() {
  const { t } = useLanguage()
  return (
    <section id="interests" className="relative py-20 md:py-28 lg:py-32 px-6 md:px-8 lg:px-12">
      <div className="absolute left-6 md:left-8 lg:left-12 top-0 bottom-0 w-px bg-ink/5" />
      <div className="absolute right-6 md:right-8 lg:right-12 top-0 bottom-0 w-px bg-ink/5" />

      <div className="relative mx-auto max-w-7xl">
        <div className="grid grid-cols-12 gap-8 md:gap-16 lg:gap-20">
          <div className="col-span-12 md:col-span-3 lg:col-span-2">
            <AnimatedSection>
              <span className="section-number">07</span>
              <p className="page-number mt-2">Interests</p>
            </AnimatedSection>
          </div>

          <div className="col-span-12 md:col-span-9 lg:col-span-10">
            <AnimatedSection delay={0.1}>
              <h2 className="text-3xl md:text-4xl lg:text-5xl mb-4">Areas of <span className="italic font-italic text-accent">Interest</span></h2>
            </AnimatedSection>
            <AnimatedSection delay={0.2}>
              <p className="text-ink-light font-light leading-relaxed max-w-2xl mb-14">
                The topics, disciplines, and creative territories I return to again and again &mdash; each one a source of inspiration and growth.
              </p>
            </AnimatedSection>

            <div className="flex flex-wrap gap-2 md:gap-3">
              {INTERESTS.map((interest, i) => (
                <motion.span key={interest} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.03 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="px-4 py-2 border border-ink/10 text-sm text-ink-light font-light hover:border-accent/40 hover:text-accent hover:bg-accent/[0.03] transition-all duration-300 cursor-default">
                  {interest}
                </motion.span>
              ))}
            </div>

            <AnimatedSection delay={0.6}>
              <div className="mt-16 p-8 md:p-10 bg-white border border-ink/6">
                <svg className="w-8 h-8 text-accent/20 mb-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                <p className="text-lg md:text-xl font-italic italic text-ink-light/70 leading-relaxed">
                  &ldquo;Design is not just what it looks like and feels like. Design is how it works.&rdquo;
                </p>
                <p className="mt-4 page-number">&mdash; Steve Jobs</p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </section>
  )
}
