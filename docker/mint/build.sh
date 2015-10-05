#! /bin/sh

# this build script is for development builds of the container from local repos
# rather than cloning from github

if [ "$VERSION" = "" ]; then
	VERSION="dev"
fi

TMINT=$GOPATH/src/github.com/tendermint/tendermint
cp start.sh $TMINT/eris_start_tendermint.sh
cp DockerfileDev $TMINT/ErisDockerfileDev
cd $TMINT
docker build -t eris/mint:$VERSION -f ErisDockerfileDev .
rm $TMINT/eris_start_tendermint.sh $TMINT/ErisDockerfileDev

