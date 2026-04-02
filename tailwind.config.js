/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        paper: '#f7f3ee',
        'paper-dark': '#f0ebe5',
        ink: '#1a1a1a',
        'ink-light': '#4a4a4a',
        'ink-faint': '#8a8a8a',
        accent: '#c45b1e',
        'accent-deep': '#8b3a0f',
        sage: '#6b7e5e',
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
        soft: '0 8px 32px rgba(0,0,0,0.06)',
        card: '0 1px 3px rgba(0,0,0,0.03), 0 8px 24px rgba(0,0,0,0.04)',
      },
    },
  },
  plugins: [],
}
