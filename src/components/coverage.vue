<template>
  <div class='app-container' ref="drap-container">
    <div class="top" v-drag="'coverage'">
      <span class="tip" v-text="'图层'"></span>
      <span class="turnoff" v-text="'×'" @click="changeCoverage"></span>
    </div>
    <div class="layer-info">
      <ul>
        <li v-for="(item, i) in getLayer" :key="i">
          <span class="img-wra"><img :src="open" alt=""></span>
          <span class="img-wra" @click="toggleLayerHidden(item, i)"><img :src="eyeopen" alt=""></span>
          <span class="name" v-text="item.lab"></span>
        </li>
      </ul>
    </div>
    <div class="bot-func">
      <img :src="add" @click="addLayer">
      <img :src="remove">
      <img :src="edit">
    </div>
  </div>
</template>

<script>
import eyeoff from '@/assets/layerImg/eyeoff.png'
import eyeopen from '@/assets/layerImg/eyeopen.png'
import off from '@/assets/layerImg/off.png'
import open from '@/assets/layerImg/open.png'
import add from '@/assets/layerImg/add.png';
import remove from '@/assets/layerImg/delete.png';
import edit from '@/assets/layerImg/edit.png'

export default {
  name: 'coverage',
  props: ["editor","graph","parent","detailParent","sign"],
  data() {
    return {
      eyeoff,eyeopen,off,open,add,remove,edit
    };
  },
  computed: {
    getLayer() { return this.detailParent },
  },
  watch: {
      parent(n,o) {
          console.log(n)
      }
  },
  created() { },
  mounted() {
    console.log(this.getLayer)
  },
  methods: {
    changeCoverage() {
      this.$emit('changeCoverage')
    },
    addLayer() {
      this.$emit('newLayer');
    },
    // 隐藏一个图层
    toggleLayerHidden(layer,i) {
      this.graph.getModel().setVisible(layer.val,!this.graph.getModel().isVisible(layer.val));
    },
  },
};
</script>

<style scoped lang="scss">
.app-container {
  background: #fff;
  position: absolute;
  left: 300px;
  top: 400px;
  z-index: 1000000;
  border-radius: 10px;
  box-shadow: 0 0 15px 3px #aaa;

  .top {
    cursor: all-scroll;
    height: 35px;
    line-height: 35px;
    background: #3d3f47;
    color: #fff;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;

    .turnoff {
      position: absolute;
      right: 10px;
      cursor: pointer;
      display: inline-block;
    }
  }
  .layer-info {
    ul {
      list-style: none;
      height: 250px;
      overflow: auto;
      background: #d4d4d4;

      li {
        width: 280px;
        padding: 5px 3px;
        text-align: left;
        padding-left: 15px;
        background: #e8e8e8;
        border-bottom: 1px solid rgb(195, 195, 195);

        .img-wra {
          display: inline-block;
          height: 15px;
          margin-right: 5px;

          img {
            height: 100%;
            cursor: pointer;
          }
        }
      }
    }
  }
}
.bot-func {
  text-align: left;
  background: #e8e8e8;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  padding: 8px 0 8px 10px;

  img {
    width: 15px;
    margin-right: 10px;
    cursor: pointer;
  }
}
</style>