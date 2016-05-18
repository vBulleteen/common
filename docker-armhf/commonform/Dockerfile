FROM eris4iot/node:armhf

RUN npm --global install commonform-cli

# set user
USER $USER
WORKDIR $ERIS
VOLUME $ERIS
ENTRYPOINT commonform
