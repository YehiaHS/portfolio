import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useLanguage } from '../LanguageContext'

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

const heroStats = {
  en: [
    { value: '3', label: 'Languages' },
    { value: '2', label: 'Degrees' },
    { value: '8.5', label: 'IELTS Score' },
    { value: '10+', label: 'Design Tools' },
  ],
  ar: [
    { value: '3', label: 'لغات' },
    { value: '2', label: 'درجتان' },
    { value: '8.5', label: 'درجة IELTS' },
    { value: '10+', label: 'أدوات تصميم' },
  ],
  fr: [
    { value: '3', label: 'Langues' },
    { value: '2', label: 'Diplômes' },
    { value: '8.5', label: 'Score IELTS' },
    { value: '10+', label: 'Outils de design' },
  ],
}

const stripArrows = (label) => label.replace(/[←→]/g, '').trim()

export default function Hero() {
  const { language, t } = useLanguage()
  const quote = heroQuotes[language] || heroQuotes.en
  const stats = heroStats[language] || heroStats.en
  const viewPortfolioLabel = stripArrows(t('viewPortfolio'))

  return (
    <section className="hero-section">
      <div className="hero-background" aria-hidden="true" />

      <div className="hero-shell">
        <div className="hero-desktop">
          <div className="hero-stage">
            <div className="hero-top-line" aria-hidden="true" />
            <div className="hero-serial" aria-hidden="true">01</div>

            <motion.div
              className="hero-stats"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              {stats.map((stat, index) => (
                <div key={`${stat.label}-${index}`} className="hero-stat">
                  <span className="hero-stat__value">{stat.value}</span>
                  <span className="hero-stat__label">{stat.label}</span>
                </div>
              ))}
            </motion.div>

            <motion.p
              className="hero-greeting"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.25 }}
            >
              {t('hello')}
            </motion.p>

            <motion.h1
              className="hero-name"
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.38 }}
            >
              Yehia
            </motion.h1>

            <motion.div
              className="hero-portrait"
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.05, delay: 0.48 }}
            >
              <img
                src={`${import.meta.env.BASE_URL}images/Yehia_Professional.png`}
                alt="Yehia Salem"
                draggable={false}
                onDragStart={(event) => event.preventDefault()}
              />
            </motion.div>

            <motion.p
              className="hero-surname"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.52 }}
            >
              Salem
            </motion.p>

            <motion.div
              className="hero-copy"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.95, delay: 0.62 }}
            >
              <p className="hero-tagline">{t('tagline')}</p>
              <p className="hero-location">{t('location')}</p>

              <blockquote className="hero-quote">
                <p>{quote.text}</p>
                <footer>{quote.source}</footer>
              </blockquote>

              <div className="hero-actions">
                <a href="#about" className="hero-pill-link" aria-label={t('aboutLabel')} />
                <Link to="/works" className="hero-primary-link">
                  <span>{viewPortfolioLabel}</span>
                  <span aria-hidden="true">→</span>
                </Link>
                <Link to="/behind-the-scenes" className="hero-secondary-link">
                  Behind the Scenes
                </Link>
              </div>

              <p className="hero-actions-caption">Complete Works</p>
            </motion.div>
          </div>
        </div>

        <div className="hero-mobile">
          <motion.p
            className="hero-mobile__greeting"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            {t('hello')}
          </motion.p>

          <motion.h1
            className="hero-mobile__name"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.28 }}
          >
            Yehia
          </motion.h1>

          <motion.div
            className="hero-mobile__portrait"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.36 }}
          >
            <img
              src={`${import.meta.env.BASE_URL}images/Yehia_Professional.png`}
              alt="Yehia Salem"
              draggable={false}
              onDragStart={(event) => event.preventDefault()}
            />
          </motion.div>

          <motion.p
            className="hero-mobile__surname"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45 }}
          >
            Salem
          </motion.p>

          <motion.div
            className="hero-mobile__copy"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.56 }}
          >
            <p className="hero-mobile__tagline">{t('tagline')}</p>
            <p className="hero-mobile__location">{t('location')}</p>

            <blockquote className="hero-mobile__quote">
              <p>{quote.text}</p>
              <footer>{quote.source}</footer>
            </blockquote>

            <div className="hero-mobile__actions">
              <a href="#about" className="hero-pill-link" aria-label={t('aboutLabel')} />
              <Link to="/works" className="hero-primary-link">
                <span>{viewPortfolioLabel}</span>
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </motion.div>

          <motion.div
            className="hero-mobile__stats"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.66 }}
          >
            {stats.map((stat, index) => (
              <div key={`${stat.label}-${index}`} className="hero-mobile__stat">
                <span className="hero-mobile__stat-value">{stat.value}</span>
                <span className="hero-mobile__stat-label">{stat.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
