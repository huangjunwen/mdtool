// 微信公众号一些过滤规则（不全）
// 1. 不允许有 id （这导致 svg 里不能 use）
// 2. 不允许 div
// 3. span 如果没有 style 会被过滤掉

// github.com/Automattic/juice inlines CSS into HTML source
const juice = require('juice/client')
// github.com/jrit/declassify remove any classes or IDs not found
const declassify = require('declassify')

function getStyle (id) {
  // https://stackoverflow.com/questions/9180184/access-css-file-contents-via-javascript
  const styleElem = document.getElementById(id)
  return Array.prototype.map.call(styleElem.sheet.cssRules, (x) => { return x.cssText}).join('\n')
}

function text2HTML (text) {
  var elem = document.createElement('template')
  elem.innerHTML = text
  return elem.content
}

function inlineCSS (html) {
  return text2HTML(juice(html, {inlinePseudoElements: true}))
}

function cleanHTML (html) {
  return declassify.process(html).trim()
}

function renameTag (node, tagName) {
  // 不需要替换
  if (node.tagName === tagName)
    return node

  // 复制属性
  let newNode = document.createElement(tagName)
  node.getAttributeNames().forEach((name) => {
    newNode.setAttribute(name, node.getAttribute(name))
  })

  // 移动 children
  Array.from(node.childNodes).forEach((child) => {
    newNode.appendChild(child)
  })

  // 替换
  node.parentElement.replaceChild(newNode, node)
  return newNode
}

function replaceTableContainer (root) {
  Array.from(root.querySelectorAll('div.table-container')).forEach((node) => {
    renameTag(node, 'table-container')
  })
}

// 替换 <a>
function replaceLink (root) {
  Array.from(root.querySelectorAll('a')).forEach((node) => {
    renameTag(node, 'a-link')
  })
}

// 将 img src 替换成 data url
async function replaceImgSrc (root) {
  const imgs = Array.from(root.querySelectorAll('img'))
  for (const img of imgs) {
    const resp = await fetch(img.src)
    const blob = await resp.blob()
    const reader = new FileReader()
    const dataUrl = await new Promise((resolve, reject) => {
      reader.onload = () => {
        resolve(reader.result)
      }
      reader.readAsDataURL(blob)
    })
    img.src = dataUrl
  }
}

document.addEventListener("DOMContentLoaded", function(event) {

  const root = document.documentElement
  const copy = document.getElementById('copy-weixin-mp')
  const contentBody = document.getElementById('content-body')
  copy.addEventListener('click', async e => {
    const markdownBodyStyle = getStyle('markdown-body-style')
    const mathjaxSVGStyle = getStyle('MJX-SVG-styles') // 这个是 mathjax 生成的
    let text = `<div class="${root.className}"><article class="mdb">${contentBody.innerHTML}</article></div><style>${markdownBodyStyle}\n${mathjaxSVGStyle}</style>`
    let article = inlineCSS(text).children[0].children[0] // 只需要 <article> 的内容即可
    replaceTableContainer(article)
    replaceLink(article)
    await replaceImgSrc(article)
    text = cleanHTML(article.outerHTML)
    //console.log(text)
    copyToClipboard({'text/html': text, 'text/plain': text}).then(() => {
      alert('完成拷贝，请到公众号后台粘帖；如果卡死（例如公式太多，或样式不对），则可以使用 chrome/firefox inspect 替换大法')
    })
    return false
  })
})
