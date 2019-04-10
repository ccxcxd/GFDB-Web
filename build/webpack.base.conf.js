'use strict'
const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const config = require('./config/index.js')

const {
  languages,

  SRC,
  PUBLIC_PATH,
  STATIC_DIR,
  DLL_DIR,
} = config

/** definition entry object */
const entryObj = {}
/** definition html output array */
const langHtmls = []

const baseHWPconfig = {
  template: path.resolve(SRC, './index.ejs'),
  xhtml: true,
  PUBLIC_PATH: PUBLIC_PATH,
}
languages.forEach((la) => {
  entryObj[la.name] = la.entry
  langHtmls.push(
    new HtmlWebpackPlugin({
      ...baseHWPconfig,
      filename: `${la.name}/index.html`,
      chunks: [la.name],
      LANG_CONFIG: la.config,
    })
  )
})

module.exports = {
  entry: entryObj,

  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      '@': SRC,
      'lang': path.resolve(SRC, 'locales'),
      'services': path.resolve(SRC, 'services'),
      'static': path.resolve(SRC, 'static'),
    },
  },

  plugins: [
    // 配置 dll
    new webpack.DllReferencePlugin({
      context: STATIC_DIR,
      manifest: path.resolve(DLL_DIR, './manifest.json'),
      name: 'dll',
    }),
    // 复制资源文件
    new CopyWebpackPlugin([
      {
        from: path.resolve(STATIC_DIR, './**'),
        to: './static/',
        context: STATIC_DIR,
        cache: true,
      },
    ]),
    // 各语种主页
    ...langHtmls,
    // 引入 dll 资源
    // new HtmlWebpackIncludeAssetsPlugin({
    //   assets: ['static/dll/dll.js'],
    //   append: true,
    // }),
    // 重定向首页
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.resolve(SRC, './indexPage.ejs'),
      xhtml: true,
      chunks: [],
    }),
    // 变量替换
    new webpack.DefinePlugin({
      'PUBLIC_PATH': JSON.stringify(PUBLIC_PATH),
    }),
  ],
}
