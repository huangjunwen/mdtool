// utils
(() => {
  // 剪贴板
  // https://stackoverflow.com/a/65996386
  const copyToClipboard = (data) => {
    return new Promise((resolve, reject) => {
      // 创建一个临时的隐藏的元素并触发 copy 事件以获得修改剪贴板的机会
      let textArea = document.createElement('textarea')
      try {
        // 通过样式隐藏起来
        textArea.style.position = 'absolute'
        textArea.style.opacity = 0
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.addEventListener('copy', (e) => {
          Object.entries(data).forEach(([f, d]) => {
            e.clipboardData.setData(f, d)
          })
          e.preventDefault()
          resolve()
        })
        document.execCommand('copy')
      } catch (e) {
        console.log(e)
        reject(e)
      } finally {
        textArea.remove()
      }
    })
  }
  window.copyToClipboard = copyToClipboard

})();
