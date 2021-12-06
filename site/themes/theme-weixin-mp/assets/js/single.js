// github.com/Automattic/juice inlines CSS into HTML source
const juice = require('juice/client')
// github.com/jrit/declassify remove any classes or IDs not found
const declassify = require('declassify')

// https://stackoverflow.com/a/65996386
function copyToClipboard(textToCopy) {
  // navigator clipboard api needs a secure context (https)
  if (navigator.clipboard && window.isSecureContext) {
    // navigator clipboard api method
    return navigator.clipboard.writeText(textToCopy);
  } else {
    // text area method
    let textArea = document.createElement("textarea");
    textArea.value = textToCopy;
    // make the textarea out of viewport
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    return new Promise((res, rej) => {
      // here the magic happens
      document.execCommand('copy') ? res() : rej();
      textArea.remove();
    });
  }
}

var _mdbStyle = ''
function getMarkdownBodyStyle() {
  if (!_mdbStyle) {
    // https://stackoverflow.com/questions/9180184/access-css-file-contents-via-javascript
    const styleElem = document.getElementById('style-markdown-body');
    const cssText = (x) => { return x.cssText }
    _mdbStyle = Array.prototype.map.call(styleElem.sheet.cssRules, cssText).join('\n')
  }
  return _mdbStyle;
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

  const copy = document.getElementById('copy')
  const wrapper = document.getElementById('wrapper')
  const markdownBody = document.getElementById('markdown-body')
  copy.addEventListener('click', e => {
    let text = `<style>${getMarkdownBodyStyle()}</style><div class="${wrapper.className}">${markdownBody.outerHTML}</div>`
    text = inlineCSS(text)
    text = text2HTML(text).children[1].innerHTML // 只需要 <div> 里头的内容即可
    console.log(text)
    copyToClipboard(text)
      .then(() => { alert('拷贝成功, 请使用 chrome/firefox inspect 替换大法粘帖到公众号') })
      .catch((e) => { alert(`拷贝失败 ${e}`) })
  })
})
