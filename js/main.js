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

                generateMap(mission_info, spot_info, enemy_team_info, enemy_character_type_info);
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
                    $("<td>").text(member.coordinator_y)
                ).appendTo("#team_table");
            });
            team_tbl_sort.refresh();
        });

        $("#download_map_btn").click(function () {
            document.getElementById("mission_map").toBlob(function (blob) {
                window.open(URL.createObjectURL(blob));
            }, "image/png");
        });

        $("#campaign_select").change();
    });
}

function generateMap(mission_info, spot_info, enemy_team_info, enemy_character_type_info) {
    var mission_id = Number($("#map_select option:checked").val());
    var mission = mission_info[mission_id];

    var canvas = document.getElementById("mission_map");
    canvas.width = Math.abs(mission.map_eff_width);
    canvas.height = Math.abs(mission.map_eff_height);
    var ctx = canvas.getContext('2d');
    if (canvas.getContext) {
        var bgImg = new Image();
        bgImg.onload = function () {
            if (mission.special_type == 1)
                ctx.fillStyle = "#3B639F";
            else
                ctx.fillStyle = "white";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.globalCompositeOperation = "multiply";

            drawBgImageHeler(ctx, this, mission, 0, 0, -1, -1);
            drawBgImageHeler(ctx, this, mission, 1, 0, 1, -1);
            drawBgImageHeler(ctx, this, mission, 2, 0, -1, -1);
            drawBgImageHeler(ctx, this, mission, 0, 1, -1, 1);
            drawBgImageHeler(ctx, this, mission, 1, 1, 1, 1);
            drawBgImageHeler(ctx, this, mission, 2, 1, -1, 1);
            drawBgImageHeler(ctx, this, mission, 0, 2, -1, -1);
            drawBgImageHeler(ctx, this, mission, 1, 2, 1, -1);
            drawBgImageHeler(ctx, this, mission, 2, 2, -1, -1);

            ctx.globalCompositeOperation = "source-over";

            $.each(mission.spot_ids, function (index, spot_id) {
                var spot = spot_info[spot_id];
                $.each(spot.route_types, function (other_id, number_of_ways) {
                    drawLine(ctx, spot.coordinator_x, spot.coordinator_y, spot_info[other_id].coordinator_x, spot_info[other_id].coordinator_y, number_of_ways);
                });
            });

            ctx.font = "bold 48px sans-serif";
            ctx.textAlign = "center";

            $.each(mission.spot_ids, function (index, spot_id) {
                var spot = spot_info[spot_id];

                var imagename = spot.belong + ".png";
                if (spot.if_random) {
                    imagename = "random" + imagename;
                } else if (spot.special_eft) {
                    imagename = "radar" + imagename;
                } else if (spot.active_cycle) {
                    imagename = "closedap" + imagename;
                } else {
                    imagename = spot.type + imagename;
                }
                imagename = "images/spot_" + imagename;
                var spotImg = new Image();
                spotImg.onload = function () {
                    var w = this.naturalWidth;
                    var h = this.naturalHeight;
                    ctx.drawImage(this, spot.coordinator_x - w / 2, spot.coordinator_y - h / 2, w, h);
                    if (spot.enemy_team_id) {
                        var enemy_team = enemy_team_info[spot.enemy_team_id];
                        drawText(ctx, $.t(enemy_character_type_info[enemy_team.enemy_leader].name), spot.coordinator_x, spot.coordinator_y - 12);
                        drawText(ctx, enemy_team.difficulty, spot.coordinator_x, spot.coordinator_y + 36);
                    }
                }
                spotImg.src = imagename;
            });
        };
        bgImg.src = "images/" + mission.map_res_name + ".png";
    }

    $("#mission_map").width("100%");
}

function drawBgImageHeler(ctx, bgImg, mission, x_src, y_src, x_scale, y_scale) {
    var w_all = mission.map_all_width;
    var h_all = mission.map_all_height;
    var w_chop = mission.map_eff_width;
    var h_chop = mission.map_eff_height;
    var x_off = mission.map_offset_x;
    var y_off = mission.map_offset_y;

    if (w_chop < 0) {
        w_chop = -w_chop;
        y_scale = -y_scale;
    }
    if (h_chop < 0) {
        h_chop = -h_chop;
        x_scale = -x_scale;
    }

    x_src = w_all * x_src;
    y_src = h_all * y_src;
    // w_src = w_all, h_src = h_all
    var x_dest = w_all * 3 / 2 + x_off - w_chop / 2;
    var y_dest = h_all * 3 / 2 - y_off - h_chop / 2;
    // w_dest = w_chop, h_dest = h_chop
    var x_inter = Math.max(x_dest, x_src);
    var y_inter = Math.max(y_dest, y_src);
    var w_inter = Math.min(x_dest + w_chop, x_src + w_all) - x_inter;
    var h_inter = Math.min(y_dest + h_chop, y_src + h_all) - y_inter;

    if (w_inter > 0 && h_inter > 0) {
        ctx.save();
        ctx.scale(x_scale, y_scale);

        var x_src_true = (x_inter % w_all);
        if (x_scale < 0) x_src_true = w_all - x_src_true - w_inter;
        x_src_true = x_src_true / w_all * bgImg.naturalWidth;

        var y_src_true = (y_inter % h_all);
        if (y_scale < 0) y_src_true = h_all - y_src_true - h_inter;
        y_src_true = y_src_true / h_all * bgImg.naturalHeight;

        var w_src_true = w_inter / w_all * bgImg.naturalWidth;
        var h_src_true = h_inter / h_all * bgImg.naturalHeight;

        var x_dest_true = (x_inter - x_dest) * x_scale;
        var y_dest_true = (y_inter - y_dest) * y_scale;
        var w_dest_true = w_inter * x_scale;
        var h_dest_true = h_inter * y_scale;

        ctx.drawImage(bgImg, x_src_true, y_src_true, w_src_true, h_src_true, x_dest_true, y_dest_true, w_dest_true, h_dest_true);
        ctx.restore();
    }
}

function drawText(ctx, text, x, y) {
    ctx.shadowColor = "black";
    ctx.shadowBlur = 7;
    ctx.lineWidth = 5;
    ctx.strokeStyle = "black";
    ctx.strokeText(text, x, y);
    ctx.shadowBlur = 0;
    ctx.fillStyle = "white";
    ctx.fillText(text, x, y);
}

function drawLine(ctx, x0, y0, x1, y1, number_of_ways) {
    ctx.shadowColor = "black";
    ctx.shadowBlur = 11;
    ctx.strokeStyle = "white";
    ctx.lineWidth = 25
    ctx.setLineDash([75, 45]);
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.stroke();
    ctx.shadowBlur = 0;
    if (number_of_ways == 1) {
        var dx = x1 - x0;
        var dy = y1 - y0;
        var thickFactor = 50 / Math.sqrt(dx * dx + dy * dy);
        var lenFactor = 0.15;
        ctx.lineWidth = 1
        ctx.fillStyle = "green";
        ctx.beginPath();
        ctx.moveTo(x0 + dx * (0.5 - lenFactor) + dy * thickFactor, y0 + dy * (0.5 - lenFactor) - dx * thickFactor);
        ctx.lineTo(x0 + dx * (0.5 + lenFactor), y0 + dy * (0.5 + lenFactor));
        ctx.lineTo(x0 + dx * (0.5 - lenFactor) - dy * thickFactor, y0 + dy * (0.5 - lenFactor) + dx * thickFactor);
        ctx.fill();
    }
    ctx.setLineDash([]);
}
