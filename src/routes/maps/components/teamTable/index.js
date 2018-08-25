import React from 'react'
import {
  Table,
} from 'antd'
import { forEach } from 'lodash'
import les from './index.less'

const TeamTable = ({
  maps,
}) => {
  // 属性获取
  const {
    enemyTeamSelected,
  } = maps
  const {
    enemy_in_team_info,
  } = mDB
  
  // 属性定义
  const ids = enemyTeamSelected.member_ids || []
  const data = ids.map(id => {
    var member = enemy_in_team_info[id]
    var character = member.enemy_character
    return {
      id: id,
      name: __(character.name),
      number: character.number,
      maxlife: Math.ceil(character.maxlife / character.number),
      pow: character.pow,
      rate: character.rate,
      hit: character.hit,
      dodge: character.dodge,
      range: character.range,
      speed: character.speed,
      armor_piercing: character.armor_piercing,
      armor: character.armor,
      def_break: character.def_break,
      def: character.def,
      def_percent: `${member.def_percent}%`,
      coordinator_x: member.coordinator_x,
      coordinator_y: member.coordinator_y,
      character: __(character.character).replace(new RegExp("//c", "g"), " "),
    }
  })

  const columns = [
    {
      title: __('team_tbl.name'),
      dataIndex: 'name',
    },
    {
      title: __('team_tbl.number'),
      dataIndex: 'number',
      sorter: (a, b) => a.number - b.number,
    },
    {
      title: __('team_tbl.maxlife'),
      dataIndex: 'maxlife',
      sorter: (a, b) => a.maxlife - b.maxlife,
    },
    {
      title: __('team_tbl.pow'),
      dataIndex: 'pow',
      sorter: (a, b) => a.pow - b.pow,
    },
    {
      title: __('team_tbl.rate'),
      dataIndex: 'rate',
      sorter: (a, b) => a.rate - b.rate,
    },
    {
      title: __('team_tbl.hit'),
      dataIndex: 'hit',
    },
    {
      title: __('team_tbl.dodge'),
      dataIndex: 'dodge',
    },
    {
      title: __('team_tbl.range'),
      dataIndex: 'range',
    },
    {
      title: __('team_tbl.speed'),
      dataIndex: 'speed',
    },
    {
      title: __('team_tbl.armor_piercing'),
      dataIndex: 'armor_piercing',
    },
    {
      title: __('team_tbl.armor'),
      dataIndex: 'armor',
    },
    {
      title: __('team_tbl.def_break'),
      dataIndex: 'def_break',
    },
    {
      title: __('team_tbl.def'),
      dataIndex: 'def',
    },
    {
      title: __('team_tbl.def_percent'),
      dataIndex: 'def_percent',
    },
    {
      title: __('team_tbl.coordinator_x'),
      dataIndex: 'coordinator_x',
    },
    {
      title: __('team_tbl.coordinator_y'),
      dataIndex: 'coordinator_y',
    },
    {
      title: __('team_tbl.character'),
      dataIndex: 'character',
    },
  ]
  const propsOfTable = {
    columns,
    dataSource: data,
    rowKey: 'id',
    className: les.table,
    pagination: false,
  }
  return (
    <div>
      <div className={les.title}>{__('team_sel.label')}</div>
      <Table {...propsOfTable} />
    </div>
  )
}

export default TeamTable
