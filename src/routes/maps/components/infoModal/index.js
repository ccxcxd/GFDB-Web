import React from 'react'
import {
  Modal,
} from 'antd'
import les from './index.less'

const replaceTxt = (txt, ...args) => {
  if (!txt) {
    return ''
  }
  let resTxt = txt
  for (let i = 1; i <= args.length; i += 1) {
    const regex = new RegExp(`\\$${i}`, 'g')
    resTxt = resTxt.replace(regex, args[i - 1])
  }
  return resTxt
}

const InfoModal = ({
  visible,
  data,
  onHide,
}) => {
  const propsOfModal = {
    title: __('map_info_tbl.modal_name'),
    visible,
    footer: false,
    onCancel: onHide,
  }
  const {
    mission,
  } = data

  // props definition
  const ifBaseShow = ["2", "3", "4", "8", "9", "10"].indexOf(mission.type) !== -1
  const ifModalShow = mission.has_medal_obj

  return (
    <Modal {...propsOfModal}>
      <div className={les.content}>
        {
          ifBaseShow &&
          <div className={les.baseMission}>
            <div className={les.title}>{__('map_info_tbl.base_mission_title')}</div>
            <div className={les.content}>
              {__(`map_info_tbl.type.${mission.type}`)}
            </div>
          </div>
        }
        {
          ifModalShow &&
          <div className={les.medalMission}>
            <div className={les.title}>{__('map_info_tbl.medal_mission_title')}</div>
            <div className={les.content}>
              <ul className={les.medalList}>
                <li
                  className={`${les.medalCon} ${les.gold}`}
                  dangerouslySetInnerHTML={{
                    __html: replaceTxt(__('map_info_tbl.medal_gold_txt'), mission.expect_turn, mission.expect_enemy_die_num)
                  }}
                />
                <li
                  className={`${les.medalCon} ${les.silver}`}
                  dangerouslySetInnerHTML={{
                    __html: replaceTxt(__('map_info_tbl.medal_silver_txt'), mission.expect_turn, mission.expect_enemy_die_num)
                  }}
                />
                <li
                  className={`${les.medalCon} ${les.copper}`}
                  dangerouslySetInnerHTML={{
                    __html: replaceTxt(__('map_info_tbl.medal_copper_txt'), mission.expect_turn, mission.expect_enemy_die_num)
                  }}
                />
              </ul>
            </div>
          </div>
        }
      </div>
    </Modal>
  )
}

export default InfoModal
