const base = require('./translation.json')
const logistic = require('./logistic.json')

module.exports = {
  ...base,
  logistic,
  'name': 'ko',
  'Hello text': '안녕하세요, 소녀 전선 인 레이더 스 스테이션에 오신 것을 환영합니다',
  'menus': [
    { path: '/', icon: 'home' },
    { path: '/maps', label: '적 데이터' },
    { path: '/quest', label: '물류리스트' },
  ],
}