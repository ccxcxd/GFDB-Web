import moduleExtend from 'dva-model-extend'
import pathToRegexp from 'path-to-regexp'
import { checkLang } from '../locales'
import { model } from '../utils/model'
import mDB from '@/db/mainDB'
import LG from '@/services/localStorage'

const {
  campaign_info,
} = mDB

export default (LANG) => {
  return moduleExtend(model, {
    namespace: 'app',

    state: {
      lang: LANG,

      lgInit: false,  // 缓存加载状态

      aboutVisible: false,  // 关于本站显示状态
      settingVisible: false,  // 设置弹窗显示状态
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
        // 加载localStorage,初始化数据
        dispatch({ type: 'initLG' })
      },
    },

    effects: {
      * initLG(inval, { put }) {
        /** /maps路由相关 start */
        let initCampaignId = LG.get('campaign_select_id')
        if (!initCampaignId) {
          initCampaignId = Object.keys(campaign_info)[0]
        }
        yield put.resolve({
          type: 'maps/selectCampaign',
          payload: initCampaignId,
        })
        const mission_select_id = LG.get('mission_select_id')
        const team_select_id = LG.get('team_select_id')
        if (mission_select_id !== undefined) {
          yield put({ type: 'maps/selectMisson', payload: mission_select_id })
        }
        if (team_select_id !== undefined) {
          yield put({ type: 'maps/selectEnemyTeam', payload: team_select_id })
        }
        const auto_generate = LG.get('auto_generate') === '1' ? true : false
        yield put({ type: 'maps/setAutoGenerate', auto: auto_generate })
        /** /maps路由相关 end */
      },
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

      * showSetting({ show }, { put }) {
        yield put({
          type: 'updateState',
          payload: { settingVisible: show },
        })
      },
    },

    reducers: {},
  })
}
