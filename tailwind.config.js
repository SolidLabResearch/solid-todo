/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./public/index.html', './src/**/*.{tsx,ts}'],
  theme: {
    extend: {
      colors: {
        background: 'rgb(245, 210, 149)',
        foreground: 'rgb(64, 60, 55)'
      }
    }
  },
  plugins: []
}
