import moduleExtend from 'dva-model-extend'
// import pathToRegexp from 'path-to-regexp'
import { isEmpty } from 'lodash'
import { model } from '../utils/model'
import mDB from '@/db/mainDB'
import LG from '@/services/localStorage'

const {
  mission_info,
  campaign_info,
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
          dispatch({ type: 'initLG' })
        }
      })
    },
  },

  effects: {
    * initLG (inval, { put }) {
      // const val = LG.get()
    },
    * initData (inval, { put }) {
      let initId = LG.get('campaign_select_id')
      if (!initId) {
        initId = Object.keys(campaign_info)[0]
      }
      yield put.resolve({
        type: 'selectCampaign',
        payload: initId,
      })
      const mission_select_id = LG.get('mission_select_id')
      const team_select_id = LG.get('team_select_id')
      if (mission_select_id !== undefined) {
        yield put({ type: 'selectMisson', payload: mission_select_id })
      }
      if (team_select_id !== undefined) {
        yield put({ type: 'selectEnemyTeam', payload: team_select_id })
      }
    },
    * selectCampaign ({ payload, autoChild }, { put }) {
      const campaign = campaign_info[payload]
      yield put.resolve({
        type: 'updateState',
        payload: { campaignSelected: campaign },
      })
      LG.set('campaign_select_id', payload)
      if (autoChild) {
        const { mission_ids } = campaign
        if (mission_ids && mission_ids.length) {
          yield put.resolve({
            type: 'selectMisson',
            payload: mission_ids[0],
          })
        }
      }
    },
    * selectMisson ({ payload, autoChild }, { put }) {
      const mission = mission_info[payload]
      yield put.resolve({
        type: 'updateState',
        payload: { missionSelected: mission },
      })
      LG.set('mission_select_id', payload)
      if (autoChild) {
        const { enemy_team_count } = mission
        if (enemy_team_count && !isEmpty(enemy_team_count)) {
          const keys = Object.keys(enemy_team_count)
          yield put.resolve({
            type: 'selectEnemyTeam',
            payload: keys[0],
          })
        }
      }
    },
    * selectEnemyTeam ({ payload }, { put }) {
      const enemyTeam = enemy_team_info[payload]
      yield put.resolve({
        type: 'updateState',
        payload: { enemyTeamSelected: enemyTeam },
      })
      LG.set('team_select_id', payload)
    },
  },

  reducers: {},
})
