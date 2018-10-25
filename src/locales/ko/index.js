const base = require('./translation.json')
const logistic = require('./logistic.json')

module.exports = {
  ...base,
  logistic,
  'name': 'ko',
  'menus': [
    { path: '/', icon: 'home' },
    { path: '/maps', label: '적 데이터' },
    { path: '/quest', label: '물류리스트' },
  ],
}