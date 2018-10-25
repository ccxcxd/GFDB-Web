import React from 'react'
import {
  Table,
} from 'antd'
import { sum, remove, filter } from 'lodash'
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
    const { duration } = record
    return (
      <div className={les.resLab}>
        <div className={`${les.total} ${(filters.resource && filters.resource.type === 'total') ? les.active : ''}`}>{val}</div>
        {/* 每小时量 */}
        <div className={`${les.hours} ${(filters.resource && filters.resource.type === 'times') ? les.active : ''}`}>{dealHours(val, duration)}/h</div>
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
      render: (val, record) => {
        const { id, campaign } = record
        return (
          <div className="code">{`${campaign}-${id % 4 || 4}`}</div>
        )
      },
    },
    {
      title: __('logistic.columns.time'),
      dataIndex: 'duration',
      width: `${__('logistic.columns.time').length + basePad}em`,
      render: v => <div className={les.timeLab}>{dealTime(v)}</div>,
    },
    {
      title: __('logistic.manpower'),
      dataIndex: 'mp',
      width: `${3 + basePad}em`,
      render: resLab,
    },
    {
      title: __('logistic.ammunition'),
      dataIndex: 'ammo',
      width: `${3 + basePad}em`,
      render: resLab,
    },
    {
      title: __('logistic.rations'),
      dataIndex: 'mre',
      width: `${3 + basePad}em`,
      render: resLab,
    },
    {
      title: __('logistic.sparePart'),
      dataIndex: 'part',
      width: `${3 + basePad}em`,
      render: resLab,
    },
    {
      title: __('logistic.columns.total'),
      dataIndex: 'total',
      width: `${__('logistic.columns.total').length + 1.4 + basePad}em`,
      render: (val, record) => {
        const { mp, ammo, mre, part } = record
        return (
          <div className={les.totalLab}>{sum([
            parseInt(mp, 10), parseInt(ammo, 10), parseInt(mre, 10), parseInt(part, 10)
          ])}</div>
        )
      }
    },
    {
      title: __('logistic.columns.extra'),
      dataIndex: 'item_pool',
      render: (val) => {
        const list = val.split(',')
        remove(list, d => d === '0')
        const realList = filter(mDB.item_info, d => list.indexOf(d.id) !== -1)
        return realList.map(d => {
          return (
            <ExtraItem
              key={d.id}
              icon={d.code}
              label={__(d.item_name)}
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
    rowKey: 'id',
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
