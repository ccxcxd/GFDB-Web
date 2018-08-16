import moduleExtend from 'dva-model-extend'
import pathToRegexp from 'path-to-regexp'
import { model } from '../utils/model'
import {
  campaignInfo,
  missionInfo,
} from '@/db/mainDB'

export default moduleExtend(model, {
  namespace: 'maps',

  state: {
    campaignInfo,
    missionInfo,
    campaignSelected: {},
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
  },

  reducers: {},
})
