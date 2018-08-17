import moduleExtend from 'dva-model-extend'
// import pathToRegexp from 'path-to-regexp'
import { model } from '../utils/model'
import {
  campaign_info,
  mission_info,
  spot_info,
  enemy_team_info,
  enemy_in_team_info,
  enemy_character_type_info,
  gun_info,
  ally_team_info,
} from '@/db/mainDB'
import Map from '../services/map'

export default moduleExtend(model, {
  namespace: 'maps',

  state: {
    campaign_info,
    mission_info,
    spot_info,
    enemy_team_info,
    enemy_in_team_info,
    enemy_character_type_info,
    gun_info,
    ally_team_info,
    campaignSelected: {}, // 选中的战役
    missionSelected: {},  // 选中的任务
    enemyTeamSelected: {},  // 选中的队伍
  },

  subscriptions: {
    setup({ dispatch, history }) {
      // 检查语种
      history.listen(({ pathname }) => {
        // const match = pathToRegexp('/maps').exec(pathname)
        // 进入路由，获取数据
        if (pathname === '/maps') {
        }
      })
    },
  },

  effects: {
    * selectCampaign ({ paylaod }, { put }) {
      yield put.resolve({
        type: 'updateState',
        payload: { campaignSelected: paylaod },
      })
    },
    * selectMisson ({ paylaod }, { put }) {
      yield put({
        type: 'updateState',
        payload: { missionSelected: paylaod },
      })
    },
    * selectEnemyTeam ({ payload }, { put }) {
      yield put({
        type: 'updateState',
        payload: { enemyTeamSelected: payload },
      })
    },
  },

  reducers: {},
})
