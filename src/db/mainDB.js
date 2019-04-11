/** 将队列json转换为数组 */
// const convertJSONToArray = (json) => {
//   const keys = Object.keys(json)
//   const array = []
//   for(let i = 0; i < keys.length; i += 1) {
//     array[i] = json[keys[i]]
//   }
//   return array
// }

// 游戏常量
const game_config_info = require('./json/game_config_info.json')

// 战役数据
const campaign_info = require('./json/campaign_info.json')

// 任务数据
const mission_info = require('./json/mission_info.json')

// 任务内地图节点数据
const spot_info = require('./json/spot_info.json')

// 敌人队伍数据
const enemy_team_info = require('./json/enemy_team_info.json')

// 敌人队伍成员数据
const enemy_in_team_info = require('./json/enemy_in_team_info.json')

// 敌人角色基础数据
const enemy_character_type_info = require('./json/enemy_character_type_info.json')

// 敌人等级参数数据
const enemy_standard_attribute_info = require('./json/enemy_standard_attribute_info.json')

// 枪支数据
const gun_info = require('./json/gun_info.json')

// 盟友数据
const ally_team_info = require('./json/ally_team_info.json')

// 建筑数据
const building_info = require('./json/building_info.json')

// 后勤数据
const operation_info = require('./json/operation_info.json')

// 物料数据
const item_info = require('./json/item_info.json')

export default {
  game_config_info,
  campaign_info,
  mission_info,
  spot_info,
  enemy_team_info,
  enemy_in_team_info,
  enemy_character_type_info,
  enemy_standard_attribute_info,
  gun_info,
  ally_team_info,
  building_info,
  operation_info,
  item_info,
}