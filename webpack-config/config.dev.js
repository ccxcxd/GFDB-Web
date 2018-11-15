const conf = require('./base/index')

module.exports = {
  mode: 'development',

  ...require('./public/base')(conf),

  entry: require('./public/entry')(conf),
  output: require('./dev/output')(conf),
  module: require('./dev/module')(conf),
  resolve: require('./public/resolve')(conf),
  plugins: require('./dev/plugins')(conf),

  // 使用 source-map
  devtool: 'cheap-source-map',
  // 对 webpack-dev-server 进行配置
  devServer: require('./dev/devServer')(conf),
}
