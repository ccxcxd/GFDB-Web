const conf = require('./base/index')

const {
  ROOT,
  HOST,
  PORT,
  languages
} = conf

module.exports = {
  mode: 'development',

  ...require('./public/base')(conf),

  entry: require('./public/entry')(conf),
  output: require('./dev/output')(conf),
  module: require('./dev/module')(conf),
  resolve: require('./public/resolve')(),
  plugins: require('./dev/plugins')(conf),

  // 使用 source-map
  devtool: 'cheap-source-map',
  // 对 webpack-dev-server 进行配置
  devServer: {
    contentBase: './dist',
    publicPath: '/',
    // 设置localhost端口
    host: HOST,
    port: PORT,
    // 自动打开浏览器
    // open: true,
    hot: true,
    quiet: true,
  },
}
