// 资源资料库
const resource = [
  { _id: 'res-01', name: 'manpower', label: '人力', icon: '/static/img/resource/60px-Icon_manpower.png' },
  { _id: 'res-02', name: 'ammunition', label: '弹药', icon: '/static/img/resource/60px-Icon_ammo.png' },
  { _id: 'res-03', name: 'rations', label: '口粮', icon: '/static/img/resource/60px-Icon_ration.png' },
  { _id: 'res-04', name: 'sparePart', label: '零件', icon: '/static/img/resource/60px-Icon_parts.png' },
];
// 额外道具库
const extraDB = [
  { _id: 'e00', name: '快建', icon: '/static/img/resource/Item_Quick_Production_Contract.png' }, /** 0 */
  { _id: 'e01', name: '快修', icon: '/static/img/resource/Item_Quick_Restoration_Contract.png' }, /** 1 */
  { _id: 'e02', name: '人形契', icon: '/static/img/resource/Item_T-Doll_Contract.png' }, /** 2 */
  { _id: 'e03', name: '装备契', icon: '/static/img/resource/Item_Equipment_Contract.png' }, /** 3 */
  { _id: 'e04', name: '采购币', icon: '/static/img/resource/Item_Token.png' } /** 4 */
];

// 战役名常量
const BATTLE_NAME_ZERO  = '第零战役';
const BATTLE_NAME_ONE   = '第一战役';
const BATTLE_NAME_TWO   = '第二战役';
const BATTLE_NAME_THREE = '第三战役';
const BATTLE_NAME_FOUR  = '第四战役';
const BATTLE_NAME_FIVE  = '第五战役';
const BATTLE_NAME_SIX   = '第六战役';
const BATTLE_NAME_SEVEN = '第七战役';
const BATTLE_NAME_EIGHT = '第八战役';
const BATTLE_NAME_NINE = '第九战役';
const BATTLE_NAME_TEN   = '第十战役';

// 后勤数组
const battle_zero = [
  {
    code: '0-1', name: '应援训练', time: 50, battleName: BATTLE_NAME_ZERO,
    manpower: 0, ammunition: 145, rations: 145, sparePart: 0,
    extra: [ extraDB[0], extraDB[1] ], captainLevel: 40, requiredPeople: 4
  },
  {
    code: '0-2', name: '梯队集训', time: 180, battleName: BATTLE_NAME_ZERO,
    manpower: 550, ammunition: 0, rations: 0, sparePart: 350,
    extra: [ extraDB[2] ], captainLevel: 45, requiredPeople: 5
  },
  {
    code: '0-3', name: '特种支援', time: 720, battleName: BATTLE_NAME_ZERO,
    manpower: 900, ammunition: 900, rations: 900, sparePart: 250,
    extra: [ extraDB[1], extraDB[3] ], captainLevel: 45, requiredPeople: 5
  },
  {
    code: '0-4', name: '联合演习', time: 1440, battleName: BATTLE_NAME_ZERO,
    manpower: 0, ammunition: 1200, rations: 800, sparePart: 750,
    extra: [ extraDB[4] ], captainLevel: 50, requiredPeople: 5
  }
];
const battle_one = [
  {
    code: '1-1', name: '热身运动', time: 15, battleName: BATTLE_NAME_ONE,
    manpower: 10, ammunition: 30, rations: 15, sparePart: 0,
    extra: [ ], captainLevel: 1, requiredPeople: 2
  },
  {
    code: '1-2', name: '巡逻戒严', time: 30, battleName: BATTLE_NAME_ONE,
    manpower: 0, ammunition: 40, rations: 60, sparePart: 0,
    extra: [ ], captainLevel: 3, requiredPeople: 2
  },
  {
    code: '1-3', name: '伤员搬运', time: 60, battleName: BATTLE_NAME_ONE,
    manpower: 30, ammunition: 0, rations: 30, sparePart: 10,
    extra: [ extraDB[1] ], captainLevel: 5, requiredPeople: 3
  },
  {
    code: '1-4', name: '全境搜查', time: 120, battleName: BATTLE_NAME_ONE,
    manpower: 160, ammunition: 160, rations: 0, sparePart: 0,
    extra: [ extraDB[2] ], captainLevel: 6, requiredPeople: 5
  },
];
const battle_two = [
  { code: '2-1', name: '前线侦查', time: 40, battleName: BATTLE_NAME_TWO,
    manpower: 100, ammunition: 0, rations: 0, sparePart: 30,
    extra: [ ], captainLevel: 5, requiredPeople: 3
  },
  { code: '2-2', name: '后方运输', time: 90, battleName: BATTLE_NAME_TWO,
    manpower: 60, ammunition: 200, rations: 80, sparePart: 0,
    extra: [ extraDB[1] ], captainLevel: 8, requiredPeople: 4
  },
  { code: '2-3', name: '工厂快递', time: 240, battleName: BATTLE_NAME_TWO,
    manpower: 10, ammunition: 10, rations: 10, sparePart: 230,
    extra: [ extraDB[0], extraDB[1] ], captainLevel: 10, requiredPeople: 5},
  { code: '2-4', name: '采集数据', time: 360, battleName: BATTLE_NAME_TWO,
    manpower: 0, ammunition: 250, rations: 600, sparePart: 60,
    extra: [ extraDB[2] ], captainLevel: 15, requiredPeople: 5
  },
];
const battle_three = [
  { code: '3-1', name: '强化工事', time: 20, battleName: BATTLE_NAME_THREE,
    manpower: 50, ammunition: 0, rations: 75, sparePart: 0,
    extra: [ ], captainLevel: 12,requiredPeople: 4
  },
  { code: '3-2', name: '截获密报', time: 45, battleName: BATTLE_NAME_THREE,
    manpower: 0, ammunition: 120, rations: 70, sparePart: 30,
    extra: [ ], captainLevel: 20,requiredPeople: 5
  },
  { code: '3-3', name: '交通管制', time: 90, battleName: BATTLE_NAME_THREE,
    manpower: 0, ammunition: 300, rations: 0, sparePart: 0,
    extra: [ extraDB[0], extraDB[1] ], captainLevel: 15,requiredPeople: 4
  },
  { code: '3-4', name: '封锁密道', time: 300, battleName: BATTLE_NAME_THREE,
    manpower: 0, ammunition: 0, rations: 300, sparePart: 300,
    extra: [ extraDB[2], extraDB[3] ], captainLevel: 25,requiredPeople: 5
  },
];
const battle_four = [
  { code: '4-1', name: '视野支援', time: 60, battleName: BATTLE_NAME_FOUR,
    manpower: 0, ammunition: 185, rations: 185, sparePart: 0,
    extra: [ extraDB[3] ], captainLevel: 30, requiredPeople: 4
  },
  { code: '4-2', name: '切断补给', time: 120, battleName: BATTLE_NAME_FOUR,
    manpower: 0, ammunition: 0, rations: 0, sparePart: 210,
    extra: [ extraDB[0] ], captainLevel: 35, requiredPeople: 5
  },
  { code: '4-3', name: '窃取地图', time: 360, battleName: BATTLE_NAME_FOUR,
    manpower: 800, ammunition: 550, rations: 0, sparePart: 0,
    extra: [ extraDB[2], extraDB[1] ], captainLevel: 40, requiredPeople: 5
  },
  { code: '4-4', name: '坐标定位', time: 480, battleName: BATTLE_NAME_FOUR,
    manpower: 400, ammunition: 400, rations: 400, sparePart: 150,
    extra: [ extraDB[0] ], captainLevel: 40, requiredPeople: 5
  }
];
const battle_five = [
  { code: '5-1', name: '例行检阅', time: 30, battleName: BATTLE_NAME_FIVE,
    manpower: 0, ammunition: 0, rations: 100, sparePart: 45,
    extra: [ ], captainLevel: 30, requiredPeople: 4
  },
  { code: '5-2', name: '现场救援', time: 150, battleName: BATTLE_NAME_FIVE,
    manpower: 0, ammunition: 600, rations: 300, sparePart: 0,
    extra: [ extraDB[1] ], captainLevel: 35, requiredPeople: 5
  },
  { code: '5-3', name: '路线追踪', time: 360, battleName: BATTLE_NAME_FIVE,
    manpower: 800, ammunition: 400, rations: 400, sparePart: 0,
    extra: [ extraDB[3] ], captainLevel: 40, requiredPeople: 5
  },
  { code: '5-4', name: '维稳工作', time: 420, battleName: BATTLE_NAME_FIVE,
    manpower: 100, ammunition: 0, rations: 0, sparePart: 700,
    extra: [ extraDB[2] ], captainLevel: 40, requiredPeople: 5
  },
];
const battle_six = [
  { code: '6-1', name: '协助救援', time: 120, battleName: BATTLE_NAME_SIX,
    manpower: 300, ammunition: 300, rations: 0, sparePart: 100,
    extra:	[ ], captainLevel: 35, requiredPeople: 5
  },
  { code: '6-2', name: '远程侦查', time: 180, battleName: BATTLE_NAME_SIX,
    manpower: 0, ammunition: 200, rations: 550, sparePart: 100,
    extra:	[ extraDB[0], extraDB[1] ], captainLevel: 40, requiredPeople: 5
  },
  { code: '6-3', name: '提取科技', time: 300, battleName: BATTLE_NAME_SIX,
    manpower: 0, ammunition: 0, rations: 200, sparePart: 500,
    extra:	[ extraDB[3] ], captainLevel: 45, requiredPeople: 5
  },
  { code: '6-4', name: '战场搜索', time: 720, battleName: BATTLE_NAME_SIX,
    manpower: 800, ammunition: 800, rations: 800, sparePart: 0,
    extra:	[ extraDB[4] ], captainLevel: 45, requiredPeople: 5
  },
];
const battle_seven = [
  { code: '7-1', name: '监视据点', time: 150, battleName: BATTLE_NAME_SEVEN,
    manpower: 650, ammunition: 0, rations: 650, sparePart: 0,
    extra: [ ], captainLevel: 40, requiredPeople: 5
  },
  { code: '7-2', name: '接应队友', time: 240, battleName: BATTLE_NAME_SEVEN,
    manpower: 0, ammunition: 650, rations: 0, sparePart: 300,
    extra: [ extraDB[2] ], captainLevel: 45, requiredPeople: 5
  },
  { code: '7-3', name: '清理道路', time: 330, battleName: BATTLE_NAME_SEVEN,
    manpower: 900, ammunition: 600, rations: 600, sparePart: 0,
    extra: [ extraDB[3] ], captainLevel: 50, requiredPeople: 5
  },
  { code: '7-4', name: '追踪傀儡', time: 480, battleName: BATTLE_NAME_SEVEN,
    manpower: 250, ammunition: 250, rations: 250, sparePart: 600,
    extra: [ extraDB[0] ], captainLevel: 50, requiredPeople: 5
  },
];
const battle_eight = [
  { code: '8-1', name: '筹集资料', time: 60, battleName: BATTLE_NAME_EIGHT,
    manpower: 150, ammunition: 150, rations: 150, sparePart: 0,
    extra: [ extraDB[3] ], captainLevel: 45, requiredPeople: 5 },
  { code: '8-2', name: '解析碎片', time: 180, battleName: BATTLE_NAME_EIGHT,
    manpower: 0, ammunition: 0, rations: 0, sparePart: 450,
    extra: [ extraDB[1] ], captainLevel: 50, requiredPeople: 5 },
  { code: '8-3', name: '勘探现场', time: 360, battleName: BATTLE_NAME_EIGHT,
    manpower: 400, ammunition: 800, rations: 800, sparePart: 0,
    extra: [ extraDB[0], extraDB[1] ], captainLevel: 55, requiredPeople: 5 },
  { code: '8-4', name: '修订路线', time: 540, battleName: BATTLE_NAME_EIGHT,
    manpower: 1500, ammunition: 400, rations: 400, sparePart: 100,
    extra: [ extraDB[2] ], captainLevel: 60, requiredPeople: 5 },
];
const battle_nine = [
  { code: '9-1', name: '清理哨站', time: 30,	battleName: BATTLE_NAME_NINE,
    manpower: 0, ammunition: 0, rations: 100, sparePart: 50,
    extra: [ ], captainLevel: 55, requiredPeople: 5 },
  { code: '9-2', name: '探测信号', time: 90,	battleName: BATTLE_NAME_NINE,
    manpower: 180, ammunition: 0, rations: 180, sparePart: 100,
    extra: [ extraDB[0] ], captainLevel: 60, requiredPeople: 5 },
  { code: '9-3', name: '快速营救', time: 270,	battleName: BATTLE_NAME_NINE,
    manpower: 750, ammunition: 750, rations: 0, sparePart: 0,
    extra: [ extraDB[2] ], captainLevel: 65, requiredPeople: 5 },
  { code: '9-4', name: '紧急压制', time: 420,	battleName: BATTLE_NAME_NINE,
    manpower: 500, ammunition: 900, rations: 900, sparePart: 0,
    extra: [ extraDB[3] ], captainLevel: 70, requiredPeople: 5 },
];
const battle_ten = [
  { code: '10-1', name: '协助验证', time: 40, battleName: BATTLE_NAME_TEN,
  manpower: 140, ammunition: 200, rations: 0, sparePart: 0,
  extra: [ ], captainLevel: 65, requiredPeople: 5 },
{ code: '10-2', name: '前线支援', time: 100, battleName: BATTLE_NAME_TEN,
  manpower: 0, ammunition: 240, rations: 180, sparePart: 0,
  extra: [ extraDB[2], extraDB[0] ], captainLevel: 70, requiredPeople: 5 },
{ code: '10-3', name: '腹地侦查', time: 320, battleName: BATTLE_NAME_TEN,
  manpower: 0, ammunition: 480, rations: 480, sparePart: 300,
  extra: [ extraDB[0], extraDB[1] ], captainLevel: 75, requiredPeople: 5 },
{ code: '10-4', name: '夺取通讯', time: 600, battleName: BATTLE_NAME_TEN,
  manpower: 660, ammunition: 660, rations: 660, sparePart: 330,
  extra: [ extraDB[3] ], captainLevel: 75, requiredPeople: 5 },
];

// 后勤总集
const questDataBase = [].concat(
  battle_zero,
  battle_one,
  battle_two,
  battle_three,
  battle_four,
  battle_five,
  battle_six,
  battle_seven,
  battle_eight,
  battle_nine,
  battle_ten
)

export default {
  quest: questDataBase,
  extra: extraDB,
  resource: resource,
}
