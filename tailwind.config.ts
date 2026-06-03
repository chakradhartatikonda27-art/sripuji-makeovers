import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        coral: {
          50:  '#FFF5F3',
          100: '#FFE4E2',
          200: '#FFCDC9',
          300: '#FFB5B0',
          400: '#F5857E',
          500: '#F0635A',
          600: '#D94F47',
          700: '#B53D36',
          800: '#8F2E28',
          900: '#6B1F1A',
        },
        blush: {
          50:  '#FFFAF9',
          100: '#FFF5F3',
          200: '#FFF0EE',
          300: '#FFE4E2',
          400: '#FFCDC9',
        },
      },
      fontFamily: {
        sans:    ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
        display: ['var(--font-playfair)', '"Playfair Display"', 'Georgia', 'serif'],
      },
      animation: {
        'fade-up':   'fadeUp 0.6s ease-out both',
        'fade-in':   'fadeIn 0.5s ease-out both',
        'marquee':   'marquee 25s linear infinite',
        'pulse-dot': 'pulseDot 2s ease-in-out infinite',
      },
      keyframes: {
        fadeUp:   { from: { opacity: '0', transform: 'translateY(24px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        fadeIn:   { from: { opacity: '0' }, to: { opacity: '1' } },
        marquee:  { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } },
        pulseDot: { '0%,100%': { opacity: '1' }, '50%': { opacity: '0.4' } },
      },
      boxShadow: {
        coral:    '0 4px 24px rgba(240,99,90,0.14)',
        'coral-lg':'0 8px 40px rgba(240,99,90,0.20)',
      },
    },
  },
  plugins: [],
}
export default config
