import React from 'react'
import { connect } from 'dva'
import { Icon } from 'antd'
import les from './index.less'

const Error = (loading) => (
  <div className={les.content}>
    <div className={`${les.error} ${loading ? 'animated' : ''} headShake`}>
      <Icon type="frown-o" />
      <h1>404 Not Found</h1>
    </div>
  </div>
)

export default connect()(Error)