import React from 'react'
import {
  Select,
} from 'antd'
import { forEach } from 'lodash'
import les from './index.less'

const Option = Select.Option

const MapSelect = ({
  dispatch,
  maps,
}) => {
  // 获取属性
  const {
    campaign_info,
    mission_info,
    campaignSelected,
    missionSelected,
  } = maps

  // 方法定义
  const campaignSelect = (id) => {
    dispatch({
      type: 'maps/selectCampaign',
      payload: campaign_info[id],
    })
  }
  const mapTargetSelect = (id) => {
    dispatch({
      type: 'maps/selectMisson',
      payload: mission_info[id],
    })
  }

  // 渲染方法定义
  const mapCampaignOpt = (obj) => {
    const childrens = []
    forEach(obj, (v, k) => {
      let type_text
      switch (v.type) {
        case 0:
          type_text = __('campaign.main')
          break;
        case 1:
          type_text = __('campaign.event')
          break;
        case 2:
          type_text = __('campaign.simulation')
          break;
        default:
          type_text = '？？'
      }
      childrens.push(
        <Option
          key={v.id}
          value={v.id}
        >{`${type_text} ${__(v.name)}`}</Option>
      )
    })
    return childrens
  }
  const mapMapOpt = (obj) => {
    const childrens = []
    forEach(obj, (v) => {
      const mission = mission_info[v]
      childrens.push(
        <Option
          key={mission.id}
          value={mission.id}
        >
          {`${mission.index_text} ${__(mission.name)}`}
        </Option>
      )
    })
    return childrens
  }

  return (
    <div>
      {/* 选择地图 */}
      <div className={les.title}>{__('map_sel.label')}:</div>
      {/* 选择章节 */}
      <div className={les.selCon}>
        <Select
          className={les.sel}
          onSelect={campaignSelect}
          value={campaignSelected.id}
        >
          {mapCampaignOpt(campaign_info)}
        </Select>
        {/* 选择地图 */}
        <Select
          className={les.sel}
          onSelect={mapTargetSelect}
          value={missionSelected.id}
        >
          {mapMapOpt(campaignSelected.mission_ids)}
        </Select>
      </div>
    </div>
  )
}

export default MapSelect
