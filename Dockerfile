FROM mhart/alpine-node:16.2.0 AS tex2svg_builder

# 安装 node 依赖
RUN npm config set prefix /root/node_global && \
      npm install -g 'esm@3.2.25' 'mathjax-full@3.2.0' 'yargs@17.0.1' 'pkg@5.3.0'
ENV NODE_PATH=/root/node_global/lib/node_modules

# 将 tex2svg (js) 打包编译成一个 exe
ADD tex2svg /root/node_global/bin/
RUN cd /root/node_global/bin && ./pkg -t node16-linuxstatic-x64 ./tex2svg
