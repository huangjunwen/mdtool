FROM node:16-buster-slim

RUN apt update && apt install -y pandoc librsvg2-bin

# 先添加 package.json 和 package-lock.json 安装 node 依赖
ADD mdtool/package.json mdtool/package-lock.json /opt/mdtool/
RUN cd /opt/mdtool && npm install

# 添加其他文件
ADD mdtool/lib /opt/mdtool/lib
ADD mdtool/bin /opt/mdtool/bin
ENV PATH="/opt/mdtool/bin:${PATH}"
