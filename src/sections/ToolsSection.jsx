/**
 * sections/ToolsSection.jsx — Tools & Software section
 */
import { motion } from 'framer-motion'
import AnimatedSection from '../components/AnimatedSection'
import { MaskReveal } from '../motionEffects.jsx'



const SVGL_URLs = {
  'Affinity Photo': 'https://svgl.app/library/affinity_photo.svg',
  'Adobe Photoshop': 'https://svgl.app/library/photoshop.svg',
  'Photoshop': 'https://svgl.app/library/photoshop.svg',
  'Affinity Designer': 'https://svgl.app/library/affinity_designer.svg',
  'Affinity Publisher': 'https://svgl.app/library/affinity_publisher.svg',
  'GIMP': 'https://svgl.app/library/gimp.svg',
  'Adobe Premiere': 'https://svgl.app/library/premiere.svg',
  'Premiere': 'https://svgl.app/library/premiere.svg',
  'HTML': 'https://svgl.app/library/html5.svg',
  'CSS': 'https://svgl.app/library/css.svg',
  'JavaScript': 'https://svgl.app/library/javascript.svg',
  'React': 'https://svgl.app/library/react_dark.svg',
  'Python': 'https://svgl.app/library/python.svg',
  'Git': 'https://svgl.app/library/git.svg',
  'VS Code': 'https://svgl.app/library/vscode.svg',
  'Figma': 'https://svgl.app/library/figma.svg',
  'Canva': 'https://svgl.app/library/canva.svg',
  'Lightroom': 'https://svgl.app/library/lightroom.svg',
  'After Effects': 'https://svgl.app/library/after-effects.svg',
  'Blender': 'https://svgl.app/library/blender.svg'
};

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
    ],
  },
  {
    category: 'Digital Art',
    tools: [
      { name: 'Krita', role: 'Digital Painting' },
      { name: 'Paint Tool SAI', role: 'Illustration' },
    ],
  },
]

const ALSO_USES = ['Figma', 'Lightroom', 'After Effects', 'Blender', 'Canva', 'HTML', 'CSS', 'JavaScript', 'React', 'Python', 'Git', 'VS Code']

export default function ToolsSection() {
  const desc = "The creative arsenal — industry-standard tools and beloved open-source alternatives used daily to bring ideas to life."
  return (
    <section id="tools" className="relative py-20 md:py-28 lg:py-40 px-6 md:px-8 lg:px-12">
      <div className="absolute inset-0 bg-paper-dark pointer-events-none" />
      <div className="absolute left-6 md:left-8 lg:left-12 top-0 bottom-0 w-px bg-ink/5" />
      <div className="absolute right-6 md:right-8 lg:right-12 top-0 bottom-0 w-px bg-ink/5" />

      <div className="relative mx-auto max-w-7xl">
        <div className="grid grid-cols-12 gap-8 md:gap-16 lg:gap-20">
          <div className="col-span-12 md:col-span-3 lg:col-span-2">
            <AnimatedSection>
              <span className="section-number">04</span>
              <p className="page-number mt-2">Toolkit</p>
            </AnimatedSection>
          </div>

          <div className="col-span-12 md:col-span-9 lg:col-span-10">
            <AnimatedSection delay={0.1}>
              <h2 className="text-3xl md:text-4xl lg:text-5xl mb-4">Tools &amp; <span className="italic font-italic text-accent">Software</span></h2>
            </AnimatedSection>
            
            <div className="max-w-2xl mb-14">
              <MaskReveal delay={0.2}>
                <p className="text-ink-light font-light leading-relaxed">
                  {desc}
                </p>
              </MaskReveal>
            </div>

            <div className="space-y-12">
              {TOOL_CATEGORIES.map((cat, ci) => (
                <AnimatedSection key={cat.category} delay={0.3 + ci * 0.15}>
                  <div>
                    <p className="page-number mb-4">{cat.category}</p>
                    <div className="flex flex-wrap gap-2">
                      {cat.tools.map((tool, ti) => (
                        <motion.div key={tool.name} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: ti * 0.05 }}
                          className="group flex flex-col md:flex-row items-start md:items-center gap-4 px-5 py-4 bg-paper-dark border border-ink/10 hover:border-accent/30 transition-all duration-300">
                          {SVGL_URLs[tool.name] ? (
                            <img src={SVGL_URLs[tool.name]} alt={tool.name} className="w-8 h-8 lg:w-9 lg:h-9 object-contain grayscale group-hover:grayscale-0 transition-all duration-300 pointer-events-none" />
                          ) : (
                            <div className="w-8 h-8 lg:w-9 lg:h-9 rounded-sm border border-ink/10 flex items-center justify-center font-display text-sm text-ink-light" aria-hidden="true">{tool.name[0]}</div>
                          )}
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
                <p className="page-number mb-3">Also uses</p>
                <p className="text-sm text-ink-light font-light leading-relaxed max-w-2xl">{ALSO_USES.join(', ')}</p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </section>
  )
}
