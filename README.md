### 快速使用

```bash
$ docker run --rm -it -v"/path/to/hugo/content:/opt/mdtool/site/content" --network=host jayven/mdtool hugo server -D

```

### markdown 工具

包含:

- hugo (https://gohugo.io/), 主要的工具
- pandoc (https://pandoc.org/)
  - pandoc-filter
    - 根据环境变量在服务端/客户端使用 MathJax 渲染 tex 公式
      - 语法见 https://pandoc.org/MANUAL.html#extension-tex_math_dollars 说明, 简单说即 `$...$` (math inline) 或者 `$$....$$` (math block)
      - 输出 svg, 如果使用服务端渲染 (默认), 则 MathJax 设置中的 font cache 为 none, 这样体积会比较大, 但适配场景要广一些 (微信公众号文章不允许 html 元素有 id)
    - 服务端使用 prismjs 渲染语法高亮, 支持添加行号
      - 语法见 https://pandoc.org/MANUAL.html#extension-fenced_code_blocks 说明, 例如
        ````markdown
        语法高亮
        ```python
        // ...
        ```

        带行号并指定开始行号语法高亮
        ```{.js .number-lines startFrom=10}
        // ....
        ```
        ````
      - code block (非 inline) 统一生成一个一行两列的 table, 第一列是行号, 第二列是高亮代码, 并包裹在 section 中,
        `<pre>` `<code>` 都会带上 `language-*` 类型, `<section>` 带 `code-container`, 例如
        ````html
        <section class="code-container">
          <table>
            <tr>
              <td></td>
              <td><pre class="language-python"><code class="language-python">....</code></pre></td>
            </tr>
          </table>
        </section>

        <section class="code-container">
          <table>
            <tr>
              <td><pre class="language-js"><code class="language-js"><span>1</span><br/><span>2</span></code></pre></td>
              <td><pre class="language-js"><code class="language-js">....</code></pre></td>
            </tr>
          </table>
        </section>
        ````
      - 普通 table 也会包括在 section 中, `<section>` 带 `table-container`
  - pandoc wrapper: 一个 shell, 使用上述的 pandoc-filter, 它在 `PATH` 上处于优先, 故 hugo 如果用 
    pandoc 进行渲染就会自动使用该 wrapper.
- 其他工具
  - tex2svg 将标准输入的 tex 公式转换为标准输出的 svg (MathJax)
  - rsvg-convert svg 转图片
  - postcss https://github.com/postcss/postcss-cli (hugo 可以直接使用 postcss)
  - juice https://github.com/Automattic/juice
  - ...

### Hugo site

docker 镜像中 `/opt/mdtool/site` 下是一个 hugo site, 默认使用的 theme 是 weixin

### 参考

- https://graemephi.github.io/posts/static-katex-with-hugo/
- https://yihui.org/cn/2017/04/mathjax-markdown/
- https://github.com/PrismJS/prism-themes
- https://github.com/imageslr/mweb-themes
- https://github.com/mdnice/markdown-nice
- https://github.com/highlightjs/highlight.js
- https://github.com/antfu/prism-theme-vars

