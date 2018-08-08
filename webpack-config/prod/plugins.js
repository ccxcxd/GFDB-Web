const basePlus = require('../public/plugins')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')

module.exports = (conf, lang) => {
  const basePlugins = basePlus(conf, lang)

  return [
    ...basePlugins,
    // 进度条插件
    new ProgressBarPlugin(),
  ]
}