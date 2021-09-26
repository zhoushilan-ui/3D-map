<template>
  <div class="welcomeContainer">
    <div id="container" style="height: 100%; width: 100%"></div>
    <el-row>
      <el-button type="primary" plain @click="handleDistrict(1)"
        >行政区下钻上浮</el-button
      >
      <el-button type="primary" plain @click="handleDistrict(2)"
        >行政区热力 - 鼠标事件</el-button
      >
      <el-button type="primary" plain @click="WorldAirLine()"
        >世界航空线</el-button
      >
      <el-button type="primary" plain @click="BusRoutePlanning()"
        >公交路线规划</el-button
      >
    </el-row>

    <div class="button-group" v-show="buttonGroup">
      <select
        name="code-list"
        id="code-list"
        style="height: 28px;margin-right: 10px;"
      >
        <option value="-1">选择下钻省份</option>
      </select>
      <input id="up-btn" type="button" class="button" value="行政区上浮" />
    </div>
    <div v-show="buttonGroups" class="buttonGroups">
      <input type="button" class="button up-btn" value="行政区上浮" />
    </div>

    <div id="panel" v-show="panel"></div>
  </div>
</template>

<script>
import $ from "jquery";
export default {
  data() {
    return {
      map: null,
      buttonGroup: false,
      buttonGroups: false,
      panel: false,
    };
  },
  mounted() {
    //初始化地图
    this.init();
	this.handleDistrict(1);
  },
  methods: {
    init() {
      this.buttonGroups = false;
      this.map = new AMap.Map("container", {
        mapStyle: "amap://styles/8067e27b3deae55ccfe3bee28ff396f1",
        center: [116.414617, 39.915156],
        zoom: 7,
        viewMode: "3D", //开启3D视图,默认为关闭
        zooms: [2, 20],
      });
      AMap.plugin(["AMap.ToolBar", "AMap.ControlBar"], () => {
        // 添加 3D 罗盘控制
        this.map.addControl(new AMap.ControlBar());
      });
    },
    handleDistrict(i) {
      this.panel = false;
      if (i == 1) {
        // this.AdministrativeAreaDrillingAndFloating();
        this.buttonGroup = true;
        this.buttonGroups = false;
        $.get(
          "https://a.amap.com/Loca/static/mock/tourist_attractions.csv",
          function(data) {
            var map = new AMap.Map("container", {
              mapStyle: "amap://styles/8067e27b3deae55ccfe3bee28ff396f1",
              pitch: 0,
              // features: ["bg", "road"],
              center: [107.4976, 32.1697],
              zoom: 4,
              viewMode: "3D",
            });
            AMap.plugin(["AMap.ToolBar", "AMap.ControlBar"], () => {
              // 添加 3D 罗盘控制
              map.addControl(new AMap.ControlBar());
            });
            var layer = new Loca.DistrictLayer({
              fitView: true,
              eventSupport: true,
              drillDown: true, // 开启鼠标单击下钻功能，前提要求开启 eventSupport 配置来支持鼠标事件
              map: map,
            });

            layer.setData(data, {
              type: "csv",
              lnglat: "经纬度",
              value: "省内5A景区数量",
            });

            layer.setOptions({
              mode: "count",
              // 是否显示无数据区域，v1.1.1 开始支持
              displayBlank: true,
              style: {
                color: [
                  "#0c2c84",
                  "#225ea8",
                  "#225ea8",
                  "#41b6c4",
                  "#7fcdbb",
                  "#c7e9b4",
                  "#ffffcc",
                ],
                // 无数据区域的颜色填充
                //blankFill: '#e3e3e3'
              },
              selectStyle: false,
            });

            layer.render();

            $("#up-btn").click(function() {
              layer.goto(-1);
            });

            $("#code-list").change(function(ev) {
              var target = ev.target;
              var adcode = $(target).val();
              if (adcode != -1) {
                layer.goto(adcode);
              }
            });
          }
        );

        var optArr = $.map(adcodes, function(item) {
          return (
            '<option value="' + item.adcode + '">' + item.name + "</option>"
          );
        });

        $("#code-list").append(optArr.join(""));
      } else {
        this.buttonGroup = false;
        this.buttonGroups = true;
        var map = new AMap.Map("container", {
          mapStyle: "amap://styles/db9efe6a1745ac24b7269b862f359536",
          viewMode: "3D",
          //   features: ["bg", "road"],
          center: [107.4976, 32.1697],
          zoom: 4,
        });

        var infoWin;

        infoWin = new AMap.InfoWindow({
          closeWhenClickMap: true,
        });

        var vLayer = new Loca.DistrictLayer({
          fitView: true,
          eventSupport: true,
          drillDown: false,
          map: map,
        });

        vLayer.on("click", function(ev) {
          var originalEv = ev.originalEvent;

          var lnglat = map.containerToLngLat(
            new AMap.Pixel(originalEv.clientX, originalEv.clientY)
          );
          var feature = ev.feature;
          var value = ev.value;
          var property = feature.subFeature.properties;

          infoWin.open(map, lnglat);
          var content = [
            "行政区：" + property.name,
            "<br>",
            "数据：" + value,
            "<br>",
            property.childrenNum
              ? '<button onclick="go2Adcode(event, ' +
                property.adcode +
                ')">下钻</button>'
              : "",
          ];
          infoWin.setContent(content.join(""));
        });

        function go2Adcode(event, code) {
          event.stopPropagation();
          infoWin.close();
          vLayer.goto(code);
        }

        $.get("//a.amap.com/Loca/static/mock/tourist_attractions.csv", function(
          data
        ) {
          vLayer.setData(data, {
            type: "csv",
            lnglat: "经纬度",
            value: "省内5A景区数量",
          });

          vLayer.setOptions({
            mode: "count",
            style: {
              color: [
                "#0c2c84",
                "#225ea8",
                "#225ea8",
                "#41b6c4",
                "#7fcdbb",
                "#c7e9b4",
                "#ffffcc",
              ],
            },
            selectStyle: false,
          });

          vLayer.render();
        });

        $(".up-btn").click(function() {
          console.log(111111111111);
          vLayer.goto(-1);
        });
      }
    },
    WorldAirLine() {
      this.buttonGroup = false;
      this.buttonGroups = false;
      this.panel = false;
      var map = new AMap.Map("container", {
        mapStyle: "amap://styles/8067e27b3deae55ccfe3bee28ff396f1",
        // features: ["bg", "road"],
        center: [108.149185, 33.663153],
        zoom: 5,
        pitch: 56,
        viewMode: "3D",
      });

      var layer = new Loca.LinkLayer({
        map: map,
        fitView: true,
      });

      //   let airline = require("../../../../public/static/openflight_airline_1.csv");

      $.get("//a.amap.com/Loca/static/mock/openflight_airline_1.csv", function(
        city_line
      ) {
        console.log(city_line);
        layer
          .setData(city_line, {
            type: "csv",
            lnglat: (e) => {
              var { fromLng, fromLat, toLng, toLat } = e.value;
              return [[fromLng, fromLat], [toLng, toLat]];
            },
          })
          .setOptions({
            style: {
              // 弧度
              curveness: {
                key: "distance",
                scale: "linear",
                clamp: true,
                // 弧度范围
                value: [0, 9],
              },
              // 填充颜色 显示航线的颜色
              color: "#FA5C53",
              borderWidth: 1,
              opacity: 0.6,
            },
          })
          .render();
      });
    },
    BusRoutePlanning() {
      this.panel = true;
      var map = new AMap.Map("container", {
        resizeEnable: true,
        center: [120.040609, 36.270397],
        zoom: 13, //地图显示的缩放级别
      });
      //插件
      map.plugin(["AMap.ToolBar"], () => {
        map.addControl(new AMap.ToolBar());
      });
      if (location.href.indexOf("&guide=1") !== -1) {
        map.setStatus({ scrollWheel: false });
      }

      var transOptions = {
        map: map,
        city: "胶州市",
        panel: "panel",
        //cityd:'乌鲁木齐',
        policy: AMap.TransferPolicy.LEAST_TIME,
      };
      //构造公交换乘类
      var transfer = new AMap.Transfer(transOptions);
      //根据起、终点坐标查询公交换乘路线
      transfer.search(
        new AMap.LngLat(120.006402, 36.304842), //地铁的起始位置
        new AMap.LngLat(120.318581, 36.07041), //终止位置
        function(status, result) {
          // result即是对应的公交路线数据信息，相关数据结构文档请参考  https://lbs.amap.com/api/javascript-api/reference/route-search#m_TransferResult
          if (status === "complete") {
            log.success("绘制公交路线完成");
          } else {
            log.error("公交路线数据查询失败" + result);
          }
        }
      );
    },

    // AdministrativeAreaDrillingAndFloating() {},
    // AdministrativeDistrictHeatPower() {},
  },
};
</script>

<style lang="scss" scoped>
.welcomeContainer {
  width: 100%;
  height: 100%;
  position: relative;
  margin: 0;

  .el-row {
    position: absolute;
    top: 10px;
    left: 20px;
  }

  .button-group {
    widows: 20%;
    position: absolute;
    bottom: 10px;
    right: 10px;
  }
}

/deep/ .amap-info-content.amap-info-outer {
  background-color: #27272b !important;
  color: #f0f2ff;
  width: 100px;
}
/deep/ .bottom-center .amap-info-sharp {
  border-top: 8px solid #27272b;
}
/deep/ .bottom-center button {
  border: none;
  color: #2181ff;
  float: right;
  background: transparent;
}
/deep/ .amap-info-close {
  color: #606166;
}

.buttonGroups {
  width: 8%;
  position: absolute;
  bottom: 10px;
  right: 10px;
}

#panel {
  position: fixed;
  background-color: white;
  max-height: 90%;
  overflow-y: auto;
  top: 65px;
  right: 10px;
  width: 380px;
}
#panel .amap-call {
  background-color: #009cf9;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
}
#panel .amap-lib-transfer {
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  overflow: hidden;
}
</style>
