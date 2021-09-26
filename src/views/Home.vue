<template>
  <div class="home">
    <topBar
      class="top-bar"
      @changeCoverage="changeCoverage"
      :editor="editor"
      :graph="graph"
      :detailParent="parent" 
      :parent="parent.length && parent[parentIndex].val"
      :undoMng="undoMng"
    ></topBar>
    <statusPanel
      class="status-panel"
      :editor="editor"
      :graph="graph"
      :parent="parent.length && parent[parentIndex].val"
      :sign="sign"
    ></statusPanel>
    <coverage
      v-if="isCoverage"
      class="coverage"
      @changeCoverage="changeCoverage"
      @newLayer="newLayer"
      :editor="editor"
      :graph="graph"
      :detailParent="parent"
      :parent="parent.length && parent[parentIndex].val"
      :sign="sign"
    ></coverage>
    <toolBar
      class="tool-bar"
      :editor="editor"
      :graph="graph"
      :parent="parent.length && parent[parentIndex].val"
    ></toolBar>
    <drawingBoard
      class="drawing-board"
      @init="init"
      :editor="editor"
      :graph="graph"
      :parent="parent.length && parent[parentIndex].val"
    ></drawingBoard>
  </div>
</template>

<script>
// @ is an alias to /src
import statusPanel from "@/components/statusPanel.vue";
import toolBar from "@/components/toolBar.vue";
import topBar from "@/components/topBar.vue";
import drawingBoard from "@/components/drawingBoard.vue";
import coverage from "@/components/coverage.vue";

import mxgraph from "@utils/init.js";
import keyDown from "@utils/initKeyHandler.js";
import rotate from "../assets/images/rotate/index";
export default {
  name: "Home",
  components: { statusPanel, toolBar, topBar, drawingBoard, coverage },
  data() {
    return {
      editor: null,
      graph: null,
       // // 这个变量中存储了图层的相关信息，其值以对象的形式存储，每条记录都有lab和val两个属性，其中的lab表示图层名，val表示当前图层的实际parent，也就是在创建cell等操作时实际使用的parent
      parent: [],
      parentIndex: 0,
      undoMng: null, // 状态管理器
      sign: false, // 用来告诉状态栏有被选中的单个的cell发生了变化，如果是正在展示的cell，则状态栏需要进行同步的修正.
      isCoverage: false,    // 是否显示图层组件
    };
  },
  mounted() {},
  methods: {
    init(refWra) {
        console.log(this.$store.getters.getNum)
      this.editor = new mxEditor();

      // 创建全局容器
      // this.graph = new mxGraph(this.$refs.graphContainer);
      this.graph = this.editor.graph;
      this.editor.setGraphContainer(refWra);
      // 创建全局父元素
      this.parent[0] = {
        lab: '默认图层',
        val: this.graph.getDefaultParent().insert(new mxCell()),
        iswork: true,
      };

      // 初始化键盘事件
      let { undoMng } = keyDown(this.graph);
      this.undoMng = undoMng;

      // 是否启用网格，也就是操作的细粒度，和性能成反比
      // 默认启用网格且网格大小为10，值越小操作的细粒度越高，性能开销越大
      // 此处直接禁用网格，操作的细粒度最高，性能开销也最大
      this.graph.gridEnabled = false;
      // 指定网格的大小，仅在开启网格时有实际意义
      this.graph.gridSize = 10;

      mxVertexHandler.prototype.rotationEnabled = true;
      mxVertexHandler.prototype.parentHighlightEnabled = true;
      //   mxConnectionHandler.prototype.waypointsEnabled = true;

      mxGraph.prototype.sizeDidChange = () => {
        // 极其敏感，图形的创建、大小变化、位置变化、旋转都会触发
        if (this.graph.getSelectionCells().length != 1) return;
        this.sign = !this.sign;
      };

      mxGraph.prototype.resizeCells = function (cells, bounds) {
        if (cells[0].style) {
          // tmp[0]是原有的样式集合(例如myStyleSvg),tmp[1]是背景图的路径设置
          let tmp = cells[0].style.split(";");
          if (cells[0].style.includes("dashed")) {
            tmp[0] = "shape=line";
            tmp[1] = "dashed";
          }
          tmp.push("imageWidth=" + bounds[0].width * 1);
          tmp.push("imageHeight=" + bounds[0].height * 1);
          this.getModel().setStyle(cells[0], tmp.join(";"));
        }
        this.model.beginUpdate();
        try {
          this.cellsResized(cells, bounds);
        } finally {
          this.model.endUpdate();
        }
        return cells;
      };

      //修改单元格选中时虚线的默认颜色
      mxVertexHandler.prototype.getSelectionColor = function () {
        return (mxConstants.VERTEX_SELECTION_COLOR = "#007DFC");
      };
      //createSizer:为指定的游标和索引创建一个sizer句柄，并返回代表该句柄的新mxRectangleShape。
      mxVertexHandler.prototype.createSizer = function (
        cursor,
        index,
        size,
        fillColor
      ) {
        size = size || mxConstants.HANDLE_SIZE;
        if (index >= 0) {
          var bounds = new mxRectangle(0, 0, 9, 9);
        } else {
          var bounds = new mxRectangle(0, 0, 15, 15);
        }
        var sizer = this.createSizerShape(bounds, index, fillColor);
        if (
          sizer.isHtmlAllowed() &&
          this.state.text != null &&
          this.state.text.node.parentNode == this.graph.container
        ) {
          sizer.bounds.height -= 1;
          sizer.bounds.width -= 1;
          sizer.dialect = mxConstants.DIALECT_STRICTHTML;
          sizer.init(this.graph.container);
        } else {
          sizer.dialect =
            this.graph.dialect != mxConstants.DIALECT_SVG
              ? mxConstants.DIALECT_MIXEDHTML
              : mxConstants.DIALECT_SVG;
          sizer.init(this.graph.getView().getOverlayPane());
        }
        mxEvent.redirectMouseEvents(sizer.node, this.graph, this.state);

        if (this.graph.isEnabled()) {
          sizer.setCursor(cursor);
        }

        if (!this.isSizerVisible(index)) {
          sizer.visible = false;
        }
        return sizer;
      };

      //createSizerShape:创建用于指定边界索引的sizer句柄的形状。如果需要支持不带异物的HTML标签，则仅应返回图像和矩形。
      mxVertexHandler.prototype.createSizerShape = function (
        bounds,
        index,
        fillColor
      ) {
        fillColor = "#007DFC";
        if (index == mxEvent.ROTATION_HANDLE) {
          //返回的是旋转的手柄的样式
          bounds = new mxRectangle(
            bounds.x,
            bounds.y,
            bounds.width,
            bounds.height
          );
          // var shape = new mxImageShape(bounds, toolgif.icon[0]);
          var shape = new mxImageShape(bounds, rotate[0]);
          // Allows HTML rendering of the images
          shape.preserveImageAspect = false;
          return shape;
        } else {
          //返回的是句柄的样式
          return new mxEllipse(
            bounds,
            fillColor || mxConstants.HANDLE_FILLCOLOR,
            "#ffffff" || mxConstants.HANDLE_STROKECOLOR,
            mxConstants.HANDLE_STROKECOLOR
          );
        }
      };
    },
    // 切换图层面板的显示状态
    changeCoverage(type) {
        this.isCoverage = type || !this.isCoverage;
    },
    // 新增图层
    newLayer() {
        this.parent.unshift({
            lab: '新建图层',
            val: this.graph.getDefaultParent().insert(new mxCell()),
            iswork: true,
        });
        this.parentIndex = this.parent.length - 1;
    }
  },
};
</script>

<style lang="scss">
.home {
  height: 100%;
}
.top-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 70px;
}
.tool-bar {
  position: fixed;
  left: 0;
  top: 70px;
  bottom: 0;
  width: 200px;
  overflow: auto;
}
.drawing-board {
  position: fixed;
  left: 200px;
  top: 70px;
  right: 0;
  bottom: 0;
}
.mxTooltip {
  display: none;
}
.mxRubberband {
  background: #57a2ff;
  position: absolute;
}
</style>
