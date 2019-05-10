const base = require('./translation.json')
const table = require('./table.json')
const logistic = require('./logistic.json')

module.exports = {
  ...base,
  ...table,
  logistic,
  'name': 'en',
  'moment': 'en-ca',
  'menus': [
    { path: '/', icon: 'home' },
    { path: '/maps/', label: 'Maps & Enemy Stats' },
    { path: '/quest/', label: 'Logistic Supports' },
  ],
}