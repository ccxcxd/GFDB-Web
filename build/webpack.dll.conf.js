'use strict'
const path = require('path')
const webpack = require('webpack')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')

const config = require('./config/index.js')
const webpackDevConf = require('./webpack.dev.conf')

const {
  SRC,
  STATIC_DIR,
  DLL_DIR,

  dll,
  prod,
} = config

module.exports = {
  // mode: 'production',
  mode: 'development',

  entry: dll.entry,

  output: {
    path: DLL_DIR,
    filename: '[name].js',
    library: '[name]', // 当前Dll的所有内容都会存放在这个参数指定变量名的一个全局变量下，注意与DllPlugin的name参数保持一致
  },

  module: webpackDevConf.module,

  resolve: {
    alias: {
      ...prod.aliasExtra,
    },
  },

  plugins: [
    // 进度条插件
    new ProgressBarPlugin(),
    // 变量替换
    // new webpack.DefinePlugin({
    //   'PUBLIC_PATH': JSON.stringify(PUBLIC_PATH),
    // }),
    // dll插件
    // ...Object.keys(dll.entry).map(dllItem => {
    //   console.log(dllItem)
    //   let name = dllItem
    //   return new webpack.DllPlugin({
    //     path: path.resolve(DLL_DIR, `./${name}_manifest.json`), // 本Dll文件中各模块的索引，供DllReferencePlugin读取使用
    //     name: name,  // 当前Dll的所有内容都会存放在这个参数指定变量名的一个全局变量下，注意与参数output.library保持一致
    //     context: STATIC_DIR, // 指定一个路径作为上下文环境，需要与DllReferencePlugin的context参数保持一致，建议统一设置为项目根目录
    //   })
    // }),
    new webpack.DllPlugin({
      path: path.resolve(DLL_DIR, '[name]-manifest.json'), // 本Dll文件中各模块的索引，供DllReferencePlugin读取使用
      name: '[name]',  // 当前Dll的所有内容都会存放在这个参数指定变量名的一个全局变量下，注意与参数output.library保持一致
      context: STATIC_DIR, // 指定一个路径作为上下文环境，需要与DllReferencePlugin的context参数保持一致，建议统一设置为项目根目录
    }),
  ],

  devtool: false,
}
