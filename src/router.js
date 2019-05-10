import React from 'react'
import { dynamic, router, routerRedux } from 'dva'

const { Router, BrowserRouter, Route, Switch } = router

const { ConnectedRouter } = routerRedux

export default (lang) => {
  return ({ history, app }) => {
    // 异步组件定义
    const DYNAMIC_C_ERROR = dynamic({
      component: () => import('./routes/error'),
    })
    const DYNAMIC_C_APP = dynamic({
      app,
      models: () => [
        (() => {
          return new Promise((resolve) => {
            import('./models/app').then((res) => {
              resolve(res.default(lang))
            })
          })
        })(),
        import('./models/maps'),
        import('./models/quest'),
      ],
      component: () => import('./routes/app'),
    })
    const DYNAMIC_C_INDEX_PAGE = dynamic({
      component: () => import('./routes/indexPage'),
    })
    const DYNAMIC_C_MAPS = dynamic({
      component: () => import('./routes/maps'),
    })
    const DYNAMIC_C_QUEST = dynamic({
      component: () => import('./routes/quest'),
    })

    return (
      <ConnectedRouter history={history}>
        <BrowserRouter basename={`/${lang.name}`}>
          <Router history={history}>
            <Switch>
              <Route
                path="/"
                render={props => (
                  <DYNAMIC_C_APP {...props}>
                    <Route path="/" exact component={DYNAMIC_C_INDEX_PAGE} />
                    <Route path="/maps/" exact component={DYNAMIC_C_MAPS} />
                    <Route path="/quest/" exact component={DYNAMIC_C_QUEST} />
                  </DYNAMIC_C_APP>
                )}
              />
              <Route component={DYNAMIC_C_ERROR} />
            </Switch>
          </Router>
        </BrowserRouter>
      </ConnectedRouter>
    )
  }
}
