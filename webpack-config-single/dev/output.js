module.exports = (conf) => {
  const {
    OUTPUT_DIR,
  } = conf

  return {
    path: OUTPUT_DIR,
    filename: `[name].js`,
  }
}
