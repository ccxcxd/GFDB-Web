import React from 'react'
import { connect } from 'dva'
import les from './index.less'
import MapSelect from './components/mapSelect'
import MapCanvas from './components/mapCanvas'

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

  return (
    <div>
      {/* 选择地图 */}
      <MapSelect {...propsOfMapSelect} />
      {/* 地图显示 */}
      <MapCanvas />
    </div>
  )
}

export default connect(({ app, maps }) => ({ app, maps }))(Main)
