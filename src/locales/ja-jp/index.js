const base = require('./translation.json')
const logistic = require('./logistic.json')

module.exports = {
  ...base,
  logistic,
  'name': 'ja-jp',
  'Hello text': 'こんにちは、女の子の前線レイダーズ駅へようこそ',
  'menus': [
    { path: '/', icon: 'home' },
    { path: '/maps', label: '敵のデータ' },
    { path: '/quest', label: '物流タスクリスト' },
  ],
}