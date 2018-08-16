import React from 'react'
import {
  Alert,
  Button,
} from 'antd'

const MapCanvas = () => {
  return (
    <div>
      {/* 提示 */}
      <div>
        <Alert message={__('map_tbl.warning')} type="error" />
      </div>
      {/* canvas */}
      <div>
        <canvas id="map_canvas_fg" width="0" height="0" />
        <canvas id="map_canvas_bg" width="0" height="0" />
        <canvas id="map_canvas_tmp" width="0" height="0" />
      </div>
      {/* 操作区 */}
      <div>
        <Button.Group>
          <Button type='primary'>{__('mission_map.auto_generate')}</Button>
          <Button type='primary'>{__('mission_map.generate')}</Button>
        </Button.Group>
        <Button type='primary'>{__('mission_map.download')}</Button>
        <Button type='primary'>{__('mission_map.download_full')}</Button>
      </div>
      <div>
        &nbsp;&nbsp;&nbsp;&nbsp;&uarr;&nbsp;&nbsp;<span>{__('mission_map.description')}</span>
      </div>
    </div>
  )
}

export default MapCanvas
