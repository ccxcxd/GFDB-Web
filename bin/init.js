#!/usr/bin/env node
const path = require('path')
const glob = require('glob')
const yargs = require('yargs')
const rm = require('rimraf')
const fs = require('fs-extra')

const ROOT = path.resolve(__dirname, '../')
const LANG_DIR = path.resolve(ROOT, './src/locales')
const ENTRIES_DIR = path.resolve(ROOT, './src/entries')
const PACKAGE_JSON = path.resolve(ROOT, './package.json')
const ENTRY_FILE = path.resolve(ROOT, './src/index.js')
const WEBPACK_CONFIG_DIR = path.resolve(ROOT, './webpack-config-single/base/')
const WEBPACK_CONFIG_PATH = path.resolve(WEBPACK_CONFIG_DIR, './languages.js')

/** 获取语种列表 */
const getLang = function () {
  const dirList = glob.sync('**/', {
    cwd: LANG_DIR,
    root: LANG_DIR,
  })
  return dirList.map(d => d.substr(0, d.length - 1))
}

/** 替换文件 */
const replaceEntry = function (baseContent, target) {
  return baseContent.replace(
    /\/\*\* IMPORT_LANG \*\//,
    `import LANG from '${target}'`,
  ).replace(
    /'.\/+/g,
    '\'../',
  )
}

/** 生成posix格式的相对路径 */
const dealRelate = function (from, to) {
  const relate = path.relative(from, to)
  const split = relate.split(path.sep)
  return split.join('/')
}

/** 字符化window的文件路径 */
const wrapPathToStr = (str) => {
  if (path.sep === '\\') {
    return str.split(path.sep).join('\\\\')
  }
  return str
}

/** 替换webpack配置文件内容 */
const replaceConfig = function (baseContent, name, config, entry) {
  const dealConfig = dealRelate(WEBPACK_CONFIG_DIR, config)
  const dealEntry = wrapPathToStr(entry)
  return baseContent.replace(
    /__NAME__/,
    name,
  ).replace(
    /__CONFIG__/,
    dealConfig,
  ).replace(
    /__ENTRY__/,
    dealEntry,
  )
}

/** 保存文件 */
const saveFile = (filePath, content, options) => {
  const dirName = path.dirname(filePath)
  fs.ensureDirSync(dirName)
  fs.writeFileSync(filePath, content, options)
}

/** 处理入口文件 */
const initEntries = function () {
  const langList = getLang()
  console.log(`found these lang: [ ${langList} ]\n`)
  // 清空entries文件夹
  const tarGlob = path.resolve(ENTRIES_DIR, './**')
  rm.sync(tarGlob)
  console.log(`clear dir: ${tarGlob}\n`)
  const entryContent = fs.readFileSync(ENTRY_FILE, 'utf-8')

  let wbConfig = ''

  // 根据语种列表生成入口文件
  for (let i = 0; i < langList.length; i += 1) {
    const langPath = `../locales/${langList[i]}`
    const replaceContent = replaceEntry(entryContent, langPath)
    const filePath = path.resolve(ENTRIES_DIR, `./index.${langList[i]}.js`)
    saveFile(
      filePath,
      replaceContent,
      'utf-8',
    )
    console.log(`save lang entry: ${filePath}`)
    wbConfig += `
  {
    name: '__NAME__',
    config: require('__CONFIG__'),
    entry: '__ENTRY__'
  },`
    wbConfig = replaceConfig(
      wbConfig,
      langList[i],
      path.resolve(LANG_DIR, langList[i], 'index.js'),
      filePath,
    )
  }
  wbConfig = 'module.export = [' + wbConfig + '\n]\n'
  // console.log(wbConfig)
  // 更新webpack配置入口文件
  saveFile(WEBPACK_CONFIG_PATH, wbConfig, 'utf-8')
  console.log(`\nupdate lang config: ${WEBPACK_CONFIG_PATH}`)
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
