/**
 * Showreel.jsx
 *
 * Dedicated subpage for the creative showreel video.
 * Embeds a Google Drive hosted video in the portfolio's editorial style.
 */

import { Link } from 'react-router-dom'
import Nav from './Nav'
import { FitLines } from './components/PretextType'
import { Grain } from './sections/DecorativeBreaks.jsx'
import { motion } from 'framer-motion'

const VIDEO_ID = '11jd-ODs1Ku42kJMiD9yCzHZBcapOsQRy'
const TITLE = ['Showreel']

export default function Showreel() {
  return (
    <div className="relative min-h-screen text-ink bg-[#0d1410]">
      <Grain />
      <Nav />

      <div className="pt-28 pb-20 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-10"
        >
          <FitLines lines={TITLE} font={'340 "Fraunces"'} as="h1" maxSize={170} className="page-title" />
          <p className="text-ink-light text-base font-light max-w-xl mt-4 leading-relaxed">
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
            src={`https://drive.google.com/file/d/${VIDEO_ID}/preview`}
            width="100%"
            height="100%"
            allow="autoplay"
            allowFullScreen
            className="w-full h-full border-0"
            title="Yehia Salem — Showreel"
          />
        </motion.div>
        <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <a href={`https://drive.google.com/file/d/${VIDEO_ID}/view`} target="_blank" rel="noopener noreferrer" className="text-accent-light underline underline-offset-4">
            Open in Google Drive
          </a>
          <Link to="/works" className="text-accent-light underline underline-offset-4">See the complete works</Link>
        </div>
        </div>
      </div>
    </div>
  )
}
