const path = require('path')

module.exports = ({
  SRC,
}) => {
  return {
    extensions: ['.js', '.jsx'],
    alias: {
      '@': SRC,
      'lang': path.resolve(SRC, 'locales'),
      'services': path.resolve(SRC, 'services'),
      'static': path.resolve(SRC, 'static'),
    },
  }
}
