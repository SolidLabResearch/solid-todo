/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./public/index.html', './src/**/*.{tsx,ts}'],
  theme: {
    extend: {
      colors: {
        background: '#f5d295',
        darker: '#403c37'
      }
    }
  },
  plugins: []
}
