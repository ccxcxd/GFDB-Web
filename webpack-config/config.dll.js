const path = require('path')
const conf = require('./base/index')

const {
  SRC,
  DLL_DIR,
} = conf

module.exports = {
  mode: 'production',

  ...require('./public/base')(conf),

  entry: {
    /*
      指定需要打包的js模块
      或是css/less/图片/字体文件等资源，但注意要在module参数配置好相应的loader
    */
    dll: [
      'react',
      'react-dom',
      'prop-types',
      'create-react-class',
      path.resolve(SRC, './db/mainDB.js'),
      // 'regenerator-runtime',
      // 'core-js',
      // 'babel-polyfill',
    ],
  },

  output: {
    path: DLL_DIR,
    filename: '[name].js',
    library: '[name]', // 当前Dll的所有内容都会存放在这个参数指定变量名的一个全局变量下，注意与DllPlugin的name参数保持一致
  },

  module: require('./dev/module')(conf),
  resolve: require('./public/resolve')(conf),
  plugins: require('./dll/plugins')(conf),

  devtool: false,
}
