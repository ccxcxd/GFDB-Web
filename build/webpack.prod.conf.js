'use strict'
const webpack = require('webpack')
const merge = require('webpack-merge')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

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

  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          name: 'commons',
          filename: './static/[name].[hash].js',
          chunks: 'initial',
          minChunks: 2
        },
      },
    },
  },

  plugins: [
    // 忽略moment
    new webpack.IgnorePlugin({
      resourceRegExp: /^\.\/locale$/,
      contextRegExp: /moment$/,
    }),
    // 另一个包体积分析插件
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
    }),
  ],
})
