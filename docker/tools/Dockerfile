FROM quay.io/eris/ubuntu
MAINTAINER Eris Industries <support@erisindustries.com>

RUN apt-get install -qq -y software-properties-common && \
  add-apt-repository -y ppa:ethereum/ethereum > /dev/null && \
  add-apt-repository -y ppa:ethereum/ethereum-dev > /dev/null && \
  apt-get update -qq && \
  apt-get install -qq -y --no-install-recommends \
    build-essential \
    cmake \
    libgmp-dev \
    libboost-all-dev \
    libjsoncpp-dev \
    libleveldb-dev \
    libcurl4-openssl-dev \
    libminiupnpc-dev \
    libmicrohttpd-dev \
    curl \
    gcc \
    g++ \
    git \
    make \
    libyaml-dev \
    python-dev \
    jq \
    && \
    apt-get -y update && \
    apt-get -y upgrade && \ # this will update cmake to version 3.x
    apt-get -y install 
      libcryptopp-dev \ 
      libjson-rpc-cpp-dev \
    && \
    git clone --recursive https://github.com/ethereum/webthree-umbrella.git && \
    ./webthree-umbrella/webthree-helpers/scripts/ethbuild.sh --no-git --project solidity --cores 4 && \
  curl -sL https://bootstrap.pypa.io/get-pip.py | python - && \
  rm -rf /var/lib/apt/lists/*
