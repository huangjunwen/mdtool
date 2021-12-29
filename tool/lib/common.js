const winston = require('winston')

const logPath = '/tmp/pandoc-filter.log'
const sockPath = '/tmp/pandoc-filter.sock'
const cachePath = '/tmp/pandoc-cache'
const cacheCleanLockPath = '/tmp/pandoc-cache-clean.lock'

const { combine, timestamp, json } = winston.format

const logger = winston.createLogger({
  level: 'info',
  format: combine(timestamp(), json()),
  transports: [
    new winston.transports.File({ filename: logPath, level: 'info' })
  ]
})

module.exports = {
  logPath,
  sockPath,
  cachePath,
  cacheCleanLockPath,
  logger,
}
