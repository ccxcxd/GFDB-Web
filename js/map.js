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

        var canvas = map.fgCanvas;
        var lastX, lastY;
        var dragged = false;
        var mousedowned = false;
        canvas.addEventListener('mousedown', function (evt) {
            document.body.style.mozUserSelect = document.body.style.webkitUserSelect = document.body.style.userSelect = 'none';
            lastX = evt.offsetX || (evt.pageX - canvas.offsetLeft);
            lastY = evt.offsetY || (evt.pageY - canvas.offsetTop);
            mousedowned = true;
        }, false);

        canvas.addEventListener('mousemove', function (evt) {
            if (mousedowned) {
                var x = evt.offsetX || (evt.pageX - canvas.offsetLeft);
                var y = evt.offsetY || (evt.pageY - canvas.offsetTop);
                var dx = map.dx + (x - lastX) / map.scale;
                var dy = map.dy + (y - lastY) / map.scale;
                if (map.applyTranslation(dx, dy))
                    map.drawFgImage();
                lastX = x;
                lastY = y;
            }
        }, false);

        canvas.addEventListener('mouseup', function (evt) {
            mousedowned = false;
        }, false);

        canvas.addEventListener('wheel', function (evt) {
            var delta = Math.sign(evt.deltaX + evt.deltaY);
            var x = evt.offsetX || (evt.pageX - canvas.offsetLeft);
            var y = evt.offsetY || (evt.pageY - canvas.offsetTop);
            if (delta != 0) {
                var scale = map.scale / Math.pow(1.1, delta);
                if (map.applyScale(scale, x, y))
                    map.drawFgImage();
                evt.preventDefault();
            }
        }, false);
    },

    show: false,
    missionId: 1,
    mapImgName: null,
    enemyPowerImgName: "images/misc/power.png",
    displayWidth: 0,    // fg_x max
    displayHeight: 0,   // fg_y max
    width: 0,           // bg_x max
    height: 0,          // bg_y max
    dx: 0,              // bg_x offset
    dy: 0,              // bg_y offset
    scale: 1.0,         // = fg_xy / bg_xy
    scaleMin: 1.0,

    generate: function () {
        map.show = true;
        map.missionId = Number($("#map_select").val());
        map.preloadResources();

        // wait for all resources loaded to avoid racing conditions in drawing
        imgLoader.onload(function () {
            var mission = map.mission_info[map.missionId];
            map.width = Math.abs(mission.map_eff_width);
            map.height = Math.abs(mission.map_eff_height);
            map.bgCanvas.width = map.width;
            map.bgCanvas.height = map.height;

            map.drawBgImage();

            map.scaleMin = map.fgCanvas.clientWidth / map.width;
            map.displayWidth = map.width * map.scaleMin;
            map.displayHeight = map.height * map.scaleMin;
            map.fgCanvas.width = map.displayWidth;
            map.fgCanvas.height = map.displayHeight;
            map.setStartingPosition();

            map.drawFgImage();
        });
    },

    remove: function () {
        map.show = false;
        map.fgCanvas.height = 0;
        map.bgCanvas.height = 0;
    },

    download: function () {
        if (!map.show)
            return;

        map.fgCanvas.toBlob(function (blob) {
            window.open(URL.createObjectURL(blob), "_blank");
        }, "image/png");
    },

    preloadResources: function () {
        // load images
        var mission = map.mission_info[map.missionId];
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
    },

    drawBgImage: function () {
        var ctx = map.bgCtx;
        var bgImg = imgLoader.imgs[map.mapImgName];
        var mission = map.mission_info[map.missionId];

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
        if (!map.show)
            return;

        var mission = map.mission_info[map.missionId];
        var scale = map.scale;
        var ctx = map.fgCtx;

        ctx.clearRect(0, 0, map.displayWidth, map.displayHeight);

        ctx.drawImage(map.bgCanvas, 0, 0, map.width, map.height,
            map.dx * scale, map.dy * scale, map.width * scale, map.height * scale);

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
        var leader_info = map.enemy_character_type_info[enemy_team.enemy_leader];
        var spineImg = imgLoader.imgs[leader_info.imagename];
        if (spineImg != null) {
            var w = spineImg.naturalWidth;
            var h = spineImg.naturalHeight;
            var scale = map.scale;
            ctx.drawImage(spineImg, 0, 0, w, h, (x0 - w / 2 + map.dx) * scale, (y0 - h / 2 + map.dy) * scale, w * scale, h * scale);
        } else {
            map.drawSpineAlternativeText(ctx, x0, y0, $.t(leader_info.name));
        }
    },

    drawSpineAlternativeText: function (ctx, x0, y0, text) {
        x0 = Math.floor((x0 + map.dx) * map.scale);
        y0 = Math.floor((y0 + map.dy) * map.scale) + 12;

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

    drawEnemyPower: function (ctx, x0, y0, power, map_difficulty) {
        var img = imgLoader.imgs[map.enemyPowerImgName];
        var imgW = img.naturalWidth;
        var imgH = img.naturalHeight;
        var scale = Math.max(map.scale, 0.6);
        var x_off = 110;
        var y_off = 50;
        var w = Math.floor(160 * scale);
        var h = Math.floor(imgH * scale);
        x0 = Math.floor((x0 + x_off - w / 2 + map.dx) * map.scale);
        y0 = Math.floor((y0 + y_off - h / 2 + map.dy) * map.scale);

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
        ctx.drawImage(img, 0, 0, imgW, imgH, x0, y0, Math.floor(imgW * scale), h);
        ctx.font = Math.floor(24 * scale) + "px EnemyPower";
        ctx.textAlign = "start";
        ctx.fillStyle = "black";
        ctx.fillText(power, x0 + 65 * scale, y0 + h * 0.8);
        ctx.restore();
    },

    drawWatermark: function (ctx) {
        ctx.save();
        ctx.font = "24px sans-serif";
        ctx.textAlign = "end";
        ctx.globalAlpha = 0.8;
        ctx.lineWidth = 3;
        map.drawWatermarkText(ctx, "http://underseaworld.net/gf/", ctx.canvas.width, ctx.canvas.height - 6);
        ctx.restore();
    },

    drawWatermarkText: function (ctx, text, x, y) {
        ctx.strokeStyle = "black";
        ctx.strokeText(text, x, y);
        ctx.fillStyle = "white";
        ctx.fillText(text, x, y);
    },

    applyTranslation: function (dx, dy) {
        dx = Math.min(dx, 0);
        dx = Math.max(dx, map.displayWidth / map.scale - map.width);
        dy = Math.min(dy, 0);
        dy = Math.max(dy, map.displayHeight / map.scale - map.height);
        if (dx == map.dx && dy == map.dy)
            return false;

        map.dx = dx;
        map.dy = dy;
        return true;
    },

    applyScale: function (scale, x, y) {
        scale = Math.min(scale, 1);
        scale = Math.max(scale, map.scaleMin);
        if (scale == map.scale)
            return false;

        var dx = map.dx + x / scale - x / map.scale;
        var dy = map.dy + y / scale - y / map.scale;
        map.scale = scale;
        map.applyTranslation(dx, dy);
        return true;
    },

    setStartingPosition: function () {
        var margin = 250;

        // initial value
        map.scale = map.scaleMin;
        map.dx = 0;
        map.dy = 0;

        // find the useful area
        var xMin = map.width;
        var xMax = 0;
        var yMin = map.height;
        var yMax = 0;
        var mission = map.mission_info[map.missionId];
        $.each(mission.spot_ids, function (index, spot_id) {
            var spot = map.spot_info[spot_id];
            xMin = Math.min(xMin, spot.coordinator_x);
            xMax = Math.max(xMax, spot.coordinator_x);
            yMin = Math.min(yMin, spot.coordinator_y);
            yMax = Math.max(yMax, spot.coordinator_y);
        });
        // add some margin
        xMin = Math.max(xMin - margin, 0);
        xMax = Math.min(xMax + margin, map.width);
        yMin = Math.max(yMin - margin, 0);
        yMax = Math.min(yMax + margin, map.height);

        // apply scaling & translation
        var w = xMax - xMin;
        var h = yMax - yMin;
        map.applyScale(Math.min(map.displayWidth / w, map.displayHeight / h), 0, 0);
        map.applyTranslation(-xMin, -yMin);
    }
};
