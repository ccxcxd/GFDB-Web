import './polyfill'
import dva from 'dva'

// import createHistory from 'history/createHashHistory'
// user BrowserHistory
import { createBrowserHistory } from 'history'
import createLoading from 'dva-loading'
// import './rollbar'
import { initI18n } from './utils/js/i18n'
import moment from 'moment'
/** IMPORT_LANG */
/** IMPORT_LANG_MOMENT */
import routerInit from './router'
import 'antd/dist/antd.css'

const __ = initI18n(LANG)
moment.locale(LANG.moment)

// 全局变量注入
window.__ = __
window.mDB = {}

const basePath = PUBLIC_PATH
// import './index.less'
// 1. Initialize
const app = dva({
  history: createBrowserHistory({
    basename: `${basePath}${LANG.name}`,
  }),
})

// 2. Plugins
app.use(createLoading())

// 3. Register global model
// app.model(require('./models/app').default(LANG))
// app.model(require('./models/maps').default)
// app.model(require('./models/quest').default)

// 4. Router
app.router(routerInit(LANG))

// 5. Start
app.start('#root')

// export default app // eslint-disable-line
