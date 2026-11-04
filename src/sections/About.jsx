/**
 * sections/About.jsx
 *
 * The bio wraps around an arched portrait, then a pull-quote set to the full width of the page.
 * Both are laid out with pretext (see components/PretextType.jsx).
 */

import { useCallback, useMemo } from 'react'
import { useLanguage } from '../LanguageContext'
import AnimatedSection from '../components/AnimatedSection'
import { FitLines, FlowText, useElementWidth } from '../components/PretextType'

const QUOTE_LINES = ['The best work lives', 'where disciplines', 'collide.']

/** Arch proportions shared by the image and the text wrapping around it. */
function archFor(width) {
  const small = width < 560
  const archWidth = small ? width * 0.46 : Math.min(width * 0.38, 400)
  return { small, archWidth, archHeight: archWidth * 1.32, gutter: small ? 16 : 44 }
}

export default function About() {
  const { t } = useLanguage()
  const profile = t('profile')
  const headline = t('aboutHeadline')
  const [flowRef, width] = useElementWidth()
  const { small, archWidth, archHeight, gutter } = archFor(width)

  const insetAt = useCallback(
    (y) => {
      if (y >= archHeight + gutter / 2) return 0
      const radius = archWidth / 2
      if (y >= radius) return archWidth + gutter
      // The arch's semicircular top: how far its edge reaches at this height
      return radius + Math.sqrt(radius * radius - (radius - y) * (radius - y)) + gutter
    },
    [archWidth, archHeight, gutter],
  )

  const blocks = useMemo(
    () => [
      {
        text: headline,
        as: 'h2',
        font: `340 ${small ? 30 : 46}px Fraunces`,
        lineHeight: small ? 36 : 54,
        className: 'text-ink',
        gapAfter: small ? 12 : 20,
      },
      {
        text: profile.summary,
        font: `300 ${small ? 16 : 21}px Manrope`,
        lineHeight: small ? 25 : 33,
        className: 'text-ink-light',
        gapAfter: 0,
      },
    ],
    [small, profile.summary, headline],
  )

  return (
    <section id="about" className="relative py-20 md:py-28 lg:py-40 px-6 md:px-8 lg:px-12">
      <div className="absolute left-6 md:left-8 lg:left-12 top-0 bottom-0 w-px bg-ink/5" />
      <div className="absolute right-6 md:right-8 lg:right-12 top-0 bottom-0 w-px bg-ink/5" />

      <div className="relative mx-auto max-w-7xl">
        <div className="grid grid-cols-12 gap-8 md:gap-16 lg:gap-20">
          <div className="col-span-12 md:col-span-3 lg:col-span-2">
            <AnimatedSection>
              <span className="section-number">01</span>
              <p className="page-number mt-2">{t('aboutLabel')}</p>
            </AnimatedSection>
          </div>

          <div ref={flowRef} className="relative col-span-12 md:col-span-9 lg:col-span-10" style={{ minHeight: archHeight }}>
            <img
              src={`${import.meta.env.BASE_URL}images/about_portrait.jpg`}
              alt="Yehia Salem at a table, smiling, with birthday cupcakes in front of him"
              loading="lazy"
              decoding="async"
              className="about-arch"
              style={{ width: archWidth, height: archHeight, borderRadius: `${archWidth / 2}px ${archWidth / 2}px 0 0` }}
            />

            {width > 0 && (
              <FlowText blocks={blocks} width={width} insetAt={insetAt} minHeight={small ? archHeight + 20 : 0} />
            )}

            <ul className="about-highlights" style={{ marginInlineStart: small ? 0 : archWidth + gutter }}>
              {profile.highlights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        <FitLines lines={QUOTE_LINES} font={'italic 400 "Instrument Serif"'} maxSize={230} className="about-quote" />
      </div>
    </section>
  )
}
