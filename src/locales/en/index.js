const base = require('./translation.json')

module.exports = {
  ...base,
  'name': 'en',
  'Hello text': 'Hello welcome to GF\' strategy site',
  'menus': [
    { label: 'MapsAndEnemy', path: '/maps' },
    { label: 'Quest', path: '/quest' },
  ],
}