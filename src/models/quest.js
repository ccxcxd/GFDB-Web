import moduleExtend from 'dva-model-extend'
// import pathToRegexp from 'path-to-regexp'
// import { isEmpty } from 'lodash'
import { model } from '../utils/model'
import qDB from '@/db/questDB'
import {
  sortBy,
  sum,
  find,
} from 'lodash'
import {
  dealHours,
} from '@/utils/js/func'

export default moduleExtend(model, {
  namespace: 'quest',

  state: {
    list: qDB.quest,
    filters: {},
  },

  subscriptions: {
    setup({ dispatch, history }) {
      // 检查语种
      history.listen(({ pathname }) => {
        // const match = pathToRegexp('/maps').exec(pathname)
        // 进入路由，获取数据
        // if (pathname === '/maps') {
        //   dispatch({ type: 'initData' })
        // }
      })
    },
  },

  effects: {
    * filterList({ payload }, { select, put }) {
      let { list } = yield select(({ quest }) => quest)
      if (payload.resource) {
        const { key, type } = payload.resource
        list = sortBy(list, [(que) => {
          const pud = que[key]
          if (type === 'total') {
            return pud
          } else if (type === 'times') {
            return dealHours(pud, que.time)
          }
          return 0
        }])
        list = list.reverse()
      } else if (payload.extra) {
        const matchId = payload.extra
        list = sortBy(list, [({ time, extra }) => {
          let weight = 0
          if (extra && extra.length) {
            const ifTarHaveValue = find(extra, d => d._id === matchId)
            if (ifTarHaveValue) {
              weight = 1/time
            }
          }
          return weight
        }])
        list = list.reverse()
      }
      yield put({
        type: 'updateState',
        payload: { list, filters: payload },
      })
    },
    * sorterList({ payload }, { select, put }) {
      const { field, order } = payload
      if (!field || !order) {
        return
      }
      let { list } = yield select(({ quest }) => quest)
      if (field === 'code') {
        list = sortBy(list, [({ code }) => {
          const nums = code.split('-')
          return parseInt(`${nums[0]}${nums[1]}`, 10)
        }])
      } else if (field === 'time') {
        list = sortBy(list, [({ time }) => time])
      } else if (field === 'total') {
        list = sortBy(list, [({ manpower, ammunition, rations, sparePart }) => sum([ manpower, ammunition, rations, sparePart ])])
      }
      if (order === 'descend') {
        list = list.reverse()
      }
      yield put({
        type: 'updateState',
        payload: { list },
      })
    },
  },

  reducers: {},
})
