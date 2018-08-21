import React from 'react'
import { Router, BrowserRouter, Route, Switch, routerRedux } from 'dva/router'
import dynamic from 'dva/dynamic'

import C_ERROR from './routes/error'
import C_APP from './routes/app'
import C_INDEX_PAGE from './routes/indexPage'
import C_MAPS from './routes/maps'
import C_QUEST from './routes/quest'

const { ConnectedRouter } = routerRedux

// 路由处理及生成
const RouterSetting = (lang) => {
  return function router({ history, app }) {

    // 根据路由结构遍历生成路由节点树
    const mapRoutes = (ary, parent) => {
      const nodeAry = []
      try {
        for (let i = 0; i < ary.length; i += 1) {
          const { path, routes, component: Component, exact = true } = ary[i]
          let key = `${i}`
          if (parent) {
            const { key: parKey } = parent
            key = `${parKey}-${key}`
          }
          // 判断有无子节点
          if (routes && routes.length) {
            // nodeAry.push(...mapRoutes(routes, { key, ...ary[i] }))
            nodeAry.push(
              <Route
                key={key}
                path={path}
                exact={exact}
                render={
                  (props) => {
                    if (Component) {
                      return (
                        <Component {...props}>
                          {mapRoutes(routes, { key, ...ary[i] })}
                        </Component>
                      )
                    } else {
                      return mapRoutes(routes, { key, ...ary[i] })
                    }
                  }
                }
              />,
            )
          } else {
            nodeAry.push(
              <Route
                key={key}
                path={path}
                exact={exact}
                component={Component}
              />
            )
          }
        }
      } catch (e) {
        console.log('route parse err:', e)
      }
      return (
        <Switch>
          {nodeAry}
          <Route
            component={C_ERROR}
          />
        </Switch>
      )
    }
  
    // 路由结构对象
    const routeData = [
      {
        // 首页
        path: '/',
        exact: false,
        component: C_APP,
        routes: [
          {
            path: '/',
            component: C_INDEX_PAGE,
          },
          {
            path: '/maps',
            component: C_MAPS,
          },
          {
            path: '/quest',
            component: C_QUEST,
          },
        ],
      },
    ]
  
    // return <Router history={history} routes={routes} />
    return (
      <ConnectedRouter history={history}>
        <BrowserRouter basename={`/${lang.name}`}>
          <Router history={history}>
          {mapRoutes(routeData)}
          </Router>
        </BrowserRouter>
      </ConnectedRouter>
    )
  }
}

export default RouterSetting
