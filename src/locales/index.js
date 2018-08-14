export const langList = [
  {
    name: 'en',
    desc: 'English',
    alias: ['en'],
  },
  {
    name: 'zh',
    desc: '简体中文',
    alias: ['zh-CN'],
  },
  {
    name: 'zh-hant',
    desc: '繁体中文',
    alias: [],
  },
]

export const getBrowserLang = () => {
  console.log(`[navigator.language]:${navigator.language}`)
  console.log(`[navigator.userLanguage]:${navigator.userLanguage}`)
  console.log(`[navigator.browserLanguage]:${navigator.browserLanguage}`)
  console.log(`[navigator.systemLanguage]:${navigator.systemLanguage}`)
  return navigator.language || navigator.browserLanguage
}

export const checkLang = () => {
  const lang = getBrowserLang()
  for (let i = 0; i < langList.length; i += 1) {
    if (langList[i]['alias'].indexOf(lang) !== -1) {
      return langList[i]
    }
  }
  return false
}
