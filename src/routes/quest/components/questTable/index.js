import React from 'react'
import { Table } from 'antd'
import qDB from '@/db/questDB'
import les from './index.less'

const {
  quest: QUEST,
} = qDB

const QuestTable = () => {
  // 属性提取

  // 方法定义
  // 将分钟数值转为字符时间表示
  const dealTime = function (getMin) {
    const hour = parseInt(getMin / 60, 10)
    let hourText = '' + hour
    const min = getMin % 60
    let minText = '' + min
    if (hour < 1) {
      hourText = '00'
    } else if (hour < 10) {
      hourText = '0' + hour
    }
    if (min < 10) {
      minText = '0' + min
    }
    return hourText + ':' + minText
  }
  // 计算每小时产量
  const dealHours = function (total, time) {
    return ((total * 60) / time).toFixed(2)
  }

  // 渲染方法定义
  const resLab = (val, record) => {
    const { time } = record
    return (
      <div>
        <div className="total">{val}</div>
        <div className="line"></div>
        {/* 每小时量 */}
        <div className="hours">{dealHours(val, time)}/h</div>
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
    },
    {
      title: '额外道具',
      dataIndex: 'extra',
      render: (val) => {
        return val.map(d => {
          return (
            <div
              className="ex-item"
              key={d._id}
            >
              <img className="icon hidden-xs" src={ `${d.icon}` } />
              <span className="text">{ d.name}</span>
            </div>
          )
        })
      },
    },
    {
      title: '队长等级',
      dataIndex: 'captainLevel',
    },
    {
      title: '所需人数',
      dataIndex: 'requiredPeople',
    },
  ]
  const propsOfTable = {
    columns,
    dataSource: QUEST,
    rowKey: 'code',
    className: les.table,
    pagination: false,
  }

  return (
    <div className={les.table}>
      <Table {...propsOfTable} />
    </div>
  )
}

export default QuestTable
