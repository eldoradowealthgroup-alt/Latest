/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        gov: {
          blue: '#1a4480',
          'blue-dark': '#162e51',
          red: '#d83933',
          green: '#2e8540',
          gray: '#71767a',
          'gray-light': '#f0f0f0',
        }
      },
    },
  },
  plugins: [],
}
