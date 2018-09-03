import moduleExtend from 'dva-model-extend'
import pathToRegexp from 'path-to-regexp'
import { checkLang } from '../locales'
import { model } from '../utils/model'
import mDB from '@/db/mainDB'
import { getWebWidth } from '@/utils/js/func'
import LG from '@/services/localStorage'

const {
  campaign_info,
} = mDB

export default (LANG) => {
  return moduleExtend(model, {
    namespace: 'app',

    state: {
      lang: LANG,

      maxWidth: 1200,
      clientWidth: 380,
      clientType: 'web',  // 客户端类型（web: 网页端，pad: 平板端，phone：手机端）此参数用于切换不同的主题

      tableProps: {
        size: 'default'
      },

      aboutVisible: false,  // 关于本站显示状态
      settingVisible: false,  // 设置弹窗显示状态

      versionVisible: false,  // 版本信息弹窗显示状态
      versionStoraged: null,  // 缓存的版本号
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
        // 获取设备宽度
        dispatch({ type: 'initConfig' })
        // 加载localStorage,初始化数据
        dispatch({ type: 'initLG' })
        // 对比缓存版本号和最新版本号
        dispatch({ type: 'initVersion' })
      },
    },

    effects: {
      * initConfig (inval, { put }) {
        const clientWidth = getWebWidth()
        let clientType = 'pad'
        let tableProps = { size: 'default' }
        if (clientWidth < 768) {
          clientType = 'phone'
          tableProps = { size: 'small' }
        } else if (clientWidth >= 1200) {
          clientType = 'web'
        }
        yield put({
          type: 'updateState',
          payload: {
            clientWidth,
            clientType,
            tableProps,
          },
        })
      },
      * initLG(inval, { put }) {
        console.log('init localStorage...')
        /** /maps路由相关 start */
        const team_select_id = LG.get('team_select_id', 'number')
        let autoTeam = true
        if (team_select_id !== undefined) {
          autoTeam = true
          yield put.resolve({ type: 'maps/selectEnemyTeam', payload: team_select_id })
        }
        const mission_select_id = LG.get('mission_select_id', 'number')
        let autoMission = true
        if (mission_select_id !== undefined) {
          autoMission = false
          yield put.resolve({
            type: 'maps/selectMisson',
            payload: mission_select_id,
            autoChild: autoTeam,
          })
        }
        let initCampaignId = LG.get('campaign_select_id', 'number')
        if (!initCampaignId) {
          initCampaignId = Object.keys(campaign_info)[0]
        }
        yield put.resolve({
          type: 'maps/selectCampaign',
          payload: initCampaignId,
          autoChild: autoMission,
        })
        const auto_generate = LG.get('auto_generate') === '1' ? true : false
        yield put({ type: 'maps/setAutoGenerate', auto: auto_generate })
        const display_power = LG.get('display_power') === '1' ? true : false
        yield put({ type: 'maps/setDisplayPower', display: display_power })
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
      * showVersion({ show }, { put }) {
        yield put({
          type: 'updateState',
          payload: { versionVisible: show },
        })
      },
      * initVersion(inval, { put }) {
        const version = LG.get('version')
        console.log(version)
        yield put({
          type: 'updateState',
          payload: { versionStoraged: version },
        })
      },
      * updateVersion({ payload }, { put }) {
        LG.set('version', payload)
        yield put({
          type: 'updateState',
          payload: { versionStoraged: payload },
        })
      },
    },

    reducers: {},
  })
}
