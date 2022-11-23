/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./public/index.html', './src/**/*.{tsx,ts}'],
  theme: {
    extend: {
      colors: {
        background: '#f5d295',
        foreground: '#222222',
        accent: '#403c37'
      }
    }
  },
  plugins: []
}
