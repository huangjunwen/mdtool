FROM node:16-buster-slim

ARG HUGO_VER=0.89.4
ARG PANDOC_VER=2.16.2
ARG DART_SASS_EMBEDDED_VER=1.0.0-beta.12

# 下载安装主要工具
RUN apt-get update && apt-get install -y wget make graphviz inotify-tools && cd /tmp && \
      wget -O hugo.deb https://github.com/gohugoio/hugo/releases/download/v${HUGO_VER}/hugo_extended_${HUGO_VER}_Linux-64bit.deb && \
      wget -O pandoc.deb https://github.com/jgm/pandoc/releases/download/${PANDOC_VER}/pandoc-${PANDOC_VER}-1-amd64.deb && \
      wget -O sass_embedded.tar.gz https://github.com/sass/dart-sass-embedded/releases/download/${DART_SASS_EMBEDDED_VER}/sass_embedded-${DART_SASS_EMBEDDED_VER}-linux-x64.tar.gz && \
      apt install ./hugo.deb && rm hugo.deb && \
      apt install ./pandoc.deb && rm pandoc.deb && \
      tar xfz sass_embedded.tar.gz && mv sass_embedded/dart-sass-embedded /usr/local/bin && \
      rm -r /tmp/*

# js 依赖
ADD site/package.json site/package-lock.json /opt/mdtool/site/
RUN cd /opt/mdtool/site && npm install

# 路径
ENV PATH="/opt/mdtool/tool/bin:${PATH}"
WORKDIR /opt/mdtool/site

# 其他文件
ADD tool /opt/mdtool/tool
ADD site /opt/mdtool/site

# 入口
ENTRYPOINT ["/opt/mdtool/tool/bin/mdtool-entrypoint"]
