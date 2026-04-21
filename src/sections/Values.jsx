/**
 * sections/Values.jsx — Core values / guiding principles section
 */
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useLanguage } from '../LanguageContext'
import AnimatedSection from '../components/AnimatedSection'



const VALUES = [
  {
    icon: <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" /></svg>,
    title: 'Interdisciplinary Thinking',
    desc: 'Blending art and technology, design and code, to create solutions that neither could achieve alone.',
  },
  {
    icon: <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M8 14s1.5 2 4 2 4-2 4-2" /><line x1="9" y1="9" x2="9.01" y2="9" /><line x1="15" y1="9" x2="15.01" y2="9" /></svg>,
    title: 'Empathy-Driven Design',
    desc: 'Every pixel serves a person. Understanding the audience is the starting point, never an afterthought.',
  },
  {
    icon: <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>,
    title: 'Relentless Craft',
    desc: 'From film editing to code reviews, the details carry the weight. Precision is not optional.',
  },
  {
    icon: <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></svg>,
    title: 'Open Collaboration',
    desc: 'The best ideas emerge from shared spaces. Languages, cultures, disciplines — all are welcome.',
  },
]

export default function Values() {
  const { t } = useLanguage()
  return (
    <section id="values" className="relative py-20 md:py-28 lg:py-40 px-6 md:px-8 lg:px-12">
      <div className="absolute left-6 md:left-8 lg:left-12 top-0 bottom-0 w-px bg-ink/5" />
      <div className="absolute right-6 md:right-8 lg:right-12 top-0 bottom-0 w-px bg-ink/5" />
      <div className="relative mx-auto max-w-7xl">
        <div className="grid grid-cols-12 gap-8 md:gap-16 lg:gap-20">
          <div className="col-span-12 md:col-span-3 lg:col-span-2">
            <AnimatedSection>
              <span className="section-number">04</span>
              <p className="page-number mt-2">Values</p>
              <p className="page-number mt-1">Core beliefs</p>
            </AnimatedSection>
          </div>
          <div className="col-span-12 md:col-span-9 lg:col-span-10">
            <AnimatedSection delay={0.1}>
              <h2 className="text-3xl md:text-4xl lg:text-5xl mb-4">Guiding <span className="italic font-italic text-accent">Principles</span></h2>
            </AnimatedSection>
            <AnimatedSection delay={0.2}>
              <p className="text-ink-light font-light leading-relaxed max-w-xl mb-14">
                The compass that shapes every project, every line of code, and every design decision.
              </p>
            </AnimatedSection>
            <div className="grid sm:grid-cols-2 gap-4 md:gap-6">
              {VALUES.map((v, i) => (
                <AnimatedSection key={v.title} delay={0.15 + i * 0.1}>
                  <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.3 }} className="editorial-card p-8 md:p-10 flex flex-col gap-4 group">
                    <div className="text-accent/60 group-hover:text-accent transition-colors duration-300">{v.icon}</div>
                    <h3 className="text-lg font-heading font-semibold text-ink">{v.title}</h3>
                    <p className="text-sm text-ink-light font-light leading-relaxed">{v.desc}</p>
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
