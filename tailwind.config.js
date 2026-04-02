/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        paper: '#f5f5f0',
        'paper-dark': '#eeefe9',
        ink: '#0d1a0f',
        'ink-light': '#3a4f3e',
        'ink-faint': '#7a8f7e',
        accent: '#2d5a3d',
        'accent-deep': '#1a3526',
        'accent-light': '#4a8f5c',
        'accent-muted': '#6ea67e',
        sage: '#6b7e5e',
        'sage-light': '#8fa67e',
        moss: '#4a5d23',
        fern: '#63b476',
        forest: '#1b4332',
        cream: '#fefdf5',
        lichen: '#a8c5a0',
      },
      fontFamily: {
        display: ['"Fraunces"', 'Georgia', 'serif'],
        sans: ['"Manrope"', 'system-ui', 'sans-serif'],
        heading: ['"Syne"', 'system-ui', 'sans-serif'],
        italic: ['"Instrument Serif"', 'Georgia', 'serif'],
      },
      letterSpacing: {
        'tighter': '-0.04em',
        'ultra': '0.25em',
      },
      boxShadow: {
        soft: '0 8px 32px rgba(13,26,15,0.06)',
        card: '0 1px 3px rgba(13,26,15,0.03), 0 8px 24px rgba(13,26,15,0.04)',
      },
    },
  },
  plugins: [],
}
