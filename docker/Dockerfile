FROM mhart/alpine-node:16.2.0

# 更新 apk 和安装依赖
RUN echo "http://mirrors.aliyun.com/alpine/v3.13/main" > /etc/apk/repositories && \
      echo "http://mirrors.aliyun.com/alpine/v3.13/community" >> /etc/apk/repositories && \
      apk update && apk add librsvg python3 py3-pip

# 安装 node 依赖
RUN npm install -g 'esm@3.2.25' 'mathjax-full@3.2.0' 'yargs@17.0.1'

# 添加 python 依赖
RUN pip3 install markdown

# 添加 bin
ENV NODE_PATH="/usr/lib/node_modules"
ADD tex2svg /usr/local/bin/
ADD mdgen /usr/local/bin/
