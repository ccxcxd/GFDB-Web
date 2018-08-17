import React from 'react'
import {
  Alert,
  Button,
  Icon,
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
      auto: false
    }
  } 

  // 生命周期
  componentDidMount () {
    const {
      dispatch,
    } = this.props
    const map = new Map({
      onSpotClick: (id) => {
        dispatch({
          type: 'maps/selectEnemyTeam',
          payload: mDB.enemy_team_info[id],
        })
      }
    })
    this.mapObj = map
  }
  componentDidUpdate(prevProps) {
    const oldMisson = prevProps.maps.missionSelected
    const newMisson = this.props.maps.missionSelected
    if (!isEqual(oldMisson, newMisson)) {
      // console.log('更新了')
      // 检查自动更新
      if (this.state.auto) {
        this.onGenerate()
      }
    }
  }

  // 自定义方法
  setAuto () {
    const { auto } = this.state
    this.setState({ auto: !auto })
    // if set true generate canvas
    if (!auto) {
      this.onGenerate()
    }
  }
  onGenerate () {
    const { maps } = this.props
    const missionId = maps.missionSelected.id
    if (!missionId) {
      message.warning('请先选择要生成的地图')
      return
    }
    this.mapObj.generate(missionId)
  }
  download () {
    const { maps } = this.props
    const mission = maps.missionSelected
    const name = `${mission.index_text} ${__(mission.name)}`
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
      auto,
    } = this.state
    const {
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
          <canvas id="map_canvas_fg" width="0" height="0" />
          <canvas id="map_canvas_bg" width="0" height="0" />
          <canvas id="map_canvas_tmp" width="0" height="0" />
        </div>
        {/* 操作区 */}
        <div className={les.btnArea}>
          <Button.Group>
            <Button
              type={ auto ? 'primary' : '' }
              onClick={() => this.setAuto()}
            >
              { auto ? <Icon type="check" /> : '' }
              {__('mission_map.auto_generate')}
            </Button>
            <Button
              type='primary'
              disabled={!missionSelected.id}
              onClick={() => this.onGenerate()}
            >{__('mission_map.generate')}</Button>
          </Button.Group>
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
        </div>
        <div className={les.btnTips}>
          &nbsp;&nbsp;&nbsp;&nbsp;&uarr;&nbsp;&nbsp;<span>{__('mission_map.description')}</span>
        </div>
      </div>
    )
  }
}

export default MapCanvas
