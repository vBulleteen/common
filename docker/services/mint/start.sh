#! /bin/bash

ifExit(){
	if [ $? -ne 0 ]; then
		echo $1
		exit 1
	fi
}


ROOT_DIR=~/.eris/blockchains/tendermint
if [ ! -d "$ROOT_DIR" ]; then
	mkdir -p $ROOT_DIR
	ifExit "Error making root dir $ROOT_DIR"
fi

# our root chain
if [ ! $NODE_ADDR ]; then
	NODE_ADDR=http://interblock.io:46657
fi

# where the etcb client scripts are
if [ ! $ECM_PATH ]; then
	ECM_PATH=.
fi

export ROOT_DIR
export NODE_ADDR
export ECM_PATH  # set by Dockerfile


# either we are fetching a chain for the first time,
# creating one from scratch, or running one we already have
CMD=$1
case $CMD in
"fetch" ) $ECM_PATH/chain_fetch.sh
	;;
"new" ) $ECM_PATH/chain_new.sh
	;;
"run" ) $ECM_PATH/chain_run.sh
	;;
*)	echo "Enter a command for starting the chain (fetch, new, run)"
	;;
esac

