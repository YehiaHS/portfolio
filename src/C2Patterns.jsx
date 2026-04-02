import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/* ────────────────────── COLORED PANEL ────────────────────── */
// C2MTL: Full-width colored section panels with dot texture
export const ColoredPanel = ({ variant = 'default', children, className = '', as: Tag = 'section' }) => {
  const variantClass = variant === 'accent' ? 'bg-panel--accent'
    : variant === 'accent-deep' ? 'bg-panel--accent-deep'
    : variant === 'dark' ? 'bg-panel--dark'
    : variant === 'peach' ? 'bg-panel--peach'
    : variant === 'sage' ? 'bg-panel--sage'
    : variant === 'moss' ? 'bg-panel--moss'
    : 'bg-panel'

  return <Tag className={`bg-panel ${variantClass} ${className}`}>{children}</Tag>
}

/* ────────────────────── FEATURED CARD ────────────────────── */
// C2MTL: Image with colored gradient overlay + copy
export const FeaturedCard = ({ image, children, overlayType = 'green', className = '' }) => {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.4 }}
      className={`featured-card ${className}`}
    >
      <div className="featured-card__img relative">
        {image}
        {overlayType && <div className={`gradient-overlay gradient-overlay--${overlayType}`} />}
      </div>
      <div className="featured-card__copy px-4 py-4">
        {children}
      </div>
    </motion.div>
  )
}

/* ────────────────────── GHOST BUTTON ────────────────────── */
// C2MTL: Pill-shaped button with sweep fill on hover
export const GhostButton = ({ children, variant = 'default', onClick, className = '', type = 'button' }) => {
  const variantClass = variant === 'dark' ? 'btn-ghost--dark'
    : variant === 'light' ? 'btn-ghost--light'
    : 'btn-ghost'

  return (
    <button type={type} onClick={onClick} className={`${variantClass} ${className}`}>
      {children}
    </button>
  )
}

/* ────────────────────── HORIZONTAL CAROUSEL ────────────────────── */
// C2MTL: Scroll-snap horizontal carousel with arrow navigation
export const HCarousel = ({ children, className = '' }) => {
  const trackRef = useRef(null)

  const scroll = (dir) => {
    if (trackRef.current) {
      trackRef.current.scrollBy({ left: dir * 350, behavior: 'smooth' })
    }
  }

  return (
    <div className={`h-carousel ${className}`}>
      <div className="h-carousel__track" ref={trackRef} style={{ scrollbarWidth: 'none' }}>
        {children}
      </div>
    </div>
  )
}

HCarousel.Item = ({ children, className = '' }) => (
  <div className={`h-carousel__item ${className}`}>{children}</div>
)

/* ────────────────────── COUNTDOWN NUMBER ────────────────────── */
// C2MTL: Large display number with small label
export const CountdownNum = ({ value, label, className = '' }) => (
  <div className={`text-center ${className}`}>
    <div className="countdown-num">{value}</div>
    <div className="countdown-unit mt-2">{label}</div>
  </div>
)

/* ────────────────────── CONTENT GRID ────────────────────── */
// C2MTL: 1px gap grid panels
export const ContentGrid = ({
  children,
  cols = 2,
  variant = 'default',
  className = '',
}) => {
  return (
    <div
      className={`content-grid ${variant === 'accent' ? 'content-grid--accent' : ''} ${className}`}
      style={{
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
      }}
    >
      {children}
    </div>
  )
}

/* ────────────────────── NUMBERED ITEMS ────────────────────── */
// C2MTL: Auto-incrementing numbered items
export const NumberedList = ({ items, className = '' }) => (
  <div className={`numbered-grid ${className}`}>
    {items.map((item, i) => (
      <div key={i} className="numbered-item">
        <h4 className="text-lg font-display mb-2">{item.title || ''}</h4>
        <p className="text-sm leading-relaxed">{item.description}</p>
      </div>
    ))}
  </div>
)

/* ────────────────────── STACKED CARD ────────────────────── */
// C2MTL: Card with offset layered border behind
export const StackedCard = ({ children, className = '' }) => (
  <div className={`stacked-card ${className}`}>{children}</div>
)

/* ────────────────────── DIAGONAL OVERLAY TEXT ────────────────────── */
// C2MTL: Large rotated outlined text behind content
export const DiagonalOverlay = ({ text, className = '' }) => (
  <div className={`diagonal-overlay ${className}`}>{text}</div>
)

/* ────────────────────── TAG PILL ────────────────────── */
// C2MTL: Pill-shaped tag
export const TagPill = ({ children, variant = 'default', className = '' }) => {
  const cls = variant === 'filled' ? 'tag-pill--filled'
    : variant === 'accent' ? 'tag-pill--accent'
    : 'tag-pill'
  return <span className={`tag-pill ${cls} ${className}`}>{children}</span>
}

/* ────────────────────── BADGE PILL ────────────────────── */
// C2MTL: Small badge
export const BadgePill = ({ children, variant = 'light', className = '' }) => {
  const cls = variant === 'dark' ? 'badge-pill--dark'
    : variant === 'accent' ? 'badge-pill--accent'
    : 'badge-pill--light'
  return <span className={`badge-pill ${cls} ${className}`}>{children}</span>
}

/* ────────────────────── SPLIT LAYOUT ────────────────────── */
// C2MTL: 50/50 image + content split
export const SplitLayout = ({ image, children, reversed = false, className = '' }) => (
  <div className={`split-layout ${reversed ? 'flex-col-reverse md:flex-row-reverse' : ''} ${className}`}>
    <div className="split-layout__image overflow-hidden">{image}</div>
    <div className="split-layout__content">{children}</div>
  </div>
)
