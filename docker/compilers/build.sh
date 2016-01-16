#!/usr/bin/env bash

start=`pwd`
cd /tmp

git clone git@github.com:eris-ltd/eris-compilers.git
cd eris-compilers
docker build --no-cache -t quay.io/eris/compilers . 1>/dev/null

cd .. && rm -rf eris-compilers
cd $start