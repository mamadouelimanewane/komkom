/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#ecfdf5',
          100: '#d1fae5',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b'
        },
        wave: {
          DEFAULT: '#1ea5fc',
          dark: '#0e70af'
        },
        orangeMoney: {
          DEFAULT: '#ff6600',
          dark: '#cc5200'
        }
      }
    },
  },
  plugins: [],
}
