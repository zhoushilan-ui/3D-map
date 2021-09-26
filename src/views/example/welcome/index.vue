<template>
  <div class="welcomeContainer">
    <div id="container" style="height: 100%; width: 100%"></div>
    <el-row>
      <el-button type="primary" plain @click="handleAutocomplete()"
        >搜索控件</el-button
      >
      <el-button type="primary" plain @click="mapInit()"
        >设定楼块样式(相当于围栏)</el-button
      >
    </el-row>
    <!-- 搜索组件 -->
    <div class="info" v-show="Autocomplete">
      <div class="input-item">
        <div class="input-item-prepend">
          <span class="input-item-text" style="width: 8rem">请输入关键字 </span>
        </div>
        <input id="tipinput" type="text" />
      </div>
    </div>
    <div>
      <input type="button" id="callApp" class="btn" value="点击调起高德地图" />
    </div>
  </div>
</template>
<script src="https://a.amap.com/jsapi_demos/static/demo-center-v2/three.js"></script>

<script>
import MapLoader from "./amap.js";
import $ from "jquery";
import AMap from "AMap";
import * as THREE from "three";
// let geoData = require("z/sh_road_heat.json");
export default {
  name: "test",
  data() {
    return {
      map: null,
      //3D热力成像
      center: [117.117854, 36.663269],
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
      img: "",
      Autocomplete: false,
      PluginUnits: false,
    };
  },
  mounted() {
    this.initMap();
    // let that = this;
    // MapLoader().then(
    //   (AMap) => {
    //     console.log("地图加载成功");

    //     that.map = new AMap.Map("container", {
    //       //pitch: 75, // 地图俯仰角度，有效范围 0 度- 83 度
    //       zoom: 17,
    //       viewMode: "3D", //开启3D视图,默认为关闭
    //       zooms: [2, 20],
    //     });

    //     that.map.setMapStyle("amap://styles/8067e27b3deae55ccfe3bee28ff396f1");

    //     that.map.addControl(
    //       new AMap.ControlBar({
    //         showZoomBar: false,
    //         showControlButton: true,
    //         position: {
    //           right: "5px",
    //           top: "120px",
    //         },
    //       })
    //     );

    //     window.onload = function () {
    //       that.map.plugin(
    //         ["AMap.ToolBar", "AMap.MapType", "AMap.OverView"],
    //         function () {
    //           //添加一个工具栏
    //           that.map.addControl(new AMap.ToolBar());
    //           //添加一个地图类型
    //           that.map.addControl(new AMap.MapType());
    //           //添加一个鹰眼
    //           that.map.addControl(new AMap.OverView());
    //         }
    //       );
    //       if (location.href.indexOf("&guide=1") !== -1) {
    //         that.map.setStatus({ scrollWheel: false });
    //       }
    //     };
    //   },
    //   (e) => {
    //     console.log("地图加载失败", e);
    //   }
    // );
  },
  methods: {
    initMap: function() {
      this.buildingLayer = new AMap.Buildings({
        zIndex: 130,
        merge: false,
        sort: false,
        zooms: [17, 20],
      });
      this.map = new AMap.Map("container", {
        resizeEnable: true, //是否监控地图容器尺寸变化
        mapStyle: "amap://styles/8067e27b3deae55ccfe3bee28ff396f1",
        zoom: 17,
        viewMode: "3D", //开启3D视图,默认为关闭
        zooms: [2, 20],
        center: this.center,
        expandZoomRange: true, //翻译扩展地图级别的范围
        showBuildingBlock: true, //是否显示建筑物的立体形状,在地图模式未3D的情况下
        labelzIndex: 130,
        label: {
          offset: new AMap.Pixel(20, 20), //修改label相对于maker的位置
          content: "点击Marker打开高德地图",
        },
      });

      //3D 热力-路口拥堵指数
      // this.Trafficjam();
      //柱体光照和鼠标事件
      // this.Cylinder();
      //设定楼块样式
      // this.mapInit();
      //天气
      this.Weather();
      //添加Canvas图层
      // this.addCanvas();
      //添加视屏图层
      this.AddVideo();
      //图片图层
      // this.AddImages();
      //添加类似水印的效果
      this.Addwatermark();
      //添加gltf模型
      // this.AddglTF();
      //实时路况图层
      // this.traffic();
      //驾车的规划
      // this.Drive();
      //THREE.js
      //this.Threes();
      //为制定的行政区域的边界添加立体的边界
      // this.Addbound();
      //插件：3D控制罗盘、工具栏、地图类型、鹰眼、定位，搜索功能
      this.PluginUnit();
      //3D Tiles 图层
      // this.Tiles();
      //3D热力图
      // this.Add3DThermodynamicDiagram();
    },
    setOpacitys() {},
    traffic() {
      //实时路况图层
      var trafficLayer = new AMap.TileLayer.Traffic({
        zIndex: 10,
      });

      trafficLayer.setMap(this.map);

      var isVisible = true;
      trafficLayer.show();
    },
    PluginUnit() {
      //3D罗盘控件
      this.map.addControl(
        new AMap.ControlBar({
          showZoomBar: false,
          showControlButton: true,
          position: {
            right: "5px",
            top: "120px",
          },
        })
      );

      //定位的参数
      const options = {
        showButton: true, // 是否显示定位按钮
        buttonPosition: "LB", // 定位按钮的位置
        buttonOffset: new AMap.Pixel(10, 20), // 定位按钮距离对应角落的距离
        showMarker: true, // 是否显示定位点
        showCircle: true, // 是否显示定位精度圈
        circleOptions: {
          // 定位精度圈的样式
          strokeColor: "#0093FF",
          noSelect: true,
          strokeOpacity: 0.5,
          strokeWeight: 1,
          fillColor: "#02B0FF",
          fillOpacity: 0.25,
        },
        zoomToAccuracy: true, // 定位成功后是否自动调整地图视野到定位点
      };

      //输入提示
      var autoOptions = {
        input: "tipinput",
      };
      this.map.plugin(
        [
          "AMap.ToolBar",
          "AMap.MapType",
          "AMap.OverView",
          "AMap.Geolocation",
          "AMap.Autocomplete",
          "AMap.IndoorMap",
        ],
        () => {
          //搜索组件
          var auto = new AMap.Autocomplete(autoOptions);
          var placeSearch = new AMap.PlaceSearch({
            map: this.map,
          }); //构造地点查询类
          AMap.event.addListener(auto, "select", select); //注册监听，当选中某条记录时会触发
          function select(e) {
            placeSearch.setCity(e.poi.adcode);
            placeSearch.search(e.poi.name); //关键字查询查询
          }

          //添加一个工具栏
          this.map.addControl(new AMap.ToolBar());
          //添加一个地图类型
          this.map.addControl(new AMap.MapType());
          //添加一个鹰眼
          this.map.addControl(new AMap.OverView());
          //添加一个地图定位
          const geolocation = new AMap.Geolocation(options);
          this.map.addControl(geolocation);
          geolocation.getCurrentPosition(function(status, result) {
            if (status == "complete") {
              console.log("====result====", result); // result为精准定位成功的返回结果；
            } else {
              console.log("=====error result ====", result); //如果status不等于'complete'，则定位失败；返回的result中包含失败信息；
            }
          });

          // 设定在没有矢量底图的时候也显示，默认情况下室内图仅在有矢量底图的时候显示
          // var indoorMap = new AMap.IndoorMap({ alwaysShow: true });

          // 初始化地图
          // this.map = new AMap.Map("container", {
          // resizeEnable: true, //是否监控地图容器尺寸变化
          // mapStyle: "amap://styles/8067e27b3deae55ccfe3bee28ff396f1",
          // zoom: 17,
          // viewMode: "3D", //开启3D视图,默认为关闭
          // zooms: [2, 20],
          // center: this.center,
          // expandZoomRange: true,
          // showBuildingBlock: true,
          // labelzIndex: 130,
          // label: {
          //   offset: new AMap.Pixel(20, 20), //修改label相对于maker的位置
          //   content: "点击Marker打开高德地图",
          // },
          // showIndoorMap: false, // 隐藏地图自带的室内地图图层
          //new AMap.TileLayer() 显示室内地图外面的地图图层
          // layers: [indoorMap, new AMap.TileLayer()], // 地图图层数组
          // });
          // this.map.layers=[indoorMap, new AMap.TileLayer()]
          // // 显示指定室内地图信息
          // indoorMap.showIndoorMap("B000A856LJ");
          // // 绑定室内图层加载完成事件
          // indoorMap.on("complete", function () {
          //   log.success("室内图层加载完成!");
          // });
        }
      );
    },

    handleAutocomplete() {
      this.Autocomplete = !this.Autocomplete;
    },
    addCanvas() {
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
          [116.328911, 39.937229],
          [116.342659, 39.946275]
        ),
        zooms: [3, 18],
      });

      CanvasLayer.setMap(this.map);
      draw();
    },
    AddVideo() {
      //视屏图层
      var bounds = new AMap.Bounds([93, -9], [147, 32]);
      var VideoLayer = new AMap.VideoLayer({
        autoplay: true,
        loop: true,
        zIndex: 130,
        //可提供不同格式以达到多浏览器兼容
        url: [
          "https://a.amap.com/jsapi_demos/static/video/cloud.m4v",
          "https://a.amap.com/jsapi_demos/static/video/cloud.mov",
        ],
        bounds: bounds,
        zooms: [3, 18],
        opacity: 0.7,
      });

      VideoLayer.setMap(this.map);
    },
    AddImages() {
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

      // 将图层添加至地图实例
      this.map.add(imageLayer);
    },
    Addwatermark() {
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
    },
    AddglTF() {
      // 创建Object3DLayer图层
      var object3Dlayer = new AMap.Object3DLayer();
      this.map.add(object3Dlayer);

      var druckMeshes, cityMeshes;

      this.map.plugin(["AMap.GltfLoader"], () => {
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

      // 给gltf模型绑定事件
      // this.map.on("click", (ev) => {
      //   var pixel = ev.pixel;
      //   var px = new AMap.Pixel(pixel.x, pixel.y);
      //   var obj =
      //     this.map.getObject3DByContainerPos(px, [object3Dlayer], false) || {};
      //   if (obj && obj.object) {
      //     var meshId = obj.object.id;
      //     if (druckMeshes && druckMeshes.layerMesh) {
      //       for (var i = 0; i < druckMeshes.layerMesh.length; i++) {
      //         if (meshId === druckMeshes.layerMesh[i].id) {
      //           console.log("您点击了小黄鸭模型");
      //           return log.info("您点击了小黄鸭模型！");
      //         }
      //       }
      //     }

      //     if (cityMeshes && cityMeshes.layerMesh) {
      //       for (var i = 0; i < cityMeshes.layerMesh.length; i++) {
      //         if (meshId === cityMeshes.layerMesh[i].id) {
      //           console.log("您点击了陆家嘴模型");
      //           return log.info("您点击了陆家嘴模型！");
      //         }
      //       }
      //     }
      //   }

      //   this.map.w.center.lat = ev.lnglat.getLat();
      //   this.map.w.center.lng = ev.lnglat.getLng();
      //   console.log(
      //     "您在 [ " +
      //       ev.lnglat.getLng() +
      //       "," +
      //       ev.lnglat.getLat() +
      //       " ] 的位置单击了地图！"
      //   );
      // });
    },
    Addbound() {
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
    },
    Add3DThermodynamicDiagram() {
      //初始化heatmap对象
      var heatmap = new AMap.Heatmap(this.map, this.heatmapOpts);
      heatmap.setDataSet({
        data: heatmapData,
        max: 100,
      });

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

    Drive() {
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
    Threes() {
      var camera;
      var renderer;
      var scene;
      var meshes = [];
      // 数据转换工具
      var customCoords = this.map.customCoords;
      // console.log(this.map);
      // 数据使用转换工具进行转换，这个操作必须要提前执行（在获取镜头参数 函数之前执行），否则将会获得一个错误信息。
      var data = customCoords.lngLatsToCoords([
        [120.033279, 36.264633],
        [120.003067, 36.263031],
        [120.008736, 36.272293],
      ]);
      // 创建 GL 图层
      var gllayer = new AMap.GLCustomLayer({
        // 图层的层级
        zIndex: 10,
        // 初始化的操作，创建图层过程中执行一次。
        init: (gl) => {
          // 这里我们的地图模式是 3D，所以创建一个透视相机，相机的参数初始化可以随意设置，因为在 render 函数中，每一帧都需要同步相机参数，因此这里变得不那么重要。
          // 如果你需要 2D 地图（viewMode: '2D'），那么你需要创建一个正交相机
          camera = new THREE.PerspectiveCamera(
            60,
            window.innerWidth / window.innerHeight,
            100,
            1 << 30
          );
          renderer = new THREE.WebGLRenderer({
            context: gl, // 地图的 gl 上下文
            // alpha: true,
            // antialias: true,
            // canvas: gl.canvas,
          });
          // 自动清空画布这里必须设置为 false，否则地图底图将无法显示
          renderer.autoClear = false;
          scene = new THREE.Scene();
          // 环境光照和平行光
          var aLight = new THREE.AmbientLight(0xffffff, 0.3);
          var dLight = new THREE.DirectionalLight(0xffffff, 1);
          dLight.position.set(1000, -100, 900);
          scene.add(dLight);
          scene.add(aLight);
          var texture = new THREE.TextureLoader().load(
            "https://a.amap.com/jsapi_demos/static/demo-center-v2/three.jpeg"
          );
          texture.minFilter = THREE.LinearFilter;
          //  这里可以使用 three 的各种材质
          var mat = new THREE.MeshPhongMaterial({
            color: 0xfff0f0,
            depthTest: true,
            transparent: true,
            map: texture,
          });
          var geo = new THREE.BoxBufferGeometry(1000, 1000, 1000);
          for (let i = 0; i < data.length; i++) {
            const d = data[i];
            var mesh = new THREE.Mesh(geo, mat);
            mesh.position.set(d[0], d[1], 500);
            meshes.push({
              mesh,
              count: i,
            });
            scene.add(mesh);
          }
        },
        render: () => {
          // 这里必须执行！！重新设置 three 的 gl 上下文状态。
          renderer.state.reset();
          var {
            near,
            far,
            fov,
            up,
            lookAt,
            position,
          } = customCoords.getCameraParams();
          // 2D 地图下使用的正交相机
          // var { near, far, top, bottom, left, right, position, rotation } = customCoords.getCameraParams();
          // 这里的顺序不能颠倒，否则可能会出现绘制卡顿的效果。
          camera.near = near;
          camera.far = far;
          camera.fov = fov;
          camera.position.set(...position);
          camera.up.set(...up);
          camera.lookAt(...lookAt);
          camera.updateProjectionMatrix();
          // 2D 地图使用的正交相机参数赋值
          // camera.top = top;
          // camera.bottom = bottom;
          // camera.left = left;
          // camera.right = right;
          // camera.position.set(...position);
          // camera.updateProjectionMatrix();
          renderer.render(scene, camera);
        },
      });
      this.map.add(gllayer);
      // 动画
      function animate() {
        for (let i = 0; i < meshes.length; i++) {
          let { mesh, count } = meshes[i];
          count += 1;
          mesh.rotateZ((count / 180) * Math.PI);
        }
        this.map.render();
        requestAnimationFrame(animate);
      }
      animate();
    },
    Weather() {
      //加载天气查询插件
      AMap.plugin("AMap.Weather", function() {
        //创建天气查询实例
        var weather = new AMap.Weather();
        //执行实时天气信息查询
        weather.getLive("胶州市", function(err, data) {
          // console.log(err, data);
        });
      });
    },
    mapInit() {
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
    Trafficjam() {
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
    },
    Cylinder() {
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
      //   var angle = 90;
      //   let that = this;
      //   function changeLightDirection() {
      //     angle += 2;
      //     var dir = [
      //       Math.cos((angle / 180) * Math.PI),
      //       -Math.sin((angle / 180) * Math.PI),
      //       2,
      //     ];
      //     that.map.DirectionLight.setDirection(dir);
      //     that.map.render();
      //     AMap.Util.requestAnimFrame(changeLightDirection);
      //   }

      //   changeLightDirection();
    },
    Tiles() {
      // // 创建 3DTilesLayer
      // var tiles = new AMap["3DTilesLayer"]({
      //   map: this.map,
      //   url: "https://a.amap.com/jsapi_demos/static/data3d/single.json", // 3d Tiles 入口文件
      //   style: {
      //     light: {
      //       color: "rgb(44,59,75)", // 设置光照颜色
      //       intensity: 2, // 设置光照强度
      //     },
      //   },
      // });
    },
  },
};
</script>

<style lang="scss">
.welcomeContainer {
  width: 100%;
  height: 100%;
  position: relative;
  margin: 0;
  padding: 0;

  .info {
    width: 200px;
    position: absolute;
    top: 10px;
    left: 100px;

    .input-item-prepend {
      background-color: rgb(194, 185, 185);
      padding: 5px;
    }

    #tipinput {
      width: 100%;
      padding: 5px;
    }

    #tipinput:focus {
      background: #ffffff;
      border: 1px solid #2da7e0;
      /* 解决input按钮自动填充后 浏览器渲染的默认背景问题 */
      box-shadow: inset 0 0 0 1000px #ffffff !important;
    }
  }
}

#callApp {
  position: absolute;
  bottom: 50px;
  left: 60px;
}

.input-item {
  height: 2rem;
}

.input-item span {
  display: inline-block;
  width: 4rem;
}

.input-item .input-text {
  color: #0288d1;
  margin-left: 1rem;
  margin-right: 0rem;
  width: 6rem;
}
.amap-geolocation-con {
  bottom: 50px !important;
}

.info table tr td.label {
  width: 20px !important;
}

.el-row {
  position: absolute;
  top: 10px;
  left: 40%;
}
</style>
