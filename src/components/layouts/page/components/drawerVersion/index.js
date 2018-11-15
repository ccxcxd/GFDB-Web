import React from 'react'
import {
  Drawer,
  Card,
} from 'antd'
import { findIndex } from 'lodash'
import versionDB from '@/db/versionDB'
import les from './index.less'

const DrawerSetting = ({
  dispatch,
  app,
}) => {
  // 获取属性
  const {
    versionVisible,
    versionStoraged,
  } = app

  // 方法定义
  const compareVersion = (storaged, target) => {
    if (storaged) {
      const stoIdx = findIndex(versionDB, d => d.version === storaged)
      const tarIdx = findIndex(versionDB, d => d.version === target)
      return stoIdx > tarIdx
    }
    return true
  }

  // 遍历方法定义
  const mapContent = (ary) => {
    if (!ary || ary.length === 0) {
      return (
        <div>{__('version.no_message')}</div>
      )
    }
    return ary.map(v => {
      const ifNewVersion = compareVersion(versionStoraged, v.version)
      return (
        <Card
          key={v.version}
          title={(
            <div className={les.titleContent}>
              <div className={les.title}>{v.version}</div>
              {ifNewVersion ? <span className={les.new}>new!</span> : null}
            </div>
          )}
          extra={v.date}
          className={`${les.card} ${ifNewVersion ? les.active : ''}`}
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
    title: __('version.title'),
    visible: versionVisible,
    width: 380,
    onClose: () => {
      dispatch({ type: 'app/showVersion', show: false })
      dispatch({ type: 'app/updateVersion', payload: versionDB[0]['version'] })
    },
  }

  return (
    <Drawer {...propsOfDrawer}>
      {mapContent(versionDB)}
    </Drawer>
  )
}

export default DrawerSetting
