/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#f0f8f3',
          100: '#dfeee4',
          200: '#bfdcc2',
          300: '#8ec29d',
          400: '#5ca57a',
          500: '#2e7d62',
          600: '#235e4d',
          700: '#1c4d41',
          800: '#183e3b',
          900: '#142f2d',
        },
        /* shadcn-style tokens used by the ported ui-layouts components.
           Literal values so portal-rendered components (dialogs, drawers)
           resolve correctly outside the .public-app scope. */
        border: '#e6e9e8',
        input: '#e6e9e8',
        ring: '#43923f',
        background: '#ffffff',
        foreground: '#0e1720',
        primary: { DEFAULT: '#43923f', foreground: '#ffffff' },
        secondary: { DEFAULT: '#eef2ef', foreground: '#0e1720' },
        muted: { DEFAULT: '#f4f7f5', foreground: '#4a5866' },
        accent: { DEFAULT: '#eef2ef', foreground: '#0e1720' },
        destructive: { DEFAULT: '#dc2626', foreground: '#ffffff' },
        card: { DEFAULT: '#ffffff', foreground: '#0e1720' },
        popover: { DEFAULT: '#ffffff', foreground: '#0e1720' },
      },
      boxShadow: {
        soft: '0 16px 40px rgba(20, 47, 45, 0.08)',
      },
      keyframes: {
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(calc(-100% - var(--gap)))' },
        },
        'marquee-reverse': {
          from: { transform: 'translateX(calc(-100% - var(--gap)))' },
          to: { transform: 'translateX(0)' },
        },
        'marquee-vertical': {
          from: { transform: 'translateY(0)' },
          to: { transform: 'translateY(calc(-100% - var(--gap)))' },
        },
        'marquee-vertical-reverse': {
          from: { transform: 'translateY(calc(-100% - var(--gap)))' },
          to: { transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
      },
      animation: {
        marquee: 'marquee var(--duration) linear infinite',
        'marquee-reverse': 'marquee-reverse var(--duration) linear infinite',
        'marquee-vertical': 'marquee-vertical var(--duration) linear infinite',
        'marquee-vertical-reverse': 'marquee-vertical-reverse var(--duration) linear infinite',
        shimmer: 'shimmer 2.5s linear infinite',
        float: 'float 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
