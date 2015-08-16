FROM erisindustries/tools
MAINTAINER Eris Industries <suppor@erisindustries.com>

ENV VERSION 0.11.0
ENV TAG v0.11A
RUN curl -sSL https://github.com/bitcoinxt/bitcoinxt/releases/download/$TAG/bitcoin-$VERSION-linux64.tar.gz | tar -xvz && mv bitcoin-$VERSION/bin/* $INSTALL_BASE

# persist data, set user
WORKDIR $ERIS
RUN mkdir --parents $ERIS/blockchains/bitcoinxt && \
  chown $USER -R /home/$USER/
RUN echo "rpcuser=eris" >> $ERIS/blockchains/bitcoinxt/bitcoin.conf && \
  echo "rpcpassword=GZfS6Fi5B1oKhXDrUeoKeQKnin9p1d4ZR85uT8NTdnmW" >> $ERIS/blockchains/bitcoinxt/bitcoin.conf

# RPC Port
EXPOSE 8332

# Peer Port
EXPOSE 8333

VOLUME $ERIS
USER $USER
ENTRYPOINT ["bitcoind", "-listen", "-server", "-daemon", "-conf=/home/eris/.eris/blockchains/bitcoinxt/bitcoin.conf", "-datadir=/home/eris/.eris/blockchains/bitcoinxt", "-rpcconnect=0.0.0.0", "-rpcuser=eris", "-rpcpassword=GZfS6Fi5B1oKhXDrUeoKeQKnin9p1d4ZR85uT8NTdnmW"]