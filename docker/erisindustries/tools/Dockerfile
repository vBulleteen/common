FROM erisindustries/ubuntu
MAINTAINER Eris Industries <support@erisindustries.com>

RUN apt-get install -qq -y software-properties-common && \
  add-apt-repository -y ppa:ethereum/ethereum > /dev/null && \
  add-apt-repository -y ppa:ethereum/ethereum-dev > /dev/null && \
  apt-get update -qq && \
  apt-get install -qq -y --no-install-recommends \
    build-essential \
    curl \
    gcc \
    g++ \
    git \
    make \
    libyaml-dev \
    python-dev \
    lllc \
    sc=$(apt-cache policy sc | grep ethereum-dev -B 1 | awk 'NR==1 {print $1}') \
    solc && \
  curl -sL https://bootstrap.pypa.io/get-pip.py | python - && \
  rm -rf /var/lib/apt/lists/*
