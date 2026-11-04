import type { Config } from 'tailwindcss';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'violet-imperial': '#6600CC',
        'or-champagne': '#C9A070',
        'amethyste': '#A87FE8',
        'ivoire-violet': '#F8F5FF',
        'ardoise': '#3A2F5C',
        'onyx': '#0D0A18',
      },
      fontFamily: {
        title: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        body: ['Jost', 'sans-serif'],
      },
      fontSize: {
        // Strict mobile floors (Section 2)
        // micro-text floor: 13px (0.8125rem), never 12px
        'xs': ['0.8125rem', { lineHeight: '1.25rem' }],
        // secondary text floor: 14px (0.875rem)
        'sm': ['0.875rem', { lineHeight: '1.35rem' }],
        // body text floor: 16px (1rem)
        'base': ['1rem', { lineHeight: '1.55rem' }],
        'lg': ['1.125rem', { lineHeight: '1.65rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.6rem' }],
        '5xl': ['3rem', { lineHeight: '1.15' }],
        '6xl': ['3.75rem', { lineHeight: '1.1' }],

        // Fluid typography scale (Section 3) with clamp()
        'fluid-hero': ['clamp(1.85rem, 5vw + 0.6rem, 4.25rem)', { lineHeight: '1.1' }],
        'fluid-h1': ['clamp(1.75rem, 4vw + 0.6rem, 3.5rem)', { lineHeight: '1.15' }],
        'fluid-h2': ['clamp(1.5rem, 3vw + 0.5rem, 2.75rem)', { lineHeight: '1.2' }],
        'fluid-h3': ['clamp(1.25rem, 1.5vw + 0.5rem, 1.875rem)', { lineHeight: '1.3' }],
        'fluid-body': ['clamp(1rem, 0.3vw + 0.95rem, 1.125rem)', { lineHeight: '1.6' }],
        'fluid-secondary': ['clamp(0.875rem, 0.2vw + 0.85rem, 0.9375rem)', { lineHeight: '1.5' }],
        'fluid-micro': ['0.8125rem', { lineHeight: '1.25rem' }],
      },
      boxShadow: {
        'soft': '0 10px 30px -10px rgba(102, 0, 204, 0.08)',
        'soft-lg': '0 20px 40px -15px rgba(102, 0, 204, 0.12)',
        'glow': '0 0 25px rgba(168, 127, 232, 0.35)',
        'glow-violet': '0 0 30px rgba(102, 0, 204, 0.4)',
      },
      borderRadius: {
        'pill': '9999px',
      },
    },
  },
  plugins: [],
} satisfies Config;
