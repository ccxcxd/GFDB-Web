/**
 * 将分钟数值转为字符时间表示
 * @param getMin 分钟数
*/
export const dealTime = function (getMin) {
  const hour = parseInt(getMin / 60, 10)
  let hourText = '' + hour
  const min = getMin % 60
  let minText = '' + min
  if (hour < 1) {
    hourText = '00'
  } else if (hour < 10) {
    hourText = '0' + hour
  }
  if (min < 10) {
    minText = '0' + min
  }
  return hourText + ':' + minText
}

/**
 * 计算每小时产量
 * @param total 总产量
 * @param time 生产时间
*/
export const dealHours = function (total, time) {
  return ((total * 60) / time).toFixed(2)
}

/** 获取设备宽度 */
export const getWebWidth = function () {
  const width = document.body.clientWidth
  console.log(`body width: ${width}`)
  return width
}
