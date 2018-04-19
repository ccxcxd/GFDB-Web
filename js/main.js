i18n_resources = {
    "zh_CN": {
        "translation": {
            "title": "少女前线敌方数据",
            "map_sel": {
                "label": "选择地图：",
                "normal": "普通",
                "emergency": "紧急",
                "night": "夜战",
            },
            "map_tbl": {
                "id": "编号",
                "leader": "队长",
                "difficulty": "效能",
                "members": "组成"
            },
            "team_sel": {
                "label": "敌人编号：",
            },
            "team_tbl": {
                "name": "名称",
                "number": "扩编",
                "maxlife": "血量",
                "pow": "伤害",
                "rate": "射速",
                "hit": "命中",
                "dodge": "闪避",
                "range": "射程",
                "speed": "移速",
                "armor_piercing": "穿甲",
                "armor": "装甲",
                "coordinator_y": "纵坐标",
                "coordinator_x": "横坐标",
            },
            "language": "简体中文"
        }
    }
}

$(document).ready(function () {
    i18next.init({
        lng: "zh_CN",
        resources: i18n_resources
    }, function (err, t) {
        jqueryI18next.init(i18next, $);
        $("[data-i18n]").localize();
    });
    
    document.title = $.t("title");

    var map_tbl_sort = new Tablesort(document.getElementById("map_table"));
    var team_tbl_sort = new Tablesort(document.getElementById("team_table"));
    
    var mission_info, spot_info, enemy_team_info, enemy_in_team_info;
    var enemy_character_type_info, ally_team_info;
    $.when(
        $.getJSON("jsons/mission_info.json", function(data) {
            mission_info = data;
        }),
        $.getJSON("jsons/spot_info.json", function(data) {
            spot_info = data;
        }),
        $.getJSON("jsons/enemy_team_info.json", function(data) {
            enemy_team_info = data;
        }),
        $.getJSON("jsons/enemy_in_team_info.json", function(data) {
            enemy_in_team_info = data;
        }),
        $.getJSON("jsons/enemy_character_type_info.json", function(data) {
            enemy_character_type_info = data;
        }),
        $.getJSON("jsons/ally_team_info.json", function(data) {
            ally_team_info = data;
        })
    ).then(function() {
        $.each(mission_info, function (id, mission) {
            var suffix;
            switch (mission.if_emergency) {
                case 0:
                    suffix = $.t("map_sel.normal");
                    break;
                case 1:
                    suffix = $.t("map_sel.emergency");
                    break;
                case 3:
                    suffix = $.t("map_sel.night");
                    break;
                default:
                    suffix = "";
            }
            var map_text = mission.campaign + "-" + mission.sub + " " + suffix;
            if (suffix)
                $("#map_select").append($("<option>")
                    .attr("value", mission.id)
                    .text(map_text));
        });

        $.each(enemy_team_info, function (id, team) {
            var team_id = team.id;
            if (team_id > 0 && team_id < 10000)
                $("#team_select").append($("<option>")
                    .attr("value", team_id)
                    .text(team_id));
        });
        
        $("#map_select").change(function() {
            $("#map_table tbody").empty();
            var mission_id = Number($("#map_select option:checked").val());
            $.each(spot_info, function (id, spot) {
                if (spot.mission_id === mission_id)
                {
                    var enemy_team_id;
                    if (spot.enemy_team_id !== 0)
                        enemy_team_id = spot.enemy_team_id;
                    else if (spot.ally_team_id !== 0)
                        enemy_team_id = ally_team_info[spot.ally_team_id].enemy_team_id;
                    else
                        return true;
                    
                    var enemy_team = enemy_team_info[enemy_team_id];
                    var count_dict = {};
                    $.each(enemy_team.member_ids, function (index, member_id) {
                        var name = enemy_in_team_info[member_id].enemy_character.name;
                        count_dict[name] = (count_dict[name] || 0) + enemy_in_team_info[member_id].number;
                    });
                    var count = "";
                    $.each(count_dict, function (key, value) {
                        count += key + "*" + value + " ";
                    });
                    
                    $("<tr>").append(
                        $("<td>").text(enemy_team_id).attr("data-team_id", ""),
                        $("<td>").text(enemy_character_type_info[enemy_team.enemy_leader].name),
                        $("<td>").text("N/A"), //enemy_team.difficulty.ToString()
                        $("<td>").text(count)
                    ).appendTo("#map_table");
                }
            });
            map_tbl_sort.refresh();

            $("#map_table tbody tr").click(function () {
                $(".table-success").removeClass("table-success");
                $(this).addClass("table-success");
                var enemy_team_id = $("[data-team_id]", this).html();
                $("#team_select").val(enemy_team_id);
                $("#team_select").change();
            });
            $("#map_table tbody tr").first().click();
        });

        $("#team_select").change(function () {
            $("#team_table tbody").empty();
            var team_id = Number($("#team_select option:checked").val());
            $.each(enemy_team_info[team_id].member_ids, function (index, member_id) {
                var member = enemy_in_team_info[member_id];
                var character = member.enemy_character;
                $("<tr>").append(
                    $("<td>").text(character.name),
                    $("<td>").text(character.number),
                    $("<td>").text(character.maxlife),
                    $("<td>").text(character.pow),
                    $("<td>").text(character.rate),
                    $("<td>").text(character.hit),
                    $("<td>").text(character.dodge),
                    $("<td>").text(character.range),
                    $("<td>").text(character.speed),
                    $("<td>").text(character.armor_piercing),
                    $("<td>").text(character.armor),
                    $("<td>").text(member.coordinator_y),
                    $("<td>").text(member.coordinator_x)
                ).appendTo("#team_table");
            });
            team_tbl_sort.refresh();
        });

        $("#map_select").change();
    });

});
