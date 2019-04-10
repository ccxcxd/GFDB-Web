'use strict'
const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')

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

  module: {
    rules: [
      {
        test: /\.js$/,
        include: [
          SRC,
        ],
        loader: 'babel-loader',
        options: {
          'presets': [
            'env',
            'react',
            'stage-0',
          ],
          'plugins': [
            ["import", { "libraryName": "antd", "libraryDirectory": "es", "style": "css" }],
            ['lodash'],
          ],
        },
      },
      {
        test: /\.(css)$/,
        // include: SRC,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            options: {},
          },
        ],
      },
      {
        test: /\.(less)$/,
        include: SRC,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              modules: true,
              sourceMap: true,
              context: SRC,
              localIdentName: '[local]___[hash:base64:6]',
              camelCase: true,
            },
          },
          {
            loader: 'less-loader',
          },
          {
            loader: 'style-resources-loader',
            options: {
              patterns: path.resolve(SRC, './utils/less/variables/*.less'),
              injector: 'append'
            },
          },
        ],
      },
      {
        // 图片加载器，雷同file-loader，更适合图片，可以将较小的图片转成base64，减少http请求
        // 如下配置，将小于8192byte的图片转成base64码
        test: /\.(png|jpg|gif)$/,
        include: SRC,
        // loader: 'url-loader?limit=8192&name=./static/img/[hash].[ext]',
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
              name: '/static/img/[hash].[ext]',
            },
          },
        ],
      },
      {
        // 专供iconfont方案使用的，后面会带一串时间戳，需要特别匹配到
        test: /\.(woff|woff2|svg|eot|ttf|otf)\??.*$/,
        include: SRC,
        loader: 'file-loader',
        options: {
          name: '/static/fonts/[hash].[ext]',
        },
      },
    ],
  },

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
    // 进度条插件
    new ProgressBarPlugin(),
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
