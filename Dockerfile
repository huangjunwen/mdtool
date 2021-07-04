FROM mhart/alpine-node:16.2.0

RUN npm config set prefix /root/node_global && \
      npm install -g 'esm@3.2.25' 'mathjax-full@3.2.0' 'yargs@17.0.1'

ENV NODE_PATH=/root/node_global/lib/node_modules

ADD tex2svg /usr/local/bin/
