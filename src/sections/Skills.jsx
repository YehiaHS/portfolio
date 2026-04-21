/**
 * sections/Skills.jsx — Skills & Capabilities section
 */
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useLanguage } from '../LanguageContext'
import { ColoredPanel } from '../C2Patterns.jsx'
import AnimatedSection from '../components/AnimatedSection'



const TOOL_TAGS = [
  'Photoshop', 'DaVinci Resolve', 'Premiere Pro', 'Krita',
  'Affinity Photo', 'Affinity Designer', 'Affinity Publisher',
  'GIMP', 'Sony Vegas', 'Paint Tool SAI', 'Illustrator', 'Figma',
]
const SKILL_LEVELS = [92, 88, 95, 85]

export default function Skills() {
  const { t } = useLanguage()
  const profile = t('profile')

  return (
    <ColoredPanel variant="sage" className="!py-0 !px-0">
      <section id="skills" className="relative py-20 md:py-28 lg:py-40 px-6 md:px-8 lg:px-12">
        <div className="absolute left-6 md:left-8 lg:left-12 top-0 bottom-0 w-px bg-ink/5" />
        <div className="absolute right-6 md:right-8 lg:right-12 top-0 bottom-0 w-px bg-ink/5" />
        <div className="hidden lg:block absolute left-0 top-0 bottom-0 w-24 pointer-events-none select-none opacity-[0.04]">
          <svg className="absolute top-20 left-3" viewBox="0 0 40 40" fill="none" stroke="#2d5a3d" strokeWidth="1">
            <path d="M14 6h4v10H14zM24 12h4v24h-4zM24 6l8 6-8 6z" />
            <path d="M6 20h28" strokeWidth="0.5" />
          </svg>
        </div>

        <div className="relative mx-auto max-w-7xl">
          <div className="grid grid-cols-12 gap-8 md:gap-16 lg:gap-20">
            <div className="col-span-12 md:col-span-3 lg:col-span-2">
              <AnimatedSection>
                <span className="section-number">03</span>
                <p className="page-number mt-2">{t('capabilities')}</p>
              </AnimatedSection>
            </div>

            <div className="col-span-12 md:col-span-9 lg:col-span-10">
              <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-14 gap-4">
                <AnimatedSection delay={0.1}>
                  <h2 className="text-3xl md:text-4xl lg:text-5xl">{t('skillsTitle')}</h2>
                </AnimatedSection>
                <AnimatedSection delay={0.2}>
                  <p className="page-number text-right md:text-left">Proficiency across {profile.skills.length} domains</p>
                </AnimatedSection>
              </div>

              <div className="grid gap-px bg-ink/5">
                {profile.skills.map((skill, i) => (
                  <AnimatedSection key={skill.title} delay={i * 0.12}>
                    <div className="bg-paper p-8 md:p-10 group hover:bg-white transition-colors duration-500">
                      <div className="flex flex-col md:flex-row md:items-start gap-6">
                        <div className="flex items-start gap-4 md:min-w-[200px]">
                          <span className="page-number mt-1">{String(i + 1).padStart(2, '0')}</span>
                          <div className="flex-1">
                            <h3 className="text-lg font-heading font-semibold text-ink mb-2">{skill.title}</h3>
                            <div className="h-1 bg-paper-dark w-full md:w-32">
                              <motion.div
                                className="h-full bg-accent/60"
                                initial={{ width: 0 }}
                                whileInView={{ width: `${SKILL_LEVELS[i] || 80}%` }}
                                viewport={{ once: true }}
                                transition={{ duration: 1.2, delay: 0.3 + i * 0.1 }}
                              />
                            </div>
                          </div>
                        </div>
                        <ul className="space-y-2 flex-1">
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

              <AnimatedSection delay={0.7}>
                <div className="mt-12">
                  <p className="section-number mb-4">Tools &amp; Software</p>
                  <div className="flex flex-wrap gap-2">
                    {TOOL_TAGS.map((tool, i) => (
                      <motion.span key={tool} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.03 }}
                        className="px-3 py-1.5 bg-white border border-ink/8 text-xs font-light text-ink-light hover:border-accent/40 hover:text-accent hover:bg-accent/[0.03] transition-all duration-300 cursor-default">
                        {tool}
                      </motion.span>
                    ))}
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>
    </ColoredPanel>
  )
}
