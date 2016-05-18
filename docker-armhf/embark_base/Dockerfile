FROM eris4iot/gulp:armhf
MAINTAINER Eris Industries <support@erisindustries.com>

USER root

RUN npm install --global embark-framework grunt-cli

# set user
USER $USER
WORKDIR $ERIS
VOLUME $ERIS
ENTRYPOINT "embark"
