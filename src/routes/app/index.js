import React from 'react'
import { connect } from 'dva'
import { Helmet } from 'react-helmet'
import { Page } from '../../components/layouts'
import DownloadDB from './downloadDB'

class Main extends React.Component {
  constructor (props) {
    super(props)
  }

  componentDidMount () {
    console.log('dva init')
    // For prerender
    document.dispatchEvent(new Event('dva-init'))
  }

  render () {
    const {
      dispatch,
      location,
      app,
      maps,
      children,
    } = this.props
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
          <meta key={ar} name={ar} content={metas[ar]} />
        )
      })
    }

    // 引入字体
    const newStyle = document.createElement('style')
    newStyle.appendChild(document.createTextNode("\
  @font-face {\
  font-family: 'EnemyPower';\
  src: url('" + PUBLIC_PATH + "static/font/Microgme.ttf');\
  }\
    "))
    document.head.appendChild(newStyle)

    return (
      <Page {...propsOfPage}>
        {/* 插入自定义meta */}
        <Helmet>
          {mapMeta(metasAry)}
        </Helmet>
        {children}
        <DownloadDB />
      </Page>
    )
  }
}

export default connect(({ app, maps }) => ({ app, maps }))(Main)
