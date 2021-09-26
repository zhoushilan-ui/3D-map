<template>
  <div class="welcomeContainer">
    <div id="container" style="height: 100%; width: 100%"></div>
    <el-row>
      <el-button type="primary" plain @click="handleGeoJSON()"
        >获取地图的GeoJSON(北京)</el-button
      >
      <el-button type="primary" plain @click="AddglTF()">glTF模型</el-button>
      <el-button type="primary" plain @click="handlerPicture()"
        >图片图层</el-button
      >
      <el-button type="primary" plain @click="handlerCanvas()"
        >Canvas图层</el-button
      >
      <el-button type="primary" plain @click="handlerTraffic()"
        >实时路况图层</el-button
      >
      <el-button type="primary" plain @click="handlerAddwatermark()"
        >img作为切片(添加类似水印的效果)</el-button
      >
    </el-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      map: null,
      isVisible: false,
      Addwatermark: false,
    };
  },
  mounted() {
    //初始化地图
    this.init();
  },
  watch: {
    isVisible: function(n, o) {
      //实时路况图层
      var trafficLayer = new AMap.TileLayer.Traffic({
        zIndex: 10,
      });
      trafficLayer.setMap(this.map);
      if (!n) {
        trafficLayer.hide();
      } else {
        trafficLayer.show();
      }
    },
  },
  methods: {
    init() {
      this.map = new AMap.Map("container", {
        mapStyle: "amap://styles/8067e27b3deae55ccfe3bee28ff396f1",
        center: [116.414617, 39.915156],
        zoom: 7,
        viewMode: "3D", //开启3D视图,默认为关闭
        zooms: [2, 20],
        expandZoomRange: true,
      });
      this.handleGeoJSON();
    },
    handleGeoJSON() {
      let that = this;
      ajax(
        "https://a.amap.com/jsapi_demos/static/geojson/beijing.json",
        (err, geoJSON) => {
          if (!err) {
            var geojson = new AMap.GeoJSON({
              geoJSON: geoJSON,
              // 还可以自定义getMarker和getPolyline
              getPolygon: function(geojson, lnglats) {
                // 计算面积
                var area = AMap.GeometryUtil.ringArea(lnglats[0]);
                return new AMap.Polygon({
                  path: lnglats,
                  fillOpacity: 1 - Math.sqrt(area / 8000000000), // 面积越大透明度越高
                  strokeColor: "white",
                  fillColor: "red",
                });
              },
            });

            this.map.setCenter([116.414617, 39.915156]); //设置地图中心点
            this.map.setZoom(9); //设置地图层级
            geojson.setMap(this.map);

            log.success("GeoJSON 数据加载完成");
          } else {
            log.error("GeoJSON 服务请求失败");
          }
        }
      );
    },
    AddglTF() {
      // 创建Object3DLayer图层
      var object3Dlayer = new AMap.Object3DLayer();
      this.map.add(object3Dlayer);
      this.map.setCenter([117.14131, 36.7422]); //设置地图中心点
      this.map.setZoom(9); //设置地图层级
      var druckMeshes, cityMeshes;

      this.map.plugin(["AMap.GltfLoader", "AMap.ControlBar"], () => {
        // 添加 3D 罗盘控制
        this.map.addControl(new AMap.ControlBar());

        var urlCity =
          "https://a.amap.com/jsapi_demos/static/gltf-online/shanghai/scene.gltf";
        // var urlDuck = "https://a.amap.com/jsapi_demos/static/gltf/Duck.gltf";
        var urlDuck = "static/eg/DamagedHelmet.gltf"; //项目本地glTF文件，文件的路径在public/static/xxx下面
        var Helmet = "static/test/timg.gltf";

        var paramCity = {
          position: new AMap.LngLat(121.510909, 31.233366), // 必须  用于设置模型加载位置
          scale: 3580, // 非必须，默认1，用于设置模型缩放倍数
          height: 1800, // 非必须，默认0，用于设置模型位置高度
          scene: 0, // 非必须，默认0，用于设置加载场景序号
        };

        var paramDuck = {
          position: new AMap.LngLat(121.495, 31.233366), // 必须
          scale: 800, // 非必须，默认1
          height: -100, // 非必须，默认0
          scene: 0, // 非必须，默认0
        };
        var paramHelmet = {
          position: new AMap.LngLat(117.677994, 36.495869), // 必须
          scale: 800, // 非必须，默认1
          height: -100, // 非必须，默认0
          scene: 0, // 非必须，默认0
        };
        var gltfObj = new AMap.GltfLoader();

        gltfObj.load(urlCity, (gltfCity) => {
          cityMeshes = gltfCity;
          gltfCity.setOption(paramCity);
          gltfCity.rotateX(90);
          gltfCity.rotateZ(120);
          object3Dlayer.add(gltfCity);
        });
        gltfObj.load(urlDuck, (gltfDuck) => {
          druckMeshes = gltfDuck;
          gltfDuck.setOption(paramDuck);
          gltfDuck.rotateX(90);
          gltfDuck.rotateZ(-20);
          object3Dlayer.add(gltfDuck);
        });
        gltfObj.load(Helmet, (gltfHelmet) => {
          druckMeshes = gltfHelmet;
          gltfHelmet.setOption(paramHelmet);
          gltfHelmet.rotateX(90);
          gltfHelmet.rotateZ(-20);
          object3Dlayer.add(gltfHelmet);
        });
      });
    },
    handlerPicture() {
      // 创建图片图层
      //构造一个ImageLayer图层对象，需要提供一个Image的url，以及它覆盖的Bounds。
      var imageLayer = new AMap.ImageLayer({
        bounds: new AMap.Bounds(
          // [120.020409, 36.239353],
          // [120.046814, 36.293404]
          [122.800491, 34.804737],
          [125.228935, 36.55341]
        ),
        // url:
        //   "http://amappc.cn-hangzhou.oss-pub.aliyun-inc.com/lbs/static/img/dongwuyuan.jpg", // 图片 Url
        url: "static/images/dream12798206.png",
        zIndex: 2,
        zooms: [3, 18], // 设置可见级别，[最小级别，最大级别]
      });

      this.map.setCenter([122.800491, 34.804737]); //设置地图中心点
      this.map.setZoom(7); //设置地图层级

      // 将图层添加至地图实例
      this.map.add(imageLayer);
    },
    handlerCanvas() {
      /*
       * 添加Canvas图层
       */
      var canvas = document.createElement("canvas");
      canvas.width = canvas.height = 200;

      var context = canvas.getContext("2d");
      context.fillStyle = "rgb(0,100,255)";
      context.strokeStyle = "white";
      context.globalAlpha = 1;
      context.lineWidth = 2;

      var radious = 0;
      var draw = function() {
        context.clearRect(0, 0, 200, 200);
        context.globalAlpha = (context.globalAlpha - 0.01 + 1) % 1;
        radious = (radious + 1) % 100;

        context.beginPath();
        context.arc(100, 100, radious, 0, 2 * Math.PI);
        context.fill();
        context.stroke();

        //2D视图时可以省略
        CanvasLayer.reFresh();

        AMap.Util.requestAnimFrame(draw);
      };

      var CanvasLayer = new AMap.CanvasLayer({
        canvas: canvas,
        bounds: new AMap.Bounds(
          [120.007264, 36.247581],
          [120.053833, 36.299257]
        ),

        zooms: [3, 18],
      });
      this.map.setCenter([120.007264, 36.247581]); //设置地图中心点
      this.map.setZoom(13); //设置地图层级

      CanvasLayer.setMap(this.map);
      draw();
    },

    handlerTraffic() {
      this.isVisible = !this.isVisible;
    },
    handlerAddwatermark() {
      this.Addwatermark = !this.Addwatermark;
      if (this.Addwatermark) {
        console.log(this.Addwatermark);
        //该demo可模拟水印效果
        var layer = new AMap.TileLayer.Flexible({
          cacheSize: 30,
          opacity: 0.3,
          createTile: function(x, y, z, success, fail) {
            if ((x + y) % 3) {
              fail();
              return;
            }
            var img = document.createElement("img");
            img.onload = function() {
              success(img);
            };
            img.crossOrigin = "anonymous"; //3D 的时候添加，同时图片要有跨域头
            img.onerror = function() {
              fail();
            };
            // img.src = "https://a.amap.com/jsapi_demos/static/images/amap.png";
            img.src = "static/images/amap.png";
          },
        });

        layer.setMap(this.map);
      } else {
        console.log(this.Addwatermark);
        return;
      }
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
