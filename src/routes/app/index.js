import React from 'react'
import { connect } from 'dva'
import { Helmet } from 'react-helmet'
import { Page } from '../../components/layouts'

const Main = ({
  dispatch,
  location,
  app,
  maps,
  children,
}) => {
  // 提取属性
  const metas = __('metas')
  const metasAry = Object.keys(metas)

  // 属性定义
  const propsOfPage = {
    dispatch,
    location,
    app,
    maps,
  }

  // 渲染方法定义
  const mapMeta = (ary) => {
    return ary.map(ar => {
      return (
        <meta name={ar} content={metas[ar]} />
      )
    })
  }

  return (
    <Page {...propsOfPage}>
      {/* 插入自定义meta */}
      <Helmet>
        {mapMeta(metasAry)}
      </Helmet>
      {children}
    </Page>
  )
}

export default connect(({ app, maps }) => ({ app, maps }))(Main)
