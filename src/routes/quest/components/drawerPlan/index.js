import React from 'react'
import {
  Drawer,
} from 'antd'
import les from './index.less'
import Condition from './components/condition'
import CountList from './countList'
import FilterList from './filterList'

const DrawerPlan = ({
  dispatch,
  quest,
}) => {
  // 属性获取
  const {
    drawerPlanVisible,
  } = quest

  // 属性定义
  const propsOfDrawer = {
    title: '试算结果',
    visible: drawerPlanVisible,
    width: '80%',
    placement: 'right',
    onClose: () => {
      dispatch({ type: 'quest/showDrawerPlan', show: false })
    },
  }
  const propsOfCondition = {
    dispatch,
    quest,
  }
  const propsOfCountList = {
    dispatch,
    quest,
  }
  const propsOfFilterList = {
    dispatch,
    quest,
  }

  return (
    <Drawer {...propsOfDrawer}>
      <div>
        {/* 试算条件 */}
        <Condition {...propsOfCondition} />
        {/* 推荐后勤 */}
        <div className={les.title}>推荐后勤</div>
        <CountList  {...propsOfCountList} />
        <br/>
        {/* 筛选结果 */}
        <div className={les.title}>筛选列表</div>
        <FilterList {...propsOfFilterList} />
      </div>
    </Drawer>
  )
}

export default DrawerPlan
