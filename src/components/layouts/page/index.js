import React from 'react'
import {
  Icon,
  Select,
  Button,
  Badge,
} from "antd"
import versionDB from '@/db/versionDB'
import { langList } from '../../../locales'
import les from './index.less'
import ModalAbout from './components/modalAbout'
import DrawerSetting from './components/drawerSetting'
import DrawerVersion from './components/drawerVersion'
import Menu from './components/menu'

const Option = Select.Option

const Page = ({
  dispatch,
  location,
  app,
  maps,
  children,
}) => {
  // 属性获取
  const {
    aboutVisible,
    versionStoraged,
  } = app

  // 属性定义
  const propsOfMenu = {
    dispatch,
    location,
    app,
  }
  const propsOfModal = {
    title: __('about.title'),
    visible: aboutVisible,
    onCancel: () => showAbout(false),
    footer: null,

    about: __('about'),
  }
  const propsOfDrawerSetting = {
    dispatch,
    app,
    maps,
  }
  const propsOfDrawerVersion = {
    dispatch,
    app,
  }

  // 方法定义
  const handleChange = (value) => {
    console.log(`selected ${value}`)
    window.location.href = `${PUBLIC_PATH}${value}`
  }
  const showAbout = (show) => {
    dispatch({ type: 'app/showAbout', show })
  }
  const showSetting = () => {
    dispatch({ type: 'app/showSetting', show: true })
  }
  const showVersion = () => {
    dispatch({ type: 'app/showVersion', show: true })
  }

  // 渲染方法定义
  const mapLang = (ary) => {
    return ary.map(d => {
      return (
        <Option key={d.name} value={d.name}>{d.desc}</Option>
      )
    })
  }

  return (
    <div className={les.container}>
      {/* 页头 */}
      <div className={les.header}>
        <div className={les.headerContent}>
          {/* 路由菜单 */}
          <Menu {...propsOfMenu} />
          {/* 占位元素 */}
          <div className={les.blank} />
          {/* 设置按钮 */}
          <div className={les.setting} onClick={showSetting}>
            <Icon type="setting" />
          </div>
          {/* 版本信息按钮 */}
          <div className={les.version} onClick={showVersion}>
            <Icon type="info-circle-o" />
            <Badge dot={versionStoraged !== versionDB[0]['version']} />
          </div>
        </div>
      </div>
      {/* 内容 */}
      <div className={les.body}>{children}</div>
      {/* 页脚 */}
      <div className={les.footer}>
        <div className={les.footerContainer}>
          {/* 关于本站 */}
          <Button
            type="primary"
            className={les.showAbout}
            onClick={() => showAbout(true)}
          >{__('about.title')}</Button>
          {/* 语言切换 */}
          <div className={les.language}>
            {/* <span>Language:</span> */}
            <Select
              className={les.lang}
              value={__('name')}
              onChange={handleChange}
            >
              {mapLang(langList)}
            </Select>
          </div>
          {/* 其他信息 */}
          <div className={les.otherInfo}>
            {/* *Need Japanese translator, you can find me on <a href="https://twitter.com/CCX_CX_D" target="_blank">twitter</a> */}
          </div>
        </div>
      </div>
      {/* 关于本站弹窗 */}
      <ModalAbout {...propsOfModal} />
      {/* 系统设置抽屉 */}
      <DrawerSetting {...propsOfDrawerSetting} />
      {/* 版本信息抽屉 */}
      <DrawerVersion {...propsOfDrawerVersion} />
    </div>
  )
}

export default Page
