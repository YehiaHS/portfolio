/**
 * sections/ToolsSection.jsx — Tools & Software section
 */
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useLanguage } from '../LanguageContext'
import AnimatedSection from '../components/AnimatedSection'



const TOOL_CATEGORIES = [
  {
    category: 'Visual Design',
    tools: [
      { name: 'Affinity Photo', role: 'Photo Editing' },
      { name: 'Adobe Photoshop', role: 'Image Manipulation' },
      { name: 'Affinity Designer', role: 'Vector Graphics' },
      { name: 'Affinity Publisher', role: 'Layout Design' },
      { name: 'GIMP', role: 'Open-Source Editing' },
    ],
  },
  {
    category: 'Video & Motion',
    tools: [
      { name: 'DaVinci Resolve', role: 'Color & Editing' },
      { name: 'Adobe Premiere', role: 'Video Editing' },
      { name: 'Sony Vegas', role: 'Timeline Editing' },
      { name: 'Krita', role: 'Animation & Painting' },
    ],
  },
  {
    category: 'Digital Art',
    tools: [
      { name: 'Krita', role: 'Digital Painting' },
      { name: 'Paint Tool SAI', role: 'Illustration' },
      { name: 'Affinity Photo', role: 'Compositing' },
    ],
  },
]

const TAG_CLOUD = [
  'Photoshop', 'Premiere', 'DaVinci Resolve', 'Krita', 'SAI',
  'Affinity Designer', 'Affinity Photo', 'Affinity Publisher',
  'GIMP', 'Sony Vegas', 'HTML', 'CSS', 'JavaScript',
  'React', 'Python', 'Git', 'VS Code', 'Figma',
  'Canva', 'Lightroom', 'After Effects', 'Blender',
]

export default function ToolsSection() {
  const { t } = useLanguage()
  return (
    <section id="tools" className="relative py-20 md:py-28 lg:py-40 px-6 md:px-8 lg:px-12">
      <div className="absolute inset-0 bg-paper-dark pointer-events-none" />
      <div className="absolute left-6 md:left-8 lg:left-12 top-0 bottom-0 w-px bg-ink/5" />
      <div className="absolute right-6 md:right-8 lg:right-12 top-0 bottom-0 w-px bg-ink/5" />

      <div className="relative mx-auto max-w-7xl">
        <div className="grid grid-cols-12 gap-8 md:gap-16 lg:gap-20">
          <div className="col-span-12 md:col-span-3 lg:col-span-2">
            <AnimatedSection>
              <span className="section-number">06</span>
              <p className="page-number mt-2">Toolkit</p>
            </AnimatedSection>
          </div>

          <div className="col-span-12 md:col-span-9 lg:col-span-10">
            <AnimatedSection delay={0.1}>
              <h2 className="text-3xl md:text-4xl lg:text-5xl mb-4">Tools &amp; <span className="italic font-italic text-accent">Software</span></h2>
            </AnimatedSection>
            <AnimatedSection delay={0.2}>
              <p className="text-ink-light font-light leading-relaxed max-w-2xl mb-14">
                The creative arsenal &mdash; industry-standard tools and beloved open-source alternatives used daily to bring ideas to life.
              </p>
            </AnimatedSection>

            <div className="space-y-12">
              {TOOL_CATEGORIES.map((cat, ci) => (
                <AnimatedSection key={cat.category} delay={0.3 + ci * 0.15}>
                  <div>
                    <p className="page-number mb-4">{cat.category}</p>
                    <div className="flex flex-wrap gap-2">
                      {cat.tools.map((tool, ti) => (
                        <motion.div key={tool.name} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: ti * 0.05 }}
                          className="group flex items-center gap-3 px-4 py-3 bg-white border border-ink/6 hover:border-accent/30 transition-all duration-300">
                          <div className="w-2 h-2 bg-accent/40 group-hover:bg-accent transition-colors" />
                          <div>
                            <p className="text-sm font-medium text-ink group-hover:text-accent transition-colors">{tool.name}</p>
                            <p className="text-[0.6rem] text-ink-faint font-light">{tool.role}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>

            <AnimatedSection delay={0.8}>
              <div className="mt-12 pt-8 border-t border-ink/5">
                <p className="page-number mb-4">Complete Tag Cloud</p>
                <div className="flex flex-wrap gap-x-4 gap-y-2">
                  {TAG_CLOUD.map((tool, i) => {
                    const sizes = ['text-xs', 'text-sm', 'text-xs', 'text-base', 'text-xs']
                    const opacities = ['text-ink-light/50', 'text-ink-light/70', 'text-ink-light/40', 'text-ink-light', 'text-ink-light/60']
                    return (
                      <motion.span key={tool} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.02 }}
                        className={`${sizes[i % 5]} ${opacities[i % 5]} hover:text-accent transition-colors cursor-default font-light`}>
                        {tool}
                      </motion.span>
                    )
                  })}
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </section>
  )
}
