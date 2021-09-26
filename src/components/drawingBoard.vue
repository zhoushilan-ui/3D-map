<template>
  <div class='app-container'>
    <div id="cov1" class="cov-item" ref="graphContainer"></div>
  </div>
</template>

<script>
export default {
  name: 'drawingBoard',
  props: ["editor","graph","parent"],
  props: ['graph'],
  data() { return {}; },
  created() { },
  mounted() {
    this.$emit('init',this.$refs.graphContainer);
  },
  methods: {},
  watch: {}
};
</script>

<style scoped>
.app-container {
  background: #f3f3f3;
}
</style>
<style>
.cov-item {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  height: 100%;
}
</style>