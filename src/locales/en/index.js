const base = require('./translation.json')
const logistic = require('./logistic.json')

module.exports = {
  ...base,
  logistic,
  'name': 'en',
  'Hello text': 'Hello welcome to GF\' strategy site',
  'menus': [
    { path: '/', icon: 'home' },
    { path: '/maps', label: 'MapsAndEnemy' },
    { path: '/quest', label: 'Quest' },
  ],
}