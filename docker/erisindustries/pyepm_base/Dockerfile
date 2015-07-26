FROM erisindustries/python
MAINTAINER Eris Industries <support@erisindustries.com>

RUN pip install pyepm && \
  pyepm -h

# set user
USER $USER
WORKDIR $ERIS
VOLUME $ERIS
ENTRYPOINT "pyepm"