'use strict'
const webpack = require('webpack')
const merge = require('webpack-merge')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const Visualizer = require('webpack-visualizer-plugin')

const webpackBaseConf = require('./webpack.base.conf.js')
const config = require('./config/index.js')

const {
  OUTPUT_DIR,
  PUBLIC_PATH,

  prod,
} = config

module.exports = merge(webpackBaseConf, {
  mode: 'production',
  // mode: 'development',

  output: {
    path: OUTPUT_DIR,
    publicPath: PUBLIC_PATH,
    filename: '[name]/index_[chunkhash:6].js',
    chunkFilename: 'chunks/[id]_[chunkhash:6].js',
  },

  resolve: {
    alias: {
      ...prod.aliasExtra,
    },
  },

  plugins: [
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    // 包体积分析
    new Visualizer(),
  ],
})
