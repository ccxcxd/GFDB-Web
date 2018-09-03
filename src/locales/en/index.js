const base = require('./translation.json')

module.exports = {
  ...base,
  'name': 'en',
  'Hello text': 'Hello welcome to GF\' strategy site',
  'menus': [
    { path: '/', icon: 'home' },
    { path: '/maps', label: 'MapsAndEnemy' },
    { path: '/quest', label: 'Quest' },
  ],
}