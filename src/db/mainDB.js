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

// 点数据
const spot_info = require('./json/spot_info.json')

// 敌人队伍数据处理
const enemy_team_info = require('./json/enemy_team_info.json')

// 敌人队伍成员数据处理
const enemy_in_team_info = require('./json/enemy_in_team_info.json')

// 敌人角色数据处理
const enemy_character_type_info = require('./json/enemy_character_type_info.json')

// 枪支数据
const gun_info = require('./json/gun_info.json')

// 盟友数据
const ally_team_info = require('./json/ally_team_info.json')

// 建筑数据
const building_info = require('./json/building_info.json')

export default {
  campaign_info,
  mission_info,
  spot_info,
  enemy_team_info,
  enemy_in_team_info,
  enemy_character_type_info,
  gun_info,
  ally_team_info,
  building_info,
}