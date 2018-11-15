import moduleExtend from 'dva-model-extend'
// import pathToRegexp from 'path-to-regexp'
// import { isEmpty } from 'lodash'
import { model } from '../utils/model'
import mDB from '@/db/mainDB'
import {
  sortBy,
  sum,
  find,
} from 'lodash'
import {
  dealHours,
} from '@/utils/js/func'

const operationList = Object.keys(mDB.operation_info).map(d => mDB.operation_info[d])

const filterByPlan = (list, condition) => {
  const baseList = [].concat(list)
  const { hour, min, resource, extra } = condition
  const time = hour * 60 * 60 + min *60
  return baseList.filter(function (ele) {
    var ifReturn = false
    if (ele.duration <= time) {
      ifReturn = true
    } else {
      return false
    }
    // 资源筛选
    for (var i = 0; i < resource.length; i += 1) {
      const keyName = resource[i].toLowerCase()
      if (parseInt(ele[keyName], 10) > 0) {
        ifReturn = true
      } else {
        return false
      }
    }
    // 道具筛选
    for (var j = 0; j < extra.length; j += 1) {
      if (find(ele.item_pool, (d) => {
        const list = d.split(',')
        return list.indexOf(extra[j]) !== -1
      })) {
        ifReturn = true
      } else {
        return false
      }
    }
    return ifReturn
  })
}

const countByPlan = (list, condition) => {
  const baseList = [].concat(list)
  const { resource }= condition
  return sortBy(baseList, resource.map(d => {
    return (obj) => obj[d]
  })).reverse().slice(0, 4)
}

const resourceList = [
  mDB.item_info['501'],
  mDB.item_info['502'],
  mDB.item_info['503'],
  mDB.item_info['504'],
]
const extraList = [
  mDB.item_info['1'],
  mDB.item_info['2'],
  mDB.item_info['3'],
  mDB.item_info['4'],
  mDB.item_info['41'],
]

export default moduleExtend(model, {
  namespace: 'quest',

  state: {
    list: operationList,
    resourceList,
    extraList,
    filters: {},

    modalPlanVisible: false,  // 筹划弹窗可视状态

    planCondition: { }, // 试算条件
    planFilterList: [], // 试算-后勤筛选列表
    planCountList: [], // 试算-后勤推荐列表

    drawerPlanVisible: false, // 试算结果弹窗
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
            return parseFloat(dealHours(pud, que.duration))
          }
          return 0
        }])
        list = list.reverse()
      } else if (payload.extra) {
        const matchId = payload.extra
        list = sortBy(list, [({ duration, item_pool }) => {
          let weight = 0
          const itemList = item_pool.split(',')
          if (itemList && itemList.length) {
            const ifTarHaveValue = find(itemList, d => d === matchId)
            if (ifTarHaveValue) {
              weight = 1/ duration
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
      const res = filterByPlan(operationList, payload)
      const countList = countByPlan(res, payload)
      yield put.resolve({
        type: 'updateState',
        payload: {
          planCondition: payload,
          planFilterList: res,
          planCountList: countList,
        },
      })
      // 隐藏弹窗
      yield put.resolve({
        type: 'showModalPlan',
        show: false,
      })
      // 显示试算结果抽屉
      yield put({
        type: 'showDrawerPlan',
        show: true,
      })
    },
    // 切换试算抽屉显示状态
    * showDrawerPlan({ show }, { put }) {
      yield put({
        type: 'updateState',
        payload: { drawerPlanVisible: show },
      })
    },
  },

  reducers: {},
})
