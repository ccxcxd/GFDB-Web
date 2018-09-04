import React from 'react'
import {
  Table,
} from 'antd'
import { sum } from 'lodash'
import les from '../questTable/index.less'
import {
  dealTime,
  dealHours,
} from '@/utils/js/func'
import { ExtraItem } from '@/components/item'
import lesMine from './index.less'

const QuestTable = ({
  dispatch,
  loading,
  app,
  quest,
}) => {
  // 属性提取
  const {
    clientType,
    clientWidth,
    tableProps,
  } = app
  const {
    planFilterList,
    filters,
  } = quest

  // 方法定义
  
  // 渲染方法定义
  const resLab = (val, record) => {
    const { time } = record
    return (
      <div className={les.resLab}>
        <div className={`${les.total} ${(filters.resource && filters.resource.type === 'total') ? les.active : ''}`}>{val}</div>
        {/* 每小时量 */}
        <div className={`${les.hours} ${(filters.resource && filters.resource.type === 'times') ? les.active : ''}`}>{dealHours(val, time)}/h</div>
      </div>
    )
  }

  // 属性定义
  const columns = [
    {
      title: '后勤编号',
      dataIndex: 'code',
      fixed: 'left',
      width: 100,
    },
    {
      title: '任务时间',
      dataIndex: 'time',
      width: 100,
      render: v => <div className={les.timeLab}>{dealTime(v)}</div>,
    },
    {
      title: '人力',
      dataIndex: 'manpower',
      width: 90,
      render: resLab,
    },
    {
      title: '弹药',
      dataIndex: 'ammunition',
      width: 90,
      render: resLab,
    },
    {
      title: '口粮',
      dataIndex: 'rations',
      width: 90,
      render: resLab,
    },
    {
      title: '零件',
      dataIndex: 'sparePart',
      width: 90,
      render: resLab,
    },
    {
      title: '资源总值',
      dataIndex: 'total',
      width: 90,
      render: (val, record) => {
        const { manpower, ammunition, rations, sparePart } = record
        return (
          <div className={les.totalLab}>{sum([manpower, ammunition, rations, sparePart])}</div>
        )
      }
    },
    {
      title: '额外道具',
      dataIndex: 'extra',
      render: (val) => {
        return val.map(d => {
          return (
            <ExtraItem
              key={d._id}
              icon={d.icon}
              label={d.name}
            />
          )
        })
      },
    },
  ]
  const propsOfTable = {
    ...tableProps,
    columns,
    dataSource: planFilterList,
    rowKey: 'code',
    className: `${les.table} ${lesMine.resizeTable}`,
    scroll: {
      x: clientType === 'web' ?
      0 :
      clientWidth - 16,
      y: 300,
    },
    pagination: false,
    // loading: loading.effects['quest/countQuest'],
    // loading: true,
  }

  return (
    <div>
      <Table {...propsOfTable} />
    </div>
  )
}

export default QuestTable
