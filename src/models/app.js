import moduleExtend from 'dva-model-extend'
import pathToRegexp from 'path-to-regexp'
import { message } from 'antd'
import { checkLang } from '../locales'
import { model } from '../utils/model'
import { getWebWidth } from '@/utils/js/func'
import LG from '@/services/localStorage'
import { getDB } from '@/services/db'
import Game from '@/services/game'

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

      ifDBInit: false,  // 数据库是否就绪
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
        // 对比缓存版本号和最新版本号
        dispatch({ type: 'initVersion' })
        // 初始化数据
        dispatch({ type: 'initDB' })
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
          initCampaignId = Object.keys(window.mDB.campaign_info)[0]
        }
        yield put.resolve({
          type: 'maps/selectCampaign',
          payload: initCampaignId,
          autoChild: autoMission,
        })
        const auto_generate = LG.get('auto_generate') === '1' ? true : false
        yield put.resolve({ type: 'maps/setAutoGenerate', auto: auto_generate })
        const hide_power = LG.get('hide_power') === '1' ? true : false
        yield put.resolve({ type: 'maps/setDisplayPower', display: !hide_power })
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
      /* init db after dom load */
      * initDB({ payload }, { put }) {
        const { success, data } = yield getDB()
        if (success) {
          window.mDB = data
          window.gameIns = new Game()
          yield put({
            type: 'updateState',
            payload: { ifDBInit: true }
          })
          // 加载localStorage,初始化数据
          yield put({ type: 'initLG' })
          yield put({ type: 'quest/initState' })
        } else {
          message.error(data)
        }
      },
    },

    reducers: {},
  })
}
