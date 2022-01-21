// 明暗模式
// export: toggleColorMode
(() => {
  const getColorMode = () => {
    return window.localStorage.getItem("colorMode") || 'light'
  }
  const setColorMode = (colorMode) => {
    window.localStorage.setItem("colorMode", colorMode)
    let root = document.documentElement
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
      ready: () => {
        MathJax.startup.defaultReady()
        MathJax.startup.promise.then(() => {
          // 设置 display （block）math 的 min-width 阻止其缩放，只能 scroll
          document.querySelectorAll('mjx-container[jax=SVG][display=true] svg').forEach((svg) => {
            svg.style.minWidth = svg.getAttribute('width')
          })
          // 排版完毕后页面大小可能会变化，
          // 导致 anchor 指向的地方不太正确，这里重新设置一次
          window.setTimeout(() => {
            let h = window.location.hash
            if (h) {
              window.location.hash = h
            }
          }, 1)
        })
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
        // 在 highlight 时将空格转换为 &nbsp; 换行符转成 <br>
        el.textContent = el.textContent.replaceAll('\u0020', '\u00a0')
        hljs.highlightElement(el)
        el.innerHTML = el.innerHTML.split('\n').join('<br/>')
      })
    }).catch((e) => {})
  })
})();
