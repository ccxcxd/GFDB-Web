import React from 'react'
import {
  Table,
} from 'antd'
import { forEach } from 'lodash'

const TeamTable = ({
  maps,
}) => {
  // 属性获取
  const {
    enemy_team_info,
    enemy_in_team_info,
    enemy_character_type_info,
    missionSelected,
  } = maps

  // 属性定义
  const teamIds = missionSelected.enemy_team_count || {}
  const initData = () => {
    const data = []
    let i = 0
    forEach(teamIds, (count, teamId, idx) => {
      console.log(idx)
      const enemyTeam = enemy_team_info[teamId]
      const countDict = {}
      forEach(enemyTeam.member_ids, (menId) => {
        const name = __(enemy_in_team_info[menId].enemy_character.name)
        countDict[name] = (countDict[name] || 0) + enemy_in_team_info[menId].number
      })
      let members = ''
      forEach(countDict, (val, key) => {
        members += key + '*' + val + ' '
      });
      let drops = ''
      forEach(enemyTeam.drops, (drop) => {
        drops += __(drop) + ' '
      })

      data[i] = {
        id: teamId,
        leader: __(enemy_character_type_info[enemyTeam.enemy_leader].name),
        difficulty: enemyTeam.difficulty,
        members: members,
        count: count,
        drop: drops,
      }
      i += 1
    })
    return data
  }
  
  const columns = [
    {
      title: __('map_tbl.id'),
      dataIndex: 'id',
    },
    {
      title: __('map_tbl.leader'),
      dataIndex: 'leader',
    },
    {
      title: __('map_tbl.difficulty'),
      dataIndex: 'difficulty',
    },
    {
      title: __('map_tbl.members'),
      dataIndex: 'members',
    },
    {
      title: __('map_tbl.count'),
      dataIndex: 'count',
    },
    {
      title: __('map_tbl.drop'),
      dataIndex: 'drop',
    },
  ]
  const propsOfTable = {
    columns,
    dataSource: initData(),
    pagination: false,
  }
  return (
    <div>
      <Table {...propsOfTable} />
    </div>
  )
}

export default TeamTable
