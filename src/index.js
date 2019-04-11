import './polyfill'
import dva from 'dva'

// import createHistory from 'history/createHashHistory'
// user BrowserHistory
import createHistory from 'history/createBrowserHistory'
import createLoading from 'dva-loading'
// import './rollbar'
import { initI18n } from './utils/js/i18n'
import mDB from '@/db/mainDB'
import moment from 'moment'
/** IMPORT_LANG */
/** IMPORT_LANG_MOMENT */

const __ = initI18n(LANG)
moment.locale(LANG.moment)

// 全局变量注入
window.__ = __
window.mDB = mDB

const basePath = PUBLIC_PATH
// import './index.less'
// 1. Initialize
const app = dva({
  history: createHistory({
    basename: `${basePath}${LANG.name}`,
  }),
})

// 2. Plugins
app.use(createLoading())

// 3. Register global model
app.model(require('./models/app').default(LANG))
app.model(require('./models/maps').default)
app.model(require('./models/quest').default)

// 4. Router
app.router(require('./router').default(LANG))

// 5. Start
app.start('#root')

// export default app // eslint-disable-line
