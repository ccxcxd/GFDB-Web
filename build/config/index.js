'use strict'
const path = require('path')

const languages = require('./languages.js')

const { publicPath } = process.env

const HOST = process.env.HOST
const PORT = process.env.PORT && Number(process.env.PORT)

const ROOT = path.resolve(__dirname, '../../')
const SRC = path.resolve(ROOT, './src')
const PUBLIC_PATH = publicPath || '/'

module.exports = {
  languages,

  ROOT, // 源码根目录
  SRC,
  OUTPUT_DIR: path.resolve(ROOT, 'dist'), // 打包产物目录
  STATIC_DIR: path.resolve(SRC, 'static'), // 静态资源目录
  DLL_DIR: path.resolve(SRC, 'static/dll'), //dll文件目录
  
  PUBLIC_PATH,

  dll: {
    entry: {
      WEBPACK_DLL_DB: [
        path.resolve(SRC, './db/mainDB.js'),
        // 'regenerator-runtime',
        // 'core-js',
        // 'babel-polyfill',
      ],
      WEBPACK_DLL_ENV: [
        'babel-polyfill',
        'url-polyfill',
      ],
    },
  },

  dev: {
    // Various Dev Server settings
    host: HOST || '0.0.0.0', // can be overwritten by process.env.HOST
    port: PORT || 8080, // can be overwritten by 

    errorOverlay: true,
    notifyOnErrors: true,
  },

  prod: {},
}