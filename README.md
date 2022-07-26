### 简介

**mdtool** 是个人使用的一套 hugo 环境 (docker 封装)，用于将内容 (markdown) 转换为不同平台的页面：

  - 个人博客
  - 微信公众号
  - ...

这里使用 pandoc 作为处理引擎而非 hugo 默认使用的 Goldmark, 这是因为 pandoc 有更丰富的 markdown 扩展，
以及其可定制的 filter 机制. 不过代价就是生成页面的速度慢了许多.

### 快速使用

安装：安装好 docker, 将 `mdtool` (bash script) 放置在 `PATH` 即可. 用法基本跟 hugo 一致

#### 新建内容

```shell
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

```shell
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

...
```

#### 生成最终页面

```shell
$ mdtool
```

#### 工作原理

`mdtool` 运行时会检查**当前目录**是否有 `content` 子目录，如果没有则会提示初始化当前目录: 新建 `config/content/public/resources` 目录;

然后会 `docker run` 启动 hugo，并将上述目录 bind mount 到容器 site 相对应的目录下.

### tool (工具目录)

- hugo (https://gohugo.io/), 主要的工具，实际直接执行的也是这个
- pandoc (https://pandoc.org/)
  - lua-pandoc-filter
  - pandoc wrapper: 一个脚本，由于处于 PATH 的优先位置，所以 hugo 在执行时会用这个 wrapper，
    目前该 wrapper 会调用上述的 filter 进行处理
- dart-sass: 见 https://gohugo.io/hugo-pipes/scss-sass/

### site (hugo 站点目录)

默认不使用 theme, 用于输出博客页面, 可以通过命令行参数 `-t` 修改:

  - `-t theme-with-weixin-mp`: 添加拷贝到微信公众号的功能

### 内容处理

- 表格：会包裹在 `.table-container` 中以供超长时滑动
- 代码：inline code 和 code block 会经由 `highlightjs` 进行语法高亮，如：
  ~~~md
  `x=lambda:None`{.python}
  
  ```python
  x=lambda:None
  ```  
  ~~~
- 数学：inline math 和 display math 会经由 `mathjax` 进行排版，如：
  ```md
  质能方程 $E=mc^2$

  $$
  E=mc^2
  $$
  ```
- 图片：如果图片是 svg 且后缀为 `.embed.svg`，则会将 svg 直接注入到 html 中以便 css 起效，如：
  ```
  ![XXX](xxx.embed.svg)
  ```
- `div.proof`：对带有 `proof` 的 `div` 添加一个 label，按之能 collapse/expand 证明
- 微信公众号输出会做如下处理
  - mathjax 的 fontCache 会设为 `none`，否则 svg 中会有 id 属性，而 id 属性是会被过滤掉的
  - `<div class="table-container">` 元素会转换为 `<table-container>` 元素，因为貌似会过滤 `<div>`
  - `<a>` 元素会转换为 `<a-link>` 元素，因为貌似会过滤 `<a>`
  - 所有 `img` 会转换为 [Data URL](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Basics_of_HTTP/Data_URIs)
  - css 会全部 inline 到元素中

### 参考

- https://graemephi.github.io/posts/static-katex-with-hugo/
- https://yihui.org/cn/2017/04/mathjax-markdown/
- https://github.com/PrismJS/prism-themes
- https://github.com/imageslr/mweb-themes
- https://github.com/mdnice/markdown-nice
- https://github.com/highlightjs/highlight.js
- https://github.com/antfu/prism-theme-vars

