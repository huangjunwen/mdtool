const tailwind = require('tailwindcss')(__dirname + '/tailwind.config.js')
const autoprefixer = require('autoprefixer')

module.exports = {
  plugins: [
    tailwind,
    autoprefixer
  ]
}
