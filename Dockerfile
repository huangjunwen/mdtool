FROM node:16-buster-slim

WORKDIR /root

RUN apt-get update && apt-get install -y pandoc librsvg2-bin wget && cd /root && \
      wget -O hugo.deb https://github.com/gohugoio/hugo/releases/download/v0.86.0/hugo_extended_0.86.0_Linux-64bit.deb && \
      apt install ./hugo.deb && rm hugo.deb

# 先添加 package.json 和 package-lock.json 安装 node 依赖
ADD mdtool/package.json mdtool/package-lock.json /opt/mdtool/
RUN cd /opt/mdtool && npm install

# 添加其他文件
ADD mdtool/lib /opt/mdtool/lib
ADD mdtool/bin /opt/mdtool/bin
ENV PATH="/opt/mdtool/bin:${PATH}"
