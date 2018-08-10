import React from 'react'
import { Router, Route, Switch } from 'dva/router'

import dynamic from 'dva/dynamic'

// 路由处理及生成
const RouterSetting = function router({ history, app }) {
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
          nodeAry.push(<Route key={key} path={path} exact={exact} component={Component} />)
        }
      }
    } catch (e) {
      console.log('route parse err:', e)
    }
    return (
      <Switch>
        {nodeAry}
        <Route
          component={
            dynamic({
              app,
              models: () => [],
              component: () => import('./routes/error/index'),
            })
          }
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
      component: dynamic({
        app,
        models: () => [],
        component: () => import('./routes/app'),
      }),
      routes: [
        {
          // 首页
          path: '/',
          component: dynamic({
            app,
            models: () => [],
            component: () => import('./routes/indexPage'),
          }),
        },
        {
          // 登录
          path: '/quest',
          component: dynamic({
            app,
            models: () => [],
            component: () => import('./routes/quest'),
          }),
        },
      ],
    },
  ]

  // return <Router history={history} routes={routes} />
  return (
    <Router history={history}>
      {mapRoutes(routeData)}
    </Router>
  )
}

// const RouterSetting = ({ history }) => {
//   return (
//     <LocaleProvider locale={zhCN}>
//       <Router history={history}>
//         <Switch>
//           <Route path="/">
//             <Route path="/">
//               <div>
//                 Hello text
//                 <Link to="/quest">asd</Link>
//               </div>
//             </Route>
//             <Route path="/quest" component={Quest} />
//           </Route>
//         </Switch>
//       </Router>
//     </LocaleProvider>
//   )
// }

export default RouterSetting
