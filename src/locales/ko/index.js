const base = require('./translation.json')
const table = require('./table.json')
const logistic = require('./logistic.json')

module.exports = {
  ...base,
  ...table,
  logistic,
  'name': 'ko',
  'moment': 'ko',
  'menus': [
    { path: '/', icon: 'home' },
    { path: '/maps/', label: '적 데이터' },
    { path: '/quest/', label: '군수지원 목록' },
  ],
}