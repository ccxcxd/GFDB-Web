module.exports = (conf) => {
  const {
    OUTPUT_DIR,
  } = conf

  return {
    path: OUTPUT_DIR,
    publicPath: '/',
    filename: '/[name]_[chunkhash:6].js',
  }
}
