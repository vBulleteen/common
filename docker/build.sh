#!/usr/bin/env bash

declare -a checks

repo_base="quay.io/eris"
tag="latest"

dep=(
  "golang:1.5"
  "ubuntu:14.04"
)

tobuild=(
  "base"
  "data"
  "ipfs"
  "btcd"
  "ubuntu"
  "tools"
  "eth"
  "node"
  "gulp"
  "commonform"
  "sunit_base"
  "embark_base"
  "bitcoincore"
  "bitcoinclassic"
  "openbazaar"
  "zcash"
)

tobuildscript=(
  "keys"
  "compilers"
)

pull_deps() {
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
}

build_and_push() {
  ele=$1
  echo "Building => $repo_base/$ele:$tag"
  echo ""
  echo ""
  docker build --no-cache -t $repo_base/$ele:$tag $ele 1>/dev/null
  echo ""
  echo ""
  echo "Finished Building."
  echo "Pushing => $ele:$tag"
  echo ""
  echo ""
  docker push $repo_base/$ele:$tag 1>/dev/null
  echo "Finished Pushing."
}

buildscript_and_push() {
  ele=$1
  echo "Building => $repo_base/$ele"
  echo ""
  echo ""
  cd $ele
  ./build.sh
  cd ..
  echo ""
  echo ""
  echo "Finished Building."
  echo "Pushing => $ele"
  echo ""
  echo ""
  docker push $repo_base/$ele 1>/dev/null
  echo "Finished Pushing."
}

pull_deps

for ele in "${tobuild[@]}"
do
  set -e
  build_and_push $ele
  set +e
done

for ele in "${tobuildscript[@]}"
do
  set -e
  buildscript_and_push $ele
  set +e
done
