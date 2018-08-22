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

const QuestTable = ({
  dispatch,
  loading,
  quest,
}) => {
  // 属性提取
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
      render: (val, record) => {
        const { code, battleName } = record
        return (
          <span className="codeLab">
            <div className="battleName hidden-xs">{battleName}</div>
            <div className="code">{code}</div>
          </span>
        )
      },
    },
    {
      title: '后勤名称',
      dataIndex: 'name',
    },
    {
      title: '任务时间(小时)',
      dataIndex: 'time',
      render: v => <div className={les.timeLab}>{dealTime(v)}</div>,
    },
    {
      title: '人力',
      dataIndex: 'manpower',
      render: resLab,
    },
    {
      title: '弹药',
      dataIndex: 'ammunition',
      render: resLab,
    },
    {
      title: '口粮',
      dataIndex: 'rations',
      render: resLab,
    },
    {
      title: '零件',
      dataIndex: 'sparePart',
      render: resLab,
    },
    {
      title: '资源总值',
      dataIndex: 'total',
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
    {
      title: '队伍要求',
      dataIndex: 'captainLevel',
      render: (val, record) => {
        const { captainLevel, requiredPeople } = record
        return (
          <div className={les.teamReq}>
            <div>
              <span className={les.title}>队长等级：</span>
              {captainLevel}
            </div>
            <div>
              <span className={les.title}>队伍人数：</span>
              {requiredPeople}
            </div>
          </div>
        )
      },
    },
  ]
  const propsOfTable = {
    columns,
    dataSource: planFilterList,
    rowKey: 'code',
    className: les.table,
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
