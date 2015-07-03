# Pull base image.
FROM eris/base
MAINTAINER Eris Industries <support@erisindustries.com>

# Set the env variables to non-interactive
ENV DEBIAN_FRONTEND noninteractive
ENV DEBIAN_PRIORITY critical
ENV DEBCONF_NOWARNINGS yes
ENV TERM linux
RUN echo 'debconf debconf/frontend select Noninteractive' | debconf-set-selections

# grab deps (gmp)
RUN apt-get update && \
  apt-get install -y --no-install-recommends \
    libgmp3-dev && \
  rm -rf /var/lib/apt/lists/*

# set the repo and install tendermint
ENV REPO /go/src/github.com/tendermint/tendermint
COPY start.sh /usr/local/bin/mint
COPY . $REPO
WORKDIR $REPO
RUN go install ./cmd/tendermint

# install the client tools
RUN go get github.com/eris-ltd/mint-client/...

# persist data, set user
VOLUME /home/$USER/.eris
WORKDIR /home/$USER/.eris
USER $USER
RUN mkdir --parents /home/$USER/.eris/blockchains/tendermint
ENV TMROOT /home/$USER/.eris/blockchains/tendermint
ENV ECM_PATH $REPO

# run tendermint
ENTRYPOINT ["mint"]
