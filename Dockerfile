FROM node:16-buster-slim

ARG HUGO_VER=0.119.0
ARG DART_SASS_VER=1.68.0
ARG PANDOC_VER=3.1.8

# 下载安装主要工具
RUN apt-get update && apt-get install -y wget make && cd /tmp && \
      wget -O hugo.deb https://github.com/gohugoio/hugo/releases/download/v${HUGO_VER}/hugo_extended_${HUGO_VER}_linux-amd64.deb && \
      wget -O dart-sass.tar.gz https://github.com/sass/dart-sass/releases/download/${DART_SASS_VER}/dart-sass-${DART_SASS_VER}-linux-x64.tar.gz && \
      wget -O pandoc.deb https://github.com/jgm/pandoc/releases/download/${PANDOC_VER}/pandoc-${PANDOC_VER}-1-amd64.deb && \
      apt install ./hugo.deb && \
      tar xfz dart-sass.tar.gz && mv dart-sass /usr/local/ && \
      apt install ./pandoc.deb && \
      rm -r /tmp/*

# js 依赖
ADD site/package.json site/package-lock.json /opt/mdtool/site/
RUN cd /opt/mdtool/site && npm install

# 路径
ENV PATH="/opt/mdtool/tool/bin:/usr/local/dart-sass:${PATH}"
WORKDIR /opt/mdtool/site

# 其他文件
ADD tool /opt/mdtool/tool
ADD site /opt/mdtool/site
