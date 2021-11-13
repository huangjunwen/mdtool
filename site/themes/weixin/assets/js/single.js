const juice = require('juice/client')
const declassify = require('declassify')

document.addEventListener("DOMContentLoaded", function(event) {
  console.log('doc loaded')
  document.getElementById('copy-wechat').addEventListener('click', e => {
    let text = declassify.process(juice(document.getElementById('markdown-main').innerHTML))

    const type = 'text/plain'
    const blob = new Blob([text], { type })
    console.log(blob)
    navigator.clipboard.write([new ClipboardItem({ [type]: blob })]).then(() => {
      alert('拷贝成功, 请使用 chrome/firefox inspect 替换大法粘帖到公众号')
    }, (e) => {
      alert(`拷贝失败 ${e}`)
    })
  })
})
