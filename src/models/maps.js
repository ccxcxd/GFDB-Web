import moduleExtend from 'dva-model-extend'
// import pathToRegexp from 'path-to-regexp'
import { isEmpty } from 'lodash'
import { model } from '../utils/model'
import LG from '@/services/localStorage'

export default moduleExtend(model, {
  namespace: 'maps',

  state: {
    autoGenerate: false,  // 自动生成地图
    displayPower: false,  // 显示效能

    campaignSelected: {}, // 选中的战役
    missionSelected: {},  // 选中的任务
    enemyTeamSelected: {},  // 选中的队伍

    currentTurn: 1, // 当前回合
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
    * setAutoGenerate ({ auto }, { put }) {
      yield put({
        type: 'updateState',
        payload: { autoGenerate: auto },
      })
      LG.set('auto_generate', auto ? '1' : '0')
    },
    * setDisplayPower ({ display }, { put }) {
      yield put({
        type: 'updateState',
        payload: { displayPower: display },
      })
      LG.set('hide_power', display ? '0' : '1')
    },
    * selectCampaign ({ payload, autoChild }, { put }) {
      const campaign = window.mDB.campaign_info[payload]
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
            autoChild,
          })
        }
      }
    },
    * selectMisson ({ payload, autoChild }, { put }) {
      const mission = window.mDB.mission_info[payload]
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
      const enemyTeam = window.mDB.enemy_team_info[payload]
      yield put.resolve({
        type: 'updateState',
        payload: { enemyTeamSelected: enemyTeam },
      })
      LG.set('team_select_id', payload)
    },
    * turnChange ({ turn }, { put }) {
      yield put({
        type: 'updateState',
        payload: { currentTurn: turn },
      })
    },
  },

  reducers: {},
})
