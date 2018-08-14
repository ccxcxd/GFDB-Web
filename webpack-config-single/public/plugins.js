const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = (conf) => {
  const {
    SRC,
  } = conf

  return [
    // 主页
    new HtmlWebpackPlugin({
      filename: 'zh/index.html',
      template: path.resolve(SRC, './index.ejs'),
      xhtml: true,
      chunks: ['zh'],
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.resolve(SRC, './indexPage.ejs'),
      xhtml: true,
      chunks: [],
    }),
  ]
}