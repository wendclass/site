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
