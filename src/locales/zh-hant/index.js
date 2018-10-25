const base = require('./translation.json')
const table = require('./table.json')
const logistic = require('./logistic.json')

module.exports = {
  ...base,
  ...table,
  logistic,
  'name': 'zh-hant',
  'menus': [
    { path: '/', icon: 'home' },
    { path: '/maps', label: '敵方數據' },
    { path: '/quest', label: '後勤列表' },
  ],
}