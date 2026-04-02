import { useRef, useState, useEffect } from 'react'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'

/* ──────────────────────── LINE SLIDE UP ──────────────────────── */
/* Tattoo site: text slides up with blur on scroll into view */

export const LineSlideUp = ({ children, className = '', delay = 0 }) => {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })

  return (
    <div className={`overflow-hidden ${className}`} ref={ref}>
      <motion.span
        initial={{ y: '100%', filter: 'blur(6px)' }}
        animate={inView ? { y: 0, filter: 'blur(0px)' } : {}}
        transition={{ duration: 0.8, delay, ease: [0.77, 0, 0.18, 1] }}
        className="block"
      >
        {children}
      </motion.span>
    </div>
  )
}

/* ──────────────────────── MASK REVEAL ──────────────────────── */
/* Tattoo site: background mask slides left to reveal text */

export const MaskReveal = ({ children, className = '', delay = 0 }) => {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <div className={`overflow-hidden relative ${className}`} ref={ref}>
      <motion.div
        initial={{ scaleX: 1, originX: 0 }}
        animate={inView ? { scaleX: 0, originX: 1 } : {}}
        transition={{ duration: 0.8, delay, ease: [0.77, 0, 0.18, 1] }}
        className="absolute inset-0 z-10 bg-paper"
      />
      {children}
    </div>
  )
}

/* ──────────────────────── GLITCH TEXT ──────────────────────── */
/* Tattoo site: glitch effect on hover for headings */

export const GlitchText = ({ children, className = '', as: Tag = 'span' }) => (
  <Tag className={`glitch-text ${className}`} data-text={typeof children === 'string' ? children : ''}>
    {children}
  </Tag>
)

/* ──────────────────────── IMAGE PARALLAX ──────────────────────── */
/* Tattoo site: image moves slower than scroll inside container */

export const ImageParallax = ({ children, className = '', speed = 0.3 }) => {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], [`${speed * 100}%`, `-${speed * 100}%`])

  return (
    <div className={`img-parallax-wrap ${className}`} ref={ref}>
      <motion.div style={{ y }} className="w-full h-full">
        {children}
      </motion.div>
    </div>
  )
}

/* ──────────────────────── PROJECT CARD WITH BACK ──────────────────────── */
/* Tattoo site: card reveals details on hover like a flip */

export const ProjectCard = ({ front, back, className = '' }) => (
  <div className={`project-card relative ${className}`} style={{ minHeight: '400px' }}>
    <div className="project-card-inner w-full h-full">
      <div className="project-card-front">{front}</div>
      <div className="project-card-back rounded-xl">{back}</div>
    </div>
  </div>
)

/* ──────────────────────── HORIZONTAL MARQUEE ──────────────────────── */

export const MarqueeBand = ({ items, className = '' }) => (
  <div className={`marquee-strip ${className}`}>
    <div className="marquee-track">
      {[...items, ...items].map((item, i) => (
        <span key={i}>{item}</span>
      ))}
    </div>
  </div>
)

/* ──────────────────────── LARGE SECTION DIVIDER TEXT ──────────────────────── */

export const DividerText = ({ text, className = '' }) => (
  <div className={`section-divider-text ${className}`} aria-hidden="true">
    {text}
  </div>
)

/* ──────────────────────── STICKY IMAGE SECTION ──────────────────────── */
/* Tattoo site: image pins while text scrolls alongside */

export const StickyImageSection = ({ image, children, className = '' }) => {
  return (
    <section className={`relative grid md:grid-cols-2 gap-0 ${className}`}>
      <div className="md:sticky md:top-0 md:h-screen overflow-hidden">
        <ImageParallax speed={0.15}>
          {image}
        </ImageParallax>
      </div>
      <div className="px-8 md:px-16 py-20 space-y-32">
        {children}
      </div>
    </section>
  )
}

/* ──────────────────────── TEXT COUNTER (counts up when in view) ──────────────────────── */

export const TextCounter = ({ end, duration = 2, suffix = '', className = '' }) => {
  const ref = useRef(null)
  const [count, setCount] = useState(0)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (!inView) return
    let start = 0
    const step = end / (duration * 30)
    const timer = setInterval(() => {
      start += step
      if (start >= end) {
        setCount(end)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 33)
    return () => clearInterval(timer)
  }, [inView, end, duration])

  return <span ref={ref} className={className}>{count}{suffix}</span>
}

/* ──────────────────────── STAGGER CHILDREN CONTAINER ──────────────────────── */

export const StaggerContainer = ({ children, className = '', staggerMs = 80 }) => {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  const container = {
    hidden: {},
    visible: {
      transition: { staggerChildren: staggerMs / 1000 },
    },
  }

  const item = {
    hidden: { y: 20, opacity: 0, filter: 'blur(4px)' },
    visible: {
      y: 0,
      opacity: 1,
      filter: 'blur(0px)',
      transition: { duration: 0.6, ease: [0.77, 0, 0.18, 1] },
    },
  }

  return (
    <motion.div
      ref={ref}
      variants={container}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      className={className}
    >
      {Array.isArray(children)
        ? children.map((child, i) => (
            <motion.div key={i} variants={item}>
              {child}
            </motion.div>
          ))
        : null}
    </motion.div>
  )
}
