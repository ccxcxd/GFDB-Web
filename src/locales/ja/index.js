const base = require('./translation.json')
const logistic = require('./logistic.json')

module.exports = {
  ...base,
  logistic,
  'name': 'ja',
  'menus': [
    { path: '/', icon: 'home' },
    { path: '/maps', label: '敵情報' },
    { path: '/quest', label: '後方支援' },
  ],
}