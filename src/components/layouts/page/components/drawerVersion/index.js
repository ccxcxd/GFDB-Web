import React from 'react'
import {
  Drawer,
  Card,
} from 'antd'
import versionDB from '@/db/versionDB'
import les from './index.less'

const DrawerSetting = ({
  dispatch,
  app,
}) => {
  // 获取属性
  const {
    versionVisible,
  } = app

  // 遍历方法定义
  const mapContent = (ary) => {
    if (!ary || ary.length === 0) {
      return (
        <div>暂无版本信息</div>
      )
    }
    return ary.map(v => {
      return (
        <Card
          key={v.version}
          title={v.version}
          extra={v.date}
          className={les.card}
        >
          <div>
            <h4>{v.desc}</h4>
            <ul>
              {
                (v.details && v.details.length) ?
                v.details.map((d, key) => {
                  return (
                    <li key={key}>{d}</li>
                  )
                }) :
                null
              }
            </ul>
          </div>
        </Card>
      )
    })
  }

  // 定义属性
  const propsOfDrawer = {
    title: '版本信息',
    visible: versionVisible,
    width: 380,
    onClose: () => {
      dispatch({ type: 'app/showVersion', show: false })
    },
  }

  return (
    <Drawer {...propsOfDrawer}>
      {mapContent(versionDB)}
    </Drawer>
  )
}

export default DrawerSetting
