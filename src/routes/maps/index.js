import React from 'react'
import { connect } from 'dva'
import {
  Skeleton,
} from 'antd'
import les from './index.less'
import MapSelect from './components/mapSelect'
import MapCanvas from './components/mapCanvas'
import MapTable from './components/mapTable'
import TeamTable from './components/teamTable'

const Main = ({
  dispatch,
  app,
  maps,
}) =>{
  // 获取属性
  const {
    ifDBInit,
  } = app

  // 属性定义
  const propsOfMapSelect = {
    dispatch,
    app,
    maps,
  }
  const propsOfMapCanvas = {
    dispatch,
    app,
    maps,
  }
  const propsOfMapTable = {
    dispatch,
    app,
    maps,
  }
  const propsOfTeamTable = {
    app,
    maps,
  }

  return (
    <Skeleton active loading={!ifDBInit}>
      <div className={les.container}>
        {/* 选择地图 */}
        <MapSelect {...propsOfMapSelect} />
        {/* 地图显示 */}
        <MapCanvas {...propsOfMapCanvas} />
        {/* 敌方队伍信息 */}
        <MapTable {...propsOfMapTable} />
        {/* 队伍详情信息 */}
        <TeamTable {...propsOfTeamTable} />
      </div>
    </Skeleton>
  )
}

export default connect(({ app, maps }) => ({ app, maps }))(Main)
