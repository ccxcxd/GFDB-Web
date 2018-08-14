import React from 'react'
import { connect } from 'dva'
import { Page } from '../../components/layouts'

const Main = ({
  app,
  children,
}) => {
  // 属性定义
  const propsOfPage = {
    app,
  }

  return (
    <Page {...propsOfPage}>{children}</Page>
  )
}

export default connect(({ app }) => ({ app }))(Main)
