FROM golang:1.4
MAINTAINER Eris Industries <support@erisindustries.com>

# User Creation

ENV user eris

# Choose the user id number 1000 to work well with Boot2Docker volumes.  See:
# https://github.com/boot2docker/boot2docker/issues/581#issuecomment-62491280
RUN groupadd --system $user \
  && useradd --system --create-home --uid 1000 --gid $user $user

RUN mkdir /home/$user/.eris
RUN chown --recursive $user /home/$user/.eris
# USER eris