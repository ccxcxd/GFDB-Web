import moduleExtend from 'dva-model-extend'
// import pathToRegexp from 'path-to-regexp'
import { isEmpty } from 'lodash'
import { model } from '../utils/model'
import mDB from '@/db/mainDB'

const {
  mission_info,
  enemy_team_info,
} = mDB

export default moduleExtend(model, {
  namespace: 'maps',

  state: {
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
          dispatch({ type: 'initData' })
        }
      })
    },
  },

  effects: {
    * initData (inval, { put }) {
      const { campaign_info } = mDB
      if (campaign_info && !isEmpty(campaign_info)) {
        const keys = Object.keys(campaign_info)
        yield put ({
          type: 'selectCampaign',
          payload: campaign_info[keys[0]],
        })
      }
    },
    * selectCampaign ({ payload }, { put }) {
      yield put.resolve({
        type: 'updateState',
        payload: { campaignSelected: payload },
      })
      const { mission_ids } = payload
      if (mission_ids && mission_ids.length) {
        yield put({
          type: 'selectMisson',
          payload: mission_info[mission_ids[0]],
        })
      }
    },
    * selectMisson ({ payload }, { put }) {
      yield put.resolve({
        type: 'updateState',
        payload: { missionSelected: payload },
      })
      const { enemy_team_count } = payload
      if (enemy_team_count && !isEmpty(enemy_team_count)) {
        const keys = Object.keys(enemy_team_count)
        yield put({
          type: 'selectEnemyTeam',
          payload: enemy_team_info[keys[0]],
        })
      }
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
