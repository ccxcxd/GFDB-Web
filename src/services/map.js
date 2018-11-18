import $ from 'jquery'
import ImgLoader from './imgLoader'
import Game from './game'

const { saveAs } = require('file-saver/FileSaver.min.js')
const {
  mission_info,
  spot_info,
  enemy_team_info,
  enemy_character_type_info,
  gun_info,
  ally_team_info,
  building_info,
} = mDB

const CANVAS_FG_ID = 'map_canvas_fg'
const CANVAS_BG_ID = 'map_canvas_bg'
const CANVAS_TMP_ID = 'map_canvas_tmp'
const WATERMARK = 'https://gf.underseaworld.net/'
const IMAGE_BASEPATH = `${PUBLIC_PATH}static/img`

const imgLoader = new ImgLoader()

class Map {
  fgCanvas = null
  bgCanvas = null
  tmpCanvas = null

  power_display = false  // 显示效能
  onSpotClick = null  // 点击地图点响应
  afterGenerate = null // 绘制完毕回调
  afterRemove = null // 销毁后回调

  /**
   * init map canvas Object
   */
  constructor ({
    powerDisplay,
    onSpotClick,
    afterGenerate,
    afterRemove,
  }) {
    this.power_display = powerDisplay
    this.onSpotClick = onSpotClick
    this.afterGenerate = afterGenerate
    this.afterRemove = afterRemove
    // init Object data
    this.fgCanvas = document.getElementById(CANVAS_FG_ID);
    this.bgCanvas = document.getElementById(CANVAS_BG_ID);
    this.tmpCanvas = document.getElementById(CANVAS_TMP_ID);

    $("#map_canvas_fg").width("100%")
    $("#map_canvas_bg").width("100%").hide()
    $("#map_canvas_tmp").width("100%").hide()

    const canvas = this.fgCanvas
    let lastX, lastY
    let mousedowned = false

    // 定义监听事件
    const mousedownHandler = (evt) => {
      document.body.style.mozUserSelect
      = document.body.style.webkitUserSelect
      = document.body.style.userSelect
      = 'none';

      lastX = evt.offsetX || (evt.pageX - canvas.offsetLeft);
      lastY = evt.offsetY || (evt.pageY - canvas.offsetTop);
      mousedowned = true;
    };
    const mousemoveHandler = (evt) => {
      if (mousedowned) {
        const x = evt.offsetX || (evt.pageX - canvas.offsetLeft);
        const y = evt.offsetY || (evt.pageY - canvas.offsetTop);
        const dx = this.dx + (x - lastX) / this.scale;
        const dy = this.dy + (y - lastY) / this.scale;
        if (this.applyTranslation(dx, dy))
          this.drawFgImage(canvas);
        lastX = x;
        lastY = y;
      }
    };
    const mouseupHandler = (evt) => {
      mousedowned = false;
      let x = evt.offsetX || (evt.pageX - canvas.offsetLeft);
      let y = evt.offsetY || (evt.pageY - canvas.offsetTop);
      if (lastX == x && lastY == y) {
        x = this.fgX2bgX(x);
        y = this.fgY2bgY(y);
        $.each(mission_info[this.missionId].spot_ids, (index, spot_id) => {
          var spot = spot_info[spot_id];
          var spotImg = imgLoader.imgs[spot.imagename];
          var w = spotImg.naturalWidth;
          var h = spotImg.naturalHeight;
          if (Math.abs(spot.coordinator_x - x) <= w / 2 && Math.abs(spot.coordinator_y - y) <= h / 2) {
            if (this.selectedSpots.length == 1 && this.selectedSpots[0] == spot_id) {
              // if already selected, then de-select
              this.selectedSpots = [];
            } else {
              // select single
              this.selectedSpots = [spot_id];
              if (spot.enemy_team_id && this.onSpotClick) {
                // Remarks: this click event will first make selection with all spots with the same enemy id
                //          then next click will only select the single one because id does not change
                // var tmp = $("#map_table tbody td[data-team_id=" + spot.enemy_team_id + "]");
                // if (tmp.length > 0) {
                //   tmp.parent().click();
                // }
                this.onSpotClick(spot.enemy_team_id)
              }
            }
            this.drawFgImage(canvas);
            return false;
          }
        });
      }
    };
    const wheelHander = (evt) => {
      const delta = Math.sign(evt.deltaX + evt.deltaY);
      const x = evt.offsetX || (evt.pageX - canvas.offsetLeft);
      const y = evt.offsetY || (evt.pageY - canvas.offsetTop);
      if (delta != 0) {
        const scale = this.scale / Math.pow(1.1, delta);
        if (this.applyScale(scale, x, y))
          this.drawFgImage(canvas);
        evt.preventDefault();
      }
    }

    canvas.addEventListener('mousedown', mousedownHandler, false);
    canvas.addEventListener('mousemove', mousemoveHandler, false);
    canvas.addEventListener('mouseup', mouseupHandler, false);
    canvas.addEventListener('mouseleave', mouseupHandler, false);
    canvas.addEventListener('wheel', wheelHander, false);
  }

  show = false
  missionId = 1
  mapImgName = null
  enemyPowerImgName = `${IMAGE_BASEPATH}/misc/power.png`
  friendStatsImgName = `${IMAGE_BASEPATH}/misc/friendstats.png`
  displayWidth = 0    // fg_x max
  displayHeight = 0   // fg_y max
  width = 0           // bg_x max
  height = 0          // bg_y max
  dx = 0              // bg_x offset
  dy = 0              // bg_y offset
  scale = 1.0         // = fg_xy / bg_xy
  scaleMin = 1.0
  turnNo = 1
  selectedSpots = []

  /**
   * generate the map of target map
   */
  generate (missionId, {
    displayPower,
  }) {
    // 应用设置更改
    if (displayPower === false || displayPower === true) {
      this.power_display = displayPower
    }

    this.show = true;
    this.missionId = missionId;
    this.preloadResources();

    // wait for all resources loaded to avoid racing conditions in drawing
    imgLoader.onload(() => {
      var mission = mission_info[this.missionId];
      this.width = Math.abs(mission.map_eff_width);
      this.height = Math.abs(mission.map_eff_height);
      this.bgCanvas.width = this.width;
      this.bgCanvas.height = this.height;

      this.scaleMin = this.fgCanvas.clientWidth / this.width;
      this.displayWidth = this.width * this.scaleMin;
      this.displayHeight = this.height * this.scaleMin;
      this.fgCanvas.width = this.displayWidth;
      this.fgCanvas.height = this.displayHeight;
      this.setStartingPosition();

      this.drawBgImage(this.bgCanvas);
      this.drawFgImage(this.fgCanvas);
      this.afterGenerate();
    });
  }

  remove () {
    this.show = false;
    this.fgCanvas.height = 0;
    this.bgCanvas.height = 0;
    this.afterRemove();
  }

  download (name) {
    if (!this.show)
      return;

    this.fgCanvas.toBlob((blob) => {
      saveAs(blob, `${name}.png`);
    }, "image/png");
  }

  downloadFullMap (name) {
    if (!this.show)
      return;

    // save states
    var displayWidth = this.displayWidth;
    var displayHeight = this.displayHeight;
    var scale = this.scale;
    var dx = this.dx;
    var dy = this.dy;
    var selectedSpots = this.selectedSpots;

    // setup temp canvas
    this.displayWidth = this.width;
    this.displayHeight = this.height;
    this.tmpCanvas.width = this.displayWidth;
    this.tmpCanvas.height = this.displayHeight;
    this.scale = 1;
    this.dx = 0;
    this.dy = 0;
    this.selectedSpots = null;

    // draw temp canvas
    this.drawFgImage(this.tmpCanvas);

    // restore states
    this.displayWidth = displayWidth;
    this.displayHeight = displayHeight;
    this.scale = scale;
    this.dx = dx;
    this.dy = dy;
    this.selectedSpots = selectedSpots;

    // output
    this.tmpCanvas.toBlob((blob) => {
      saveAs(blob, `${name}.png`);
      this.tmpCanvas.height = 0;
    }, "image/png");
  }

  selectAllEnemy (enemy_team_id) {
    this.selectedSpots = [];
    $.each(this.mission_info[this.missionId].spot_ids, (index, spot_id) => {
      if (this.spot_info[spot_id].enemy_team_id == enemy_team_id)
        this.selectedSpots.push(spot_id);
    });
    this.drawFgImage(this.fgCanvas);
  }

  preloadResources () {
    // load images
    var mission = mission_info[this.missionId];
    this.mapImgName = `${IMAGE_BASEPATH}/map/` + mission.map_res_name + ".png";
    imgLoader.add(this.mapImgName);
    $.each(mission.spot_ids, (index, spot_id) => {
      var spot = spot_info[spot_id];

      var imagename;
      if (spot.random_get) {
        imagename = "random";
      } else if (spot.special_eft) {
        imagename = "radar";
      } else if (spot.active_cycle) {
        if (spot.type == 7)
          imagename = "closedhvap";
        else
          imagename = "closedap";
      } else {
        imagename = "spot" + spot.type;
      }
      imagename = __("spot_img." + imagename);
      imagename = `${IMAGE_BASEPATH}/spot/` + imagename + spot.belong + ".png";
      spot.imagename = imagename;
      imgLoader.add(imagename);

      if (spot.hostage_info) {
        var gun = gun_info[spot.hostage_info.split(",")[0]];
        var imagename2 = `${IMAGE_BASEPATH}/spine/` + gun.code + ".png";
        gun.imagename = imagename2;
        imgLoader.add(imagename2);
      }

      if (spot.building_id != 0) {
        var building = building_info[spot.building_id];
        var imagename2 = `${IMAGE_BASEPATH}/building/` + building.code + building.belong + ".png";
        building.imagename = imagename2;
        imgLoader.add(imagename2);
      }

      var loadEnemySpine = false;
      if (spot.ally_team_id) {
        var team = ally_team_info[spot.ally_team_id];
        if (team.initial_type == 1) {
          var leader_info = gun_info[team.leader_id];
          var imagename2 = `${IMAGE_BASEPATH}/spine/` + leader_info.code + ".png";
          leader_info.imagename = imagename2;
          imgLoader.add(imagename2);
        } else {
          loadEnemySpine = true;
        }
      }

      if (loadEnemySpine || spot.enemy_team_id) {
        var leader_info = enemy_character_type_info[enemy_team_info[spot.enemy_team_id].enemy_leader];
        var imagename2 = `${IMAGE_BASEPATH}/spine/` + leader_info.code + ".png";
        leader_info.imagename = imagename2;
        imgLoader.add(imagename2);
      }
    });
    imgLoader.add(this.enemyPowerImgName);
    imgLoader.add(this.friendStatsImgName);

    // load font
    if (document.fonts) {
      var d = $.Deferred();
      document.fonts.load("10pt EnemyPower").then(() => {
        d.resolve();
      });
      imgLoader.loaders.push(d.promise());
    }
  }

  drawBgImage (canvas) {
    var ctx = canvas.getContext('2d');
    var bgImg = imgLoader.imgs[this.mapImgName];
    var mission = mission_info[this.missionId];

    // multiply night color
    ctx.save();
    if (mission.special_type == 1)
      ctx.fillStyle = "#3B639F";
    else
      ctx.fillStyle = "white";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.globalCompositeOperation = "multiply";

    // draw background
    this.drawBgImageHelper(ctx, bgImg, mission, 0, 0, -1, -1);
    this.drawBgImageHelper(ctx, bgImg, mission, 1, 0, 1, -1);
    this.drawBgImageHelper(ctx, bgImg, mission, 2, 0, -1, -1);
    this.drawBgImageHelper(ctx, bgImg, mission, 0, 1, -1, 1);
    this.drawBgImageHelper(ctx, bgImg, mission, 1, 1, 1, 1);
    this.drawBgImageHelper(ctx, bgImg, mission, 2, 1, -1, 1);
    this.drawBgImageHelper(ctx, bgImg, mission, 0, 2, -1, -1);
    this.drawBgImageHelper(ctx, bgImg, mission, 1, 2, 1, -1);
    this.drawBgImageHelper(ctx, bgImg, mission, 2, 2, -1, -1);

    ctx.restore();

    // draw spot connections
    $.each(mission.spot_ids, (index, spot_id) => {
      var spot = spot_info[spot_id];
      $.each(spot.route_types, (other_id, number_of_ways) => {
        this.drawConnectionLine(ctx, spot.coordinator_x, spot.coordinator_y,
          spot_info[other_id].coordinator_x, spot_info[other_id].coordinator_y, number_of_ways);
      });
    });

    // draw spots
    $.each(mission.spot_ids, (index, spot_id) => {
      var spot = spot_info[spot_id];
      var spotImg = imgLoader.imgs[spot.imagename];
      var w = spotImg.naturalWidth;
      var h = spotImg.naturalHeight;
      ctx.drawImage(spotImg, spot.coordinator_x - w / 2, spot.coordinator_y - h / 2);

      // draw buildings
      if (spot.building_id != 0) {
        var building = building_info[spot.building_id];
        this.drawBuilding(ctx, spot.coordinator_x, spot.coordinator_y, building);
      }
    });
  }

  drawBgImageHelper (ctx, bgImg, mission, x_src, y_src, x_scale, y_scale) {
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

  drawConnectionLine (ctx, x0, y0, x1, y1, number_of_ways) {
    ctx.save();
    ctx.shadowColor = "black";
    ctx.shadowBlur = 11;
    ctx.strokeStyle = "white";
    ctx.fillStyle = "white";
    if (number_of_ways == 2) {
      ctx.lineWidth = 25;
      ctx.setLineDash([75, 45]);
      ctx.beginPath();
      ctx.moveTo(x0, y0);
      ctx.lineTo(x1, y1);
      ctx.stroke();
    } else if (number_of_ways == 1) {
      var dx = x1 - x0;
      var dy = y1 - y0;
      var dd = Math.sqrt(dx * dx + dy * dy);
      var w = 15; // width / 2
      var l = 30; // length
      var t = 30; // thickness
      ctx.lineWidth = 0;
      for (var ll = 0; ll < dd; ll += l * 2) {
        ctx.beginPath();
        ctx.moveTo(x0 + ll * dx / dd + w * dy / dd, y0 + ll * dy / dd - w * dx / dd);
        ctx.lineTo(x0 + (ll + t) * dx / dd + w * dy / dd, y0 + (ll + t) * dy / dd - w * dx / dd);
        ctx.lineTo(x0 + (ll + t + l) * dx / dd, y0 + (ll + t + l) * dy / dd);
        ctx.lineTo(x0 + (ll + t) * dx / dd - w * dy / dd, y0 + (ll + t) * dy / dd + w * dx / dd);
        ctx.lineTo(x0 + ll * dx / dd - w * dy / dd, y0 + ll * dy / dd + w * dx / dd);
        ctx.lineTo(x0 + (ll + l) * dx / dd, y0 + (ll + l) * dy / dd);
        ctx.fill();
      }
    } else {
      ctx.lineWidth = 25;
      ctx.beginPath();
      ctx.moveTo(x0, y0);
      ctx.lineTo(x1, y1);
      ctx.stroke();
    }
    ctx.restore();
  }

  drawBuilding (ctx, x0, y0, building) {
    var spineImg = imgLoader.imgs[building.imagename];
    if (spineImg != null) {
      var wo = spineImg.naturalWidth;
      var ho = spineImg.naturalHeight;
      var shift = building.shifting_spot.split(",");
      x0 -= parseInt(shift[0]);
      y0 -= parseInt(shift[1]);
      var w = wo * 1.5;
      var h = ho * 1.5;
      ctx.drawImage(spineImg, 0, 0, wo, ho, x0 - w / 2, y0 - h / 2, w, h);
    } else {
      this.drawBgSpineAlternativeText(ctx, x0, y0, __(building.name));
    }
  }

  drawBgSpineAlternativeText (ctx, x0, y0, text, selected) {
    var scale = this.scale;
    ctx.save();
    ctx.font = "bold " + Math.floor(32 / scale) + "px " + __("font.sans-serif");
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.shadowColor = "black";
    ctx.shadowBlur = 5 / scale;
    ctx.lineWidth = 9 / scale;
    ctx.strokeStyle = selected ? "yellow" : "black";
    ctx.strokeText(text, x0, y0);
    ctx.shadowBlur = 0;
    ctx.fillStyle = selected ? "red" : "white";
    ctx.fillText(text, x0, y0);
    ctx.restore();
  }

  drawFgImage (canvas) {
    if (!this.show)
      return;

    var mission = mission_info[this.missionId];
    var scale = this.scale;
    var ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, this.displayWidth, this.displayHeight);

    ctx.drawImage(
      this.bgCanvas,
      0, 0,
      this.width, this.height,
      this.dx * scale, this.dy * scale,
      this.width * scale, this.height * scale,
    );

    // draw spine first
    $.each(mission.spot_ids, (index, spot_id) => {
      var spot = spot_info[spot_id];
      var x0 = spot.coordinator_x;
      var y0 = spot.coordinator_y;
      var selected = $.inArray(spot_id, this.selectedSpots) !== -1;
      if (spot.building_id != 0) {
        var shift = building_info[spot.building_id].shifting_team.split(",");
        x0 += parseInt(shift[0]);
        y0 += parseInt(shift[1]);
      }
      if (spot.hostage_info) {
        var s = spot.hostage_info.split(",");
        var gun = gun_info[s[0]];
        this.drawSpine(ctx, x0, y0, gun.imagename, __(gun.name), selected);
      } else if (spot.ally_team_id) {
        var ally_team = ally_team_info[spot.ally_team_id];
        if (ally_team.initial_type == 1) {
          var leader_info = gun_info[ally_team.leader_id];
          this.drawSpine(ctx, x0, y0, leader_info.imagename, __(leader_info.name), selected);
        } else {
          var enemy_team = enemy_team_info[spot.enemy_team_id];
          var leader_info = enemy_character_type_info[enemy_team.enemy_leader];
          this.drawSpine(ctx, x0, y0, leader_info.imagename, __(leader_info.name), selected);
        }
      } else if (spot.enemy_team_id) {
        var enemy_team = enemy_team_info[spot.enemy_team_id];
        var leader_info = enemy_character_type_info[enemy_team.enemy_leader];
        this.drawSpine(ctx, x0, y0, leader_info.imagename, __(leader_info.name), selected);
      }
    });

    // then power (can overlay on spine)
    if (this.power_display) {
      $.each(mission.spot_ids, (index, spot_id) => {
        var spot = spot_info[spot_id];
        var x0 = spot.coordinator_x;
        var y0 = spot.coordinator_y;
        if (spot.hostage_info) {
          var s = spot.hostage_info.split(",");
          var gun = gun_info[s[0]];
          var hp = s[1];
          var power = Math.floor(0.15 * mission.difficulty * hp);
          this.drawFriendStats(ctx, x0, y0, __("game.30135"), "#FF4D00", __("game.30136"), "#DDDDDD", power, hp, "hostage", "#676767");
        } else if (spot.ally_team_id) {
          var ally_team = ally_team_info[spot.ally_team_id];
          var allyColor = "white";
          var order = "  ";
          var power = "";
          var text = __(ally_team.name);
          if (typeof text === "undefined")
            text = "";
          if (ally_team.initial_type == 0) {
            allyColor = "#FFC33E";
            var enemy_team = enemy_team_info[spot.enemy_team_id];
            power = Game.getEnemyTeamPower(enemy_team, this.turnNo) + (enemy_team.correction_turn?"*":"");
          } else if (ally_team.initial_type == 1) {
            allyColor = "#96C9F8";
            order = __("game.30132")
          } else if (ally_team.initial_type == 2) {
            allyColor = "#FF0000";
            var enemy_team = enemy_team_info[spot.enemy_team_id];
            power = Game.getEnemyTeamPower(enemy_team, this.turnNo) + (enemy_team.correction_turn?"*":"");
          }
          this.drawFriendStats(ctx, x0, y0, text, allyColor, order, allyColor, power, 1, "ally", allyColor);
        } else if (spot.enemy_team_id) {
          var enemy_team = enemy_team_info[spot.enemy_team_id];
          power = Game.getEnemyTeamPower(enemy_team, this.turnNo) + (enemy_team.correction_turn?"*":"");
          this.drawEnemyPower(ctx, x0, y0, power, mission.difficulty);
        }
      });
    }

    this.drawWatermark(ctx);
  }

  drawSpine (ctx, x0, y0, imagename, alternativeText, selected) {
    var spineImg = imgLoader.imgs[imagename];
    if (spineImg != null) {
      var w = spineImg.naturalWidth;
      var h = spineImg.naturalHeight;
      var scale = this.scale;
      ctx.save();
      if (selected) {
        ctx.shadowColor = "yellow";
        ctx.shadowBlur = 10;
      }
      ctx.drawImage(spineImg, 0, 0, w, h, this.bgX2fgX(x0 - w / 2), this.bgY2fgY(y0 - h / 2), w * scale, h * scale);
      ctx.restore();
    } else {
      this.drawSpineAlternativeText(ctx, x0, y0, alternativeText);
    }
  }

  drawSpineAlternativeText (ctx, x0, y0, text, selected) {
    x0 = Math.floor(this.bgX2fgX(x0));
    y0 = Math.floor(this.bgY2fgY(y0));

    ctx.save();
    ctx.font = "bold 32px " + __("font.sans-serif");
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.shadowColor = "black";
    ctx.shadowBlur = 5;
    ctx.lineWidth = 9;
    ctx.strokeStyle = selected ? "yellow" : "black";
    ctx.strokeText(text, x0, y0);
    ctx.shadowBlur = 0;
    ctx.fillStyle = selected ? "red" : "white";
    ctx.fillText(text, x0, y0);
    ctx.restore();
  }

  drawEnemyPower (ctx, x0, y0, power, map_difficulty) {
    var img = imgLoader.imgs[this.enemyPowerImgName];
    var imgW = img.naturalWidth;
    var imgH = img.naturalHeight;
    var scale = Math.max(this.scale, 0.6);
    var x_off = 110;
    var y_off = 50;
    var w = Math.floor(160 * scale);
    var h = Math.floor(imgH * scale);
    x0 = Math.floor(this.bgX2fgX(x0 + x_off - w / 2));
    y0 = Math.floor(this.bgY2fgY(y0 + y_off - h / 2));

    ctx.save();
    var powerNo = parseInt(power);
    if (powerNo <= map_difficulty * 0.5)
      ctx.fillStyle = "white";
    else if (powerNo <= map_difficulty * 0.75)
      ctx.fillStyle = "#FFCC00";
    else if (powerNo <= map_difficulty * 1)
      ctx.fillStyle = "#FF6600";
    else
      ctx.fillStyle = "red";
    ctx.globalAlpha = 0.9;
    ctx.lineWidth = 0;
    this.drawParallelogram(ctx, x0, y0, w, h);
    ctx.drawImage(img, 0, 0, imgW, imgH, x0, y0, Math.floor(imgW * scale), h);
    ctx.font = Math.floor(24 * scale) + "px EnemyPower";
    ctx.textAlign = "start";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "black";
    ctx.fillText(power, x0 + 65 * scale, y0 + h / 2);
    ctx.restore();
  }

  drawFriendStats (ctx, x0, y0, name, nameColor, order, orderColor, power, hp, hpType, hpColor) {
    var img = imgLoader.imgs[this.friendStatsImgName];
    var imgW = img.naturalWidth;
    var imgH = img.naturalHeight;
    var scale = Math.max(this.scale, 0.6);
    var x_off = 65;
    var y_off = 40;
    x0 = Math.floor(this.bgX2fgX(x0 + x_off));
    y0 = Math.floor(this.bgY2fgY(y0) - (y_off + imgH) * scale);

    ctx.save();
    ctx.globalAlpha = 0.9;
    ctx.drawImage(img, 0, 0, imgW, imgH, x0, y0, Math.floor(imgW * scale), Math.floor(imgH * scale));
    if (hpType == "hostage") {
      var hpMax = Math.max(hp, 5);
      var wBar = Math.floor(217 / hpMax) - 1;
      var xCur = x0 + 22 * scale;
      for (var i = 0; i < hpMax; i++) {
        if (i < hp)
          ctx.fillStyle = orderColor;
        else
          ctx.fillStyle = hpColor;
        this.drawParallelogram(ctx, xCur, y0 + 2 * scale, wBar * scale, 9 * scale);
        xCur += wBar * scale + 1;
      }
    } else if (hpType == "ally") {
      ctx.fillStyle = hpColor;
      this.drawParallelogram(ctx, x0 + 22 * scale, y0 + 2 * scale, 217 * scale, 9 * scale);
    }
    ctx.textAlign = "start";
    ctx.textBaseline = "middle";
    ctx.font = "bold " + Math.floor(36 * scale) + "px " + __("font.serif");
    ctx.fillStyle = nameColor;
    ctx.fillText(name, x0 + 4 * scale, y0 + 39 * scale);
    if (order != "") {
      var x1 = x0 + 187 * scale;
      var y1 = y0 + 26 * scale;
      var w = 60 * scale;
      var h = 46 * scale;
      // order pad should also has transparency, but for the way we draw things, have to set alpha to 1
      ctx.save();
      ctx.globalAlpha = 1;
      ctx.fillStyle = orderColor;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x1 + w, y1);
      ctx.arc(x1 + w, y1 + h / 2, h / 2, 1.5 * Math.PI, 0.5 * Math.PI);
      ctx.lineTo(x1, y1 + h);
      ctx.arc(x1, y1 + h / 2, h / 2, 0.5 * Math.PI, 1.5 * Math.PI);
      ctx.fill();
      ctx.font = Math.floor(36 * scale) + "px " + __("font.sans-serif");
      ctx.textAlign = "center";
      ctx.fillStyle = "black";
      ctx.fillText(order, x1 + w / 2, y1 + h / 2);
      ctx.restore();
    }
    ctx.font = Math.floor(20 * scale) + "px EnemyPower";
    ctx.textAlign = "start";
    ctx.fillStyle = "white";
    ctx.fillText(power, x0 + 45 * scale, y0 + 68 * scale);
    ctx.restore();
  }

  drawParallelogram (ctx, x0, y0, w, h) {
    ctx.beginPath();
    ctx.moveTo(x0 + h, y0);
    ctx.lineTo(x0, y0 + h);
    ctx.lineTo(x0 + w, y0 + h);
    ctx.lineTo(x0 + w + h, y0);
    ctx.fill();
  }

  drawWatermark (ctx) {
    ctx.save();
    ctx.font = "24px sans-serif";
    ctx.textAlign = "end";
    ctx.textBaseline = "bottom";
    ctx.globalAlpha = 0.8;
    ctx.lineWidth = 3;
    this.drawWatermarkText(ctx, WATERMARK, ctx.canvas.width - 6, ctx.canvas.height - 2);
    ctx.restore();
  }

  drawWatermarkText (ctx, text, x, y) {
    ctx.strokeStyle = "black";
    ctx.strokeText(text, x, y);
    ctx.fillStyle = "white";
    ctx.fillText(text, x, y);
  }

  applyTranslation (dx, dy) {
    dx = Math.min(dx, 0);
    dx = Math.max(dx, this.displayWidth / this.scale - this.width);
    dy = Math.min(dy, 0);
    dy = Math.max(dy, this.displayHeight / this.scale - this.height);
    if (dx == this.dx && dy == this.dy)
      return false;

    this.dx = dx;
    this.dy = dy;
    return true;
  }

  applyScale (scale, x, y) {
    scale = Math.min(scale, 1);
    scale = Math.max(scale, this.scaleMin);
    if (scale == this.scale)
      return false;

    var dx = this.dx + x / scale - x / this.scale;
    var dy = this.dy + y / scale - y / this.scale;
    this.scale = scale;
    this.applyTranslation(dx, dy);
    return true;
  }

  bgX2fgX (x) {
    return (x + this.dx) * this.scale;
  }

  bgY2fgY (y) {
    return (y + this.dy) * this.scale;
  }

  fgX2bgX (x) {
    return x / this.scale - this.dx;
  }

  fgY2bgY (y) {
    return y / this.scale - this.dy;
  }

  setStartingPosition () {
    var margin = 250;

    // initial value
    this.scale = this.scaleMin;
    this.dx = 0;
    this.dy = 0;

    // find the useful area
    var xMin = this.width;
    var xMax = 0;
    var yMin = this.height;
    var yMax = 0;
    var mission = mission_info[this.missionId];
    $.each(mission.spot_ids, (index, spot_id) => {
      var spot = spot_info[spot_id];
      xMin = Math.min(xMin, spot.coordinator_x);
      xMax = Math.max(xMax, spot.coordinator_x);
      yMin = Math.min(yMin, spot.coordinator_y);
      yMax = Math.max(yMax, spot.coordinator_y);
    });
    // add some margin
    xMin = Math.max(xMin - margin, 0);
    xMax = Math.min(xMax + margin, this.width);
    yMin = Math.max(yMin - margin, 0);
    yMax = Math.min(yMax + margin, this.height);

    // apply scaling & translation
    var w = xMax - xMin;
    var h = yMax - yMin;
    this.applyScale(Math.min(this.displayWidth / w, this.displayHeight / h), 0, 0);
    this.applyTranslation(-xMin, -yMin);
  }
}

export default Map
