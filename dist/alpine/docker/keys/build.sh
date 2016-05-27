#!/usr/bin/env bash

start=`pwd`
name=keys
eris_name=eris-$name
repo=https://github.com/eris-ltd/$eris_name

cd /tmp
git clone $repo $name
cd $name
docker build --no-cache -t quay.io/eris/$name . 1>/dev/null

cd .. && rm -rf $name
cd $start