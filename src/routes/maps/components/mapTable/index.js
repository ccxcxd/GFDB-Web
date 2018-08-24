import React from 'react'
import {
  Table,
  Select,
} from 'antd'
import { forEach } from 'lodash'
import les from './index.less'

// 渲染方法定义
const mapTeamOpt = () => {
  const {
    enemy_team_info,
  } = mDB
  const childrens = []
  const Option = Select.Option
  forEach(enemy_team_info, (val, key) => {
    if (key && val.id) {
      childrens.push(
        <option
          key={key}
          value={key}
        >
          {key}
        </option>
      )
    }
  })
  return childrens
}
const opts = mapTeamOpt()

const TeamTable = ({
  dispatch,
  maps,
}) => {
  // 属性获取
  const {
    missionSelected,
    enemyTeamSelected,
  } = maps
  const {
    enemy_team_info,
    enemy_in_team_info,
    enemy_character_type_info,
  } = mDB

  // 方法定义
  const selectEnemyTeam = (payload) => {
    dispatch({
      type: 'maps/selectEnemyTeam',
      payload,
    })
  }
  const selectOtherEnemyTeam = (e) => {
    const id = e.target.value
    console.log(id)
    const target = enemy_team_info[id]
    dispatch({
      type: 'maps/selectEnemyTeam',
      payload: target,
    })
  }
  const getStrLength = (str) => {
    if (!str) {
      return 0
    }
    return str.length
  }

  

  // 属性定义
  const teamIds = missionSelected.enemy_team_count || {}
  const initData = () => {
    const data = []
    let i = 0
    forEach(teamIds, (count, teamId) => {
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
        id: parseInt(teamId, 10),
        leader: __(enemy_character_type_info[enemyTeam.enemy_leader].name),
        difficulty: enemyTeam.difficulty,
        members: members,
        count: count,
        drop: drops,
        member_ids: enemyTeam.member_ids,
      }
      i += 1
    })
    return data
  }
  const columns = [
    {
      title: __('map_tbl.id'),
      dataIndex: 'id',
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: __('map_tbl.leader'),
      dataIndex: 'leader',
    },
    {
      title: __('map_tbl.difficulty'),
      dataIndex: 'difficulty',
      sorter: (a, b) => a.difficulty - b.difficulty,
    },
    {
      title: __('map_tbl.members'),
      dataIndex: 'members',
    },
    {
      title: __('map_tbl.count'),
      dataIndex: 'count',
      sorter: (a, b) => a.count - b.count,
    },
    {
      title: __('map_tbl.drop'),
      dataIndex: 'drop',
      sorter: (a, b) => getStrLength(a.drop) - getStrLength(b.drop),
    },
  ]
  const propsOfTable = {
    columns,
    dataSource: initData(),
    rowKey: 'id',
    className: les.table,
    rowClassName: (rec) => {
      if (rec.id === enemyTeamSelected.id) {
        return `${les.tr} ${les.active}`
      }
      return les.tr
    },
    onRow: (record) => {
      return {
        onClick: () => selectEnemyTeam(record),       // 点击行
        // onMouseEnter: () => {},  // 鼠标移入行
      }
    },
    pagination: false,
  }

  return (
    <div>
      <Table {...propsOfTable} />
      <div className={les.teamSelect}>
        <span className={les.title}>切换其他敌方编队：</span>
        <select
          className={`ant-select ant-select-enabled ${les.select}`}
          value={enemyTeamSelected.id}
          onChange={selectOtherEnemyTeam}
        >
          {/* {mapTeamOpt(enemy_team_info)} */}
          {opts}
        </select>
      </div>
    </div>
  )
}

export default TeamTable
