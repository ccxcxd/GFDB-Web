const path = require('path')

module.exports = (conf) => {
  const {
    SRC,
  } = conf

  return {
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
            'react',
            'stage-0',
          ],
          'plugins': [
            ["import", { "libraryName": "antd", "libraryDirectory": "es", "style": "css" }],
          ],
        },
      },
      {
        test: /\.(css)$/,
        // include: SRC,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            options: {},
          },
        ],
      },
      {
        test: /\.(less)$/,
        include: SRC,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              modules: true,
              sourceMap: true,
              context: SRC,
              localIdentName: '[local]___[hash:base64:6]',
              camelCase: true,
            },
          },
          {
            loader: 'less-loader',
          },
          {
            loader: 'style-resources-loader',
            options: {
              patterns: path.resolve(SRC, 'utils/less/variables/*.less'),
              injector: 'append'
            },
          },
        ],
      },
      {
        // 图片加载器，雷同file-loader，更适合图片，可以将较小的图片转成base64，减少http请求
        // 如下配置，将小于8192byte的图片转成base64码
        test: /\.(png|jpg|gif)$/,
        include: SRC,
        // loader: 'url-loader?limit=8192&name=./static/img/[hash].[ext]',
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
              name: '/static/img/[hash].[ext]',
            },
          },
        ],
      },
      {
        // 专供iconfont方案使用的，后面会带一串时间戳，需要特别匹配到
        test: /\.(woff|woff2|svg|eot|ttf)\??.*$/,
        include: SRC,
        loader: 'file-loader',
        options: {
          name: '/static/fonts/[hash].[ext]',
        },
      },
    ],
  }
}
