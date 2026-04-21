/**
 * App.jsx — Main page orchestrator
 *
 * This file wires together all section components. Business logic and markup
 * live in src/sections/ — this file is intentionally kept minimal.
 */

import Cursor from './Cursor'
import Nav from './Nav'
import { DividerText } from './motionEffects.jsx'

// Decorative utilities
import { Grain, SectionNav, KeyboardShortcuts, BotanicalBreak, MarqueeStrip, GeometricPatternBand, DecorativeEmblem, DecorativeBreak } from './sections/DecorativeBreaks.jsx'

// Sections (in render order)
import Hero from './sections/Hero.jsx'
import Ticker from './sections/Ticker.jsx'
import About from './sections/About.jsx'
import Skills from './sections/Skills.jsx'
import Values from './sections/Values.jsx'
import Awards from './sections/Awards.jsx'
import ToolsSection from './sections/ToolsSection.jsx'
import Interests from './sections/Interests.jsx'
import Education from './sections/Education.jsx'
import VisualMoments from './sections/VisualMoments.jsx'
import Contact from './sections/Contact.jsx'
import Footer from './sections/Footer.jsx'

export default function App() {
  return (
    <div className="relative min-h-screen text-ink cursor-none page-enter">
      {/* Global overlays */}
      <Cursor />
      <Grain />
      <KeyboardShortcuts />

      {/* Navigation */}
      <Nav />
      <SectionNav />

      {/* Page sections */}
      <Hero />
      <Ticker />
      <About />
      <BotanicalBreak />
      <MarqueeStrip />
      <Skills />
      <GeometricPatternBand />
      <DividerText text="CRAFT" />
      <DecorativeBreak letter="A" />
      <Awards />
      <DecorativeEmblem />
      <DividerText text="CREATE" />
      <ToolsSection />
      <Values />
      <Interests />
      <Education />
      <VisualMoments />
      <Contact />
      <Footer />
    </div>
  )
}
