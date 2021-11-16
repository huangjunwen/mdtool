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

document.addEventListener("DOMContentLoaded", function(event) {
  console.log('doc loaded')
  document.getElementById('copy-wechat').addEventListener('click', e => {
    let text = declassify.process(juice(document.getElementById('markdown-main').innerHTML))

    copyToClipboard(text)
      .then(() => { alert('拷贝成功, 请使用 chrome/firefox inspect 替换大法粘帖到公众号') })
      .catch((e) => { alert(`拷贝失败 ${e}`) })
  })
})
