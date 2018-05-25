$(document).ready(function () {
    i18next
        .use(i18nextBrowserLanguageDetector)
        .use(i18nextXHRBackend)
        .init({
            backend: {
                loadPath: "locales/{{lng}}/{{ns}}.json",
                parse: (data) => JSON.parse(data)
            },
            whitelist: ["zh-CN", "zh-TW", "ko-KR", "en-US"],
            load: "currentOnly",
            //debug: true,
            fallbackLng: "zh-CN"
        }, function (err, t) {
            jqueryI18next.init(i18next, $);
            $("[data-i18n]").localize();
            document.title = $.t("title");
            setup_page();

            $("#language").change(function () {
                i18next.changeLanguage($("#language").val(), function (err, t) {
                    location.reload();
                });
            });
        });

    i18next.on('languageChanged', function (lng) {
        $("#language").val(lng);
    });
});

function setup_page() {
    var setup_done = false;

    var map_tbl_sort = new Tablesort(document.getElementById("map_table"));
    var team_tbl_sort = new Tablesort(document.getElementById("team_table"));

    var mission_info, spot_info, enemy_team_info, enemy_in_team_info;
    var enemy_character_type_info, campaign_info;
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
        $.getJSON("jsons/campaign_info.json", function (data) {
            campaign_info = data;
        })
    ).then(function () {
        map.init(mission_info, spot_info, enemy_team_info, enemy_character_type_info);

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
            if (team_id > 0)
                $("#team_select").append($("<option>")
                    .attr("value", team_id)
                    .text(team_id));
        });

        $("#campaign_select").change(function () {
            $("#map_select").empty();
            var campaign_id = Number($("#campaign_select").val());
            localStorage.setItem("campaign_select", campaign_id);
            $.each(campaign_info[campaign_id].mission_ids, function (index, mission_id) {
                var mission = mission_info[mission_id];
                var mission_text = mission.index_text + " " + $.t(mission.name);
                $("#map_select").append($("<option>")
                    .attr("value", mission.id)
                    .text(mission_text));
            });
            if (setup_done)
                $("#map_select").change();
        });

        $("#map_select").change(function () {
            $("#map_table tbody").empty();
            var mission_id = Number($("#map_select").val());
            localStorage.setItem("map_select", mission_id);
            $.each(mission_info[mission_id].enemy_team_count, function (enemy_team_id, enemy_team_count) {
                var enemy_team = enemy_team_info[enemy_team_id];
                var count_dict = {};
                $.each(enemy_team.member_ids, function (index, member_id) {
                    var name = $.t(enemy_in_team_info[member_id].enemy_character.name);
                    count_dict[name] = (count_dict[name] || 0) + enemy_in_team_info[member_id].number;
                });
                var members = "";
                $.each(count_dict, function (key, value) {
                    members += key + "*" + value + " ";
                });
                var drops = "";
                $.each(enemy_team.drops, function (index, drop) {
                    drops += $.t(drop) + " ";
                });
                

                $("<tr>").append(
                    $("<td>").text(enemy_team_id).attr("data-team_id", ""),
                    $("<td>").text($.t(enemy_character_type_info[enemy_team.enemy_leader].name)),
                    $("<td>").text(enemy_team.difficulty),
                    $("<td>").text(members),
                    $("<td>").text(enemy_team_count),
                    $("<td>").text(drops)
                ).appendTo("#map_table");
            });
            map_tbl_sort.refresh();

            $("#map_table tbody tr").click(function () {
                $(".table-success").removeClass("table-success");
                $(this).addClass("table-success");
                var enemy_team_id = $("[data-team_id]", this).html();
                $("#team_select").val(enemy_team_id);
                $("#team_select").change();
            });

            if ($("#auto_generate_map_btn").hasClass("active")) {
                map.generate();
            } else {
                var canvas = document.getElementById("map_canvas_fg");
                canvas.width = 0;
                canvas.height = 0;
            }

            if (setup_done)
                $("#map_table tbody tr").first().click();
        });

        $("#team_select").change(function () {
            $("#team_table tbody").empty();
            var team_id = Number($("#team_select").val());
            localStorage.setItem("team_select", team_id);
            $.each(enemy_team_info[team_id].member_ids, function (index, member_id) {
                var member = enemy_in_team_info[member_id];
                var character = member.enemy_character;
                $("<tr>").append(
                    $("<td>").text($.t(character.name)),
                    $("<td>").text(character.number),
                    $("<td>").text(Math.ceil(character.maxlife / character.number)),
                    $("<td>").text(character.pow),
                    $("<td>").text(character.rate),
                    $("<td>").text(character.hit),
                    $("<td>").text(character.dodge),
                    $("<td>").text(character.range),
                    $("<td>").text(character.speed),
                    $("<td>").text(character.armor_piercing),
                    $("<td>").text(character.armor),
                    $("<td>").text(member.coordinator_x),
                    $("<td>").text(member.coordinator_y),
                    $("<td>").text($.t(character.character).replace(new RegExp("//c", "g"), " "))
                ).appendTo("#team_table");
            });
            team_tbl_sort.refresh();
        });

        $("#generate_map_btn").click(function () {
            map.generate();
        });

        $("#auto_generate_map_btn").click(function () {
            $(this).toggleClass("active");
            var auto_gen = $(this).hasClass("active");
            localStorage.setItem("auto_generate_map", auto_gen);
            if (auto_gen)
                $("#generate_map_btn").click();
        });

        $("#download_map_btn").click(function () {
            document.getElementById("map_canvas_fg").toBlob(function (blob) {
                window.open(URL.createObjectURL(blob), "_blank");
            }, "image/png");
        });

        var storage_val = localStorage.getItem("auto_generate_map") === "true";
        if (storage_val) {
            $("#auto_generate_map_btn").addClass("active");
        }

        storage_val = Number(localStorage.getItem("campaign_select")) || 1;
        $("#campaign_select").val(storage_val);
        $("#campaign_select").change();

        storage_val = Number(localStorage.getItem("map_select")) || 5;
        $("#map_select").val(storage_val);
        $("#map_select").change();

        storage_val = Number(localStorage.getItem("team_select")) || 1;
        $("#team_select").val(storage_val);
        $("#team_select").change();

        var setup_done = true;
    });
}
