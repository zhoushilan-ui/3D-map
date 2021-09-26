import "element-ui/lib/theme-chalk/index.css";
import "@/style/style.scss";

import Vue from "vue";
import App from "@/App.vue";
import router from "@/router";
import store from "@/store";

// 引入组件库及其组件库样式
import ElementUI from "element-ui";

Vue.use(ElementUI);

import * as R from "ramda";

Vue.prototype.R = R;

Vue.config.productionTip = false;

import VueAMap from "vue-amap";
Vue.use(VueAMap);

// 将自动注册所有组件为全局组件
import dataV from "@jiaminghi/data-view";

Vue.use(dataV);

//初始化vue-amap
VueAMap.initAMapApiLoader({
  key: "a7816cf2959e426625cda34e257cd1ed",
  plugin: [
    "AMap.Geolocation",
    "AMap.Geocoder",
    "AMap.DistrictSearch",
    "AMap.ControlBar",
    "AMap.AMapManager",
    "AMap.Autocomplete",
    "AMap.PlaceSearch",
    "AMap.ToolBar",
    "AMap.MapType",
    "AMap.OverView",
  ],
  // 默认高德 sdk 版本为 1.4.4
  v: "1.4.4",
  uiVersion: "1.0.11", // 版本号
});

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
