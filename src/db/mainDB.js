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
const campaign_info = require('./json/campaign_info.json')

// 地图数据处理
const mission_info = require('./json/mission_info.json')

// 敌人队伍数据处理
const enemy_team_info = require('./json/enemy_team_info.json')

// 敌人队伍成员数据处理
const enemy_in_team_info = require('./json/enemy_in_team_info.json')

// 敌人角色数据处理
const enemy_character_type_info = require('./json/enemy_character_type_info.json')

export {
  campaign_info,
  mission_info,
  enemy_team_info,
  enemy_in_team_info,
  enemy_character_type_info,
}