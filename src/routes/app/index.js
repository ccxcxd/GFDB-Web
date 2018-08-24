import React from 'react'
import { connect } from 'dva'
import { Page } from '../../components/layouts'

const Main = ({
  dispatch,
  location,
  app,
  maps,
  children,
}) => {
  // 属性定义
  const propsOfPage = {
    dispatch,
    location,
    app,
    maps,
  }

  return (
    <Page {...propsOfPage}>{children}</Page>
  )
}

export default connect(({ app, maps }) => ({ app, maps }))(Main)
