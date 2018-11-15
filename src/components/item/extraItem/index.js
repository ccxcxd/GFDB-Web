import React from 'react'
import { Tooltip } from 'antd'
import './index.less'

const ExtraItem = ({
  icon,
  label,
  showLabel = false,
  ...otherProps,
}) => {
  return (
    <div
      className='extra-item'
      {...otherProps}
    >
      <Tooltip title={label}>
        <img
          className='icon'
          src={`${PUBLIC_PATH}static/img/item/${icon.toLowerCase()}.png`}
        />
      </Tooltip>
      { showLabel && <div className='label'>{label}</div> }
    </div>
  )
}

export default ExtraItem
