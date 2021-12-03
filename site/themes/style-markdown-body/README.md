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

  <!-- 在 markdown 内容以外也可以用 css 里的 util classes 添加样式以保持跟 markdown 内容一致 -->
  <div class="mdb-body-color">
  </div>

  <div class="mdb-padding-y-1">
  </div>

</body>

```

### Util Classes

- `_base.scss` 中定义的
  - `mdb-margin-x-XXX`: 左右外边距类
  - `mdb-margin-y-XXX`: 上下外边距类
  - `mdb-padding-x-XXX`: 左右内边距类
  - `mdb-padding-y-XXX`: 上下内边距类
  - `mdb-font`: 默认字体
  - `mdb-heading-XXX-font`: `<h1>` ... `<h6>` 字体
  - `mdb-code-XXX-font`: `<code>` 字体
  - `mdb-table-font`: table 字体
  - `mdb-block-XXX`: 块元素帮助类
  - `mdb-inline-XXX`: 内联元素帮助类
- `_theme.scss` 中定义的
  - `mdb-body-color`: markdown 主体颜色
  - `mdb-selection-color`: 选择颜色
  - `mdb-heading-color`: `<h1>` ... `<h6>` 颜色
  - ...



