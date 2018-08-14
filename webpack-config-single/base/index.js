const path = require('path')
const languages = require('./languages')

const ROOT = path.resolve(__dirname, '../../')

module.exports = {
  ROOT, // 源码根目录
  SRC: path.resolve(ROOT, './src'),
  OUTPUT_DIR: path.resolve(ROOT, 'dist'), // 打包产物目录

  HOST: 'localhost',
  PORT: 9000,

  notifyOnErrors: true, // 显示错误信息
  languages,  // 语言库配置
}