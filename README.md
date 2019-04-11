# GFDB-Web

Girls' Frontline Database Web Part

json数据是由另一个工具处理的：https://github.com/ccxcxd/GFDB-Decoder

本人完全不懂前端，欢迎大佬指点

有问题和建议可以在GitHub开issue或者NGA留言(tid=13906769)

## 指令列表

- `npm run dev`: 启动本地开发服务器
- `npm run build`: 打包代码
- `npm run local`: 启动本地静态服务器访问打包产物
- `npm run dll`: 生成 dll 文件（dll文件是打包的前置文件，如打包提示缺少dll文件的话执行本命令重新生成即可）

---

## 打包可用参数

- `--config`: 指定使用的 webpack 配置文件

其他可用的 cli 配置项详见 webpack 和 webpack-dev-server 的[配置列表](https://webpack.js.org/api/cli/)

---

## 目录说明

- `bin` 存放打包前操作 nodejs 文件，作用是生成多语种入口
- `build` 存放 webpack 配置文件的文件夹
- `dist` 存放打包产物的文件夹
- `src` 源码目录
  - `components` 公用视图模块
  - `db` 数据文件（如战役数据、后勤数据等）
  - `entries` 多语种的入口文件，本目录内容由 `bin/init.js` 根据 `src/index.js` 生成，不用手动编辑
  - `locales` 多语种数据目录，`bin/init.js` 根据本目录下的语种目录（文件夹）生成语种列表，生成多语种的入口文件
  - `models` 视图的操作 models 文件存放目录（redux 的 state 操作模块）
  - `routes` 前端路由文件存放目录
  - `services` 服务存放目录（http请求操作或是抽象的耗时操作）
  - `static` 静态文件存放目录（本目录下的文件会复制到产物中的 static 目录 `dist/static`）
  - `utils` 存放一些公用源文件的目录
    - `less` 存放less 的公用文件
      - `variables` 存放 less 文件的公用资源（会被自动引入所有 less 文件的头部）

---

## 框架说明

- 打包框架 [Webpack](https://webpack.js.org/)
- 前端框架 [React](https://reactjs.org/)
- 数据框架 [Dva](https://dvajs.com/) ([Redux](https://redux.js.org/) 的实现)

![概念图](https://zos.alipayobjects.com/rmsportal/PPrerEAKbIoDZYr.png)

### 代码执行主要流程：

- 通过路由分发把不同路由下的请求重定向回根目录的入口页面（单页应用)
- 根据入口文件的路由挂载对应路由的 model
- 根据路由渲染视图组件（react-router）
- 如触发某 model 的路由监听事件，执行之
