#! /bin/bash

echo "new chain: $CHAIN_ID"
tendermint node && last_pid=$! && sleep(1) && kill -KILL $last_pid
