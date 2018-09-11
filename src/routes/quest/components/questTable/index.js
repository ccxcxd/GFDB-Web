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
    clientType,
    clientWidth,
    tableProps,
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
  const basePad = clientType === 'web' ? 4 : 1.5
  const filterResData = [
    {
      text: __('logistic.columns.filterTotalDescend'),
      value: 'total',
    },
    {
      text: __('logistic.columns.filterYieldDescend'),
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
      title: __('logistic.columns.code'),
      dataIndex: 'code',
      fixed: 'left',
      width: `${__('logistic.columns.code').length + basePad}em`,
      render: (val, record) => {
        const { code, name } = record
        return (
          <span className="codeLab">
            <div className="code">{code}</div>
            <div className="battleName">{__(name)}</div>
          </span>
        )
      },
    },
    {
      title: __('logistic.columns.time'),
      dataIndex: 'time',
      fixed: 'left',
      width: `${__('logistic.columns.time').length + basePad}em`,
      render: v => <div className={les.timeLab}>{dealTime(v)}</div>,
    },
    {
      title: __('logistic.manpower'),
      dataIndex: 'manpower',
      width: `${5 + basePad}em`,
      ...filterRes('manpower'),
      render: resLab,
    },
    {
      title: __('logistic.ammunition'),
      dataIndex: 'ammunition',
      width: `${5 + basePad}em`,
      ...filterRes('ammunition'),
      render: resLab,
    },
    {
      title: __('logistic.rations'),
      dataIndex: 'rations',
      width: `${5 + basePad}em`,
      ...filterRes('rations'),
      render: resLab,
    },
    {
      title: __('logistic.sparePart'),
      dataIndex: 'sparePart',
      width: `${5 + basePad}em`,
      ...filterRes('sparePart'),
      render: resLab,
    },
    {
      title: __('logistic.columns.total'),
      dataIndex: 'total',
      width: `${__('logistic.columns.total').length + 1.4 + basePad}em`,
      sorter: true,
      render: (val, record) => {
        const { manpower, ammunition, rations, sparePart } = record
        return (
          <div className={les.totalLab}>{sum([manpower, ammunition, rations, sparePart])}</div>
        )
      }
    },
    {
      title: __('logistic.columns.extra'),
      width: `${__('logistic.columns.extra').length + 1.4 + basePad}em`,
      dataIndex: 'extra',
      filterIcon: <Icon type="down-square-o" />,
      // filters: qDB.extra.map(d => {
      //   return { text: d.name, value: d._id }
      // }),
      filterDropdown: () => (
        <List
          size='small'
          header={__('logistic.columns.filterExtraYieldDescend')}
          bordered
          className={les.filterExtraCon}
          dataSource={qDB.extra}
          renderItem={({ _id, name }) => {
            return (
              <List.Item
                onClick={() => dealExtraSort(_id)}
                className={`${filters.extra === _id ? les.active : ''}`}
              ><Icon type="check" className={les.check} />{__(name)}</List.Item>
            )
          }}
        />
      ),
      render: (val) => {
        return val.map(d => {
          return (
            <ExtraItem key={d._id} icon={d.icon} label={__(d.name)} />
          )
        })
      },
    },
    {
      title: __('logistic.columns.teamRequire'),
      dataIndex: 'teamRequire',
      render: (val, record) => {
        const { captainLevel, requiredPeople } = record
        return (
          <div className={les.teamReq}>
            <div>
              <span className={les.title}>{__('logistic.columns.captainLevel')}：</span>
              {captainLevel}
            </div>
            <div>
              <span className={les.title}>{__('logistic.columns.captainNumber')}：</span>
              {requiredPeople}
            </div>
          </div>
        )
      },
    },
  ]
  const propsOfTable = {
    ...tableProps,
    columns,
    dataSource: list,
    rowKey: 'code',
    className: `responsive-table ${les.table}`,
    scroll: {
      x: clientType === 'web' ?
      0 :
      clientWidth - 16,
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
