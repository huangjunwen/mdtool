FROM node:16-buster-slim

# 系统依赖以及 hugo
RUN apt-get update && apt-get install -y pandoc librsvg2-bin wget make && cd /tmp && \
      wget -O hugo.deb https://github.com/gohugoio/hugo/releases/download/v0.86.0/hugo_extended_0.86.0_Linux-64bit.deb && \
      apt install ./hugo.deb && rm hugo.deb && \
      wget -O sass_embedded.tar.gz https://github.com/sass/dart-sass-embedded/releases/download/1.0.0-beta.12/sass_embedded-1.0.0-beta.12-linux-x64.tar.gz && \
      tar xfz sass_embedded.tar.gz && mv sass_embedded/dart-sass-embedded /usr/local/bin && rm -r sass_embedded.tar.gz sass_embedded

# js 依赖
ADD tool/package.json tool/package-lock.json /opt/mdtool/tool/
ADD site/package.json site/package-lock.json /opt/mdtool/site/
RUN cd /opt/mdtool/tool && npm install && cd /opt/mdtool/site && npm install

# 路径
ENV PATH="/opt/mdtool/tool/bin:/opt/mdtool/tool/node_modules/.bin:${PATH}"
WORKDIR /opt/mdtool/site

# 其他文件
ADD tool /opt/mdtool/tool
ADD site /opt/mdtool/site
RUN cd /opt/mdtool/site/themes/style-markdown-body/assets/scss && make
