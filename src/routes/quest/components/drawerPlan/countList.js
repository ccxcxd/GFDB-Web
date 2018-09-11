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

const CountList = ({
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
    planCountList,
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
  const basePad = clientType === 'web' ? 4 : 1.5
  const columns = [
    {
      title: __('logistic.columns.code'),
      dataIndex: 'code',
      fixed: 'left',
      width: `${__('logistic.columns.code').length + basePad}em`,
      // render: (val, record) => {
      //   const { code, battleName } = record
      //   return (
      //     <span className="codeLab">
      //       <div className="battleName hidden-xs">{battleName}</div>
      //       <div className="code">{code}</div>
      //     </span>
      //   )
      // },
    },
    {
      title: __('logistic.columns.time'),
      dataIndex: 'time',
      width: `${__('logistic.columns.time').length + basePad}em`,
      render: v => <div className={les.timeLab}>{dealTime(v)}</div>,
    },
    {
      title: __('logistic.manpower'),
      dataIndex: 'manpower',
      width: `${3 + basePad}em`,
      render: resLab,
    },
    {
      title: __('logistic.ammunition'),
      dataIndex: 'ammunition',
      width: `${3 + basePad}em`,
      render: resLab,
    },
    {
      title: __('logistic.rations'),
      dataIndex: 'rations',
      width: `${3 + basePad}em`,
      render: resLab,
    },
    {
      title: __('logistic.sparePart'),
      dataIndex: 'sparePart',
      width: `${3 + basePad}em`,
      render: resLab,
    },
    {
      title: __('logistic.columns.total'),
      dataIndex: 'total',
      width: `${__('logistic.columns.total').length + 1.4 + basePad}em`,
      render: (val, record) => {
        const { manpower, ammunition, rations, sparePart } = record
        return (
          <div className={les.totalLab}>{sum([manpower, ammunition, rations, sparePart])}</div>
        )
      }
    },
    {
      title: __('logistic.columns.extra'),
      dataIndex: 'extra',
      render: (val) => {
        return val.map(d => {
          return (
            <ExtraItem
              key={d._id}
              icon={d.icon}
              label={__(d.name)}
            />
          )
        })
      },
    },
  ]
  const propsOfTable = {
    ...tableProps,
    columns,
    dataSource: planCountList,
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

export default CountList
