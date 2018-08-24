import React from 'react'
import {
  Drawer,
  Divider,
  Checkbox,
} from 'antd'
import les from './index.less'

const DrawerSetting = ({
  dispatch,
  app,
  maps,
}) => {
  // 获取属性
  const {
    settingVisible,
  } = app
  const {
    autoGenerate,
  } = maps

  // 定义方法
  const checkAutoGenerate = (e) => {
    const auto = e.target.checked
    dispatch({
      type: 'maps/setAutoGenerate',
      auto,
    })
  }

  // 定义属性
  const propsOfDrawer = {
    title: '系统设置',
    visible: settingVisible,
    width: 280,
    onClose: () => {
      dispatch({ type: 'app/showSetting', show: false })
    },
  }

  return (
    <Drawer {...propsOfDrawer}>
      <Divider orientation="left">敌方数据设置</Divider>
      <div className={les.card}>
        <Checkbox
          checked={autoGenerate}
          onChange={checkAutoGenerate}
        >自动加载地图</Checkbox>
        <Checkbox>显示效能</Checkbox>
      </div>

      <Divider orientation="left">后勤列表设置</Divider>
    </Drawer>
  )
}

export default DrawerSetting
