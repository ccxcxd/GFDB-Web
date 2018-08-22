import React from 'react'
import les from './index.less'
import qDB from '@/db/questDB'
import { find } from 'lodash'
import { ExtraItem } from '@/components/item'

const {
  extra,
  resource,
} = qDB

const ConditionLab = ({
  dispatch,
  quest,
}) => {
  // 获取变量
  const {
    planCondition,
  } = quest

  // 遍历方法定义
  const mapRes = (ary) => {
    return ary.map(d => {
      return (
        <span key={d}>{find(resource, r => r.name === d).label}</span>
      )
    })
  }
  const mapExtra = (ary) => {
    return ary.map(d => {
      const ext = find(extra, e => e._id === d)
      return (
        <ExtraItem
          key={d}
          icon={ext.icon}
          label={ext.name}
        />
      )
    })
  }
  const showNothing = () => {
    return (
      <div>暂无选择</div>
    )
  }

  return (
    <div>
      <div className={les.condition}>
        <div className={`${les.item} ${les.timeLab}`}>
          <div className={les.title}>后勤总时长：</div>
          <div className={les.text}>
          <span className={les.timeTxt}>{planCondition.hour}</span>时<span className={les.timeTxt}>{planCondition.min}</span>分</div>
        </div>
        <div className={`${les.item} ${les.resLab}`}>
          <div className={les.title}>需求资源：</div>
          <div className={les.text}>
            {
              (planCondition.resource && planCondition.resource.length) ?
              mapRes(planCondition.resource) :
              showNothing()
            }
          </div>
        </div>
        <div className={`${les.item} ${les.extLab}`}>
          <div className={les.title}>需求道具：</div>
          <div className={les.text}>
            {
              (planCondition.extra && planCondition.extra.length) ?
              mapExtra(planCondition.extra) :
              showNothing()
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConditionLab
