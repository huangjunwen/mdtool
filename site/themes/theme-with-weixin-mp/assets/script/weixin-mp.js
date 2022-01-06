// github.com/Automattic/juice inlines CSS into HTML source
const juice = require('juice/client')
// github.com/jrit/declassify remove any classes or IDs not found
const declassify = require('declassify')

// https://stackoverflow.com/a/65996386
function copyToClipboard (textToCopy) {
  // navigator clipboard api needs a secure context (https)
  if (navigator.clipboard && window.isSecureContext) {
    // navigator clipboard api method
    return navigator.clipboard.writeText(textToCopy)
  } else {
    // text area method
    let textArea = document.createElement("textarea")
    textArea.value = textToCopy
    // make the textarea out of viewport
    textArea.style.position = "fixed"
    textArea.style.left = "-999999px"
    textArea.style.top = "-999999px"
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()
    return new Promise((res, rej) => {
      // here the magic happens
      document.execCommand('copy') ? res() : rej()
      textArea.remove()
    })
  }
}

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
    console.log(text)
    copyToClipboard(text)
      .then(() => { alert('拷贝成功, 请使用 chrome/firefox inspect 替换大法粘帖到公众号') })
      .catch((e) => { alert(`拷贝失败 ${e}`) })
    return false
  })
})
