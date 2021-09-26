<template>
  <div class="welcomeContainer">
    <div id="container" style="height: 100%; width: 100%"></div>
    <el-row>
      <el-button type="primary" plain @click="handleTrafficjam()"
        >3D 热力-路口拥堵指数</el-button
      >
      <el-button type="primary" plain @click="Add3DThermodynamicDiagram()"
        >3D热力图</el-button
      >
      <el-button type="primary" plain @click="handlerAddbound()"
        >为制定的行政区域的边界添加立体的边界</el-button
      >
      <el-button type="primary" plain @click="handlerCylinder()"
        >柱体光照和鼠标事件</el-button
      >
      <el-button type="primary" plain @click="handlerMapInit()"
        >设定楼块样式(相当于围栏)</el-button
      >
    </el-row>
  </div>
</template>

<script>
import $ from "jquery";
export default {
  data() {
    return {
      map: null,
      heatmapOpts: {
        //3d 相关的参数
        "3d": {
          //热度转高度的曲线控制参数，可以利用左侧的控制面板获取
          heightBezier: [0.4, 0.2, 0.4, 0.8],
          //取样精度，值越小，曲面效果越精细，但同时性能消耗越大
          gridSize: 2,
          heightScale: 1,
        },
      },
      buildingLayer: {},
      pitch: 60,
    };
  },
  mounted() {
    //初始化地图
    this.init();
    //3D罗盘插件
    this.handlerTool();
  },
  methods: {
    init() {
      this.buildingLayer = new AMap.Buildings({
        zIndex: 130,
        merge: false,
        sort: false,
        zooms: [17, 20],
      });

      this.map = new AMap.Map("container", {
        mapStyle: "amap://styles/8067e27b3deae55ccfe3bee28ff396f1",
        center: [120.375785, 36.090712],
        zoom: 9,
        viewMode: "3D", //开启3D视图,默认为关闭
        zooms: [2, 20],
        pitch: this.pitch,
      });
    },
    handleTrafficjam() {
      var layer = new Loca.HeatmapLayer({
        map: this.map,
      });
      //使用jquery异步请求获取数据
      $.get("//a.amap.com/Loca/static/mock/sh_road_heat.json", function(datas) {
        layer.setData(datas, {
          lnglat: function(data) {
            return [data.value.lng, data.value.lat];
          },
          value: "queue_len",
        });

        layer
          .setOptions({
            style: {
              radius: 18,
              color: {
                0.5: "#2c7bb6",
                0.65: "#abd9e9",
                0.7: "#ffffbf",
                0.9: "#fde468",
                1.0: "#d7191c",
              },
            },
          })
          .render();
      });
      //设置地图中心点
      this.map.setCenter([121.477323, 31.245688]);
      this.map.setZoom(10); //设置地图层级
    },
    handlerTool() {
      AMap.plugin(["AMap.ControlBar"], () => {
        // 添加 3D 罗盘控制
        this.map.addControl(new AMap.ControlBar());
      });
    },
    Add3DThermodynamicDiagram() {
      //初始化heatmap对象
      var heatmap = new AMap.Heatmap(this.map, this.heatmapOpts);
      heatmap.setDataSet({
        data: heatmapData,
        max: 100,
      });

      //设置地图中心点
      this.map.setCenter([116.399669, 39.926666]);
      this.map.setZoom(11); //设置地图层级

      //控制左侧的曲线控制面板
      (() => {
        var bezierInp = document.getElementById("bezierInp");
        var bezierHelper;

        function onBezierUpdate(val) {
          bezierInp.value = val;

          this.heatmapOpts["3d"].heightBezier = val;

          if (heatmap) {
            heatmap.setOptions(this.heatmapOpts);
          }
        }
        // console.log(this.heatmapOpts["3d"].heightBezier);
        if (this.heatmapOpts["3d"].heightBezier != undefined) {
          bezierHelper.setBezier(this.heatmapOpts["3d"].heightBezier);
        } else {
          return;
        }
        // bezierHelper.setBezier(this.heatmapOpts["3d"].heightBezier);

        bezierInp.value = bezierHelper.getBezier();

        window.onBezierUpdate = onBezierUpdate;
      })();
    },
    handlerAddbound() {
      var object3Dlayer1 = new AMap.Object3DLayer({ zIndex: 1 });
      this.map.add(object3Dlayer1);

      var opts = {
        subdistrict: 0,
        extensions: "all",
        level: "city",
      };

      //利用行政区查询获取边界
      var district = new AMap.DistrictSearch(opts);
      district.search("青岛", (status, result) => {
        var bounds = result.districtList[0].boundaries;
        var height = 30000;
        var color = "#0088ffcc"; //rgba
        var wall = new AMap.Object3D.Wall({
          path: bounds,
          height: height,
          color: color,
        });
        wall.backOrFront = "both";
        wall.transparent = true;
        object3Dlayer1.add(wall);
      });

      //设置地图中心点
      this.map.setCenter([120.387284, 36.077645]);
      this.map.setZoom(9); //设置地图层级
    },
    handlerCylinder() {
      var layer = new Loca.ScatterPointLayer({
        map: this.map,
        eventSupport: true,
      });

      var list = heatGrid.map((value) => {
        var val = value.split("$");
        return {
          coord: val[1],
          value: +val[0],
        };
      });

      layer.setData(list.slice(0, 5000), {
        lnglat: "coord",
      });

      var colors = ["#0553A1", "#0B79B0", "#10B3B0", "#7CCF98", "#DCE872"];

      layer.setOptions({
        // 设定棱柱体顶点数量, 默认 16，呈现圆柱体
        //vertex: 4,
        // 单位米
        unit: "meter",
        light: {
          // 环境光
          ambient: {
            // 光照颜色
            color: "#ffffff",
            // 光照强度，范围 [0, 1]
            intensity: 0.5,
          },
          // 平行光
          directional: {
            color: "#ffffff",
            // 光照方向，是指从地面原点起，光指向的方向。
            // 数组分别表示 X 轴、Y 轴、Z 轴。
            // 其中 X 正向朝东、Y 正向朝南、Z 正向朝地下。
            direction: [1, -1.5, 2],
            intensity: 0.6,
          },
        },
        style: {
          // 正多边形半径
          radius: 500,
          height: {
            key: "value",
            value: [0, 50000],
          },
          // 顶边颜色
          color: {
            key: "value",
            scale: "quantile",
            value: colors,
          },
          opacity: 0.9,
          // 旋转角度，单位弧度
          rotate: (Math.PI / 180) * 45,
        },
        selectStyle: {
          color: "#fcff19",
          opacity: 0.9,
        },
      });

      layer.on("mousemove", (ev) => {
        // openInfoWin(this.map, ev.originalEvent, {
        //   "位置": ev.rawData.coord,
        //   "热度": ev.rawData.value,
        // });
      });

      layer.render();

      // 光照
      this.map.DirectionLight = new AMap.Lights.DirectionLight(
        [0, -1, 2],
        [1, 1, 1],
        0.7
      );

      // 动态改变光照方向
      var angle = 90;
      let that = this;
      function changeLightDirection() {
        angle += 2;
        var dir = [
          Math.cos((angle / 180) * Math.PI),
          -Math.sin((angle / 180) * Math.PI),
          2,
        ];
        that.map.DirectionLight.setDirection(dir);
        that.map.render();
        AMap.Util.requestAnimFrame(changeLightDirection);
      }

      changeLightDirection();

      this.map.setCenter([116.414617, 39.915156]); //设置地图中心点
      this.map.setZoom(11); //设置地图层级
      //   this.map.setPitch = 70;
    },
    handlerMapInit() {
      var options = {
        hideWithoutStyle: false, //是否隐藏设定区域外的楼块
        areas: [
          {
            //围栏1
            //visible:false,//是否可见
            rejectTexture: true, //是否屏蔽自定义地图的纹理
            color1: "ffffff00", //楼顶颜色
            color2: "ffffcc00", //楼面颜色
            path: [
              [116.471163, 39.995403],
              [116.4703, 39.994639],
              [116.469916, 39.994315],
              [116.469194, 39.993719],
              [116.469032, 39.993863],
              [116.468815, 39.994108],
              [116.468625, 39.994355],
              [116.468471, 39.99466],
              [116.468421, 39.994811],
              [116.468366, 39.995156],
              [116.468306, 39.996157],
              [116.468308, 39.996557],
              [116.468483, 39.996884],
              [116.468834, 39.997188],
              [116.469481, 39.997764],
              [116.470511, 39.998708],
              [116.471404, 39.999517],
              [116.471553, 39.999568],
              [116.471713, 39.999563],
              [116.471929, 39.999463],
              [116.473228, 39.998584],
              [116.474008, 39.998046],
              [116.474541, 39.997674],
              [116.474541, 39.997576],
              [116.474604, 39.997049],
              [116.474586, 39.996895],
              [116.474179, 39.996516],
              [116.473585, 39.995997],
              [116.473606, 39.995997],
            ],
          },
          {
            //围栏2
            color1: "ff99ff00",
            color2: "ff999900",
            path: [
              [116.474609, 39.993478],
              [116.474489, 39.993495],
              [116.473693, 39.994009],
              [116.472898, 39.994546],
              [116.472837, 39.9946],
              [116.4728, 39.994653],
              [116.472779, 39.994745],
              [116.47282, 39.994815],
              [116.47491, 39.99655],
              [116.475041, 39.996607],
              [116.47525, 39.996643],
              [116.475715, 39.996686],
              [116.475947, 39.996688],
              [116.476103, 39.996658],
              [116.477228, 39.995932],
              [116.477261, 39.995833],
              [116.477264, 39.995729],
              [116.477205, 39.995625],
              [116.47642, 39.994899],
              [116.474854, 39.993558],
              [116.47469, 39.99348],
              [116.474609, 39.993478],
            ],
          },
          {
            //围栏3
            color1: "ff99ff00",
            color2: "ff999900",
            path: [
              [120.037991, 36.26525],
              [120.038025, 36.261921],
              [120.039795, 36.262095],
              [120.039607, 36.26486],
              [120.038376, 36.265231],
              [120.037991, 36.26525],
            ],
          },
          {
            //围栏4
            color1: "ff99ff00",
            color2: "ff999900",
            path: [
              [113.949857, 22.538697],
              [113.949889, 22.536343],
              [113.953998, 22.536428],
              [113.953961, 22.53889],
              [113.949857, 22.538697],
            ],
          },
          {
            //围栏5
            color1: "ff99ff00",
            color2: "ff999900",
            path: [
              [120.031345, 36.259182],
              [120.031632, 36.255952],
              [120.033285, 36.256097],
              [120.033285, 36.258687],
              // [120.031344, 36.259867],
              [120.031345, 36.259182],
            ],
          },
        ],
      };
      this.buildingLayer.setStyle(options); //此配色优先级高于自定义mapStyle
      this.map.addControl(new AMap.Scale());
      new AMap.Polygon({
        bubble: true,
        fillOpacity: 0.4,
        strokeWeight: 1,
        path: options.areas[0].path,
        map: this.map,
      });
      new AMap.Polygon({
        bubble: true,
        fillColor: "green",
        fillOpacity: 0.2,
        strokeWeight: 1,
        path: options.areas[1].path,
        map: this.map,
      });
      new AMap.Polygon({
        bubble: true,
        fillColor: "red",
        fillOpacity: 0.2,
        strokeWeight: 1,
        path: options.areas[2].path,
        map: this.map,
      });
      new AMap.Polygon({
        bubble: true,
        fillColor: "red",
        fillOpacity: 0.2,
        strokeWeight: 1,
        path: options.areas[3].path,
        map: this.map,
      });
      new AMap.Polygon({
        bubble: true,
        fillColor: "red",
        fillOpacity: 0.2,
        strokeWeight: 1,
        path: options.areas[4].path,
        map: this.map,
      });
    },
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
}
</style>
