import React from 'react'
import { connect } from 'dva'
import {
  Select,
} from 'antd'
import les from './index.less'

const Option = Select.Option

const Main = ({
  app,
  maps,
}) =>{
  // 获取属性
  const {
    lang,
  } = app
  const {
    campaign = {},
  } = lang
  const {
    campaign_info,
  } = maps

  // 渲染方法定义
  const mapCampaignOPt = (ary) => {
    return ary.map(d => {
      let type_text
      switch (d.type) {
        case 0:
          type_text = campaign.main
          break;
        case 1:
          type_text = campaign.event
          break;
        case 2:
          type_text = campaign.simulation
          break;
        default:
          type_text = '？？'
      }
      return (
        <Option
          key={d.id}
          value={d.id}
        >{`${type_text} ${__(lang, d.name)}`}</Option>
      )
    })
  }

  return (
    <div>
      {/* 选择地图 */}
      <div className={les.row}>{lang.map_sel.label}:</div>
      <Select
        className={les.campaignSel}
      >
        {mapCampaignOPt(campaign_info)}
      </Select>
    </div>
  )
}

export default connect(({ app, maps }) => ({ app, maps }))(Main)
