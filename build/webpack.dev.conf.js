'use strict'
const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')

const webpackBaseConf = require('./webpack.base.conf.js')
const config = require('./config/index.js')

const {
  languages,

  ROOT,

  dev,
} = config
const {
  host,
  port,
  notifyOnErrors,
} = dev

/** 自定义的错误输出格式 */
const createNotifierCallback = () => {
  const notifier = require('node-notifier')
  /* eslint-disable-next-line */
  const packageConfig = require(path.resolve(ROOT, 'package.json'))


  return (severity, errors) => {
    if (severity !== 'error') return

    const error = errors[0]
    const filename = error.file && error.file.split('!').pop()

    notifier.notify({
      title: packageConfig.name,
      message: severity + ': ' + error.name,
      subtitle: filename || '',
      // icon: path.join(__dirname, 'logo.png'),
    })
  }
}

module.exports = merge(webpackBaseConf, {
  mode: 'development',

  output: {
    path: config.OUTPUT_DIR,
    publicPath: config.PUBLIC_PATH,
    filename: '[name]/index.js',
    chunkFilename: 'chunks/[id]_[chunkhash:6].js',
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        include: [
          config.SRC,
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
        include: config.SRC,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              modules: true,
              sourceMap: true,
              context: config.SRC,
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
              patterns: path.resolve(config.SRC, './utils/less/variables/*.less'),
              injector: 'append'
            },
          },
        ],
      },
      {
        // 图片加载器，雷同file-loader，更适合图片，可以将较小的图片转成base64，减少http请求
        // 如下配置，将小于8192byte的图片转成base64码
        test: /\.(png|jpg|gif)$/,
        include: config.SRC,
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
        include: config.SRC,
        loader: 'file-loader',
        options: {
          name: '/static/fonts/[hash].[ext]',
        },
      },
    ],
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    // 进度条插件
    new ProgressBarPlugin(),
    // 优化错误提示
    new FriendlyErrorsPlugin({
      compilationSuccessInfo: {
        messages: [`Your application is running here http://${host === '0.0.0.0' ? 'localhost' : host}:${port}`],
      },
      onErrors: notifyOnErrors
        ? createNotifierCallback()
        : undefined,
    }),
    // // 注册react全局引用
    // new webpack.ProvidePlugin({
    //   'React': 'react',
    //   'ReactDOM': 'react-dom',
    // }),
  ],

  // 使用 source-map
  devtool: 'cheap-source-map',
  devServer: {
    contentBase: './dist',
    publicPath: '/',
    // 设置localhost端口
    host: host,
    port: port,
    disableHostCheck: true,
    // 自动打开浏览器
    // open: true,
    hot: true,
    quiet: true,
    historyApiFallback: {
      rewrites: languages.map(d => {
        return {
          from: `^\/${d.name}`,
          to: `/${d.name}/`,
        }
      }),
    },
  },
})
