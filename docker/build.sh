#!/usr/bin/env bash

dep=(
  "golang:1.4"
  "ubuntu:14.04"
)

for d in "${dep[@]}"
do
  echo "Pulling => $d"
  echo ""
  echo ""
  docker pull $d
  echo ""
  echo ""
  echo "Finished Pulling."
done

tag="latest"

ei=(
  "eris/base"
  "eris/data"
  "eris/ipfs"
  "eris/btcd"
  "eris/mint"
  "erisindustries/ubuntu"
  "erisindustries/tools"
  "eris/eth"
  "erisindustries/node"
  "erisindustries/gulp"
  "erisindustries/sunit_base"
  "erisindustries/embark_base"
  "erisindustries/pyepm_base"
)

for ele in "${ei[@]}"
do
  echo "Building => $ele:$tag"
  echo ""
  echo ""
  docker build -t $ele:$tag $ele
  echo ""
  echo ""
  echo "Finished Building."
  echo "Pushing => $ele:$tag"
  echo ""
  echo ""
  docker push $ele:$tag
  echo "Finished Pushing."
done