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

const filterByPlan = (list, condition) => {
  const baseList = [].concat(list)
  const { hour, min, resource, extra }= condition
  const time = hour * 60 + min
  return baseList.filter(function (ele) {
    var ifReturn = false
    if (ele.time <= time) {
      ifReturn = true
    } else {
      return false
    }
    // 资源筛选
    for (var i = 0; i < resource.length; i += 1) {
      if (parseInt(ele[resource[i]], 10) > 0) {
        ifReturn = true
      } else {
        return false
      }
    }
    // 道具筛选
    for (var j = 0; j < extra.length; j += 1) {
      if (find(ele.extra, d => d._id === extra[j])) {
        ifReturn = true
      } else {
        return false
      }
    }
    return ifReturn
  })
}

const sortByPlan = (list, condition) => {
  const baseList = [].concat(list)
  const { resource }= condition
  return sortBy(baseList, resource.map(d => {
    return (obj) => obj[d]
  })).reverse().slice(0, 4)
}

export default moduleExtend(model, {
  namespace: 'quest',

  state: {
    list: qDB.quest,
    filters: {},

    modalPlanVisible: false,  // 筹划弹窗可视状态
    planList: [], // 试算结果
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
    // 切换弹窗显示状态
    * showModalPlan({ show }, { put }) {
      yield put({
        type: 'updateState',
        payload: { modalPlanVisible: show },
      })
    },
    // 试算后勤序列
    * countQuest({ payload }, { put }) {
      const res = filterByPlan(qDB.quest, payload)
      console.log(sortByPlan(res, payload))
      yield put({
        type: 'updateState',
        payload: { planList: res },
      })
    },
  },

  reducers: {},
})
