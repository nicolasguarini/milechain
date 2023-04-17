/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    colors: {
      "accent": "#f5cb5c",
      "primary": "#e8eddf",
      "primary-darker": "#cfdbd5",
      "darker": "#242423",
      "dark": "#333533"
    },
    extend: {
      fontFamily: {
        "helvetica-neue": ["Helvetica Neue", "Helvetica", "sans-serif"]
      }
    }
  },
  plugins: [],
}
