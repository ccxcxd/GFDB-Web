module.exports = (conf) => {
  const {
    OUTPUT_DIR,
    PUBLIC_PATH,
  } = conf

  return {
    path: OUTPUT_DIR,
    publicPath: PUBLIC_PATH,
    filename: '[name]/index.js',
    chunkFilename: 'chunks/[id]_[chunkhash:6].js',
  }
}
