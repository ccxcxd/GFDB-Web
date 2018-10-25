import React from 'react'
import {
  Table,
} from 'antd'
import { filter } from 'lodash'
import les from '../questTable/index.less'
import {
  dealTime,
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
  const resLab = (val, val_h) => {
    return (
      <div className={les.resLab}>
        <div className={`${les.total} ${(filters.resource && filters.resource.type === 'total') ? les.active : ''}`}>{val}</div>
        {/* 每小时量 */}
        <div className={`${les.hours} ${(filters.resource && filters.resource.type === 'times') ? les.active : ''}`}>{val_h.toFixed(2)}/h</div>
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
      width: `${5 + basePad}em`,
      render: (val, rec) => resLab(val, rec[`mp_h`]),
    },
    {
      title: __('logistic.ammunition'),
      dataIndex: 'ammo',
      width: `${5 + basePad}em`,
      render: (val, rec) => resLab(val, rec[`ammo_h`]),
    },
    {
      title: __('logistic.rations'),
      dataIndex: 'mre',
      width: `${5 + basePad}em`,
      render: (val, rec) => resLab(val, rec[`mre_h`]),
    },
    {
      title: __('logistic.sparePart'),
      dataIndex: 'part',
      width: `${5 + basePad}em`,
      render: (val, rec) => resLab(val, rec[`part_h`]),
    },
    {
      title: __('logistic.columns.total'),
      dataIndex: 'total',
      width: 90,
      render: (val) => {
        return (
          <div className={les.totalLab}>{val}</div>
        )
      }
    },
    {
      title: __('logistic.columns.extra'),
      dataIndex: 'item_list',
      render: (val) => {
        const realList = filter(mDB.item_info, d => val.indexOf(parseInt(d.id, 10)) !== -1)
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
    dataSource: planFilterList,
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

export default QuestTable
