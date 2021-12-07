module.exports = {
  purge: {
    enabled: process.env.HUGO_ENVIRONMENT === 'production',
    content: [
      './hugo_stats.json',
      './layouts/**/*.html',
    ],
    extract: {
      json: (content) => {
        let els = JSON.parse(content).htmlElements;
        return els.tags.concat(els.classes, els.ids);
      }
    },
    mode: 'all'
  },
  plugins: []
}
