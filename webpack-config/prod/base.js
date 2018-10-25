const baseConf = require('../public/base')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports = (conf) => {
  const baseConfig = baseConf(conf)

  return {
    ...baseConfig,
    // 代码压缩
    optimization: {
      minimizer: [
        new UglifyJsPlugin({
          uglifyOptions: {
            compress: {
              properties: false,
              warnings: false,
            },
            output: {
              beautify: false,
              quote_keys: true,
            },
            keep_fnames: true,
            sourceMap: false,
          },
        })
      ],
      splitChunks: {
        chunks: 'async',
        // maxSize: 20000,
        cacheGroups: {
          commons: {
            name: 'commons',
            filename: '[name].bundle.js',
          },
        }
      },
    },
  }
}