### markdown 工具

用 docker 打包好 (`docker pull jayven/markdown-tool`)

包含:

- hugo (https://gohugo.io/)
- pandoc (https://pandoc.org/)
  - pandoc-filter:
    - 根据环境变量在服务端/客户端使用 MathJax 渲染 tex 公式
    - 服务端使用 prismjs 渲染语法高亮 (需要外部包含 theme 才能看到颜色)
  - pandoc wrapper: 一个 shell, 使用上述的 pandoc-filter, 它在 `PATH` 上处于优先, 故 hugo 如果用 
    pandoc 进行渲染就会自动使用该 wrapper.
