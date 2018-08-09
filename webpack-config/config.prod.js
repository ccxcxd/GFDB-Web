const conf = require('./base/index')

const {
  languages
} = conf

module.exports = Object.keys(languages).map((lang) => {
  return {
    name: lang,
    mode: 'production',

    ...require('./public/base')(conf),

    entry: require('./public/entry')(conf),
    output: require('./prod/output')(conf, lang),
    module: require('./dev/module')(conf),
    resolve: require('./public/resolve')(),
    plugins: require('./prod/plugins')(conf, lang),
  
    devtool: false,
  }
})
