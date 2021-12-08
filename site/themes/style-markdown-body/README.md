### 说明

这个 **module** 里包含的是 markdown 内容样式

### 用法

使用 `{{ partial "markdown-body.html" . }}` 添加 css 链接 (`<link>` 元素的 id 是 `#style-markdown-body`).

使用 `{{- $themeNames := partial "markdown-body-theme-names.html" . -}}` 获得主题名称列表.

期望的 html 结构如下：

```html

<!-- 在较外层元素上添加主题 class，例如在 body 上；另外还需要同时添加 light 或者 dark 指示模式 -->
<body class="{{ index $themeNames 0 }} light">

  <!-- 在内层 markdown 内容的包裹元素上添加 mdb class 对 markdown 内容添加样式, 例如可以用一个 article -->
  <article class="mdb">
    {{ .Content }}
  </article>

  <!-- 在 markdown 内容以外也可以用 mdb css variables 对其他元素添加样式以保持观感上的一致 -->
  
</body>

```

### mdb css variables

- `_base.scss` 中定义的变量，作用域是 `:root` 下，所以全局可用
  - `--mdb-heading-margin`: `<hX>` 的 `margin` 设置
  - `--mdb-paragraph-margin`: 一般段落的 `margin` 设置
  - `--mdb-block-margin`: 一般块元素的 `margin` 设置
  - `--mdb-block-padding`: 一般块元素的 `padding` 设置
  - `--mdb-block-border-radius`: 一般块元素的圆角设置
  - `--mdb-inline-margin`: 一般内联元素的 `margin` 设置
  - `--mdb-inline-padding`: 一般内联元素的 `padding` 设置
  - `--mdb-inline-border-radius`: 一般内联元素的圆角设置
  - `--mdb-sans-ff`: sans-serif font family
  - `--mdb-mono-ff`: monospace font family
  - `--mdb-body-font`: 主体字体（大小/行宽/字体）设置
  - `--mdb-hX-font`: 各级 heading 字体
  - `--mdb-code-font`: 代码字体
  - `--mdb-table-font`: table 内字体
- `_theme.scss` 中定义的, 作用域是在主题下的，所有不同主题会有不同颜色
  - `--mdb-body-fg-color`: 主体前景色
  - `--mdb-body-bg-color`: 主体背景色
  - `--mdb-selection-fg-color`: 选择前景色
  - `--mdb-selection-bg-color`: 选择背景色
  - `--mdb-heading-fg-color`: `<hX>` 前景色
  - `--mdb-heading-bg-color`: `<hX>` 背景色
  - `--mdb-blockquote-fg-color`: `<blockquote>` 前景色
  - `--mdb-blockquote-bg-color`: `<blockquote>` 背景色
  - `--mdb-link-fg-color`: `<a>` 前景色
  - `--mdb-link-bg-color`: `<a>` 背景色
  - `--mdb-hr-fg-color`: `<hr>` 前景色
  - `--mdb-hr-bg-color`: `<hr>` 背景色
  - `--mdb-block-fg-color`: 一般块元素前景色
  - `--mdb-block-bg-color`: 一般块元素背景色
  - `--mdb-block-header-fg-color`: 一般块元素头前景色
  - `--mdb-block-header-bg-color`: 一般块元素头背景色
  - `--mdb-inline-fg-color`: 一般内联元素前景色
  - `--mdb-inline-bg-color`: 一般内联元素背景色



