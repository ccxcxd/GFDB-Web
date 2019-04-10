const lookup = (key, lang) => {
  if (typeof key === 'string') {
    if (key.indexOf('.') !== -1) {
      // 检测到分层符
      const keyList = key.split('.')
      let res
      let obj = lang
      for (let i = 0; i < keyList.length; i += 1) {
        res = obj[keyList[i]]
        obj = res
      }
      return res
    }
    return lang[key]
  }
}

export const initI18n = (lang = {}) => (key) => {
  const res = lookup(key, lang)
  if (typeof res === 'undefined') {
    return "????"
  } else if (typeof res === 'string') {
    return res.replace(new RegExp("//c|//n", "g"), " ")
  } else {
    return res
  }
}