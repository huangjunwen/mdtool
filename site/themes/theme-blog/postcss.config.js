const tailwind = require('tailwindcss')(__dirname + '/tailwind.config.js')

module.exports = {
  plugins: [
    require('postcss-import'),
    require('postcss-nested'),
    tailwind,
    require('autoprefixer')
  ]
}
