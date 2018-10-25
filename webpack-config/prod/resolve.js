const baseReso = require('../public/resolve')

module.exports = (conf) => {
  const baseResolve = baseReso(conf)
  baseResolve.alias['jquery'] = 'jquery/dist/jquery.min.js'
  return baseResolve
}