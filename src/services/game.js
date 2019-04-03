import $ from 'jquery'

const f32 = Math.fround;

const {
    game_config_info,
    enemy_in_team_info,
    enemy_character_type_info,
    enemy_standard_attribute_info,
  } = mDB

class GameClass {
  
    constructor () {
    }
  
    /**
     * 返回一个指定等级的enemy_character_type_info
     * @param {*} enemy_character_type_id 初始的enemy_character_type_info的id
     * @param {*} level 新的等级
     * @param {*} number 新的人数
     */
    getEnemyCharAtLevel (enemy_character_type_id, level, number) {
        var enemyChar = enemy_character_type_info[enemy_character_type_id];
        var lv_from = enemy_standard_attribute_info[enemyChar.level];
        var lv_to = enemy_standard_attribute_info[level];
        var result = $.extend({}, enemyChar);

        if (enemyChar && lv_from && lv_to) {
            result.number = number;
            result.level = level;
            result.maxlife = this.ueRound(f32(enemyChar.maxlife * lv_to.maxlife / lv_from.maxlife) * number);
            result.pow = this.ueRound(enemyChar.pow * lv_to.pow / lv_from.pow);
            result.hit = this.ueRound(enemyChar.hit * lv_to.hit / lv_from.hit);
            result.dodge = this.ueRound(enemyChar.dodge * lv_to.dodge / lv_from.dodge);
            result.armor_piercing = this.ueRound(enemyChar.armor_piercing * lv_to.armor_piercing / lv_from.armor_piercing);
            result.armor = this.ueRound(enemyChar.armor * lv_to.armor / lv_from.armor);
            result.shield = this.ueRound(enemyChar.shield * lv_to.shield / lv_from.shield);
            result.def = this.ueRound(enemyChar.def * lv_to.def / lv_from.def);
            result.def_break = this.ueRound(enemyChar.def_break * lv_to.def_break / lv_from.def_break);
        }

        return result;
    }
  
    getEnemyPower (enemy, def_percent) {
        var eea = this.breakStringArray(game_config_info.enemy_effect_attack.parameter_value, s => f32(s));
        var eed = this.breakStringArray(game_config_info.enemy_effect_defence.parameter_value, s => f32(s));
        if (eea.length < 5 || eed.length < 5)
            return -1;

        // effect_attack = 22 * 当前人数 * ((伤害 + 破防 * 0.85)* 射速 / 50 * 命中 / (命中 + 35) + 2)
        var effect_attack = this.ueCeil(eea[0] * enemy.number * ((enemy.pow + eea[4] * enemy.def_break) * enemy.rate / eea[1] * enemy.hit / (enemy.hit + eea[2]) + eea[3]));
        // effect_defence = 0.25 * (当前总生命 * (35 + 回避) / 35 * 200 / (200 - 护甲) + 100) * (防护 * 2 - 防护 * 当前防护% + 150 * 2) / (防护 - 防护 * 当前防护% + 150) / 2
        var defEff = f32(f32(enemy.def * def_percent) / 100);
        var effect_defence = this.ueCeil(eed[0] * (enemy.maxlife * (eed[1] + enemy.dodge) / eed[1] * eed[2] / (eed[2] - enemy.armor) + eed[3]) * 
                             (enemy.def * 2 - defEff + eed[4] * 2) / (enemy.def - defEff + eed[4]) / 2);
        var effect = this.ueCeil(f32(enemy.effect_ratio) * (f32(effect_attack) + f32(effect_defence)));

        return effect;
    }

    getEnemyTeamPower (enemyTeam, turnNo) {
        var power = 0;
        var lvUp = this.getEnemyTeamLvCorrection(enemyTeam, turnNo);
        $.each(enemyTeam.member_ids, (index, member_ids) => {
            var member = enemy_in_team_info[member_ids];
            var enemy = this.getEnemyCharAtLevel(member.enemy_character_type_id, member.level + lvUp, member.number);
            power += this.getEnemyPower(enemy, member.def_percent);
        });
        return power;
    }
    
    getEnemyTeamPowerDecoratedString (enemyTeam, turnNo, power = null) {
        if (power === null)
            power = this.getEnemyTeamPower(enemyTeam, turnNo);

        if (enemyTeam.lv_up_array.length > 0)
            return power + '*'
        else
            return power.toString()
    }

    getEnemyTeamLvCorrection (enemyTeam, turnNo) {
        if (turnNo)
            turnNo -= 1; // lvUpArray start from 0 (= 1st turn)
        else
            turnNo = 0;

        var lvUpArray = enemyTeam.lv_up_array;
        if (lvUpArray.length == 0 || turnNo < 0) {
            return 0;
        } else if (turnNo >= lvUpArray.length) {
            return lvUpArray[lvUpArray.length - 1];
        } else {
            return lvUpArray[turnNo];
        }
    }

    breakStringArray(str, converter, seperator = ",") {
        if (str === "")
            return [];

        var tokens = str.split(seperator);
        var result = [];
        $.each(tokens, (index, val) => {
            result.push(converter(val));
        });
        return result;
    }

    ueRound(x) {
        return Math.round(f32(x));
    }

    ueCeil(x) {
        return Math.ceil(f32(x));
    }

  }
  
  const Game = new GameClass()
  
  export default Game
  