import React from 'react'
import {
  Alert,
  Button,
  Icon,
  Dropdown,
  Checkbox,
  message,
} from 'antd'
import Map from '@/services/map'
import { isEqual } from 'lodash'
import les from './index.less'

class MapCanvas extends React.Component {
  constructor (props) {
    super(props)
    this.mapObj = null
    this.state = {
      loading: false,
      show: false,
    }
  } 

  // 生命周期
  componentDidMount () {
    const {
      dispatch,
      maps,
    } = this.props
    const {
      displayPower,
    } = maps
    const map = new Map({
      displayPower,
      onSpotClick: (id) => {
        dispatch({
          type: 'maps/selectEnemyTeam',
          payload: id,
        })
      },
      afterGenerate: () => {
        this.setState({
          loading: false,
          show: true,
        })
      },
      afterRemove: () => {
        this.setState({
          loading: false,
          show: false,
        })
      }
    })
    this.mapObj = map
  }
  componentDidUpdate(prevProps) {
    const oldMaps = prevProps.maps
    const newMaps = this.props.maps
    // 监听变量变化，重绘页面
    const oldMisson = oldMaps.missionSelected
    const newMisson = newMaps.missionSelected
    if (!isEqual(oldMisson, newMisson)) {
      // console.log('更新了')
      // 检查自动更新
      if (newMaps.autoGenerate) {
        this.onGenerate()
      } else {
        this.mapObj.remove()
      }
    }
    const oldAuto = oldMaps.autoGenerate
    const newAuto = newMaps.autoGenerate
    if (oldAuto !== newAuto && newAuto === true) {
      this.onGenerate()
    }
    if (oldMaps.displayPower !== newMaps.displayPower) {
      this.onGenerate()
    }
  }

  // 自定义方法
  setAuto () {
    const {
      dispatch,
      maps,
    } = this.props
    dispatch({
      type: 'maps/setAutoGenerate',
      auto: !maps.autoGenerate,
    })
    // if set true generate canvas
    if (!maps.autoGenerate) {
      this.onGenerate()
    }
  }
  setDisplayPower () {
    const {
      dispatch,
      maps,
    } = this.props
    dispatch({
      type: 'maps/setDisplayPower',
      display: !maps.displayPower,
    })
  }
  onGenerate () {
    this.setState({
      loading: true,
    })
    const { maps } = this.props
    const {
      displayPower,
      missionSelected,
    } = maps
    const missionId = missionSelected.id
    if (!missionId) {
      message.warning('请先选择要生成的地图')
      this.setState({
        loading: false,
      })
      return
    }
    this.mapObj.generate(missionId, {
      displayPower,
    })
  }
  download () {
    const { maps } = this.props
    const mission = maps.missionSelected
    const name = `${mission.index_text}_${__(mission.name)}`
    this.mapObj.download(name)
  }
  downloadFullMap () {
    const { maps } = this.props
    const mission = maps.missionSelected
    const name = `${mission.index_text}_${__(mission.name)}`
    this.mapObj.downloadFullMap(name)
  }

  render () {
    // 属性获取
    const {
      maps,
    } = this.props
    const {
      loading,
      show,
    } = this.state
    const {
      autoGenerate,
      displayPower,
      missionSelected,
    } = maps

    return (
      <div>
        {/* 提示 */}
        <div className={les.warning}>
          <Alert message={__('map_tbl.warning')} type="error" />
        </div>
        {/* canvas */}
        <div className={les.canvasArea}>
          {
            (loading || show) ?
            null :
            (
              <div className={les.waitMap}>
                <div className={les.content}>
                  <Icon type="setting" /> 未生成地图
                </div>
              </div>
            )
          }
          {
            loading ?
            (
              <div className={les.loading}>
                <div className={les.content}>
                  <Icon type="loading" /> 地图生成中...
                </div>
              </div>
            ) :
            null
          }
          <canvas id="map_canvas_fg" width="0" height="0" />
          <canvas id="map_canvas_bg" width="0" height="0" />
          <canvas id="map_canvas_tmp" width="0" height="0" />
        </div>
        {/* 操作区 */}
        <div className={les.btnArea}>
          <Button
            type='primary'
            disabled={!missionSelected.id}
            onClick={() => this.onGenerate()}
          >
            { autoGenerate ? <Icon type="sync" /> : '' }
            {__('mission_map.generate')}
          </Button>
          <Button.Group>
            <Button
              type='primary'
              disabled={!missionSelected.id}
              onClick={() => this.download()}
            >{__('mission_map.download')}</Button>
            <Button
              type='primary'
              disabled={!missionSelected.id}
              onClick={() => this.downloadFullMap()}
            >{__('mission_map.download_full')}</Button>
          </Button.Group>
          <Dropdown
            trigger="click"
            placement="topRight"
            overlay={(
              <div className={les.settingList}>
                <Checkbox
                  checked={autoGenerate}
                  onChange={() => this.setAuto()}
                >{__('mission_map.auto_generate')}</Checkbox>
                <Checkbox
                  checked={!displayPower}
                  onChange={() => this.setDisplayPower()}
                >{__('mission_map.power_display_hide')}</Checkbox>
              </div>
            )}
          >
            <Button
              icon="setting"
              shape="circle"
            />
          </Dropdown>
        </div>
        <div className={`${les.btnTips} hidden-xs`}>
          &nbsp;&nbsp;&nbsp;&nbsp;&uarr;&nbsp;&nbsp;<span>{__('mission_map.description')}</span>
        </div>
      </div>
    )
  }
}

export default MapCanvas
