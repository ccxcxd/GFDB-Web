import React from 'react'
import {
  Modal,
} from 'antd'
import les from './index.less'

const InfoModal = ({
  visible,
  data,
  onHide,
}) => {
  const propsOfModal = {
    title: '战场说明',
    visible,
    footer: false,
    onCancel: onHide,
  }
  return (
    <Modal {...propsOfModal}>
      <div className={les.content}>
        <div className={les.baseMission}>
          <div className={les.title}>任务目标</div>
          <div className={les.content}>示例任务文本</div>
        </div>
        <div className={les.extraMission}>
          <div className={les.title}>勋章获取条件</div>
          <div className={les.content}>示例文本</div>
        </div>
      </div>
    </Modal>
  )
}

export default InfoModal
