$(document).ready(function () {
    i18next
        .use(i18nextBrowserLanguageDetector)
        .use(i18nextXHRBackend)
        .init({
            backend: {
                loadPath: "locales/{{lng}}/{{ns}}.json",
                parse: (data) => JSON.parse(data)
            },
            fallbackLng: "zh-CN"
        }, function (err, t) {
            jqueryI18next.init(i18next, $);
            $("[data-i18n]").localize();
            document.title = $.t("title");
            setup_page();
        });
});

function setup_page() {
    var map_tbl_sort = new Tablesort(document.getElementById("map_table"));
    var team_tbl_sort = new Tablesort(document.getElementById("team_table"));

    var mission_info, spot_info, enemy_team_info, enemy_in_team_info;
    var enemy_character_type_info, ally_team_info, campaign_info;
    $.when(
        $.getJSON("jsons/mission_info.json", function (data) {
            mission_info = data;
        }),
        $.getJSON("jsons/spot_info.json", function (data) {
            spot_info = data;
        }),
        $.getJSON("jsons/enemy_team_info.json", function (data) {
            enemy_team_info = data;
        }),
        $.getJSON("jsons/enemy_in_team_info.json", function (data) {
            enemy_in_team_info = data;
        }),
        $.getJSON("jsons/enemy_character_type_info.json", function (data) {
            enemy_character_type_info = data;
        }),
        $.getJSON("jsons/ally_team_info.json", function (data) {
            ally_team_info = data;
        }),
        $.getJSON("jsons/campaign_info.json", function (data) {
            campaign_info = data;
        })
    ).then(function () {
        $.each(campaign_info, function (id, campaign) {
            var type_text;
            switch (campaign.type) {
                case 0:
                    type_text = $.t("campaign.main");
                    break;
                case 1:
                    type_text = $.t("campaign.event");
                    break;
                case 2:
                    type_text = $.t("campaign.simulation");
                    break;
                default:
                    type_text = "？？";
            }
            var campaign_text = type_text + " " + $.t(campaign.name);
            $("#campaign_select").append($("<option>")
                .attr("value", campaign.id)
                .text(campaign_text));
        });

        $.each(enemy_team_info, function (id, team) {
            var team_id = team.id;
            if (team_id > 0 && team_id < 10000)
                $("#team_select").append($("<option>")
                    .attr("value", team_id)
                    .text(team_id));
        });

        $("#campaign_select").change(function () {
            $("#map_select").empty();
            var campaign_id = Number($("#campaign_select option:checked").val());
            $.each(campaign_info[campaign_id].mission_ids, function (index, mission_id) {
                var mission = mission_info[mission_id];
                var mission_text = mission.index_text + " " + $.t(mission.name);
                $("#map_select").append($("<option>")
                    .attr("value", mission.id)
                    .text(mission_text));
            });
            $("#map_select").change();
        });

        $("#map_select").change(function () {
            $("#map_table tbody").empty();
            var mission_id = Number($("#map_select option:checked").val());
            $.each(spot_info, function (id, spot) {
                if (spot.mission_id === mission_id) {
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

        $("#campaign_select").change();
    });
}
