const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = ({
  SRC,
  languages,
}) => {
  const indexs = languages.map(d => {
    return new HtmlWebpackPlugin({
      filename: `${d.name}/index.html`,
      template: path.resolve(SRC, './index.ejs'),
      xhtml: true,
      chunks: [d.name],
    })
  })
  return [
    // 各语种主页
    ...indexs,
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.resolve(SRC, './indexPage.ejs'),
      xhtml: true,
      chunks: [],
    }),
  ]
}