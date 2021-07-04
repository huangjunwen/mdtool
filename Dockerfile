FROM mhart/alpine-node:16.2.0

# 更新 apk
RUN echo "http://mirrors.aliyun.com/alpine/v3.13/main" > /etc/apk/repositories && \
      echo "http://mirrors.aliyun.com/alpine/v3.13/community" >> /etc/apk/repositories && \
      apk update

# 安装 node 依赖
RUN npm config set prefix /root/node_global && \
      npm install -g 'esm@3.2.25' 'mathjax-full@3.2.0' 'yargs@17.0.1' 'pkg@5.3.0'
ENV NODE_PATH=/root/node_global/lib/node_modules

# 将 tex2svg (js) 打包编译成一个 exe
ADD tex2svg /root/node_global/bin/
RUN cd /root/node_global/bin && ./pkg -t node16-alpine-x64 ./tex2svg
