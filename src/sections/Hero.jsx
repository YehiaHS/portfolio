import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useLanguage } from '../LanguageContext'
import { latestItems, useDriveCategories } from '../data/driveContent'

const heroQuotes = {
  en: {
    text: 'It is only with the heart that one can see rightly; what is essential is invisible to the eye.',
    source: 'Le Petit Prince',
  },
  ar: {
    text: 'لا يُرى بوضوح إلا بالقلب؛ ما هو جوهري لا تراه العين.',
    source: 'الأمير الصغير',
  },
  fr: {
    text: 'On ne voit bien qu\'avec le cœur. L\'essentiel est invisible pour les yeux.',
    source: 'Le Petit Prince',
  },
}

const heroFacts = {
  en: ['3 languages', '2 degrees', 'IELTS 8.5', '10+ design tools'],
  ar: ['3 لغات', 'درجتان', 'IELTS 8.5', '+10 أدوات تصميم'],
  fr: ['3 langues', '2 diplômes', 'IELTS 8.5', '10+ outils de design'],
}

const stripArrows = (label) => label.replace(/[←→]/g, '').trim()

const entrance = (delay) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] },
})

/** Loads the 3D garden after the page is usable. The hero is complete without it. */
function useGarden(heroRef, hostRef, portraitRef) {
  useEffect(() => {
    if (navigator.connection?.saveData) return undefined

    let cancelled = false
    let dispose = null

    const load = async () => {
      try {
        const portrait = portraitRef.current
        const [{ createGarden }] = await Promise.all([import('../scene/garden.js'), portrait.decode()])
        if (!cancelled) dispose = createGarden({ host: hostRef.current, hero: heroRef.current, portrait })
      } catch (error) {
        // No WebGL or a failed download: the portrait image is already in place
        console.warn('Garden scene unavailable:', error.message)
      }
    }

    const idle = window.requestIdleCallback
      ? window.requestIdleCallback(load, { timeout: 1200 })
      : window.setTimeout(load, 200)

    return () => {
      cancelled = true
      if (window.cancelIdleCallback) window.cancelIdleCallback(idle)
      else window.clearTimeout(idle)
      dispose?.()
    }
  }, [heroRef, hostRef, portraitRef])
}

export default function Hero() {
  const { language, t } = useLanguage()
  const quote = heroQuotes[language] || heroQuotes.en
  const facts = heroFacts[language] || heroFacts.en
  const [newest] = latestItems(useDriveCategories(), 1)

  const heroRef = useRef(null)
  const hostRef = useRef(null)
  const portraitRef = useRef(null)
  useGarden(heroRef, hostRef, portraitRef)

  return (
    <section ref={heroRef} className="garden-hero">
      {/* The name sits under the canvas so that leaves and the portrait pass in front of the letters */}
      <h1 className="garden-name" dir="ltr">
        <motion.span className="garden-name__first" {...entrance(0.1)}>
          Yehia
        </motion.span>{' '}
        <motion.span className="garden-name__last" {...entrance(0.22)}>
          Salem
        </motion.span>
      </h1>

      <img
        ref={portraitRef}
        className="garden-portrait"
        src={`${import.meta.env.BASE_URL}images/portrait-cutout.webp`}
        alt="Portrait of Yehia Salem"
        width="697"
        height="980"
        draggable={false}
      />

      <div ref={hostRef} className="garden-canvas" aria-hidden="true" />

      <motion.div className="garden-intro" {...entrance(0.4)}>
        <p className="garden-tagline">{t('tagline')}</p>
        <p className="garden-location">{t('location')}</p>
        <div className="garden-actions">
          <Link to="/works" className="garden-action garden-action--primary">
            {stripArrows(t('viewPortfolio'))}
          </Link>
          <Link to="/behind-the-scenes" className="garden-action">
            {t('navBehind')}
          </Link>
        </div>
        {newest && (
          <Link to="/works" className="garden-new">
            {t('justAdded')}: {newest.caption}
          </Link>
        )}
      </motion.div>

      <motion.div className="garden-aside" {...entrance(0.52)}>
        <blockquote className="garden-quote">
          <p>{quote.text}</p>
          <footer>{quote.source}</footer>
        </blockquote>
        <ul className="garden-facts">
          {facts.map((fact) => (
            <li key={fact}>{fact}</li>
          ))}
        </ul>
      </motion.div>
    </section>
  )
}
