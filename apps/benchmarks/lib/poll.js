'use strict'

const Promise = require('bluebird')

const poll = (action) =>
  action().catch(() => Promise.delay(100).then(() => poll(action)))

module.exports = poll
