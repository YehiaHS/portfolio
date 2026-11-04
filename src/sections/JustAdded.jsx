/**
 * sections/JustAdded.jsx — newest files from the Google Drive folder, right under the hero.
 * Renders nothing until the folder has files in it.
 */
import { Link } from 'react-router-dom'
import { useLanguage } from '../LanguageContext'
import { latestItems, useDriveCategories } from '../data/driveContent'
import ImageCard from '../components/ImageCard'

export default function JustAdded() {
  const { t } = useLanguage()
  const items = latestItems(useDriveCategories(), 3)

  if (items.length === 0) return null

  return (
    <section className="px-6 md:px-8 lg:px-12 py-14 md:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-baseline justify-between gap-6 mb-8">
          <h2 className="font-display text-3xl md:text-4xl text-ink">{t('justAdded')}</h2>
          <Link to="/works" className="text-sm text-accent-light underline underline-offset-4">
            {t('completeWorks')}
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {items.map((item, index) => (
            <Link key={item.id} to="/works" aria-label={item.caption} className="block">
              <ImageCard {...item} index={index} />
              <p className="mt-2 text-sm text-ink-light font-light">{item.caption}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
