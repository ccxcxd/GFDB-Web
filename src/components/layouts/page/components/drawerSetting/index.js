import React from 'react'
import {
  Checkbox,
  Divider,
  Drawer,
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
    displayPower,
  } = maps

  // 定义方法
  const checkAutoGenerate = () => {
    dispatch({
      type: 'maps/setAutoGenerate',
      auto: !autoGenerate,
    })
  }
  const setDisplayPower = () => {
    dispatch({
      type: 'maps/setDisplayPower',
      display: !displayPower,
    })
  }

  // 定义属性
  const propsOfDrawer = {
    title: __('setting.title'),
    visible: settingVisible,
    width: 280,
    onClose: () => {
      dispatch({ type: 'app/showSetting', show: false })
    },
  }

  return (
    <Drawer {...propsOfDrawer}>
      <Divider orientation="left">{__('setting.enemy_data_setting')}</Divider>
      <div className={les.card}>
        <Checkbox
          checked={autoGenerate}
          onChange={checkAutoGenerate}
        >{__('mission_map.auto_generate')}</Checkbox>
        <Checkbox
          checked={!displayPower}
          onChange={setDisplayPower}
        >{__('mission_map.power_display_hide')}</Checkbox>
      </div>

      <Divider orientation="left">{__('setting.quest_list_setting')}</Divider>
    </Drawer>
  )
}

export default DrawerSetting
