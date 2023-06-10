// 动态加载 js script，返回 Promise
function loadScript (url, opts) {
  let { async } = opts || {}
  return new Promise((resolve, reject) => {
    let script = document.createElement('script')
    script.onload = () => { resolve(true) }
    script.onerror = (e) => { reject(e) }
    document.head.appendChild(script)
    if (async) {
      script.async = true
    }
    script.src = url
  })
}

// tex 排版 (mathjax)
(() => {
  window.MathJax = {
    svg: {
      fontCache: window.mathjaxFontCache || 'global'
    },
    options: {
      menuOptions: {
        settings: {
          assistiveMml: false,  // true to enable assitive MathML
          collapsible: false,   // true to enable collapsible math
          explorer: false,      // true to enable the expression explorer
        }
      },
      enableEnrichment: false,
      enableComplexity: false,
      enableExplorer: false,
      enableAssistiveMml: false,
    },
    startup: {
      ready: () => {
        MathJax.startup.defaultReady()
        MathJax.startup.promise.then(() => {
          // 设置 math 的 min-width 阻止其缩放，只能 scroll
          document.querySelectorAll('mjx-container[jax=SVG] svg').forEach((svg) => {
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
  loadScript('/res/libs/mathjax/es5/tex-svg.js', { async: true })
})();

// 代码高亮 (highlightjs)
(() => {
  document.addEventListener('DOMContentLoaded', async (ev) => {
    await loadScript('/res/libs/highlightjs/highlight.min.js')
    // 额外语言
    await loadScript('/res/libs/highlightjs-agda/agda.min.js')
    hljs.configure({
      ignoreUnescapedHTML: true
    })
    document.querySelectorAll('pre[class*=language-] > code, code[class*=language-]').forEach((el) => {
      // 在 highlight 时将空格转换为 &nbsp; 换行符转成 <br>
      el.textContent = el.textContent.replaceAll('\u0020', '\u00a0')
      hljs.highlightElement(el)
      el.innerHTML = el.innerHTML.split('\n').join('<br/>')
    })
  })
})();

// 如果 img 是 svg 且后缀为 '.embed.svg'，则将 svg 代码直接注入到 html 中
(() => {
  let svgInjectLoaded = loadScript('/res/libs/svg-inject/svg-inject.min.js')
  document.addEventListener('DOMContentLoaded', (ev) => {
    svgInjectLoaded.then(() => {
      SVGInject(document.querySelectorAll('img[src$=".embed.svg"]'), {
        beforeInject (img, svg) {
          svg.removeAttribute('height')
          //svg.removeAttribute('width')
        }
      })
    })
  })
})();

// Proof div expand/collapse
(() => {
  document.addEventListener('DOMContentLoaded', (ev) => {

    let proofLabels = Array.from(document.getElementsByClassName('proof-label'))
    let collapseClassName = 'collapse'

    // 合起来还是展开并返回因此造成的 document height 的变化
    let collapseOrExpand = (el, toCollapse) => {
      let h = el.parentElement.scrollHeight
      toCollapse ? el.classList.add(collapseClassName) : el.classList.remove(collapseClassName)
      return el.parentElement.scrollHeight - h
    }

    proofLabels.forEach((el, i) => {
      el.addEventListener('click', (ev) => {
        if (!ev.altKey) {
          // 没有按 alt 的时候则 toggle 该单个元素
          el.classList.toggle(collapseClassName)
          return
        }
        // 按了 alt 的时候则 toggle 页面上全部证明
        let toCollapse = !el.classList.contains(collapseClassName)
        proofLabels.forEach((e, j) => {
          let y = collapseOrExpand(e, toCollapse)
          // 关键，若变化的在当前点击的之前，则会影响到 scroll，相应得 scroll
          if (j < i) {
            window.scrollBy(0, y)
          }
        })
      })
    })

  })
})();
