import React from 'react'
import { connect } from 'dva'
import {
  Button,
} from 'antd'
import les from './index.less'
import QuestTable from './components/questTable'
import ModalPlan from './components/modalPlan'
import DrawerPlan from './components/drawerPlan'

const Main = ({
  dispatch,
  loading,
  app,
  quest,
}) => {
  // 方法定义
  const onPlanClick = () => {
    dispatch({ type: 'quest/showModalPlan', show: true })
  }

  // 属性定义
  const propsOfTable = {
    dispatch,
    loading,
    app,
    quest,
  }
  const propsOfModalPlan = {
    dispatch,
    loading,
    quest,
  }
  const propsOfDrawerPlan = {
    dispatch,
    loading,
    quest,
  }

  return (
    <div className={les.container}>
      <div className={les.btnArea}>
        <Button
          type="primary"
          onClick={onPlanClick}
        >一键咸鱼</Button>
        {/* 筹划弹窗 */}
        <ModalPlan {...propsOfModalPlan} />
        {/* 试算结果弹窗 */}
        <DrawerPlan {...propsOfDrawerPlan} />
      </div>
      <QuestTable {...propsOfTable} />
    </div>
  )
}

export default connect(({ loading, app, quest }) => ({ loading, app, quest }))(Main)
