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
  app,
  quest,
}) => {
  // 属性获取
  const {
    drawerPlanVisible,
  } = quest

  // 属性定义
  const propsOfDrawer = {
    title: __('logistic.supportPlan.resultModalName'),
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
    app,
    quest,
  }
  const propsOfFilterList = {
    dispatch,
    app,
    quest,
  }

  return (
    <Drawer {...propsOfDrawer}>
      <div>
        {/* 试算条件 */}
        <Condition {...propsOfCondition} />
        {/* 推荐后勤 */}
        <div className={les.title}>{__('logistic.supportPlan.recommendList')}</div>
        <CountList  {...propsOfCountList} />
        <br/>
        {/* 筛选结果 */}
        <div className={les.title}>{__('logistic.supportPlan.filterList')}</div>
        <FilterList {...propsOfFilterList} />
      </div>
    </Drawer>
  )
}

export default DrawerPlan
