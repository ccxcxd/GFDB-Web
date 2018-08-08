const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const I18nPlugin = require("i18n-webpack-plugin")

module.exports = (conf, lang) => {
  const {
    SRC,
    languages,
  } = conf

  return [
    // 主页
    new HtmlWebpackPlugin({
      filename: `${lang}/index.html`,
      template: path.resolve(SRC, './pages/index.ejs'),
      xhtml: true,
    }),
    // 重定向首页
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.resolve(SRC, './pages/indexPage.ejs'),
      xhtml: true,
    }),
    // 多语言
    new I18nPlugin(languages[lang])
  ]
}