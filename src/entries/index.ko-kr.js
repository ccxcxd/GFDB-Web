import '../polyfill'
import dva from 'dva'

// import createHistory from 'history/createHashHistory'
// user BrowserHistory
import createHistory from 'history/createBrowserHistory'
import createLoading from 'dva-loading'
import 'moment/locale/zh-cn'
// import '../rollbar'
import { initI18n } from '../utils/js/i18n'
import mDB from '../db/mainDB'
import LANG from '../locales/ko-kr'

const __ = initI18n(LANG)

// import '../index.less'
// 1. Initialize
const app = dva({
  history: createHistory({
    basename: `/${LANG.name}`,
  }),
})

// 2. Plugins
app.use(createLoading())

// 3. Register global model
app.model(require('../models/app').default(LANG))
app.model(require('../models/maps').default)

// 4. Router
app.router(require('../router').default(LANG))

// 5. Start
app.start('#root')

// 全局变量注入
window.__ = __
window.mDB = mDB

// export default app // eslint-disable-line
