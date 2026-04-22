import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { LanguageProvider } from './LanguageContext.jsx'
import App from './App.jsx'
import BehindTheScenes from './BehindTheScenes.jsx'
import WorksArchive from './WorksArchive.jsx'
import Showreel from './Showreel.jsx'
import ErrorBoundary from './ErrorBoundary.jsx'
import ScrollToTop from './components/ScrollToTop.jsx'
import './index.css'

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
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/works" element={<WorksArchive />} />
          <Route path="/behind-the-scenes" element={<BehindTheScenes />} />
          <Route path="/showreel" element={<Showreel />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <LanguageProvider>
        <BrowserRouter basename={basename}>
          <ScrollToTop />
          <AnimatedRoutes />
        </BrowserRouter>
      </LanguageProvider>
    </ErrorBoundary>
  </React.StrictMode>,
)
