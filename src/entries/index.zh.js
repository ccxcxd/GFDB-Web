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
import qDB from '../db/questDB'
import LANG from '../locales/zh'

const __ = initI18n(LANG)

// 全局变量注入
window.__ = __
window.mDB = mDB
window.qDB = qDB

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
app.model(require('../models/quest').default)

// 4. Router
app.router(require('../router').default(LANG))

// 5. Start
app.start('#root')

// export default app // eslint-disable-line
