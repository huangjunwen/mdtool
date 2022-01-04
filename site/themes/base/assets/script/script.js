(function() {
  // dark/light mode
  const getColorMode = () => {
    return window.localStorage.getItem("colorMode") || 'light'
  }
  const setColorMode = (colorMode) => {
    window.localStorage.setItem("colorMode", colorMode)
    let root = document.getElementsByTagName('html')[0]
    let a = 'light-mode', r = 'dark-mode'
    if (colorMode === 'dark')
      a = 'dark-mode', r = 'light-mode'
    root.classList.remove(r)
    root.classList.add(a)
  }
  const toggleColorMode = () => {
    setColorMode(getColorMode() === 'light' ? 'dark' : 'light')
  }
  window.toggleColorMode = toggleColorMode
  setColorMode(getColorMode())

  // 代码高亮 (highlightjs)
  document.addEventListener('DOMContentLoaded', (ev) => {
    hljs.configure({
      ignoreUnescapedHTML: true
    })
    document.querySelectorAll('pre[class*=language-] > code, code[class*=language-]').forEach((el) => {
      hljs.highlightElement(el)
    })
  })

  // tex 排版 (mathjax)
  window.MathJax = {
    svg: {
      fontCache: window.noMathjaxFontCache ? 'none' : 'global'
    },
    options: {
      enableAssistiveMml: false
    }
  }
}())
