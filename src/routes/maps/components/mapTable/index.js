import React from 'react'
import {
  Table,
  Select,
} from 'antd'
import { forEach } from 'lodash'
import les from './index.less'
import Game from '@/services/game'

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
  app,
  maps,
}) => {
  // 属性获取
  const {
    clientType,
    clientWidth,
    tableProps,
  } = app
  const {
    missionSelected,
    enemyTeamSelected,
    currentTurn,
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
    dispatch({
      type: 'maps/selectEnemyTeam',
      payload: id,
    })
  }
  const getStrLength = (str) => {
    if (!str) {
      return 0
    }
    return str.length
  }
  const getMembers = (enemyTeam) => {
    const countDict = {}
    forEach(enemyTeam.member_ids, (menId) => {
      const char_id = enemy_in_team_info[menId].enemy_character_type_id;
      const name = __(enemy_character_type_info[char_id].name)
      countDict[name] = (countDict[name] || 0) + enemy_in_team_info[menId].number
    })
    let members = ''
    forEach(countDict, (val, key) => {
      members += key + '*' + val + ' '
    });
    return members;
  }
  const getLimitedDrop = (enemyTeam) => {
    let drops_limit = ''
    forEach(enemyTeam.drops_limit, (drop) => {
      drops_limit += __(drop) + ' '
    })
    return drops_limit;
  }
  const getRegularDrop = (enemyTeam) => {
    let drops_reg = ''
    let rank = 0
    for (rank = 0; rank < 5; rank++) { 
      if (enemyTeam.drops_reg_count[rank] > 0) {
        drops_reg += "★" + (rank + 1).toString() + "×" + enemyTeam.drops_reg_count[rank] + " "
      }
    }
    return drops_reg;
  }
  

  // 属性定义
  const teamIds = missionSelected.enemy_team_count || {}
  const initData = () => {
    const data = []
    let i = 0
    forEach(teamIds, (count, teamId) => {
      const enemyTeam = enemy_team_info[teamId]
      const teamPower = Game.getEnemyTeamPower(enemyTeam, currentTurn);

      data[i] = {
        id: parseInt(teamId, 10),
        leader: __(enemy_character_type_info[enemyTeam.enemy_leader].name),
        power: teamPower,
        power_display: teamPower + (enemyTeam.correction_turn?"*":""),
        members: getMembers(enemyTeam),
        count: count,
        drop_limit: getLimitedDrop(enemyTeam),
        drop_reg: getRegularDrop(enemyTeam),
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
      fixed: 'left',
      width: 90,
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: __('map_tbl.leader'),
      dataIndex: 'leader',
    },
    {
      title: __('map_tbl.power'),
      dataIndex: 'power_display',
      sorter: (a, b) => a.power - b.power,
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
      title: __('map_tbl.drop_limit'),
      dataIndex: 'drop_limit',
      sorter: (a, b) => getStrLength(a.drop_limit) - getStrLength(b.drop_limit),
    },
    {
      title: __('map_tbl.drop_reg'),
      dataIndex: 'drop_reg',
      sorter: (a, b) => getStrLength(a.drop_reg) - getStrLength(b.drop_reg),
    },
  ]
  const propsOfTable = {
    ...tableProps,
    columns,
    dataSource: initData(),
    rowKey: 'id',
    className: `responsive-table ${les.table}`,
    scroll: {
      x: clientType === 'web' ?
      0 :
      clientWidth - 16,
    },
    rowClassName: (rec) => {
      if (rec.id === enemyTeamSelected.id) {
        return `${les.tr} ${les.active}`
      }
      return les.tr
    },
    onRow: (record) => {
      return {
        onClick: () => selectEnemyTeam(record.id),       // 点击行
        // onMouseEnter: () => {},  // 鼠标移入行
      }
    },
    pagination: false,
  }

  return (
    <div>
      <Table {...propsOfTable} />
      <div className={les.teamSelect}>
        <span className={les.title}>{__('team_sel.label')}</span>
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
