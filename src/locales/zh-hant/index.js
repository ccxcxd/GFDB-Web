const base = require('./translation.json')

module.exports = {
  ...base,
  'name': 'zh-hant',
  'Hello text': '你好 歡迎來到少前攻略站',
  'menus': [
    { label: '敵方數據', path: '/maps' },
    { label: '後勤列表', path: '/quest' },
  ],
}