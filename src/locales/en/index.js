const base = require('./translation.json')
const logistic = require('./logistic.json')

module.exports = {
  ...base,
  logistic,
  'name': 'en',
  'menus': [
    { path: '/', icon: 'home' },
    { path: '/maps', label: 'Maps & Enemy Stats' },
    { path: '/quest', label: 'Logistic Supports' },
  ],
}