
const logPath = '/tmp/pandoc-filter.log'
const sockPath = '/tmp/pandoc-filter.sock'
const cachePath = '/tmp/pandoc-cache'
const cacheCleanLockPath = '/tmp/pandoc-cache-clean.lock'

let _logger = null
function logger () {
  if (!_logger) {
    const winston = require('winston')
    const { combine, timestamp, json } = winston.format
    _logger = winston.createLogger({
      level: 'info',
      format: combine(timestamp(), json()),
      transports: [
        new winston.transports.File({ filename: logPath, level: 'info' })
      ]
    })
  }
  return _logger
}

function sleep (interval) {
  return new Promise((resolove) => setTimeout(resolove, interval))
}

module.exports = {
  logPath,
  sockPath,
  cachePath,
  cacheCleanLockPath,
  logger,
  sleep,
}
