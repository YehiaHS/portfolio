/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        noir: '#0a0a0f',
        graphite: '#131320',
        smoke: '#1c1c2e',
        fog: '#2a2a3e',
        pearl: '#e8e6e1',
        cream: '#d4d0c8',
        wheat: '#b8af9e',
        amber: '#f5a623',
        copper: '#d4763c',
        rose: '#c4637a',
        dusk: '#8b5cf6',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
        accent: ['"Cormorant"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        soft: '0 8px 32px rgba(0,0,0,0.3)',
        glow: '0 0 60px rgba(245,166,35,0.15)',
        inner: 'inset 0 1px 0 rgba(232,230,225,0.05)',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        breathe: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.7' },
        },
      },
      animation: {
        shimmer: 'shimmer 6s linear infinite',
        float: 'float 8s ease-in-out infinite',
        breathe: 'breathe 4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
