import React from 'react'
import les from './index.less'
import mDB from '@/db/mainDB'
import { find } from 'lodash'
import { ExtraItem } from '@/components/item'

const ConditionLab = ({
  dispatch,
  quest,
}) => {
  // 获取变量
  const {
    planCondition,
    resourceList,
    extraList,
  } = quest

  // 遍历方法定义
  const mapRes = (ary) => {
    return ary.map(d => {
      return (
        <span key={d}>{__(find(resourceList, r => r.code === d).item_name)}</span>
      )
    })
  }
  const mapExtra = (ary) => {
    return ary.map(d => {
      const ext = find(extraList, e => e.id === d)
      return (
        <ExtraItem
          key={d}
          icon={ext.code}
          label={__(ext.item_name)}
        />
      )
    })
  }
  const showNothing = () => {
    return (
      <div>{__('logistic.supportPlan.noSelect')}</div>
    )
  }

  return (
    <div>
      <div className={les.condition}>
        <div className={`${les.item} ${les.timeLab}`}>
          <div className={les.title}>{__('logistic.supportPlan.totalTimeLab')}：</div>
          <div className={les.text}>
          <span className={les.timeTxt}>{planCondition.hour}</span>H<span className={les.timeTxt}>{planCondition.min}</span>M</div>
        </div>
        <div className={`${les.item} ${les.resLab}`}>
          <div className={les.title}>{__('logistic.supportPlan.needResLab')}：</div>
          <div className={les.text}>
            {
              (planCondition.resource && planCondition.resource.length) ?
              mapRes(planCondition.resource) :
              showNothing()
            }
          </div>
        </div>
        <div className={`${les.item} ${les.extLab}`}>
          <div className={les.title}>{__('logistic.supportPlan.needExtraLab')}：</div>
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
