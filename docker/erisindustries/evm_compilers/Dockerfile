FROM ubuntu:14.04
MAINTAINER Eris Industries <support@erisindustries.com>

ENV DEBIAN_FRONTEND noninteractive
ENV INSTALL_PATH /usr/local/bin
ENV DONT_INSTALL_PATH /usr/bin

RUN apt-get install -qq -y software-properties-common && \
  add-apt-repository -y ppa:ethereum/ethereum > /dev/null && \
  add-apt-repository -y ppa:ethereum/ethereum-dev > /dev/null && \
  apt-get update -qq && \
  apt-get install -qq -y --no-install-recommends \
    lllc \
    sc \
    solc && \
  rm -rf /var/lib/apt/lists/*

RUN mv $DONT_INSTALL_PATH/solc $INSTALL_PATH/solc && \
  mv $DONT_INSTALL_PATH/lllc $INSTALL_PATH/lllc && \
  mv $DONT_INSTALL_PATH/sc $INSTALL_PATH/sc

VOLUME $INSTALL_PATH
ENTRYPOINT "solc"
# use by mounting volumes-from this container