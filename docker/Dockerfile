FROM mhart/alpine-node:16.2.0

# 更新 apk 和安装系统依赖
RUN echo "http://mirrors.aliyun.com/alpine/v3.13/main" > /etc/apk/repositories && \
      echo "http://mirrors.aliyun.com/alpine/v3.13/community" >> /etc/apk/repositories && \
      apk update && apk add librsvg

# 先添加 package.json 和 package-lock.json 安装 node 依赖
ADD mdtools/package.json mdtools/package-lock.json /opt/mdtools/
RUN cd /opt/mdtools && npm install

# 添加其他文件
ADD mdtools/lib /opt/mdtools/lib
ADD mdtools/bin /opt/mdtools/bin
ENV PATH="/opt/mdtools/bin:${PATH}"
