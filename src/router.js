import React from 'react'
import { routerRedux, Route, Switch } from 'dva/router'
import { LocaleProvider } from 'antd'
import zhCN from 'antd/lib/locale-provider/zh_CN'

import Quest from './routes/quest'

const { ConnectedRouter } = routerRedux

const Router = ({ history }) => {
  return (
    <LocaleProvider locale={zhCN}>
      <ConnectedRouter history={history} basename="/zh">
        <Switch>
          <Route path="/">
            <div>
              {__('Hello text')}
              <a href="/quest">asd</a>
            </div>
          </Route>
          <Route path="/quest" exact component={Quest} />
        </Switch>
      </ConnectedRouter>
    </LocaleProvider>
  )
}

export default Router
