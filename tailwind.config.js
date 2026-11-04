/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        paper: '#0d1410',
        'paper-dark': '#111c14',
        'paper-darker': '#162319',
        ink: '#d4e4d8',
        'ink-light': '#a8b8ac',
        'ink-faint': '#8a9c8e',
        accent: '#4a9f62',
        'accent-deep': '#2d6b3f',
        'accent-light': '#63b476',
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
