import React from 'react'
import './index.less'

const ExtraItem = ({
  icon,
  label,
  ...otherProps,
}) => {
  return (
    <div
      className='extra-item'
      {...otherProps}
    >
      <img className='icon' src={icon} />
      <div className='label'>{label}</div>
    </div>
  )
}

export default ExtraItem
