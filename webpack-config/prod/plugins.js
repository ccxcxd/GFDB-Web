const basePlus = require('../public/plugins')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const Visualizer = require('webpack-visualizer-plugin')

module.exports = (conf) => {
  const basePlugins = basePlus(conf)

  return [
    ...basePlugins,
    // 进度条插件
    new ProgressBarPlugin(),
    // 包体积分析
    new Visualizer(),
  ]
}