export const __ = (tar = {}, key) => {
  if (typeof key === 'string') {
    if (key.indexOf('.') !== -1) {
      // 检测到分层符
      const keyList = key.split('.')
      let res
      let obj = tar
      for (let i = 0; i < keyList.length; i += 1) {
        res = obj[keyList[i]]
        obj = res
      }
      return res
    }
    return tar[key]
  }
}