FROM node:16-buster-slim

# 系统依赖以及 hugo
RUN apt-get update && apt-get install -y pandoc librsvg2-bin wget && cd /tmp && \
      wget -O hugo.deb https://github.com/gohugoio/hugo/releases/download/v0.86.0/hugo_extended_0.86.0_Linux-64bit.deb && \
      apt install ./hugo.deb && rm hugo.deb

# js 依赖
ADD package.json package-lock.json /opt/mdtool/
RUN cd /opt/mdtool && npm install

# 路径
ENV PATH="/opt/mdtool/bin:${PATH}"
WORKDIR /opt/mdtool/site

# 其他文件
ADD lib /opt/mdtool/lib
ADD bin /opt/mdtool/bin
ADD site /opt/mdtool/site
