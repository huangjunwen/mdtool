FROM mhart/alpine-node:16.2.0

# 更新 apk
RUN echo "http://mirrors.aliyun.com/alpine/v3.13/main" > /etc/apk/repositories && \
      echo "http://mirrors.aliyun.com/alpine/v3.13/community" >> /etc/apk/repositories && \
      apk update && apk add librsvg python3 py3-pip

# 添加 tex2svg
RUN npm config set prefix /root/node_global && \
      npm install -g 'esm@3.2.25' 'mathjax-full@3.2.0' 'yargs@17.0.1'
ENV NODE_PATH="/root/node_global/lib/node_modules"
ADD tex2svg /root/node_global/bin/

# 设置 PATH
ENV PATH="/root/node_global/bin:${PATH}"
