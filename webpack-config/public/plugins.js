const path = require('path')
const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = ({
  SRC,
  STATIC_DIR,
  DLL_DIR,
  PUBLIC_PATH,
  languages,
}) => {
  const langHtmls = []
  languages.forEach(d => {
    langHtmls.push(
      new HtmlWebpackPlugin({
        filename: `${d.name}/index.html`,
        template: path.resolve(SRC, './index.ejs'),
        xhtml: true,
        chunks: [d.name],
        PUBLIC_PATH: PUBLIC_PATH,
      })
    )
  })
  return [
    // 配置 dll
    new webpack.DllReferencePlugin({
      context: STATIC_DIR,
      manifest: path.resolve(DLL_DIR, './manifest.json'),
      name: 'dll',
    }),
    // 复制资源文件
    new CopyWebpackPlugin([
      {
        from: path.resolve(STATIC_DIR, './**'),
        to: './static/',
        context: STATIC_DIR,
        cache: true,
      },
    ]),
    // 各语种主页
    ...langHtmls,
    // 引入 dll 资源
    // new HtmlWebpackIncludeAssetsPlugin({
    //   assets: ['static/dll/dll.js'],
    //   append: true,
    // }),
    // 重定向首页
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.resolve(SRC, './indexPage.ejs'),
      xhtml: true,
      chunks: [],
    }),
    // 变量替换
    new webpack.DefinePlugin({
      'PUBLIC_PATH': JSON.stringify(PUBLIC_PATH),
    }),
  ]
}