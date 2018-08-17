import moduleExtend from 'dva-model-extend'
import pathToRegexp from 'path-to-regexp'
import { checkLang } from '../locales'
import { model } from '../utils/model'

export default (LANG) => {
  return moduleExtend(model, {
    namespace: 'app',

    state: {
      lang: LANG,

      aboutVisible: false,  // 关于本站显示状态
    },

    subscriptions: {
      setup({ dispatch, history }) {
        // 检查语种
        history.listen(({ pathname }) => {
          const match = pathToRegexp('/:lang').exec(pathname)
          // 进入路由，获取数据
          if (match) {
            // console.log(match)
          }
          if (pathname === '/') {
            dispatch({ type: 'getLang' })
          }
        })
      },
    },

    effects: {
      * getLang(inval, { put }) {
        const { name } = checkLang()
        setTimeout(() => {
          put({ type: 'updateState', payload: { lang: name }})
        }, 3000)
        // yield put({ type: 'updateState', payload: { lang: name }})
      },

      * showAbout({ show }, { put }) {
        yield put({
          type: 'updateState',
          payload: { aboutVisible: show },
        })
      },
    },

    reducers: {},
  })
}
