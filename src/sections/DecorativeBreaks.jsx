/**
 * sections/DecorativeBreaks.jsx
 *
 * The patterned band between Skills and Awards, and the page grain overlay.
 */

/* ── GeometricPatternBand ────────────────────────────────────────────────── */
export function GeometricPatternBand() {
  return (
    <div className="relative h-32 md:h-40 overflow-hidden bg-[#0a0e0c]">
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1440 160" fill="none" preserveAspectRatio="none">
        {Array.from({ length: 36 }).map((_, i) => (
          <line key={`v${i}`} x1={i * 40} y1="0" x2={i * 40} y2="160" stroke="#2d5a3d" strokeWidth="0.3" opacity="0.3" />
        ))}
        {Array.from({ length: 5 }).map((_, i) => (
          <line key={`h${i}`} x1="0" y1={i * 40} x2="1440" y2={i * 40} stroke="#2d5a3d" strokeWidth="0.3" opacity="0.3" />
        ))}
        {Array.from({ length: 18 }).map((_, i) => (
          <rect key={`d${i}`} x={i * 80 + 30} y={i % 2 === 0 ? 10 : 50} width="20" height="20"
            transform={`rotate(45 ${i * 80 + 40} ${i % 2 === 0 ? 20 : 60})`}
            fill="#4a8f5c" opacity={i % 3 === 0 ? '0.25' : i % 3 === 1 ? '0.15' : '0.08'} />
        ))}
        <circle cx="200" cy="80" r="50" stroke="#4a8f5c" strokeWidth="0.5" opacity="0.15" />
        <circle cx="720" cy="80" r="60" stroke="#4a8f5c" strokeWidth="0.5" opacity="0.12" />
        <circle cx="1240" cy="80" r="45" stroke="#4a8f5c" strokeWidth="0.5" opacity="0.15" />
        <path d="M0 100 Q 360 40, 720 100 Q 1080 160, 1440 100" stroke="#4a8f5c" strokeWidth="1" opacity="0.2" />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-[#f5f5f0]/60 text-[0.6rem] font-heading font-semibold tracking-[0.3em] uppercase">
          Craft &middot; Code &middot; Create
        </span>
      </div>
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#4a8f5c]/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#4a8f5c]/30 to-transparent" />
    </div>
  )
}

/* ── Grain Overlay ───────────────────────────────────────────────────────── */
export function Grain() {
  return (
    <svg className="fixed inset-0 w-full h-full pointer-events-none z-[9998] opacity-[0.035] mix-blend-overlay" style={{ pointerEvents: 'none' }}>
      <filter id="noiseFilter">
        <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch">
          <animate attributeName="baseFrequency" values="0.8;0.82;0.79;0.8" dur="0.3s" repeatCount="indefinite" />
        </feTurbulence>
      </filter>
      <rect width="100%" height="100%" filter="url(#noiseFilter)" />
    </svg>
  )
}
