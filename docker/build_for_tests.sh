#!/usr/bin/env bash

declare -a checks

repo_base="quay.io/eris"
tag="latest"

dep=(
  "alpine:3.3"
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
  "parity"
  "openbazaar-server"
  "openbazaar-client"
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

build() {
  ele=$1
  echo "Building => $repo_base/$ele:$tag"
  echo ""
  echo ""
  docker build --no-cache -t $repo_base/$ele:$tag $ele 1>/dev/null
  echo ""
  echo ""
  echo "Finished Building."
}

buildscript() {
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
}

pull_deps

for ele in "${tobuild[@]}"
do
  set -e
  build $ele
  set +e
done

for ele in "${tobuildscript[@]}"
do
  set -e
  buildscript $ele
  set +e
done
