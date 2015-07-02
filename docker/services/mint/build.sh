#!/bin/bash
base=github.com/tendermint/tendermint
repo=$GOPATH/src/$base
branch=${MINT_BUILD_BRANCH:=permissions}
start=`pwd`

go get -u $base

cd $repo
git checkout $branch
git status

cp $start/Dockerfile .
cp $start/start.sh .
cp $start/.dockerignore .

docker build -t eris/mint .

rm $repo/Dockerfile
rm $repo/start.sh
rm $repo/.dockerignore

cd $start