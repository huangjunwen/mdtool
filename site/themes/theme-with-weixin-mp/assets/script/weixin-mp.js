// github.com/Automattic/juice inlines CSS into HTML source
const juice = require('juice/client')
// github.com/jrit/declassify remove any classes or IDs not found
const declassify = require('declassify')

function getStyle (id) {
  // https://stackoverflow.com/questions/9180184/access-css-file-contents-via-javascript
  const styleElem = document.getElementById(id)
  return Array.prototype.map.call(styleElem.sheet.cssRules, (x) => { return x.cssText}).join('\n')
}

function inlineCSS(html) {
  return declassify.process(juice(html)).trim()
}

function text2HTML(text) {
  var elem = document.createElement('template')
  elem.innerHTML = text
  return elem.content
}

document.addEventListener("DOMContentLoaded", function(event) {

  const root = document.documentElement
  const copy = document.getElementById('copy-weixin-mp')
  const contentBody = document.getElementById('content-body')
  copy.addEventListener('click', e => {
    const markdownBodyStyle = getStyle('markdown-body-style')
    const mathjaxSVGStyle = getStyle('MJX-SVG-styles') // 这个是 mathjax 生成的
    let text = `<div class="${root.className}"><article class="mdb">${contentBody.innerHTML}</article></div><style>${markdownBodyStyle}\n${mathjaxSVGStyle}</style>`
    text = inlineCSS(text)
    text = text2HTML(text).children[0].children[0].outerHTML // 只需要 <article> 的内容即可
    //console.log(text)
    copyToClipboard({'text/html': text, 'text/plain': text}).then(() => {
      alert('完成拷贝，请到公众号后台粘帖；如果卡死（例如公式太多，或样式不对），则可以使用 chrome/firefox inspect 替换大法')
    })
    return false
  })
})
