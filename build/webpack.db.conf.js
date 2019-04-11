'use strict'
const path = require('path')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const MergeJsonWebpackPlugin = require("merge-jsons-webpack-plugin")

const config = require('./config/index.js')

const {
  ROOT,
  SRC,
  STATIC_DIR,

  db,
} = config

const outputPath = path.resolve(SRC, './db')

module.exports = {
  mode: 'production',

  entry: {
    db_output: path.resolve(SRC, './db/fakeDBEntry.js')
  },

  output: {
    path: outputPath,
    filename: '[name].js',
  },

  plugins: [
    // 进度条插件
    new ProgressBarPlugin(),
    new MergeJsonWebpackPlugin({
      context: ROOT,
      prefixFileName: true,
      files: db.jsons.map(d => `./src/db/json/${d}.json`),
      output: {
        fileName: path.relative(
          outputPath,
          path.resolve(STATIC_DIR, `./${db.outputFileName}.json`),
        )
      },
    }),
  ],
}
