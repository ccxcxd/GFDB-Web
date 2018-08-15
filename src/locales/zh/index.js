module.exports = {
  'name': 'zh',
  'Hello text': '你好 欢迎来到少前攻略站',
  'menus': [
    { label: '敌方数据', path: '/maps' },
    { label: '后勤列表', path: '/quest' },
  ],
  'questTableColumns': [
    {
      title: '后勤编号',
      dataIndex: 'code',
    },
    {
      title: '后勤名称',
      dataIndex: 'battleName',
    },
    {
      title: '任务时间(小时)',
      dataIndex: 'time',
    },
  ],
}