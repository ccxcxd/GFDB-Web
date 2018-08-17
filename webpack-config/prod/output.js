module.exports = (conf) => {
  const {
    OUTPUT_DIR,
  } = conf

  return {
    path: OUTPUT_DIR,
    publicPath: '/',
    filename: '[name]/index_[chunkhash:6].js',
    chunkFilename: 'chunks/[id]_[chunkhash:6].js',
  }
}
