FROM eris/base
MAINTAINER Eris Industries <support@erisindustries.com>

RUN apt-get update -qq && \
  apt-get install -qq -y \
    build-essential \
    libyaml-dev \
    python-dev && \
  curl -sL https://bootstrap.pypa.io/get-pip.py | python - && \
  rm -rf /var/lib/apt/lists/*