import '../polyfill'
import dva from 'dva'

// import createHistory from 'history/createHashHistory'
// user BrowserHistory
import createHistory from 'history/createBrowserHistory'
import createLoading from 'dva-loading'
import 'moment/locale/zh-cn'
// import '../rollbar'
import LANG from '../locales/zh-hant'

// import '../index.less'
// 1. Initialize
const app = dva({
  history: createHistory({
    basename: `/${LANG.langType}`,
  }),
  initialState: {
    app:{
      lang: LANG,
    }
  },
})

// 2. Plugins
app.use(createLoading())

// 3. Register global model
app.model(require('../models/app').default)

// 4. Router
app.router(require('../router').default(LANG))

// 5. Start
app.start('#root')

// export default app // eslint-disable-line
