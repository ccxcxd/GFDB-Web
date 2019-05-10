import React from 'react'
import { routerRedux } from 'dva'
import {
  Icon,
  Dropdown,
} from 'antd'
import les from './index.less'

const Menu = ({
  dispatch,
  location,
  app,
}) => {
  // 属性获取
  const menus = __('menus')
  const {
    pathname,
  } = location
  const {
    clientType,
  } = app

  // 方法定义
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
          {
            d.icon ?
            <Icon type={d.icon} /> :
            d.label
          }
        </li>
      )
    })
  }

  return (
    <div>
      {
        clientType === 'phone' ?
        (
          // 移动端下拉式菜单
          <Dropdown
            trigger={['click']}
            overlay={(
              <ul className={`${les.menu} ${les.phoneStyle}`}>{mapMenu(menus)}</ul>
            )}
          >
            <div className={les.menuIconContainer}>
              <Icon
                type="bars"
                theme="outlined"
                className={les.menuIcon}
              />
            </div>
          </Dropdown>
        ):
        (
          // 网页及pad端平铺式菜单
          <ul
            className={les.menu}
          >
            {mapMenu(menus)}
          </ul>
        )
      }
    </div>
    
  )
}

export default Menu
