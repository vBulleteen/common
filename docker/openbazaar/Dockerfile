FROM quay.io/eris/tools
MAINTAINER Eris Industries <support@erisindustries.com>

# Dependencies
RUN touch /usr/local/man
RUN apt-get -qq update && apt-get -y upgrade && \
  apt-get install -y -qq python-dev python-pip libffi-dev libssl-dev pylint

RUN git clone https://github.com/OpenBazaar/OpenBazaar-Server.git /OpenBazaar-Server
WORKDIR /OpenBazaar-Server

RUN pip install -r requirements.txt && \
  pip install -r test_requirements.txt
RUN make && chown --recursive $USER /OpenBazaar-Server

# set user
USER $USER
WORKDIR $ERIS

# boot
VOLUME $ERIS
ENTRYPOINT python openbazaard.py
