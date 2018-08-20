import moduleExtend from 'dva-model-extend'
// import pathToRegexp from 'path-to-regexp'
// import { isEmpty } from 'lodash'
import { model } from '../utils/model'

export default moduleExtend(model, {
  namespace: 'quest',

  state: {
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
  },

  reducers: {},
})
