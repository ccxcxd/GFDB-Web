import React from 'react'
import { connect } from 'dva'
import les from './index.less'
import MapSelect from './components/mapSelect'
import MapCanvas from './components/mapCanvas'
import MapTable from './components/mapTable'
import TeamTable from './components/teamTable'

const Main = ({
  dispatch,
  maps,
}) =>{
  // 获取属性

  // 属性定义
  const propsOfMapSelect = {
    dispatch,
    maps,
  }
  const propsOfMapTable = {
    dispatch,
    maps,
  }
  const propsOfTeamTable = {
    maps,
  }

  return (
    <div className={les.container}>
      {/* 选择地图 */}
      <MapSelect {...propsOfMapSelect} />
      {/* 地图显示 */}
      <MapCanvas />
      {/* 敌方队伍信息 */}
      <MapTable {...propsOfMapTable} />
      {/* 队伍详情信息 */}
      <TeamTable {...propsOfTeamTable} />
    </div>
  )
}

export default connect(({ app, maps }) => ({ app, maps }))(Main)
