const base = require('./translation.json')
const logistic = require('./logistic.json')

module.exports = {
  ...base,
  logistic,
  'name': 'zh',
  'Hello text': '你好 欢迎来到少前攻略站',
  'menus': [
    { path: '/', icon: 'home' },
    { path: '/maps', label: '敌方数据' },
    { path: '/quest', label: '后勤列表' },
  ],
}