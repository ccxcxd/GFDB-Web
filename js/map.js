var map = {
    mission_info: null,
    spot_info: null,
    enemy_team_info: null,
    enemy_character_type_info: null,
    fgCanvas: null,
    fgCtx: null,
    bgCanvas: null,
    bgCtx: null,

    init: function (mission_info, spot_info, enemy_team_info, enemy_character_type_info) {
        map.mission_info = mission_info;
        map.spot_info = spot_info;
        map.enemy_team_info = enemy_team_info;
        map.enemy_character_type_info = enemy_character_type_info;
        map.fgCanvas = document.getElementById("map_canvas_fg");
        map.fgCtx = map.fgCanvas.getContext('2d');
        map.bgCanvas = document.getElementById("map_canvas_bg");
        map.bgCtx = map.bgCanvas.getContext('2d');
        $("#map_canvas_fg").width("100%");
        $("#map_canvas_bg").width("100%").hide();
    },

    missionId: 1,
    mapImgName: null,
    enemyPowerImgName: "images/misc/power.png",
    scale: 1.0,

    generate: function () {
        map.missionId = Number($("#map_select").val());
        var mission = map.mission_info[map.missionId];

        // load images
        map.mapImgName = "images/map/" + mission.map_res_name + ".png";
        imgLoader.add(map.mapImgName);
        $.each(mission.spot_ids, function (index, spot_id) {
            var spot = map.spot_info[spot_id];

            var imagename;
            if (spot.random_get) {
                imagename = "random";
            } else if (spot.special_eft) {
                imagename = "radar";
            } else if (spot.active_cycle) {
                imagename = "closedap";
            } else {
                imagename = "spot" + spot.type;
            }
            imagename = $.t("spot_img." + imagename);
            imagename = "images/spot/" + imagename + spot.belong + ".png";
            spot.imagename = imagename;
            imgLoader.add(imagename);

            if (spot.enemy_team_id) {
                var leader_info = map.enemy_character_type_info[map.enemy_team_info[spot.enemy_team_id].enemy_leader];
                var imagename2 = "images/spine/" + leader_info.code + ".png";
                leader_info.imagename = imagename2;
                imgLoader.add(imagename2);
            }
        });
        imgLoader.add(map.enemyPowerImgName);

        // load font
        var d = $.Deferred();
        document.fonts.load("10pt EnemyPower").then(function () {
            d.resolve();
        });
        imgLoader.loaders.push(d.promise());

        // wait for all images loaded to avoid racing conditions in drawing
        imgLoader.onload(function () {
            map.drawBgImage();

            map.scale = map.fgCanvas.clientWidth / map.bgCanvas.width;
            map.fgCanvas.width = map.bgCanvas.width * map.scale;
            map.fgCanvas.height = map.bgCanvas.height * map.scale;

            map.drawFgImage();
        });
    },

    remove: function () {
        map.fgCanvas.height = 0;
        map.bgCanvas.height = 0;
    },

    download: function () {
        map.fgCanvas.toBlob(function (blob) {
            window.open(URL.createObjectURL(blob), "_blank");
        }, "image/png");
    },

    drawBgImage: function () {
        var mission = map.mission_info[map.missionId];
        map.bgCanvas.width = Math.abs(mission.map_eff_width);
        map.bgCanvas.height = Math.abs(mission.map_eff_height);

        var ctx = map.bgCtx;
        var bgImg = imgLoader.imgs[map.mapImgName];

        // multiply night color
        ctx.save();
        if (mission.special_type == 1)
            ctx.fillStyle = "#3B639F";
        else
            ctx.fillStyle = "white";
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.globalCompositeOperation = "multiply";

        // draw background
        map.drawBgImageHelper(ctx, bgImg, mission, 0, 0, -1, -1);
        map.drawBgImageHelper(ctx, bgImg, mission, 1, 0, 1, -1);
        map.drawBgImageHelper(ctx, bgImg, mission, 2, 0, -1, -1);
        map.drawBgImageHelper(ctx, bgImg, mission, 0, 1, -1, 1);
        map.drawBgImageHelper(ctx, bgImg, mission, 1, 1, 1, 1);
        map.drawBgImageHelper(ctx, bgImg, mission, 2, 1, -1, 1);
        map.drawBgImageHelper(ctx, bgImg, mission, 0, 2, -1, -1);
        map.drawBgImageHelper(ctx, bgImg, mission, 1, 2, 1, -1);
        map.drawBgImageHelper(ctx, bgImg, mission, 2, 2, -1, -1);

        ctx.restore();

        // draw spot connections
        $.each(mission.spot_ids, function (index, spot_id) {
            var spot = map.spot_info[spot_id];
            $.each(spot.route_types, function (other_id, number_of_ways) {
                map.drawConnectionLine(ctx, spot.coordinator_x, spot.coordinator_y,
                    map.spot_info[other_id].coordinator_x, map.spot_info[other_id].coordinator_y, number_of_ways);
            });
        });

        // draw spots
        $.each(mission.spot_ids, function (index, spot_id) {
            var spot = map.spot_info[spot_id];
            var spotImg = imgLoader.imgs[spot.imagename];
            var w = spotImg.naturalWidth;
            var h = spotImg.naturalHeight;
            ctx.drawImage(spotImg, spot.coordinator_x - w / 2, spot.coordinator_y - h / 2);
        });
    },

    drawBgImageHelper: function (ctx, bgImg, mission, x_src, y_src, x_scale, y_scale) {
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
    },

    drawConnectionLine: function (ctx, x0, y0, x1, y1, number_of_ways) {
        ctx.save();
        ctx.shadowColor = "black";
        ctx.shadowBlur = 11;
        ctx.strokeStyle = "white";
        ctx.lineWidth = 25;
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
        ctx.restore();
    },

    drawFgImage: function () {
        var mission = map.mission_info[map.missionId];
        var scale = map.scale;
        var ctx = map.fgCtx;

        ctx.drawImage(map.bgCanvas, 0, 0, map.bgCanvas.width, map.bgCanvas.height, 0, 0, map.bgCanvas.width * scale, map.bgCanvas.height * scale);

        // draw spine first
        $.each(mission.spot_ids, function (index, spot_id) {
            var spot = map.spot_info[spot_id];
            if (spot.enemy_team_id) {
                var enemy_team = map.enemy_team_info[spot.enemy_team_id];
                var x0 = spot.coordinator_x;
                var y0 = spot.coordinator_y;
                map.drawSpine(ctx, x0, y0, enemy_team);
            }
        });

        // then power (can overlay on spine)
        $.each(mission.spot_ids, function (index, spot_id) {
            var spot = map.spot_info[spot_id];
            if (spot.enemy_team_id) {
                var enemy_team = map.enemy_team_info[spot.enemy_team_id];
                var x0 = spot.coordinator_x;
                var y0 = spot.coordinator_y;
                map.drawEnemyPower(ctx, x0, y0, enemy_team.difficulty, mission.difficulty);
            }
        });

        map.drawWatermark(ctx);
    },

    drawSpine: function (ctx, x0, y0, enemy_team) {
        var scale = map.scale;
        var leader_info = map.enemy_character_type_info[enemy_team.enemy_leader];
        var spineImg = imgLoader.imgs[leader_info.imagename];
        if (spineImg != null) {
            var w = spineImg.naturalWidth;
            var h = spineImg.naturalHeight;
            ctx.drawImage(spineImg, 0, 0, w, h, (x0 - w / 2) * scale, (y0 - h / 2) * scale, w * scale, h * scale);
        } else {
            map.drawSpineAlternativeText(ctx, x0, y0, $.t(leader_info.name));
        }
    },

    drawSpineAlternativeText: function (ctx, x0, y0, text) {
        var scale = map.scale;
        x0 = Math.floor(x0 * scale);
        y0 = Math.floor(y0 * scale) + 12;

        ctx.save();
        ctx.font = "bold 32px sans-serif";
        ctx.textAlign = "center";
        ctx.shadowColor = "black";
        ctx.shadowBlur = 5;
        ctx.lineWidth = 9;
        ctx.strokeStyle = "black";
        ctx.strokeText(text, x0, y0);
        ctx.shadowBlur = 0;
        ctx.fillStyle = "white";
        ctx.fillText(text, x0, y0);
        ctx.restore();
    },

    drawEnemyPower: function(ctx, x0, y0, power, map_difficulty) {
        var scale = map.scale;
        var x_off = 140;
        var y_off = 50;
        var w = 160;
        var h = 27;
        x0 = Math.floor((x0 + x_off - w / 2) * scale);
        y0 = Math.floor((y0 + y_off - h / 2) * scale);

        ctx.save();
        if (power <= map_difficulty * 0.5)
            ctx.fillStyle = "white";
        else if (power <= map_difficulty * 0.75)
            ctx.fillStyle = "#FFCC00";
        else if (power <= map_difficulty * 1)
            ctx.fillStyle = "#FF6600";
        else
            ctx.fillStyle = "red";
        ctx.globalAlpha = 0.9;
        ctx.lineWidth = 0;
        ctx.beginPath();
        ctx.moveTo(x0 + h, y0);
        ctx.lineTo(x0, y0 + h);
        ctx.lineTo(x0 + w, y0 + h);
        ctx.lineTo(x0 + w + h, y0);
        ctx.fill();
        ctx.drawImage(imgLoader.imgs[map.enemyPowerImgName], x0, y0);
        ctx.font = "24px EnemyPower";
        ctx.textAlign = "start";
        ctx.fillStyle = "black";
        ctx.fillText(power, x0 + 64, y0 + 22);
        ctx.restore();
    },

    drawWatermark: function (ctx) {
        ctx.save();
        ctx.font = "24px sans-serif";
        ctx.textAlign = "end";
        ctx.globalAlpha = 0.8;
        ctx.lineWidth = 3;
        map.drawWatermarkText(ctx, "http://underseaworld.net/gf/  ", ctx.canvas.width, ctx.canvas.height - 28);
        map.drawWatermarkText(ctx, $.t("about.image_copyright"), ctx.canvas.width, ctx.canvas.height - 4);
        ctx.restore();
    },

    drawWatermarkText: function (ctx, text, x, y) {
        ctx.strokeStyle = "black";
        ctx.strokeText(text, x, y);
        ctx.fillStyle = "white";
        ctx.fillText(text, x, y);
    }
};
