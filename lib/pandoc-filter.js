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
  
  function visitMath (block) {
    if (block.t === 'Math') {
      const [{ t: mathType }, value] = block.c
      const inline = mathType == 'InlineMath'
      block.t = 'RawInline'
      block.c = ['html', tex2svg(value, { inline, container: true })]
      return
    }
    if (Array.isArray(block.c)) {
      block.c.forEach(visitMath)
      return
    }
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

  function serverSideRenderMath (data) {
    data.blocks.forEach(visitMath)
    data.blocks.push({
      t: 'RawBlock',
      c: ['html', tex2svgCSS]
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
      let [[id, classes, attrs], value] = block.c
      attrs = Object.fromEntries(attrs)

      // 逐个尝试确定语言
      let lang = ''
      let grammer = null
      for (let l of classes) {
        if (!prismLanguages[l]) {
          continue
        }
        if (!prism.languages[l]) {
          prismLoadLanguages(prismLanguages[l])
        }
        assert(prism.languages[l])
        lang = l
        grammer = prism.languages[l]
        break
      }

      // 着色
      let code = grammer ? prism.highlight(value, grammer, lang) : prism.util.encode(value)

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

      // 处理换行 (仅对非 inline 有效), 如果需要 lineno, 则 wrap 到 <li> 中, 否则将 '\n' 换成 <br>
      // https://pandoc.org/MANUAL.html#extension-fenced_code_blocks
      // > The numberLines (or number-lines) class will cause the lines of the code block to be numbered,
      // > starting with 1 or the value of the startFrom attribute.
      if (!inline) {
        if (classes.includes('numberLines') || classes.includes('number-lines')) {
          code = code.split('\n').map((line) => { return `<li>${line}</li>` }).join('')
          code = `<ol start="${attrs.startFrom || 1}">${code}</ol>`
        } else {
          code = code.split('\n').join('<br />')
        }
      }

      // https://prismjs.com/examples.html#different-markup
      let langClass = `language-${lang ? lang : 'none'}`
      classes.push(langClass)
      code = `<code class="${classes.join(' ')}">${code}</code>`
      if (!inline) {
        code = `<pre class="${langClass}">${code}</pre>`
      }
      block.c = ['html', code]
      block.t = inline ? 'RawInline' : 'RawBlock'
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

  return (input) => {
    let data = JSON.parse(input)
    if (mjxClientRender) {
      clientSideRenderMath(data)
    } else {
      serverSideRenderMath(data)
    }
    serverSideRenderCode(data)
    return JSON.stringify(data)
  }
  
}

module.exports = init
