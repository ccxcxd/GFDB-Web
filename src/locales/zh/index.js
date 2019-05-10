const base = require('./translation.json')
const table = require('./table.json')
const logistic = require('./logistic.json')

module.exports = {
  ...base,
  ...table,
  logistic,
  'name': 'zh',
  'moment': 'zh-cn',
  'menus': [
    { path: '/', icon: 'home' },
    { path: '/maps/', label: '敌方数据' },
    { path: '/quest/', label: '后勤列表' },
  ],
}