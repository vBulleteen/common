#!/bin/bash
base=github.com/tendermint/tendermint
repo=$GOPATH/src/$base
branch=${MINT_BUILD_BRANCH:=permissions}
start=`pwd`

if [ -d $base ]; then
	go get -u $base
fi

cd $repo
git checkout $branch
git status

# TODO: this copying makes me cringe
# a dockerignore flag would solve everything
# sortof
cp $start/Dockerfile .
cp $start/*.sh .
cp $start/.dockerignore .
cp $start/config.toml .

docker build -t eris/mint .

rm $repo/Dockerfile
rm $repo/*.sh
rm $repo/.dockerignore
rm $repo/config.toml

cd $start
