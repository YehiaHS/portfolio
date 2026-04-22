/**
 * Showreel.jsx
 *
 * Dedicated subpage for the creative showreel video.
 * Embeds a Google Drive hosted video in the portfolio's editorial style.
 */

import Nav from './Nav'
import { Grain } from './sections/DecorativeBreaks.jsx'
import { motion } from 'framer-motion'

export default function Showreel() {
  return (
    <div className="relative min-h-screen text-ink bg-[#0d1410]">
      <Grain />
      <Nav />

      <main className="pt-28 pb-20 px-6 md:px-12 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-10"
        >
          <p className="text-[0.6rem] tracking-[0.3em] uppercase text-[#4a9f62] font-heading mb-3">
            Creative Portfolio
          </p>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-[#d4e4d8] mb-3 tracking-tight">
            Showreel
          </h1>
          <div className="h-px w-24 bg-gradient-to-r from-[#4a9f62] to-transparent mb-4" />
          <p className="text-[#5a6a5e] text-sm md:text-base font-body max-w-xl leading-relaxed">
            A curated selection of creative work spanning design, motion, and digital storytelling.
          </p>
        </motion.div>

        {/* Video embed */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="w-full aspect-video rounded-xl overflow-hidden border border-[#4a9f62]/20 shadow-[0_40px_100px_-25px_rgba(0,0,0,0.7)] bg-[#111c14]"
        >
          <iframe
            src="https://drive.google.com/file/d/11jd-ODs1Ku42kJMiD9yCzHZBcapOsQRy/preview"
            width="100%"
            height="100%"
            allow="autoplay"
            allowFullScreen
            className="w-full h-full border-0"
            title="Yehia Salem — Showreel"
          />
        </motion.div>
      </main>
    </div>
  )
}
