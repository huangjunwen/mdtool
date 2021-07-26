/*****************************
 * 修改自 https://github.com/mathjax/MathJax-demos-node/blob/master/simple/tex2svg
 */

/*************************************************************************
 *
 *  simple/tex2svg
 *
 *  Uses MathJax v3 to convert a TeX string to an SVG string.
 *
 * ----------------------------------------------------------------------
 *
 *  Copyright (c) 2019 The MathJax Consortium
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

const defaultEM = 16

const defaultEX = 8

const defaultWidth = 80 * 16

//  The default TeX packages to use
const defaultPackages = 'base, autoload, require, ams, newcommand'

//  Minimal CSS needed for stand-alone image
const defaultCSS = [
  'svg a{fill:blue;stroke:blue}',
  '[data-mml-node="merror"]>g{fill:red;stroke:red}',
  '[data-mml-node="merror"]>rect[data-background]{fill:yellow;stroke:none}',
  '[data-frame],[data-line]{stroke-width:70px;fill:none}',
  '.mjx-dashed{stroke-dasharray:140}',
  '.mjx-dotted{stroke-linecap:round;stroke-dasharray:0,140}',
  'use[data-c]{stroke-width:3px}'
].join('')

async function initTex2Svg ({ packages, fontCache }) {

  packages = packages ? packages : defaultPackages
  fontCache = fontCache ? 'local' : 'none'

  const req = require('esm')(module)

  const mathjax = await req('mathjax-full').init({
      options: {
        enableAssistiveMml: false
      },
      loader: {
        load: ['adaptors/liteDOM', 'tex-svg']
      },
      tex: {
        packages: packages.replace('\*', defaultPackages).split(/\s*,\s*/)
      },
      svg: {
        fontCache
      },
      startup: {
        typeset: false
      }
  })

  return (s, { inline, em, ex, width, container }) => {
    let node = mathjax.tex2svg(s, {
      display: !inline,
      em: em ? em : defaultEM,
      ex: ex ? ex : defaultEX,
      containerWidth: width ? width : defaultWidth
    })
    const adaptor = mathjax.startup.adaptor
    return container ? adaptor.outerHTML(node) : adaptor.innerHTML(node)
  }
}

module.exports = {
  defaultEM,
  defaultEX,
  defaultWidth,
  defaultPackages,
  defaultCSS,
  initTex2Svg
}
