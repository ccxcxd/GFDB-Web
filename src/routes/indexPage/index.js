import React from 'react'
import { connect } from 'dva'
import { Icon } from 'antd'
import les from './index.less'

const Main = ({
  app,
}) => {
  // 属性获取
  const {
    lang,
  } = app

  return (
    <div className={les.welcome}>
      <Icon type="smile-o" /> {__('welcome.hello')}<br/>
      {__('welcome.choose')}
    </div>
  )
}

export default connect(({ app  }) => ({ app }))(Main)
