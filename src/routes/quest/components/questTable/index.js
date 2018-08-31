import React from 'react'
import {
  Table,
  Icon,
  List,
} from 'antd'
import { sum } from 'lodash'
import les from './index.less'
import {
  dealTime,
  dealHours,
} from '@/utils/js/func'
import qDB from '@/db/questDB'
import { ExtraItem } from '@/components/item'

const QuestTable = ({
  dispatch,
  loading,
  app,
  quest,
}) => {
  // 属性提取
  const {
    maxWidth,
    clientWidth,
  } = app
  const {
    list,
    filters,
  } = quest

  // 方法定义
  // 处理表单校验和筛选
  const dealTableChange = (pagination, filters, sorter) => {
    // console.log(pagination)
    // console.log(filters)
    // console.log(sorter)
    // filters sorter 互斥,二取其一
    dispatch({
      type: 'quest/filterList',
      payload: filters,
    })
    dispatch({
      type: 'quest/sorterList',
      payload: sorter,
    })
  }
  // 处理资源产率排序
  const dealResSort = (key, type) => {
    const obj = { resource: { key, type } }
    dealTableChange({}, obj, {})
  }
  // 处理额外道具产能排序
  const dealExtraSort = (_id) => {
    const obj = { extra: _id }
    dealTableChange({}, obj, {})
  }

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
  const filterResData = [
    {
      text: '总量降序',
      value: 'total',
    },
    {
      text: '时量降序',
      value: 'times',
    },
  ]
  const filterRes = (key) => {
    return {
      filterIcon: <Icon type="down-square-o" />,
      filterDropdown: () => (
        <List
          size='small'
          bordered
          className={les.filterListCon}
          dataSource={filterResData}
          renderItem={({ text, value }) => {
            return (
              <List.Item
                onClick={() => dealResSort(key, value)}
                className={`${(filters.resource && filters.resource.key === key && filters.resource.type === value) ? les.active : ''}`}
              ><Icon type="check" className={les.check} />{text}</List.Item>
            )
          }}
        />
      ),
    }
  }
  const columns = [
    {
      title: '后勤编号',
      dataIndex: 'code',
      fixed: 'left',
      width: 120,
      sorter: true,
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
      sorter: true,
      render: v => <div className={les.timeLab}>{dealTime(v)}</div>,
    },
    {
      title: '人力',
      dataIndex: 'manpower',
      ...filterRes('manpower'),
      render: resLab,
    },
    {
      title: '弹药',
      dataIndex: 'ammunition',
      ...filterRes('ammunition'),
      render: resLab,
    },
    {
      title: '口粮',
      dataIndex: 'rations',
      ...filterRes('rations'),
      render: resLab,
    },
    {
      title: '零件',
      dataIndex: 'sparePart',
      ...filterRes('sparePart'),
      render: resLab,
    },
    {
      title: '资源总值',
      dataIndex: 'total',
      sorter: true,
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
      filterIcon: <Icon type="down-square-o" />,
      // filters: qDB.extra.map(d => {
      //   return { text: d.name, value: d._id }
      // }),
      filterDropdown: () => (
        <List
          size='small'
          header="按产能效率排序"
          bordered
          className={les.filterExtraCon}
          dataSource={qDB.extra}
          renderItem={({ _id, name }) => {
            return (
              <List.Item
                onClick={() => dealExtraSort(_id)}
                className={`${filters.extra === _id ? les.active : ''}`}
              ><Icon type="check" className={les.check} />{name}</List.Item>
            )
          }}
        />
      ),
      render: (val) => {
        return val.map(d => {
          return (
            <ExtraItem key={d._id} icon={d.icon} label={d.name} />
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
    dataSource: list,
    rowKey: 'code',
    className: `responsive-table ${les.table}`,
    scroll: {
      x: clientWidth < maxWidth ?
        clientWidth - 16 :
        0,
      y: document.body.clientHeight - 236,
    },
    pagination: false,
    onChange: dealTableChange,
    loading: loading.effects['quest/sorterList'],
    // loading: true,
  }

  return (
    <div className={les.table}>
      <Table {...propsOfTable} />
    </div>
  )
}

export default QuestTable
