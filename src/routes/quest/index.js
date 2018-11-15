import React from 'react'
import { connect } from 'dva'
import les from './index.less'
import BtnLab from './components/btnLab'
import QuestTable from './components/questTable'
import ModalPlan from './components/modalPlan'
import DrawerPlan from './components/drawerPlan'

const Main = ({
  dispatch,
  loading,
  app,
  quest,
}) => {
  // 属性定义
  const propsOfBtnLab = {
    dispatch,
  }
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
    app,
    quest,
  }

  return (
    <div className={les.container}>
      {/* 操作按键栏 */}
      <BtnLab {...propsOfBtnLab} />
      {/* 筹划弹窗 */}
      <ModalPlan {...propsOfModalPlan} />
      {/* 试算结果弹窗 */}
      <DrawerPlan {...propsOfDrawerPlan} />
      {/* 后勤表格 */}
      <QuestTable {...propsOfTable} />
    </div>
  )
}

export default connect(({ loading, app, quest }) => ({ loading, app, quest }))(Main)
