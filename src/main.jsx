import React, { Suspense, lazy } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence, MotionConfig, motion } from 'framer-motion'
import { LanguageProvider } from './LanguageContext.jsx'
import App from './App.jsx'
import ErrorBoundary from './ErrorBoundary.jsx'
import ScrollToTop from './components/ScrollToTop.jsx'
import './index.css'

const BehindTheScenes = lazy(() => import('./BehindTheScenes.jsx'))
const WorksArchive = lazy(() => import('./WorksArchive.jsx'))
const Showreel = lazy(() => import('./Showreel.jsx'))

const basename = import.meta.env.BASE_URL

const AnimatedRoutes = () => {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className="page-enter"
      >
        <Suspense fallback={<div className="min-h-screen" />}>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/works" element={<WorksArchive />} />
          <Route path="/behind-the-scenes" element={<BehindTheScenes />} />
          <Route path="/showreel" element={<Showreel />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </Suspense>
      </motion.div>
    </AnimatePresence>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <LanguageProvider>
        <BrowserRouter basename={basename}>
          <MotionConfig reducedMotion="user">
            <ScrollToTop />
            <AnimatedRoutes />
          </MotionConfig>
        </BrowserRouter>
      </LanguageProvider>
    </ErrorBoundary>
  </React.StrictMode>,
)
