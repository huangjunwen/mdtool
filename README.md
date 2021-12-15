### 简介

**mdtool** 是个人使用的一套 hugo 环境 (docker 封装)，用于将内容 (markdown) 转换为不同平台的页面：

  - 个人博客
  - 微信公众号
  - ...

这里使用 pandoc 作为处理引擎而非 hugo 默认使用的 Goldmark, 这是因为 pandoc 有更丰富的 markdown 扩展，
以及其可定制的 filter 机制. 不过代价就是生成页面的速度慢了许多.

### 快速使用

安装：安装好 docker, 将 `mdtool` (bash script) 放置在 `PATH` 即可.

`mdtool` 运行时会检查**当前目录**是否有 `content` 子目录，如果没有则会提示初始化当前目录: 新建 `config/content/public/resources` 目录;

然后会 `docker run` 启动 hugo，并将上述目录 bind mount 到容器 site 相对应的目录下.

#### 新建内容

```bash
$ cd my-blog
$ tree
.
├── config
│   └── _default
│       └── config.toml
└── content
    └── posts
        ├── second.md
        └── first.md
$ mdtool new posts/third.md
$ tree
.
├── config
│   └── _default
│       └── config.toml
└── content
    └── posts
        ├── third.md
        ├── second.md
        └── first.md
```

#### 写作

```bash
$ cd my-blog
$ mdtool serve -D
Start building sites …
hugo v0.86.0-41C6C52E+extended linux/amd64 BuildDate=2021-07-21T09:53:14Z VendorInfo=gohugoio

                   | EN
-------------------+-----
  Pages            | 15
  Paginator pages  |  0
  Non-page files   |  0
  Static files     |  0
  Processed images |  0
  Aliases          |  0
  Sitemaps         |  1
  Cleaned          |  0

Built in 4322 ms
...
```

#### 生成最终页面

```bash
$ cd my-blog
$ mdtool
```

### tool (工具目录)

- hugo (https://gohugo.io/), 主要的工具
- pandoc (https://pandoc.org/)
  - pandoc-filter
    - 服务端使用 MathJax 渲染 tex 公式
      - 语法见 https://pandoc.org/MANUAL.html#extension-tex_math_dollars 说明, 简单说即 `$...$` (math inline) 或者 `$$....$$` (math block)
      - 输出 svg, MathJax 设置中的 font cache 为 none, 这样体积会比较大, 但适配场景要广一些 (微信公众号文章不允许 html 元素有 id)
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
  - dart-sass: 见 https://gohugo.io/hugo-pipes/scss-sass/
  - postcss: 见 https://gohugo.io/hugo-pipes/postcss/
- 其他工具
  - tex2svg 将标准输入的 tex 公式转换为标准输出的 svg (MathJax)
  - rsvg-convert svg 转图片
  - ...

### site (hugo 站点目录)

默认使用的 theme 是 `theme-base`, 用于输出博客页面, 可以通过命令行参数 `-t` 修改:

  - `-t theme-with-weixin-mp`: 添加拷贝到微信公众号的功能

### 参考

- https://graemephi.github.io/posts/static-katex-with-hugo/
- https://yihui.org/cn/2017/04/mathjax-markdown/
- https://github.com/PrismJS/prism-themes
- https://github.com/imageslr/mweb-themes
- https://github.com/mdnice/markdown-nice
- https://github.com/highlightjs/highlight.js
- https://github.com/antfu/prism-theme-vars

