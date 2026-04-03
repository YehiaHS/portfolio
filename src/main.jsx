import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { LanguageProvider } from './LanguageContext.jsx'
import App from './App.jsx'
import Portfolio from './Portfolio.jsx'
import BehindTheScenes from './BehindTheScenes.jsx'
import WorksArchive from './WorksArchive.jsx'
import ErrorBoundary from './ErrorBoundary.jsx'
import ScrollToTop from './components/ScrollToTop.jsx'
import './index.css'

const basename = import.meta.env.BASE_URL

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <LanguageProvider>
        <BrowserRouter basename={basename}>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/behind-the-scenes" element={<BehindTheScenes />} />
            <Route path="/works" element={<WorksArchive />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </LanguageProvider>
    </ErrorBoundary>
  </React.StrictMode>,
)
