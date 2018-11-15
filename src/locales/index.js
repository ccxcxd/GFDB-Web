export const langList = [
  {
    name: 'zh',
    desc: '简体中文',
    alias: ['zh', 'zh-CN', 'zh-hans'],
  },
  {
    name: 'zh-hant',
    desc: '繁体中文',
    alias: ['zh-hant', 'zh-TW'],
  },
  {
    name: 'ko',
    desc: '한국어',
    alias: ['ko', 'ko-KR'],
  },
  {
    name: 'en',
    desc: 'English',
    alias: ['en', 'en-US'],
  },
  {
    name: 'ja',
    desc: '日本語',
    alias: ['ja', 'ja-JP'],
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
