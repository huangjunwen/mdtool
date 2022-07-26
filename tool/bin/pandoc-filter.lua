if FORMAT:match 'html' then

  -- 将 table 包裹起来使得如果 table 超长可以滚动
  function Table (el)
    return pandoc.Div(el, {class = 'table-container'})
    -- return {
    --   pandoc.RawBlock('html', '<section class="table-container">'),
    --   el,
    --   pandoc.RawBlock('html', '</section>'),
    -- }
  end

  -- 约定第一个 class 指语言，添加 language- 前缀
  function Code (el)
    el.classes[1] = 'language-' .. (el.classes[1] or 'plaintext')
    return el
  end

  function CodeBlock (el)
    el.classes[1] = 'language-' .. (el.classes[1] or 'plaintext')
    return el
  end

  -- inline/display math 不需要包裹元素
  function Math (el)
    if el.mathtype == 'DisplayMath' then
      return pandoc.Str('\\[' .. el.text .. '\\]')
    else
      return pandoc.Str('\\(' .. el.text .. '\\)')
    end
  end

  -- 特殊 div
  function Div (el)
    -- proof div，可 expand/collapse
    if el.classes[1] == 'proof' then
      return pandoc.Div({
        pandoc.Div(pandoc.Str('Proof'), {class = 'proof-label'}),
        pandoc.Div(el.content, {class = 'proof-content'})
      }, el.attr)
    end
  end

end
