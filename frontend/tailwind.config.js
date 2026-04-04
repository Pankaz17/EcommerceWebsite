/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
        display: ['Syne', 'DM Sans', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          dark: '#09090b',
          surface: '#18181b',
          accent: '#f59e0b',
          violet: '#8b5cf6',
        },
      },
    },
  },
  plugins: [],
}
