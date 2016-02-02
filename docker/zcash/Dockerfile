FROM quay.io/eris/tools
MAINTAINER Eris Industries <support@erisindustries.com>

ENV NAME zcash
ENV BRANCH zc.v0.11.2.latest
ENV LOCATION /var/zcash
ENV BOOST_VERSION 1.57.0

RUN apt-add-repository -y ppa:bitcoin/bitcoin && \
  apt-get update -qq && \
  apt-get install -qq -y --no-install-recommends \
    build-essential g++ python-dev autotools-dev libicu-dev build-essential \
    libbz2-dev wget automake autoconf libtool bsdmainutils libdb4.8-dev \
    libdb4.8++-dev libssl-dev libevent-dev pkg-config libgmp-dev \
    libprocps3-dev libgtest-dev python-markdown unzip && \
  rm -rf /var/lib/apt/lists/*

WORKDIR /tmp
RUN wget -q -O boost.tar.gz http://downloads.sourceforge.net/project/boost/boost/$BOOST_VERSION/boost_$(echo "$BOOST_VERSION" | tr '.' '_').tar.gz && \
  tar -xzf boost.tar.gz && \
  cd boost_$(echo "$BOOST_VERSION" | tr '.' '_') && \
  ./bootstrap.sh && \
  ./b2 install && \
  cd /tmp && rm -rf boost*

RUN git clone https://github.com/Electric-Coin-Company/$NAME.git /$LOCATION

WORKDIR /$LOCATION

RUN /$LOCATION/zcutil/fetch-params.sh

RUN /$LOCATION/zcutil/build.sh

# Expose mainnet wallet rpc port.
EXPOSE 8332

# Expose mainnet peer port.
EXPOSE 8333

# Expose mainnet rpc port.
EXPOSE 8334

# Expose testnet wallet rpc port.
EXPOSE 18332

# Expose testnet peer port.
EXPOSE 18333

# Expose testnet rpc port.
EXPOSE 18334

# persist data, set user
WORKDIR $ERIS
ENV DATA_DIR $ERIS/scratch/data/$NAME
RUN mkdir --parents $DATA_DIR && \
  touch $DATA_DIR/bitcoin.conf && \
  echo testnet=1 >> $DATA_DIR/bitcoin.conf && \
  echo addnode=alphatestnet.z.cash >> $DATA_DIR/bitcoin.conf && \
  echo rpcuser=username >> $DATA_DIR/bitcoin.conf && \
  echo rpcpassword=Hze7btPVjmo6iJmUCdB5DXppCzZWaK8PEDHUJYYAYuFC >> $DATA_DIR/bitcoin.conf && \
  chmod 600 $DATA_DIR/bitcoin.conf && \
  mkdir /root/.zcash && \
  cp $DATA_DIR/bitcoin.conf /root/.zcash/bitcoin.conf && \
  mv /root/.zcash-params /home/$USER/ && \
  mv /home/$USER/.zcash-params/regtest/* /home/$USER/.zcash-params/ && \
  chown $USER -R /home/$USER/

VOLUME /home/$USER/.eris

USER $USER
CMD $LOCATION/src/zcashd -conf=$DATA_DIR/bitcoin.conf -datadir=$DATA_DIR -daemon
