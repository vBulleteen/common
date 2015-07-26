FROM eris/base
MAINTAINER Eris Industries <support@erisindustries.com>

RUN echo "setting up node, npm, and io.js" && \
  curl -sL https://deb.nodesource.com/setup_iojs_2.x | bash - > /dev/null && \
  apt-get install -y -qq --no-install-recommends \
    build-essential \
    gcc \
    g++ \
    make \
    iojs && \
  rm -rf /var/lib/apt/lists/*
