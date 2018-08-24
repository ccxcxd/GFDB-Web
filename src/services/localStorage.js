class LocalStorageClass {
  lg = null

  constructor () {
    if (!window.localStorage) {
      throw new Error('localStorage not support')
    }
    this.lg = window.localStorage
  }

  /**
   * 获取数据
   * @param {*} itemName 字段名
   * @param {*} translateType 值转换方式[number | string]
   */
  get (itemName, translateType) {
    let val = this.lg.getItem(itemName)
    if (translateType === 'number') {
      val = parseInt(val, 10)
    }
    return val || undefined
  }

  /**
   * 保存数据
   * @param {*} itemName 字段名
   * @param {*} itemValue 字段内容
   */
  set (itemName, itemValue) {
    try {
      this.lg.setItem(itemName, itemValue)
    } catch (e) {
      throw new Error(e.message)
    }
  }
}

const LG = new LocalStorageClass()

export default LG
