// 明暗模式
// export: toggleColorMode
(() => {
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
})();

// tex 排版 (mathjax)
(() => {
  window.MathJax = {
    svg: {
      fontCache: window.mathjaxFontCache || 'global'
    },
    options: {
      enableAssistiveMml: false
    },
    startup: {
      pageReady: () => {
        return MathJax.startup.defaultPageReady().then(() => {
          // 排版完毕后页面大小可能会变化，
          // 导致 anchor 指向的地方不太正确，这里重新设置一次
          let h = window.location.hash
          if (h)
            window.location.hash = window.location.hash
        });
      }
    }
  }
  let script = document.createElement('script')
  document.head.appendChild(script)
  script.src = '/mathjax/es5/tex-svg.js'
})();

// 代码高亮 (highlightjs)
(() => {
  let hljsLoaded = new Promise((resolve, reject) => {
    let script = document.createElement('script')
    script.onload = () => { resolve(true) }
    script.onerror = (e) => { reject(e) }
    document.head.appendChild(script)
    script.src = '/highlightjs/highlight.min.js'
  })
  document.addEventListener('DOMContentLoaded', (ev) => {
    hljsLoaded.then(() => {
      hljs.configure({
        ignoreUnescapedHTML: true
      })
      document.querySelectorAll('pre[class*=language-] > code, code[class*=language-]').forEach((el) => {
        hljs.highlightElement(el)
      })
    }).catch((e) => {})
  })
})();
