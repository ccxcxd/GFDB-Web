import React from 'react'
import les from './index.less'
import QuestTable from './components/questTable'

const Main = () => {
  // 属性定义
  const propsOfTable = {}

  return (
    <div className={les.container}>
      <QuestTable {...propsOfTable} />
    </div>
  )
}

export default Main
