FROM erisindustries/tools
MAINTAINER Eris Industries <support@erisindustries.com>

RUN apt-get update -qq && \
  apt-get install -qq -y --no-install-recommends \
    geth && \
  rm -rf /var/lib/apt/lists/*

# start script
COPY start.sh $INSTALL_BASE/start

# set user
USER $USER
WORKDIR $ERIS

# configure
ENV ETH_PATH $ERIS/blockchains/ethereum
RUN mkdir --parents $ETH_PATH

# boot
VOLUME $ERIS
EXPOSE 8545 30303
CMD ["start"]
