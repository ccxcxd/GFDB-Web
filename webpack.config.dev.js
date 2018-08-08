const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')

const ROOT = __dirname
const SRC = path.resolve(ROOT, 'src')

const HOST = 'localhost'
const PORT = 9000
const notifyOnErrors = true

/** 自定义的错误输出格式
 */
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

module.exports = {
  entry: ['babel-polyfill', './src/pages/index.js'],
  output: {
    path: path.resolve(ROOT, 'dist'),
    filename: 'index.js',
  },
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
            'stage-0',
          ],
        },
      },
      {
        test: /\.(less|css)$/,
        // include: paths.srcRootDir,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
            },
          },
          {
            loader: 'less-loader',
          },
        ],
      }
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  // 使用 source-map
  devtool: 'cheap-source-map',
  // 对 webpack-dev-server 进行配置
  devServer: {
    contentBase: './dist',
    // 设置localhost端口
    host: HOST,
    port: PORT,
    // 自动打开浏览器
    // open: true,
    hot: true,
    quiet: true,
  },
  plugins: [
    // 主页
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.resolve(SRC, './pages/index.ejs'),
      xhtml: true,
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    // 进度条插件
    new ProgressBarPlugin(),
    // 优化错误提示
    new FriendlyErrorsPlugin({
      compilationSuccessInfo: {
        messages: [`Your application is running here: http://${HOST}:${PORT}`],
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
  mode: 'development',
  context: ROOT,
}
