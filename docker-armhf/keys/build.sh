#!/usr/bin/env bash

start=`pwd`
name=keys
eris_name=eris-$name
arch=armhf
repo=https://github.com/shuangjj/$eris_name

cd /tmp
git clone $repo $name
cd $name
docker build --no-cache -t eris4iot/$name:$arch . 1>/dev/null

cd .. && rm -rf $name
cd $start
