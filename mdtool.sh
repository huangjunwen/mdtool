#!/bin/bash

image_name="jayven/markdown-tool:latest"
cont_name=${MDTOOL_CONT:-mdtool_cont}
cont_path_prefix="/host"
port=33333

if (( "$#" < 1 )); then
  echo "Usage:"
  echo "    mdtool subcommand [args...] [optionis...]"
  echo ""
  echo "Subcommands:"
  echo "    tex2svg    Convert stdin math formula to stdout svg."
  echo "    svg2png    Convert stdin svg to stdout png."
  exit 0
fi

if [[ $(docker ps -f "name=$cont_name" --format '{{.Names}}') != $cont_name ]]; then
  # 将 host 的整个目录树挂载到 container 的 cont_path_prefix 下并启动一个 simple server
  docker run -d --rm --name "$cont_name" -p"$port:$port" -v"/:$cont_path_prefix" $image_name \
    ash -c "cd $cont_path_prefix && python3 -m http.server $port"
  echo "你可以打开浏览器 http://localhost:$port$(pwd)"
fi

# 将 host 路径转换为 container 内的路径
cont_path () {
  p="$(cd "$(dirname "$1")"; pwd -P)/$(basename "$1")" # 绝对路径
  return "$cont_path_prefix$p"
}

subcommand="$1"; shift;

case $subcommand in 
  tex2svg)
    docker exec -i $cont_name tex2svg $@
    ;;

  svg2png)
    docker exec -i $cont_name rsvg-convert $@
    ;;
esac
