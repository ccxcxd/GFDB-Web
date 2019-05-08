'use strict'
const path = require('path')
const rimraf = require('rimraf')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const MergeJsonWebpackPlugin = require("merge-jsons-webpack-plugin")

const config = require('./config/index.js')
const utils = require('./utils.js')

const {
  ROOT,
  SRC,

  db,
} = config

rimraf.sync(path.resolve(db.dir, 'db_output.js'))
rimraf.sync(path.resolve(db.dir, '**.json'))

const dbFileName = `${db.outputFileName}.${Date.parse(new Date)}`
utils.updateFiles('db', dbFileName)

module.exports = {
  mode: 'production',

  entry: {
    db_output: path.resolve(SRC, './db/fakeDBEntry.js'),
  },

  output: {
    path: db.dir,
    filename: `[name].js`,
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
          db.dir,
          path.resolve(db.dir, `./${dbFileName}.json`),
        )
      },
    }),
  ],
}
