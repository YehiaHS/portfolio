/**
 * sections/Contact.jsx — Contact section with email, WhatsApp, phone cards & social links
 */
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useLanguage } from '../LanguageContext'
import AnimatedSection from '../components/AnimatedSection'



const SOCIALS = [
  {
    name: 'GitHub',
    href: 'https://github.com/yehiasalem',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
      </svg>
    ),
  },
  {
    name: 'LinkedIn',
    href: 'https://linkedin.com/in/yehiahatemsalem',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
]

export default function Contact() {
  const { t } = useLanguage()
  const profile = t('profile')

  const contactMethods = [
    {
      label: t('email'),
      value: profile.contact.email,
      href: `mailto:${profile.contact.email}`,
      icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 4-10 8L2 4" /></svg>,
    },
    {
      label: t('whatsapp'),
      value: profile.contact.whatsapp,
      href: `https://wa.me/${profile.contact.whatsapp.replace(/[^0-9]/g, '')}`,
      icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" /></svg>,
    },
    {
      label: t('phone'),
      value: profile.contact.phone,
      href: `tel:${profile.contact.phone}`,
      icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>,
    },
  ]

  return (
    <section id="contact" className="relative py-20 md:py-28 lg:py-40 px-6 md:px-8 lg:px-12">
      <div className="absolute left-6 md:left-8 lg:left-12 top-0 bottom-0 w-px bg-ink/5" />
      <div className="absolute right-6 md:right-8 lg:right-12 top-0 bottom-0 w-px bg-ink/5" />
      <div className="hidden lg:block absolute left-0 top-0 bottom-0 w-24 pointer-events-none select-none opacity-[0.04]">
        <svg className="absolute top-20 left-3" viewBox="0 0 40 40" fill="none" stroke="#2d5a3d" strokeWidth="1">
          <rect x="3" y="8" width="34" height="24" rx="2" /><path d="M3 8l17 14L37 8" />
        </svg>
      </div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.02] font-heading text-[16rem] md:text-[24rem] font-bold leading-none select-none pointer-events-none whitespace-nowrap">
        Let&apos;s Talk
      </div>

      <div className="relative mx-auto max-w-7xl">
        <div className="grid grid-cols-12 gap-8 md:gap-16 lg:gap-20">
          <div className="col-span-12 md:col-span-3 lg:col-span-2">
            <AnimatedSection>
              <span className="section-number">09</span>
              <p className="page-number mt-2">{t('contactMe')}</p>
            </AnimatedSection>
          </div>

          <div className="col-span-12 md:col-span-9 lg:col-span-10">
            <AnimatedSection delay={0.1}>
              <h2 className="text-3xl md:text-5xl xl:text-7xl mb-4 leading-none">
                Let&apos;s <span className="italic font-italic text-accent">connect</span>
              </h2>
            </AnimatedSection>
            <AnimatedSection delay={0.2}><p className="page-number mb-4">{t('available')}</p></AnimatedSection>
            <AnimatedSection delay={0.3}>
              <p className="text-ink-light font-light text-lg max-w-xl mb-14 leading-relaxed">
                Whether you have an exciting project in mind, want to collaborate, or simply wish to say hello &mdash; my inbox is always open.
              </p>
            </AnimatedSection>

            {/* Contact cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-ink/5 mb-10">
              {contactMethods.map(({ label, value, href, icon }) => (
                <AnimatedSection key={label}>
                  <motion.a
                    href={href}
                    target={href.startsWith('http') ? '_blank' : undefined}
                    rel={href.startsWith('http') ? 'noreferrer' : undefined}
                    className="block bg-paper p-8 hover:bg-white transition-colors group"
                    whileHover={{ y: -6, rotate: -0.5 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                  >
                    <div className="flex items-center gap-2 mb-3 text-ink-faint group-hover:text-accent transition-colors">
                      {icon}
                      <p className="page-number">{label}</p>
                    </div>
                    <p className="text-sm text-ink font-light group-hover:text-accent transition-colors break-all">{value}</p>
                  </motion.a>
                </AnimatedSection>
              ))}
            </div>

            {/* Social links */}
            <AnimatedSection delay={0.7}>
              <div className="flex items-center gap-6 mb-8">
                <p className="page-number">Find me on</p>
                {SOCIALS.map((s) => (
                  <a key={s.name} href={s.href} target="_blank" rel="noreferrer" className="text-ink-faint hover:text-accent transition-colors duration-300" title={s.name}>
                    {s.icon}
                  </a>
                ))}
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.6}>
              <div className="pt-8 border-t border-ink/5">
                <p className="section-number mb-3">{t('whyReachOut')}</p>
                <p className="text-ink-light text-sm font-light leading-relaxed max-w-xl">{t('reachOutText')}</p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </section>
  )
}
