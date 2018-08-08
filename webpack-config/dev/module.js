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
            'stage-0',
          ],
        },
      },
      {
        test: /\.(less|css)$/,
        // include: paths.srcRootDir,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
            },
          },
          {
            loader: 'less-loader',
          },
        ],
      }
    ],
  }
}
