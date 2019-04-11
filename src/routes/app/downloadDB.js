import React from 'react'
import { connect } from 'dva'
import {
  Spin,
  Icon,
  Button,
} from 'antd'
import styles from './downloadDB.less'

class DownloadDB extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      hideSuccess: false,
    }
  }

  handleCloseSuccess () {
    this.setState({ hideSuccess: true })
  }
  handleRetry () {
    const { dispatch } = this.props
    dispatch({ type: 'app/initDB' })
  }

  render () {
    const {
      app,
      loading,
    } = this.props
    const {
      hideSuccess,
    } = this.state
    const {
      ifDBInit,
    } = app
    const loadingGetDB = loading.effects['app/initDB']

    if (ifDBInit) {
      // download sucess
      if (hideSuccess) {
        return ''
      } else {
        return (
          <div className={styles.successLab}>
            <Icon type="check-circle" />
            <div className={styles.txt}>下载成功</div>
            <Button
              type="dashed"
              size="small"
              className={styles.btn}
              onClick={() => this.handleCloseSuccess()}
            >关闭</Button>
          </div>
        )
      }
    } else if (!loadingGetDB && !ifDBInit) {
      // download error
      return (
        <div className={styles.failLab}>
          <Icon type="exclamation-circle" />
          <div className={styles.txt}>下载失败</div>
          <Button
            type="dashed"
            size="small"
            className={styles.btn}
            onClick={() => this.handleRetry()}
          >重试</Button>
        </div>
      )
    } else {
      // downloading
      return (
        <Spin
          className={styles.loadingWrap}
          spinning={loadingGetDB}
          indicator={(
            <div className={styles.dlDB}>
              <Icon
                type="loading"
                className={styles.loading}
                spin
              />
              <div className={styles.txt}>数据下载中...</div>
            </div>
          )}
        />
      )
    }
  }
}

export default connect(({ app, loading }) => ({ app, loading }))(DownloadDB)
