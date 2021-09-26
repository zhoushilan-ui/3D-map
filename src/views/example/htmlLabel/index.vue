<template>
  <div class="welcomeContainer">
    <div id="container" style="height: 100%; width: 100%"></div>
    <el-row>
      <input
        type="button"
        class="btn"
        value="开始动画"
        id="start"
        onclick="startAnimation()"
      />
    </el-row>
  </div>
</template>
   <script
  type="text/javascript"
  src="https://webapi.amap.com/maps?v=2.0&key=78e9d68846c7c9228d04968b86134e76"
></script>
<script>
export default {
  name: "htmlLabel",
  data() {
    return {
      map: null,
      zoom: 18,
    };
  },
  computed: {

  },
  watch: {
    "this.map.getZoom()": function(n, o) {
      console.log(n);
    },
  },
  mounted() {
    //初始化地图
    this.init();
  },
  methods: {
    init() {
      this.map = new AMap.Map("container", {
        resizeEnable: true,
        center: [120.039532, 36.270063],
        zoom: this.zoom,
        pitch: 55.94919957310569,
        rotation: -0.7908261543741522,
        viewMode: "3D",
        buildingAnimation: true,
        // fitView: true,
        mapStyle: "amap://styles/271cb83ca74a985c60dd420e99847fc6",
      });
      //  console.log(this.map.getZoom());
      AMap.plugin(["AMap.MoveAnimation", "AMap.ControlBar"], () => {
        // 添加 3D 罗盘控制
        // this.map.addControl(new AMap.ControlBar());
        var marker,
          lineArr = [
            [120.009456, 36.256676],
            [120.030225, 36.257317],
            [120.03098, 36.261304],
            [120.042765, 36.262148],
            [120.043268, 36.258248],
            [120.058288, 36.259354],
            [120.067092, 36.259441],
            [120.065511, 36.263253],
            [120.064397, 36.263224],
          ];

        window.map = this.map;

        marker = new AMap.Marker({
          map: this.map,
          position: [120.009456, 36.256676],
          icon: "https://a.amap.com/jsapi_demos/static/demo-center-v2/car.png",
          offset: new AMap.Pixel(-13, -26),
        });

        // 绘制轨迹 汽车未启动前路线的颜色
        var polyline = new AMap.Polyline({
          map: this.map,
          path: lineArr,
          showDir: true,
          strokeColor: "#28F", //线颜色
          // strokeOpacity: 1,     //线透明度
          strokeWeight: 6, //线宽
          // strokeStyle: "solid"  //线样式
        });
        //汽车启动后，汽车行驶的路线
        var passedPolyline = new AMap.Polyline({
          map: this.map,
          strokeColor: "#AF5", //线颜色
          strokeWeight: 6, //线宽
        });
        //添加小车移动时的监听函数，此处为最重要的代码，在小车开始移动时就一直设置地图中心点和旋转角
        marker.on("moving", (e) => {
          passedPolyline.setPath(e.passedPath);
          // 设置地图中心点
          this.map.setCenter(e.target.getPosition());
          // 设置旋转角
          this.map.setRotation(-e.target.getOrientation());
        });

        this.map.setFitView();
 
        // 开始动画
        window.startAnimation = function startAnimation() {
          marker.moveAlong(lineArr, {
            // 每一段的时长
            duration: 2000,
            // JSAPI2.0 是否延道路自动设置角度在 moveAlong 里设置
            autoRotation: true,
          });
        };
        //  暂停动画
        // window.pauseAnimation = function() {
        //   marker.pauseMove();
        // };
        // 继续动画
        // window.resumeAnimation = function() {
        //   marker.resumeMove();
        // };
        // 停止动画

        // window.stopAnimation = function() {
        //   marker.stopMove();
        // };
      });
    },
  },
};
</script>

<style lang="scss">
.welcomeContainer {
  width: 100%;
  height: 100%;
  position: relative;

  .el-row {
    position: absolute;
    top: 10px;
    left: 20px;

    .btn {
      background-color: aqua;
      padding: 6px 10px;
      border: 1px solid aqua;

      &:focus {
        outline: none;
        border: 1px solid aqua;
      }
    }
  }
}
</style>
