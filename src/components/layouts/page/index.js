import React from 'react'
import { Link } from 'dva/router'
import { Menu } from "antd";

const Page = ({
  children,
}) => {
  return (
    <div>
      <div>
        <Menu
          mode="horizontal"
        >
          <Menu.Item>
            <Link to="/">首页</Link>
          </Menu.Item>
          <Menu.Item>
            <Link to="/quest">后勤列表</Link>
          </Menu.Item>
        </Menu>
      </div>
      <div>{children}</div>
    </div>
  )
}

export default Page
