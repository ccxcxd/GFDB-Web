const base = require('./translation.json')
const table = require('./table.json')
const logistic = require('./logistic.json')

module.exports = {
  ...base,
  ...table,
  logistic,
  'name': 'ja',
  'moment': 'ja',
  'menus': [
    { path: '/', icon: 'home' },
    { path: '/maps', label: '敵情報' },
    //{ path: '/quest', label: '後方支援' },
  ],
}