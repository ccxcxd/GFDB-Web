import React from 'react'
import {
  Table,
  Icon,
  List,
} from 'antd'
import { filter } from 'lodash'
import les from './index.less'
import {
  dealTime,
} from '@/utils/js/func'
import mDB from '@/db/mainDB'
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
    extraList,
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
      width: `${3 + basePad}em`,
      render: (val, record) => {
        const { id, campaign, name } = record
        return (
          <span className="codeLab">
            <div className="code">{`${campaign}-${id % 4 || 4}`}</div>
            <div className="battleName">{__(name)}</div>
          </span>
        )
      },
    },
    {
      title: __('logistic.columns.time'),
      dataIndex: 'duration',
      width: `${3 + basePad}em`,
      render: v => <div className={les.timeLab}>{dealTime(v)}</div>,
    },
    {
      title: __('item-10000501'),
      dataIndex: 'mp',
      width: `${5 + basePad}em`,
      ...filterRes('mp'),
      render: (val, rec) => resLab(val, rec[`mp_h`]),
    },
    {
      title: __('item-10000502'),
      dataIndex: 'ammo',
      width: `${5 + basePad}em`,
      ...filterRes('ammo'),
      render: (val, rec) => resLab(val, rec[`ammo_h`]),
    },
    {
      title: __('item-10000503'),
      dataIndex: 'mre',
      width: `${5 + basePad}em`,
      ...filterRes('mre'),
      render: (val, rec) => resLab(val, rec[`mre_h`]),
    },
    {
      title: __('item-10000504'),
      dataIndex: 'part',
      width: `${5 + basePad}em`,
      ...filterRes('part'),
      render: (val, rec) => resLab(val, rec[`part_h`]),
    },
    {
      title: __('logistic.columns.extra'),
      width: `${4 + 1.4 + basePad}em`,
      dataIndex: 'item_list',
      filterIcon: <Icon type="down-square-o" />,
      filterDropdown: () => (
        <List
          size='small'
          header={__('logistic.columns.filterExtraYieldDescend')}
          bordered
          className={les.filterExtraCon}
          dataSource={extraList}
          renderItem={({ id, item_name }) => {
            return (
              <List.Item
                onClick={() => dealExtraSort(id)}
                className={`${filters.extra === id ? les.active : ''}`}
              ><Icon type="check" className={les.check} />{__(item_name)}</List.Item>
            )
          }}
        />
      ),
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
    {
      title: __('logistic.columns.total'),
      dataIndex: 'total',
      // width: `${__('logistic.columns.total').length + 1.4 + basePad}em`,
      sorter: true,
      render: (val) => {
        return (
          <div className={les.totalLab}>{val}</div>
        )
      }
    },
  ]
  const propsOfTable = {
    ...tableProps,
    columns,
    dataSource: list,
    rowKey: 'id',
    className: `responsive-table ${les.table}`,
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
