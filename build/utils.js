'use strict'
const path = require('path')
const fs = require('fs-extra')

const config = require('./config')

/** update filename record file */
exports.updateFiles = (key, value) => {
  const filePath = config.FILES_CONFIG_PATH

  const configNow = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
  console.log('configNow: ', configNow)
  configNow[key] = value
  fs.writeFileSync(filePath, JSON.stringify(configNow), 'utf-8')
}
