const base = require('./translation.json')

module.exports = {
  ...base,
  'name': 'ko-kr',
  'Hello text': '你好 欢迎来到少前攻略站',
  'menus': [
    { path: '/', icon: 'home' },
    { path: '/maps', label: '敌方数据' },
    { path: '/quest', label: '后勤列表' },
  ],
}