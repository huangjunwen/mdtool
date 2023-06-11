(() => {
  window.createGiscus = ({
    containerId,
    repo,
    repoId,
    category,
    categoryId,
    mapping,
    strict,
    reactionsEnabled,
    inputPosition,
    lightTheme,
    darkTheme
  }) => {
    document.addEventListener('DOMContentLoaded', async (ev) => {

      let currentTheme = () => getColorMode() === 'light' ? lightTheme : darkTheme

      // Ref: https://github.com/giscus/giscus/issues/336
      let giscusAttrs = {
        'src': 'https://giscus.app/client.js',
        'data-repo': repo,
        'data-repo-id': repoId,
        'data-category': category,
        'data-category-id': categoryId,
        'data-mapping': mapping,
        'data-strict': strict,
        'data-reactions-enabled': reactionsEnabled,
        'data-emit-metadata': '0',
        'data-input-position': inputPosition,
        'data-theme': currentTheme(),
        'data-lang': 'en',
        'crossorigin': 'anonymous',
        'async': '',
      }
      let giscusScript = document.createElement('script')
      Object.entries(giscusAttrs).forEach(([key, value]) => giscusScript.setAttribute(key, value))
      document.getElementById(containerId).appendChild(giscusScript)

      // 明暗模式改变时通知 giscus iframe 改变 theme
      document.addEventListener('colorMode', (ev) => {
        const iframe = document.querySelector('iframe.giscus-frame')
        if (!iframe) return
        iframe.contentWindow.postMessage({
          giscus: {
            setConfig: {
              theme: currentTheme()
            }
          }
        }, 'https://giscus.app')
      })

    })
  }
})();
