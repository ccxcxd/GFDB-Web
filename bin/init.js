#!/usr/bin/env node
const path = require('path')
const glob = require('glob')
const yargs = require('yargs')

const ROOT = path.resolve(__dirname, '../')
const LANG_DIR = path.resolve(ROOT, './src/locales')
const PACKAGE_JSON = path.resolve(ROOT, './package.json')

/** 获取语种列表 */
const getLang = function () {
  const dirList = glob.sync('**/', {
    cwd: LANG_DIR,
    root: LANG_DIR,
  })
  return dirList.map(d => d.substr(0, d.length - 1))
}

/** 处理入口文件 */
const initEntries = function () {
  const langList = getLang()
  console.log(`found these lang: [ ${langList} ]`)
}

// init usage
yargs.usage(
  `initLang ${require(PACKAGE_JSON).version}

  Usage: node init.js`
)

// init yargs command
yargs
  .command(
    'dev',
    'init langs files with watching file change',
    {},
    function (argv) {},
  )
  .middleware([ initEntries ])

yargs
  .command(
    'build',
    'init langs files without watching',
    {},
    function (argv) {},
  )
  .middleware([ initEntries ])

yargs
  .help('h')
  .alias('h', 'help')
  .version(require(PACKAGE_JSON).version)
  .alias('version', 'v')
  .strict()
  .epilog('copyright 2018')
  .argv
