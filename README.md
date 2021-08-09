### markdown 工具

包含:

- hugo (https://gohugo.io/), 主要的工具
- pandoc (https://pandoc.org/)
  - pandoc-filter:
    - 根据环境变量在服务端/客户端使用 MathJax 渲染 tex 公式 (渲染为 svg, 服务端渲染 font cache 为 none)
    - 服务端使用 prismjs 渲染语法高亮, 支持添加行号, 见 https://pandoc.org/MANUAL.html#extension-fenced_code_blocks 说明
  - pandoc wrapper: 一个 shell, 使用上述的 pandoc-filter, 它在 `PATH` 上处于优先, 故 hugo 如果用 
    pandoc 进行渲染就会自动使用该 wrapper.
- 底层工具
  - tex2svg 将标准输入的 tex 公式转换为标准输出的 svg (MathJax)
  - rsvg-convert svg 转图片


### 参考

- https://graemephi.github.io/posts/static-katex-with-hugo/
- https://yihui.org/cn/2017/04/mathjax-markdown/
- https://github.com/PrismJS/prism-themes
- https://github.com/mdnice/markdown-nice
