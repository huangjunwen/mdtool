async function init () {

  // 参考自
  //   https://graemephi.github.io/posts/static-katex-with-hugo/
  //   https://gist.github.com/graemephi/7c60093f342b6dabf00d976492b6c91f
  //   https://github.com/mvhenderson/pandoc-filter-node
  //   https://github.com/mathematic-inc/node-pandoc-filter

  const assert = require('assert').ok
  const pd = require('pandoc-filter')
  const cheerio = require('cheerio')
  const prism = require('prismjs')
  const prismLoadLanguages = require('prismjs/components/')
  const prismComponents = require('prismjs/components')
  require('prismjs/plugins/custom-class/prism-custom-class.min.js')
  const tex2svgInit = require('./tex2svg.js')

  // mathjax 的 font cache 设置, server side render 只支持 none/local
  const mjxFontCache = process.env['MATHJAX_FONT_CACHE'] || 'none'
  assert(mjxFontCache === 'none' || mjxFontCache === 'local')

  /////////////////////////// Table ////////////////////////////

  // 将 table 用 section 包裹起来
  async function visitTable (elm, format, meta) {
    return [pd.RawBlock('html', '<section class="table-container">'), elm, pd.RawBlock('html', '</section>')]
  }

  /////////////////////////// Math ////////////////////////////

  const { tex2svg, tex2svgCSS } = await tex2svgInit({
    fontCache: mjxFontCache !== 'none'
  })

  async function visitMath ({ t, c: [{t: mathType}, value] }, format, meta) {
    const inline = mathType == 'InlineMath'
    let $ = cheerio.load(await tex2svg(value, { inline, container: true }))
    $('mjx-container').attr('data-math', value) // 添加 data-math 属性存放原始的公式
    // 参考 mdnice: 将 width/height 属性移到 style 中去
    $('mjx-container>svg').css(
      'width', $('mjx-container>svg').attr('width')
    ).css(
      'height', $('mjx-container>svg').attr('height')
    ).css(
      'vertical-align', 'middle'
    ).removeAttr('width').removeAttr('height')
    return pd.RawInline('html', $.html())
  }

  /////////////////////////// Code ////////////////////////////

  // prism 添加的 class name 全部加上一个 prefix 以免跟其他来源命名冲突
  prism.plugins.customClass.prefix('prism-')

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

  async function visitCode ({ t, c: [[codeId, codeClasses, codeAttrs], src] }, format, meta) {
    let inline = t === 'Code'
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
        grammer = prism.languages[cls]
        assert(grammer)
        lang = cls
        langClass = `language-${lang}`
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
      return pd.RawInline('html', `<code class="${codeClasses}">${code}</code>`)
    }

    // 处理换行, 将 '\n' 换成 <br>
    let lines = code.split('\n')
    code = code.split('\n').join('<br/>')
    code = `<pre class="${langClass}"><code class="${codeClasses}">${code}</code></pre>`

    // 处理行号
    let linenoCode = ''
    if (lineno) {
      let width = Math.max(String(linenoStart).length, String(linenoStart+lines.length).length)
      linenoCode = lines.map((_, i) => {
        return `<span>${String(linenoStart+i).padStart(width, '\u00a0')}</span>`
      }).join('<br/>')
      linenoCode = `<pre class="${langClass}"><code class="${codeClasses}">${linenoCode}</code></pre>`
    }

    return pd.RawBlock('html',
      `<section class="code-container"><table><tr><td>${linenoCode}</td><td>${code}</td></tr></table></section>`)
  }

  async function action (elm, format, meta) {
    if (elm.t === 'Table') {
      return await visitTable(elm, format, meta)
    }
    if (elm.t === 'Math') {
      return await visitMath(elm, format, meta)
    }
    if (elm.t === 'CodeBlock' || elm.t === 'Code') {
      return await visitCode(elm, format, meta)
    }
    return null
  }

  return async (input) => {
    let data = JSON.parse(input)
    data = await pd.filter(data, action, "")
    return JSON.stringify(data)
  }

}

module.exports = init
