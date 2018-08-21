import React from 'react'
import { connect } from 'dva'
import les from './index.less'
import QuestTable from './components/questTable'

const Main = ({
  dispatch,
  loading,
  quest,
}) => {
  // 属性定义
  const propsOfTable = {
    dispatch,
    loading,
    quest,
  }

  return (
    <div className={les.container}>
      <QuestTable {...propsOfTable} />
    </div>
  )
}

export default connect(({ loading, quest }) => ({ loading, quest }))(Main)
