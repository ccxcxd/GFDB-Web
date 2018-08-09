module.exports = (conf, lang) => {
  const {
    OUTPUT_DIR,
  } = conf

  return {
    path: OUTPUT_DIR,
    filename: `${lang}/[name]_[chunkhash:6].js`,
  }
}
