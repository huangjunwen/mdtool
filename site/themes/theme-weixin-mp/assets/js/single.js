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

  const colorSchemeNames = document.getElementById('color-scheme-names')
  const colorSchemeStyles = document.getElementById('color-scheme-styles')
  const markdownBodyCSS = document.getElementById('markdown-body-style')
  colorSchemeNames.addEventListener('change', e => {
    markdownBodyCSS.innerText = colorSchemeStyles.children[colorSchemeNames.selectedIndex].innerText
  })
  colorSchemeNames.dispatchEvent(new Event('change'))

  const copyWechat = document.getElementById('copy-wechat')
  const markdownMain = document.getElementById('markdown-main')
  copyWechat.addEventListener('click', e => {
    let text = declassify.process(juice(markdownMain.innerHTML))
    copyToClipboard(text)
      .then(() => { alert('拷贝成功, 请使用 chrome/firefox inspect 替换大法粘帖到公众号') })
      .catch((e) => { alert(`拷贝失败 ${e}`) })
  })

})
