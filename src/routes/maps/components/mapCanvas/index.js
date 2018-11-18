import React from 'react'
import {
  Alert,
  Button,
  Icon,
  Dropdown,
  Checkbox,
  message,
  Slider,
} from 'antd'
import Map from '@/services/map'
import { isEqual, debounce } from 'lodash'
import les from './index.less'
import InfoModal from '../infoModal'

const TURN_MIN = 1

const roundMax = (mission) => {
  return mission.turn_limit > 0 ? mission.turn_limit : 1
}

class MapCanvas extends React.Component {
  constructor (props) {
    super(props)
    this.mapObj = null
    this.state = {
      loading: false,
      show: false,

      infoVisible: false,
      infoData: {},

      currentTurnReal: this.props.maps.currentTurn,
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
      autoGenerate,
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
    if (autoGenerate) {
      this.onGenerate()
    }
  }
  componentDidUpdate(prevProps) {
    const oldMaps = prevProps.maps
    const newMaps = this.props.maps
    // 监听变量变化，重绘页面
    if (!isEqual(oldMaps, newMaps)) {
      // 检查自动更新
      if (newMaps.autoGenerate) {
        this.onGenerate()
      } else {
        this.mapObj.remove()
      }
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
    console.log('displayPower', displayPower)
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

  showInfoModal (data, show = true) {
    this.setState({
      infoVisible: show,
      infoData: data,
    })
  }
  changeGlobalTurn (val) {
    const { dispatch } = this.props
    dispatch({
      type: 'maps/turnChange',
      turn: val,
    })
    this.mapObj.turnNo = val
    // this.onGenerate();
  }
  changeTurn (val) {
    this.setState({
      currentTurnReal: val,
    })
    this.changeGlobalTurn(val)
  }
  turnAdd () {
    const val = this.state.currentTurnReal + 1
    this.changeTurn(val)
  }
  turnReduce () {
    const val = this.state.currentTurnReal - 1
    this.changeTurn(val)
  }

  render () {
    // 属性获取
    const {
      maps,
    } = this.props
    const {
      loading,
      show,

      infoVisible,
      infoData,

      currentTurnReal,
    } = this.state
    const {
      autoGenerate,
      displayPower,
      missionSelected,
      currentTurn,
    } = maps

    const propsOfInfoModal = {
      visible: infoVisible,
      data: infoData,
      onHide: () => {
        this.showInfoModal({}, false)
      },
    }
    const IF_RANGE_SHOW = !!missionSelected.turn_limit
    const TURN_MAX = roundMax(missionSelected)
    const TURN_MARK = {}
    TURN_MARK[TURN_MIN] = TURN_MIN
    TURN_MARK[TURN_MAX] = TURN_MAX

    return (
      <div>
        {/* 提示 */}
        <div className={les.warning}>
          <Alert message={__('map_tbl.warning')} type="error" />
          <Alert message={(<font size="4"><b>{__('map_tbl.warning2')}</b></font>)} type="error" />
        </div>
        {/* canvas */}
        <div className={les.canvasArea}>
          <div className={les.canvasBtnLab}>
            {/* 关卡条件 */}
            <div className={les.mapInfo} onClick={() => this.showInfoModal({})}>
              <Icon type="profile" />
              <div className={les.infoTxt}>{'战场说明'}</div>
            </div>
            {/* 当前回合 */}
            <div className={les.turnLab}>
              <div className={les.turnContnet}>{currentTurnReal}</div>
              <div className={les.turnTips}>当前回合</div>
            </div>
          </div>
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
            { autoGenerate ? <Icon type="sync" spin={true} /> : '' }
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
            trigger={["click"]}
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
              // shape="circle"
              className={les.settingBtn}
            />
          </Dropdown>
          {
            IF_RANGE_SHOW &&
            <div className={les.roundSelCon}>
              <div className={les.roundTip}>回合数选择:</div>
              <Button
                icon="caret-left"
                disabled={currentTurnReal <= TURN_MIN}
                onClick={() => this.turnReduce()}
              />
              <Slider
                className={les.roundSlider}
                marks={TURN_MARK}
                min={TURN_MIN}
                max={TURN_MAX}
                value={currentTurnReal}
                onChange={(v) => this.changeTurn(v)}
              />
              <Button
                icon="caret-right"
                disabled={currentTurnReal >= TURN_MAX}
                onClick={() => this.turnAdd()}
              />
            </div>
          }
        </div>
        <div className={`${les.btnTips} hidden-xs`}>
          &nbsp;&nbsp;&nbsp;&nbsp;&uarr;&nbsp;&nbsp;<span>{__('mission_map.description')}</span>
        </div>
        {/* 战役信息弹窗 */}
        <InfoModal {...propsOfInfoModal} />
      </div>
    )
  }
}

export default MapCanvas
