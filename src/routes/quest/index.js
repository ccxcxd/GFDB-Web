import React from 'react'
import { Table } from 'antd'
import les from './index.less'

const Main = () => {
  // 属性提取

  // 属性定义
  const columns = [
    {
      title: '后勤编号',
      dataIndex: 'code',
    },
    {
      title: '后勤名称',
      dataIndex: 'battleName',
    },
    {
      title: '任务时间(小时)',
      dataIndex: 'time',
    }
  ]
  const propsOfTable = {
    columns,
  }

  return (
    <div>
      <div className={les.table}>
        <Table {...propsOfTable} />
      </div>
    </div>
  )
}

export default Main
