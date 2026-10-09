/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
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
      },
      boxShadow: {
        soft: '0 16px 40px rgba(20, 47, 45, 0.08)',
      },
    },
  },
  plugins: [],
}

