module.exports = (conf) => {
  const {
    ROOT,
  } = conf

  return {
    context: ROOT,

    // 抽取公共组件
    // optimization: {
    //   splitChunks: {
    //     // cacheGroups: {
    //     //   // vendors: {
    //     //   //   name: 'vendors',
    //     //   //   test: /[\\/]node_modules[\\/]/,
    //     //   //   filename: 'common/[name]_[chunkhash:6].js',
    //     //   //   chunks: 'all',
    //     //   // },
    //     //   commons: {
    //     //     name: 'commons',
    //     //     chunks: 'all',
    //     //     minChunks: 2,
    //     //   }
    //     // },
    //   },
    // },
  }
}
