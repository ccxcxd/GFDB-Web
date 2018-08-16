/** 将队列json转换为数组 */
const convertJSONToArray = (json) => {
  const keys = Object.keys(json)
  const array = []
  for(let i = 0; i < keys.length; i += 1) {
    array[i] = json[keys[i]]
  }
  return array
}

// 战役数据处理
const campaignInfo = require('./json/campaign_info.json')

// 地图数据处理
const missionInfo = require('./json/mission_info.json')

export {
  campaignInfo,
  missionInfo,
}