const conf = require('./base/index')

module.exports = {
  mode: 'production',

  ...require('./public/base')(conf),

  entry: require('./public/entry')(conf),
  output: require('./prod/output')(conf),
  module: require('./dev/module')(conf),
  resolve: require('./public/resolve')(),
  plugins: require('./prod/plugins')(conf),

  devtool: false,
}
