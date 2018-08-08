const conf = require('./base/index')

const {
  ROOT,
  HOST,
  PORT,
  languages
} = conf

module.exports = Object.keys(languages).map((lang) => {
  return {
    name: lang,
    mode: 'production',
    context: ROOT,

    entry: require('./public/entry')(conf),
    output: require('./public/output')(conf, lang),
    module: require('./dev/module')(conf),
    resolve: require('./public/resolve')(),
    plugins: require('./prod/plugins')(conf, lang),
  
    devtool: false,
  }
})
