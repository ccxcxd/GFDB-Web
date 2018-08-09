import React from 'react'
import { routerRedux, Route, Switch } from 'dva/router'
import { LocaleProvider } from 'antd'
import zhCN from 'antd/lib/locale-provider/zh_CN'

const { ConnectedRouter } = routerRedux

const Router = ({ history }) => {
  return (
    <LocaleProvider locale={zhCN}>
      <ConnectedRouter history={history}>
        <Switch>
          <Route path="/">
            <div>{__('Hello text')}</div>
          </Route>
        </Switch>
      </ConnectedRouter>
    </LocaleProvider>
  )
}

export default Router
