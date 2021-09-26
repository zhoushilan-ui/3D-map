<template>
  <div class="welcomeContainer">
    <div id="container" style="height: 100%; width: 100%"></div>
    <el-row>
      <el-button type="primary" plain @click="handleMap()">室内地图</el-button>
      <el-button type="success" plain @click="handl3DMap()"
        >3D室内地图</el-button
      >
      <el-button type="primary" plain @click="Drive()"
        >汽车的轨迹回放</el-button
      >
      <el-button type="primary" plain @click="handlerDrive()"
        >起始点到终点的路径</el-button
      >
      <el-button type="primary" plain @click="handlerWorld()"
        >简易行政区图-世界</el-button
      >
      <el-button type="primary" plain @click="handlerWeather()"
        >天气预报</el-button
      >
    </el-row>
    <div class="legend" id="legend" v-show="legend">
      <ul></ul>
    </div>
    <div v-show="callApp">
      <input type="button" id="callApp" class="btn" value="点击调起高德地图" />
    </div>
    <!-- 天气预报 -->
    <div id="weather-forecast" v-show="Weather"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      map: null,
      callApp: false,
      Weather: false,
    };
  },
  mounted() {
    //初始化地图
    this.handleMap();
  },
  methods: {
    handleMap() {
      this.callApp = false;
      this.legend = false;
      this.Weather = false;
      //平面室内地图
      AMap.plugin(["AMap.IndoorMap"], () => {
        var indoorMap = new AMap.IndoorMap({ alwaysShow: true });
        //设定在没有矢量底图的时候也显示，默认情况下室内图仅在有矢量底图的时候显示
        this.map = new AMap.Map("container", {
          mapStyle: "amap://styles/8067e27b3deae55ccfe3bee28ff396f1",
          resizeEnable: true,
          zoom: 17,
          showIndoorMap: false, //隐藏地图自带的室内地图图层
          layers: [indoorMap, new AMap.TileLayer()],
        });
        indoorMap.showIndoorMap("B000A856LJ");
      });
    },
    handl3DMap() {
      this.callApp = false;
      this.legend = true;
      //3D室内地图
      this.map = new AMap.Map("container", {
        resizeEnable: true,
        center: [116.518542, 39.924677],
        zoom: 18,
        pitch: 50,
        viewMode: "3D",
      });
      this.map.on("indoor_create", () => {
        this.map.indoorMap.showIndoorMap("B000A856LJ", 5);
      });

      //3D罗盘控制盘
      this.handlerTool(this.map);
    },
    Drive() {
      this.callApp = false;
      this.Weather = false;
      this.map = new AMap.Map("container", {
        resizeEnable: true,
        center: [116.397428, 39.90923],
        zoom: 17,
      });
      var marker,
        lineArr = [
          //汽车轨迹的路径
          [116.478935, 39.997761],
          [116.478939, 39.997825],
          [116.478912, 39.998549],
          [116.478912, 39.998549],
          [116.478998, 39.998555],
          [116.478998, 39.998555],
          [116.479282, 39.99856],
          [116.479658, 39.998528],
          [116.480151, 39.998453],
          [116.480784, 39.998302],
          [116.480784, 39.998302],
          [116.481149, 39.998184],
          [116.481573, 39.997997],
          [116.481863, 39.997846],
          [116.482072, 39.997718],
          [116.482362, 39.997718],
          [116.483633, 39.998935],
          [116.48367, 39.998968],
          [116.484648, 39.999861],
        ];

      marker = new AMap.Marker({
        map: this.map,
        position: [116.478935, 39.997761],
        icon: "https://webapi.amap.com/images/car.png",
        offset: new AMap.Pixel(-26, -13),
        autoRotation: true,
        angle: -90,
      });

      // 绘制轨迹
      var polyline = new AMap.Polyline({
        map: this.map,
        path: lineArr,
        showDir: true,
        strokeColor: "#28F", //线颜色
        // strokeOpacity: 1,     //线透明度
        strokeWeight: 6, //线宽
        // strokeStyle: "solid"  //线样式
      });

      var passedPolyline = new AMap.Polyline({
        map: this.map,
        // path: lineArr,
        strokeColor: "#AF5", //线颜色
        // strokeOpacity: 1,     //线透明度
        strokeWeight: 6, //线宽
        // strokeStyle: "solid"  //线样式
      });

      marker.on("moving", function(e) {
        passedPolyline.setPath(e.passedPath);
         // 设置地图中心点
      });

      this.map.setFitView(); //根据地图上添加的覆盖物分布情况，自动缩放地图到合适的视野级别，参数overlayList默认为当前地图上添加的所有覆盖物图层

      function startAnimation() {
        marker.moveAlong(lineArr, 200);
      }
      startAnimation();
    },
    //3D罗盘控制盘
    handlerTool(map) {
      AMap.plugin(["AMap.ToolBar", "AMap.ControlBar"], () => {
        // 添加 3D 罗盘控制
        map.addControl(new AMap.ControlBar());

        //在图面添加工具条控件，工具条控件集成了缩放、平移、定位等功能按钮在内的组合控件
        // map.addControl(
        //   new AMap.ToolBar({
        //     // 简易缩放模式，默认为 false
        //     liteStyle: true,
        //   })
        // );
      });
    },
    handlerDrive() {
      this.callApp = !this.callApp;
      this.legend = false;
      this.Weather = false;
      this.map = new AMap.Map("container", {
        resizeEnable: true,
        center: [116.397428, 39.90923],
        zoom: 17,
      });
      AMap.plugin(["AMap.Driving"], () => {
        var drivingOption = {
          policy: AMap.DrivingPolicy.LEAST_TIME,
          map: this.map,
        };
        var driving = new AMap.Driving(drivingOption); //构造驾车导航类
        //根据起终点坐标规划驾车路线
        driving.search(
          [
            { keyword: "胶州市政府", city: "0532" }, //起点
            { keyword: "三里河小学", city: "0532" }, //终点
          ],
          function(status, result) {
            button.onclick = function() {
              driving.searchOnAMAP({
                origin: result.origin, //起点坐标
                destination: result.destination, //终点坐标
              });
            };
          }
        );
      });
      var button = document.getElementById("callApp");
      if (AMap.UA.mobile) {
        document.getElementsByClassName("info")[0].style.display = "none";
        button.style.fontSize = "16px";
      } else {
        button.style.marginRight = "10px";
      }
    },
    handlerWorld() {
      this.callApp = false;
      this.legend = true;
      this.Weather = false;
      var counts = [30000, 10000, 5000, 1000, 500, 100];
      var color = [
        "#ffffb2",
        "#fed976",
        "#feb24c",
        "#fd8d3c",
        "#f03b20",
        "#bd0026",
      ].reverse();
      var dis = new AMap.DistrictLayer.World({
        zIndex: 10,
        styles: {
          "stroke-width": 0.8,
          fill: function(d) {
            var country = data.find((c) => {
              return c.name == d.NAME_CHN;
            });
            if (!country) {
              return "#f0f0f0";
            }
            country = country.qz;
            if (country > counts[0]) {
              return color[0];
            } else if (country > counts[1]) {
              return color[1];
            } else if (country > counts[2]) {
              return color[2];
            } else if (country > counts[3]) {
              return color[3];
            } else if (country > counts[4]) {
              return color[4];
            } else {
              return color[5];
            }
          },
          "city-stroke": "#fff",
          "county-stroke": function(d) {
            if (d.type === "Nation_Border_China") {
              return "red";
            }
            return "#fff";
          },
          "province-stroke": "#fff",
          "coastline-stroke": function(d) {
            if (d.type === "Coastline_China") {
              return "rgb(189,0,38)";
            }
            return "rgba(0,0,0,0)";
          },
          "nation-stroke": function(d) {
            if (d.type === "Nation_Border_China") {
              return "#f768a1";
            }
            return "#fff";
          },
        },
      });

      this.map = new AMap.Map("container", {
        layers: [dis],
        center: [170.451348, 43.792165],
        zoom: 2,
        viewMode: "3D",
        showLabel: false,
      });
      var ul = document.querySelector(".legend ul");
      console.log(ul);
      ul.innerHTML = "";
      color.forEach((c, i) => {
        ul.innerHTML +=
          '<li><span style="background: ' +
          c +
          ';"></span><a> > ' +
          counts[i] +
          "</a></li>";
      });
      //   this.map.addControl(new AMap.Scale());
      //   this.map.addControl(new AMap.ToolBar());
      document.getElementsByClassName("amap-mcode")[0].innerHTML =
        "-GS(2019)756号";
    },
    handlerWeather() {
      this.Weather = !this.Weather;
      this.legend = false;

      this.map = new AMap.Map("container", {
        mapStyle: "amap://styles/8067e27b3deae55ccfe3bee28ff396f1",
        resizeEnable: true,
        zoom: 17,
        showIndoorMap: false, //隐藏地图自带的室内地图图层
        // layers: [indoorMap, new AMap.TileLayer()],
      });

      //加载天气查询插件
      AMap.plugin("AMap.Weather", function() {
        //创建天气查询实例
        var weather = new AMap.Weather();
        //执行实时天气信息查询
        weather.getLive("胶州市", function(err, data) {
          console.log(err, data);
          if (err) {
            return;
          }
          var str = [];
          str.push("<h4 >实时天气" + "</h4><hr>");
          str.push("<p>城市/区：" + data.city + "</p>");
          str.push("<p>天气：" + data.temperature +"℃"+ "</p>");
          str.push("<p>时间：" + data.reportTime + "</p>");
          str.push("<p>天气情况：" + data.weather + "</p>");
          str.push("<p>天气风向：" + data.windDirection + "</p>");
          str.push("<p>天气风力：" + data.windPower + "</p>");
          document.getElementById("weather-forecast").innerHTML = str.join("");
        });
      });

      this.map.setCenter([120.034285, 36.273889]); //设置地图中心点
      this.map.setZoom(12); //设置地图层级
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
  #callApp {
    position: absolute;
    bottom: 30px;
    left: 20px;
  }
}
#container {
  //   background-color: rgba(175, 200, 253) !important;
  background-image: none;
}
.legend {
  width: 100px;
  position: absolute;
  left: 10px;
  bottom: 25px;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
}

/deep/ .legend ul {
  overflow: hidden;
  list-style: none;
  margin: 0;
  padding: 0;
  li {
    float: left;
    height: 30px;
    a {
      float: left;
      color: #555;
      font-size: 14px;
      text-decoration: none;
      height: 30px;
      line-height: 30px;
    }
    span {
      float: left;
      width: 14px;
      height: 14px;
      margin: 8px;
    }
  }
}

#weather-forecast {
  width: 30%;
  background: #fff;
  position: absolute;
  right: 10px;
  top: 50px;
  padding: 20px;
  border-radius: 20px;
  h4 {
    margin: 0px 0px !important;
  }
  p {
    margin: 0px 1px !important;
  }
}
</style>
