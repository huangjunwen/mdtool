// github.com/Automattic/juice inlines CSS into HTML source
const juice = require('juice/client')
// github.com/jrit/declassify remove any classes or IDs not found
const declassify = require('declassify')

// https://stackoverflow.com/a/65996386
function copyToClipboard (textToCopy) {
  // 创建一个临时的隐藏的元素并触发 copy 事件以获得修改剪贴板的机会
  let textArea = document.createElement('textarea')
  try {
    // 通过样式隐藏起来
    textArea.style.position = 'absolute'
    textArea.style.opacity = 0
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.addEventListener('copy', (e) => {
      e.clipboardData.setData('text/html', textToCopy)
      e.clipboardData.setData('text/plain', textToCopy)
      e.preventDefault()
    })
    document.execCommand('copy')
  } catch (e) {
    console.log(e)
  } finally {
    textArea.remove()
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
    //console.log(text)
    copyToClipboard(text)
    alert('完成拷贝，请到公众号后台粘帖')
    return false
  })
})
