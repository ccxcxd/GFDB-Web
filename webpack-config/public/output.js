module.exports = (conf, lang) => {
  const {
    OUTPUT_DIR,
  } = conf

  return {
    path: OUTPUT_DIR,
    filename: `${lang}.output.js`,
  }
}
