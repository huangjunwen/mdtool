async function init () {

  const assert = require('assert').ok
  const cheerio = require('cheerio')
  const prism = require('prismjs')
  const prismLoadLanguages = require('prismjs/components/')
  const prismComponents = require('prismjs/components')
  const tex2svgInit = require('./tex2svg.js')


  // 如果 MATHJAX_CLIENT_RENDER=1 的话则在客户端渲染, 否则在服务端渲染
  const mjxClientRender = process.env['MATHJAX_CLIENT_RENDER'] === '1'

  // 指定客户端 cdn js url
  const mjxClientJSUrl = process.env['MATHJAX_CLIENT_JS_URL'] || 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js'

  // mathjax 的 font cache 设置, server side render 只支持 none/local, client side render 则支持 none/local/global
  const mjxFontCache = process.env['MATHJAX_FONT_CACHE'] || (mjxClientRender ? 'global' : 'none')
  assert(mjxFontCache === 'none' || mjxFontCache === 'local' || (mjxFontCache === 'global' && mjxClientRender))

  // 参考自
  //   https://graemephi.github.io/posts/static-katex-with-hugo/
  //   https://gist.github.com/graemephi/7c60093f342b6dabf00d976492b6c91f

  /////////////////////////// Math ////////////////////////////

  const { tex2svg, tex2svgCSS } = await tex2svgInit({
    fontCache: mjxFontCache !== 'none'
  })
  
  async function visitMath (block) {
    if (block.t === 'Math') {
      const [{ t: mathType }, value] = block.c
      const inline = mathType == 'InlineMath'
      block.t = 'RawInline'
      block.c = ['html', await tex2svg(value, { inline, container: true })]
      return
    }
    if (Array.isArray(block.c)) {
      for (let b of block.c) {
        await visitMath(b)
      }
      return
    }
  }

  async function serverSideRenderMath (data) {
    for (let b of data.blocks) {
      await visitMath(b)
    }
    data.blocks.push({
      t: 'RawBlock',
      c: ['html', tex2svgCSS]
    })
  }

  function clientSideRenderMath (data) {
    data.blocks.push({
        t: 'RawBlock',
        c: ['html', `<script>
  window.MathJax = {
    options: {
      processHtmlClass: 'math'
    },
    svg: {
      fontCache: '${mjxFontCache}'
    }
  };
  (function () {
    var script = document.createElement('script');
    script.src = '${mjxClientJSUrl}';
    script.async = true;
    document.head.appendChild(script);
  })();
  </script>`]
    })
  }

  /////////////////////////// Code ////////////////////////////
  
  // 获得 prism 所有支持的 language alias -> language name
  // 见 https://github.com/PrismJS/prism/blob/master/components/index.js::loadLanguages
  let prismLanguages = {}
  Object.entries(prismComponents.languages).forEach(([lang, meta]) => {
    if (lang === 'meta') {
      return
    }
    prismLanguages[lang] = lang
    let alias = meta.alias
    if (alias) {
      if (!Array.isArray(alias)) {
        alias = [alias]
      }
      alias.forEach((a) => {
        prismLanguages[a] = lang
      })
    }
  })

  function visitCode (block) {
    if (block.t === 'CodeBlock' || block.t === 'Code') {
      let inline = block.t === 'Code'
      let [[codeId, codeClasses, codeAttrs], src] = block.c
      codeAttrs = Object.fromEntries(codeAttrs)
      src = src.trim() // 去掉前后的空格换行符

      // 获得设置
      let lang = ''
      let langClass = 'language-none' // https://prismjs.com/examples.html#different-markup
      let grammer = null
      let lineno = false
      let linenoStart = null
      for (let i=0; i<codeClasses.length; i++) {
        let cls = codeClasses[i]
        // https://pandoc.org/MANUAL.html#extension-fenced_code_blocks
        if (cls == 'number-lines' || cls == 'numberLines') {
          lineno = true
          linenoStart = parseInt(codeAttrs.startFrom) || 1
          codeClasses[i] = ''
          continue
        }
        if (prismLanguages[cls]) {
          if (!prism.languages[cls]) {
            prismLoadLanguages(prismLanguages[cls])
          }
          lang = cls
          langClass = `language-${lang}`
          assert(prism.languages[cls])
          grammer = prism.languages[cls]
          codeClasses[i] = ''
          continue
        }
      }
      codeClasses.push(langClass)
      codeClasses = codeClasses.filter(cls => Boolean(cls)).join(' ')

      // 着色
      let code = grammer ? prism.highlight(src, grammer, lang) : prism.util.encode(src)

      // 处理空格, 全部换成 &nbsp;
      {
        let $ = cheerio.load(code)
        let replaceSp = function (el) {
          $(el).contents().filter((i, sub) => {
            if (sub.type === 'text') {
              sub.data = sub.data.replaceAll('\u0020', '\u00a0')
            } else if (sub.type === 'tag') {
              replaceSp(sub)
            }
          })
        }
        replaceSp($.root())
        code = $.html()
      }

      if (inline) {
        block.t = 'RawInline'
        block.c = ['html', `<code class="${codeClasses}">${code}</code>`]
        return
      }

      // 处理换行, 将 '\n' 换成 <br>
      let lines = code.split('\n')
      code = code.split('\n').join('<br/>')
      code = `<pre class="${langClass}"><code class="${codeClasses}">${code}</code></pre>`

      // 处理行号
      if (lineno) {
        let width = Math.max(String(linenoStart).length, String(linenoStart+lines.length).length)
        let linenoCode = lines.map((_, i) => {
          return `<span>${String(linenoStart+i).padStart(width, '\u00a0')}</span>`
        }).join('<br/>')
        linenoCode = `<pre class="${langClass}"><code class="${codeClasses}">${linenoCode}</code></pre>`
        code = `<table class="lineno-code"><tr><td>${linenoCode}</td><td>${code}</td></tr></table>`
      }


      block.t = 'RawBlock'
      block.c = ['html', code]
      return
    }
    if (Array.isArray(block.c)) {
      block.c.forEach(visitCode)
      return
    }
  }

  function serverSideRenderCode (data) {
    data.blocks.forEach(visitCode)
  }

  return async (input) => {
    let data = JSON.parse(input)
    if (mjxClientRender) {
      clientSideRenderMath(data)
    } else {
      await serverSideRenderMath(data)
    }
    serverSideRenderCode(data)
    return JSON.stringify(data)
  }
  
}

module.exports = init
