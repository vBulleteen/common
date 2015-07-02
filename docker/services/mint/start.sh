#! /bin/bash

if [[ $BARAK_SEED ]]; then
	cat ./cmd/barak/$BARAK_SEED | barak &
fi

if [[ $FAST_SYNC ]]; then
	tendermint node --fast_sync
else
	tendermint node
fi

