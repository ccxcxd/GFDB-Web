const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = ({
  SRC,
  STATIC_DIR,
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
    // 重定向首页
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.resolve(SRC, './indexPage.ejs'),
      xhtml: true,
      chunks: [],
    }),
    // 复制资源文件
    new CopyWebpackPlugin([
      {
        from: path.resolve(STATIC_DIR, './**'),
        to: './static/',
        context: STATIC_DIR,
      },
    ]),
  ]
}