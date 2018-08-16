import moduleExtend from 'dva-model-extend'
import pathToRegexp from 'path-to-regexp'
import { model } from '../utils/model'
import {
  campaign_info,
  mission_info,
  enemy_team_info,
  enemy_in_team_info,
  enemy_character_type_info,
} from '@/db/mainDB'

export default moduleExtend(model, {
  namespace: 'maps',

  state: {
    campaign_info,
    mission_info,
    enemy_team_info,
    enemy_in_team_info,
    enemy_character_type_info,
    campaignSelected: {}, // 选中的战役
    missionSelected: {},  // 选中的任务
  },

  subscriptions: {
    setup({ dispatch, history }) {
      // 检查语种
      history.listen(({ pathname }) => {
        const match = pathToRegexp('/:lang').exec(pathname)
        // 进入路由，获取数据
      })
    },
  },

  effects: {
    * selectCampaign ({ paylaod }, { put }) {
      yield put({
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
  },

  reducers: {},
})
