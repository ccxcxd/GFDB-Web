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
        ],
      },
    ],
  }
}
