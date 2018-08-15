import React from 'react'
import { routerRedux } from 'dva/router'
import { Link } from 'dva/router'
import { Select } from "antd"
import { langList } from '../../../locales'
import les from './index.less'

const Option = Select.Option

const Page = ({
  dispatch,
  location,
  app,
  children,
}) => {
  // 属性获取
  const {
    lang,
  } = app
  const {
    pathname,
  } = location
  console.log(pathname)

  // 属性定义
  const menus = lang.menus

  // 方法定义
  const handleChange = (value) => {
    console.log(`selected ${value}`)
    window.location.href = `/${value}`
  }
  const link = (url) => {
    dispatch(routerRedux.push(url))
  }

  // 渲染方法定义
  const mapMenu = (ary) => {
    return ary.map(d => {
      return (
        <li
          key={d.path}
          className={`${les.menuItem} ${pathname === d.path ? les.active : ''}`}
          onClick={() => link(d.path)}
        >
          {d.label}
        </li>
      )
    })
  }
  const mapLang = (ary) => {
    return ary.map(d => {
      return (
        <Option key={d.name} value={d.name}>{d.desc}</Option>
      )
    })
  }

  return (
    <div className={les.container}>
      <div className={les.header}>
        <div className={les.headerContent}>
          <Link
            to="/"
            className={`${les.logo} ${pathname === '/' ? les.active : ''}`}
          >
            <img src={require('@/static/img/logo.png')} alt="logo" />
          </Link>
          {/* 路由菜单 */}
          <ul
            className={les.menu}
          >
            {mapMenu(menus)}
          </ul>
          {/* 语言切换 */}
          <Select
            className={les.lang}
            value={lang.name}
            onChange={handleChange}
          >
            {mapLang(langList)}
          </Select>
        </div>
      </div>
      <div className={les.body}>{children}</div>
    </div>
  )
}

export default Page
