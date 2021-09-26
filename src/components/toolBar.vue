<template>
  <div class="app-container">
    <div class="container-left">
      <el-collapse>
        <el-collapse-item
          v-for="(palette, paletteIndex) in Object.values(paletteses)"
          title="通用"
          :name="palette['name']"
          :key="paletteIndex + 3000"
        >
          <a
            v-for="(_, shapeIndex) in palette['shapes']"
            :shapeIndex="shapeIndex"
            :paletteIndex="paletteIndex"
            ref="dragItem1"
            :key="shapeIndex + 4000"
          >
          </a>
        </el-collapse-item>
        <el-collapse-item title="通用1">
          <div id="container"></div>
        </el-collapse-item>
        <el-collapse-item
          v-for="(palette, paletteIndex) in Object.values(palettes)"
          title="箭头"
          :name="palette['name']"
          :key="paletteIndex + 2000"
        >
          <a
            v-for="(_, shapeIndex) in palette['shapes']"
            :shapeIndex="shapeIndex"
            :paletteIndex="paletteIndex"
            ref="dragItem"
            :key="shapeIndex + 1000"
          >
          </a>
        </el-collapse-item>
        <el-collapse-item
          v-for="(item, i) in tool"
          :key="i"
          :title="item.default.name"
          ref="dragItems"
        >
        </el-collapse-item>
      </el-collapse>
    </div>
    <div class="container-right" @click="hangdleOpenShrink()"></div>
  </div>
</template>

<script>
//引入svg图片
import tool from "../assets/tool_svg/index";
import toolgif from "../assets/tool_png/basic/index.main";

//获取文件xml
const path = require("path");
import $ from "jquery";
import { parse } from "querystring";
import rotate from "../assets/images/rotate/index";
import { sign } from "crypto";
export default {
  name: "toolbar",
  props: ["editor", "graph", "parent"],
  data() {
    return {
      tool,
      toolgif,
      cell_offset: {
        x: 0,
        y: 0,
      },
      palettes: {
        arrows: {},
      },
      paletteses: {
        currency: {},
      },
    };
  },
  computed: {
    // 当前选中的cell
    getSelectCell() {
      return this.graph && this.graph.getSelectionCells();
    },
  },
  watch: {
    getSelectCell(n, o) {
      // 展示cell信息
      let tmpCell = this.graph && this.graph.getSelectionCells()[0];
      console.log(tmpCell);
      if (tmpCell == undefined) {
        return;
      }
    },
  },
  created() {},
  mounted() {
    this.$nextTick(() => {
      setTimeout(() => {
        //创建通用模板
        this.createCurrency();
        //创建折叠面板中的图形
        this.createTool();
        this.addStencilPalette("箭头", "arrows", path.join("arrows.xml"));
        this.addStencilPalette("通用", "currency", path.join("currency.xml"));
        setTimeout(() => {
          //创建XML模块
          this.createXML(this.$refs.dragItem, this.palettes);
          this.createXML(this.$refs.dragItem1, this.paletteses);
          //添加描点
          // this.toggle();
        }, 1000);
      }, 500);
    });

    mxGraph.prototype.resetEdge = function (edge) {
      console.log(edge);
    };
    mxGraph.prototype.resetEdges = function (cells) {
      console.log(cells);
    };
  },
  methods: {
    toggle() {
      // Overridden to define per-shape connection points
      mxGraph.prototype.getAllConnectionConstraints = function (
        terminal,
        source
      ) {
        if (terminal != null && terminal.shape != null) {
          if (terminal.shape.stencil != null) {
            if (terminal.shape.stencil.constraints != null) {
              return terminal.shape.stencil.constraints;
            }
          } else if (terminal.shape.constraints != null) {
            return terminal.shape.constraints;
          }
        }

        return null;
      };

      // Defines the default constraints for all shapes
      mxShape.prototype.constraints = [
        new mxConnectionConstraint(new mxPoint(0.25, 0), true),
        new mxConnectionConstraint(new mxPoint(0.5, 0), true),
        new mxConnectionConstraint(new mxPoint(0.75, 0), true),
        new mxConnectionConstraint(new mxPoint(0, 0.25), true),
        new mxConnectionConstraint(new mxPoint(0, 0.5), true),
        new mxConnectionConstraint(new mxPoint(0, 0.75), true),
        new mxConnectionConstraint(new mxPoint(1, 0.25), true),
        new mxConnectionConstraint(new mxPoint(1, 0.5), true),
        new mxConnectionConstraint(new mxPoint(1, 0.75), true),
        new mxConnectionConstraint(new mxPoint(0.25, 1), true),
        new mxConnectionConstraint(new mxPoint(0.5, 1), true),
        new mxConnectionConstraint(new mxPoint(0.75, 1), true),
      ];

      // Edges have no connection points
      mxPolyline.prototype.constraints = null;

      // Enables connect preview for the default edge style
      mxConnectionHandler.prototype.createEdgeState = function (me) {
        var edge = graph.createEdge(null, null, null, null, null);

        return new mxCellState(
          this.graph.view,
          edge,
          this.graph.getCellStyle(edge)
        );
      };

      // Specifies the default edge style
      //设置单元格的连线时可以折线的
      // this.graph.getStylesheet().getDefaultEdgeStyle()["edgeStyle"] =
      //   // "orthogonalEdgeStyle";
    },
    //通用模板
    createCurrency() {
      //创建一个新的工具栏监听工具
      var parent = document.getElementById("container");
      var toolbar = new mxToolbar(parent);
      toolbar.enabled = false;
      //创建一个工具箱事件
      let _self = this;
      var addVertex = (icon, w, h, style) => {
        var vertex = new mxCell(null, new mxGeometry(0, 0, w, h), style);
        vertex.setVertex(true);
        let img = _self.addToolbarItem(this.graph, toolbar, vertex, icon);

        // 工具箱事件
        // toolbar.enabled = true;
        img.enabled = true;
        this.graph.getSelectionModel().addListener(mxEvent.CHANGE, () => {
          let tmp = _self.graph.isSelectionEmpty();
          // 这里的20透明度表示的是某个cell元素(节点或者边)获得焦点的时候工具栏的透明度
          mxUtils.setOpacity(img, tmp ? 100 : 20);
          img.enabled = tmp;
        });
      };

      //定义虚线的样式
      let dashed = {
        [mxConstants.STYLE_ROUNDED]: true,
        [mxConstants.STYLE_DASHED]: 1, // 定义虚线的样式
      };
      //
      this.graph.getStylesheet().putCellStyle("dashed", dashed);
      toolgif.icon.forEach((item) => {
        if (item.includes("actor")) {
          addVertex(item, 30, 30, "shape=actor;");
        } else if (item.includes("ellipse")) {
          addVertex(item, 30, 30, "shape=ellipse;");
        } else if (item.includes("rhombus")) {
          addVertex(item, 30, 30, "shape=rhombus;");
        } else if (item.includes("triangle")) {
          addVertex(item, 30, 30, "shape=triangle;");
        } else if (item.includes("cloud")) {
          addVertex(item, 30, 30, "shape=cloud;");
        } else if (item.includes("hexagon")) {
          addVertex(item, 30, 30, "shape=hexagon;");
        } else if (item.includes("cylinder")) {
          addVertex(item, 30, 30, "shape=cylinder;");
        } else if (item.includes("hline")) {
          addVertex(item, 30, 30, "shape=line;");
        } else if (item.includes("dotted")) {
          addVertex(item, 30, 30, "shape=line;dashed;");
        } else if (item.includes("open_start")) {
          //addVertex(item, 30, 30, "shape=line;openstart;");
        }
      });
    },
    //初始化创建工具栏  仪表~风机的模板
    createTool() {
      //声名一个全局的图片样式
      const mystyle = {
        //可能的值都是带有形状前缀的常量或任何新定义的形状名称
        [mxConstants.STYLE_SHAPE]: mxConstants.SHAPE_LABEL, // 不设置这个属性 背景图片不出来
        [mxConstants.STYLE_PERIMETER]: mxPerimeter.RectanglePerimeter,
        [mxConstants.STYLE_ROUNDED]: true,
        [mxConstants.STYLE_ARCSIZE]: 6, // 设置圆角程度

        // [mxConstants.STYLE_STROKECOLOR]: "#ebb862", // 边框颜色
        [mxConstants.STYLE_STROKECOLOR]: tool[0].default.icon[0],
        [mxConstants.STYLE_FONTCOLOR]: "#333333",
        [mxConstants.STYLE_FILLCOLOR]: "transparent", // 背景色
        [mxConstants.STYLE_LABEL_BACKGROUNDCOLOR]: "#e6e6e6",

        [mxConstants.STYLE_ALIGN]: mxConstants.ALIGN_CENTER,
        [mxConstants.STYLE_VERTICAL_ALIGN]: mxConstants.ALIGN_CENTER,
        [mxConstants.STYLE_IMAGE_ALIGN]: mxConstants.ALIGN_CENTER,
        [mxConstants.STYLE_IMAGE_VERTICAL_ALIGN]: mxConstants.ALIGN_CENTER,

        [mxConstants.STYLE_IMAGE]: "",
        [mxConstants.STYLE_IMAGE_WIDTH]: "110",
        [mxConstants.STYLE_IMAGE_HEIGHT]: "110",
        // 该值表示添加到顶点标签顶部的间隔(以像素为单位)(样式仅适用于顶点)。
        [mxConstants.STYLE_SPACING_TOP]: "110",
        // 该值表示添加到顶点标签的每边的间距(以像素为单位)(样式仅适用于顶点)
        [mxConstants.STYLE_SPACING]: "8",
      };
      this.graph.getStylesheet().putCellStyle("mystyle", mystyle);

      //delete this.graph.getStylesheet().getDefaultEdgeStyle()["endArrow"]; //去掉箭头

      //创建一个新的工具栏监听工具
      var parent = document.querySelectorAll(".el-collapse-item__content");
      tool.forEach((element, i) => {
        this.create(parent[i + 3], element.default.icon);
      });
    },
    create(parent, images) {
      var toolbar = new mxToolbar(parent);
      toolbar.enabled = false;
      //创建一个工具箱事件
      //在图中，启用新的连接
      this.graph.setConnectable(true);
      let _self = this;
      var addVertex = (icon, w, h, style) => {
        var vertex = new mxCell(null, new mxGeometry(0, 0, 130, 150), style);
        vertex.setVertex(true);
        let img = _self.addToolbarItem(this.graph, toolbar, vertex, icon);

        // 工具箱事件
        // toolbar.enabled = true;
        img.enabled = true;
        this.graph.getSelectionModel().addListener(mxEvent.CHANGE, () => {
          let tmp = _self.graph.isSelectionEmpty();
          // 这里的20透明度表示的是某个cell元素(节点或者边)获得焦点的时候工具栏的透明度
          mxUtils.setOpacity(img, tmp ? 100 : 20);
          img.enabled = tmp;
        });
      };
      images.forEach((item, i) => {
        addVertex(item, null, null, "mystyle;image=" + item);
      });
    },
    addToolbarItem(graph, toolbar, prototype, image) {
      //在鼠标按下时，获取鼠标点击的dom元素的相关位置，高、宽的信息。
      let vertex_DOMRect = null;
      // 添加、删除功能
      let funct = (graph, evt, cell, x, y) => {
        graph.stopEditing(false);
        let vertex = graph.getModel().cloneCell(prototype);
        //设置单元格的x，y轴
        // vertex.geometry.x = x + this.cell_offset.x + 5;
        // vertex.geometry.y = y + this.cell_offset.y + 5;
        vertex.geometry.x = x;
        vertex.geometry.y = y;
        //设置单元格的宽、高
        vertex.geometry.width = vertex_DOMRect.width;
        vertex.geometry.height = vertex_DOMRect.height;
        //设置单元格中图片的宽、高
        vertex.style +=
          ";imageWidth=" +
          vertex_DOMRect.width +
          ";imageHeight=" +
          vertex_DOMRect.height;
        graph.addCell(vertex);
        graph.setSelectionCell(vertex);
      };
      // 创建拖动预览图标
      let img = toolbar.addMode(null, image, (evt, cell) => {
        let pt = graph.getPointForEvent(evt);
        funct(graph, evt, cell, pt.x, pt.y);
      });
      mxEvent.addListener(img, "mousedown", (evt) => {
        //getBoundingClientRect用于获取某个元素相对于视窗的位置集合
        vertex_DOMRect = evt.target.getBoundingClientRect();
        if (img.enabled === false) {
          mxEvent.consume(evt);
        }
      });

      setTimeout(() => {
        this.$nextTick(() => {
          mxUtils.makeDraggable(img, graph, funct, undefined, -10, -10);
        });
      }, 2000);
      return img;
    },
    //箭头模板
    addStencilPalette(title, name, file) {
      var req = mxUtils.load(file);
      //获取所有的shape的标签
      var root = req.getDocumentElement();
      let shape = root.firstChild;
      if (title == "箭头") {
        this.$set(this.palettes, name, {
          title,
          name,
          shapes: [],
        });
      } else if (title == "通用") {
        this.$set(this.paletteses, name, {
          title,
          name,
          shapes: [],
        });
      }
      //生成一个对象
      while (shape != null) {
        if (shape.nodeType === mxConstants.NODETYPE_ELEMENT) {
          //name:字符串，必填。唯一标识形状的模具名称。
          //“ w”和“ h”是可选的十进制视图范围
          const shapeName = shape.getAttribute("name");
          const w = shape.getAttribute("w");
          const h = shape.getAttribute("h");
          //mxStencilRegistry:一个单例类，提供模板的注册表以及将这些模板绘制到画布或DOM上的方法。
          //mxStencil:通过将desc设置为给定的XML节点并调用parseDescription和parseConstraints来构造新的通用形状
          mxStencilRegistry.addStencil(shapeName, new mxStencil(shape));
          if (title == "箭头") {
            this.palettes[name]["shapes"].push({
              name: shape.getAttribute("name"),
              width: w / 2,
              height: h / 2,
            });
          } else {
            this.paletteses[name]["shapes"].push({
              name: shape.getAttribute("name"),
              width: w / 2,
              height: h / 2,
            });
          }
        }
        shape = shape.nextSibling;
      }
    },
    createThumb(item, width, height, data) {
      const tmpGraph = new mxGraph(document.createElement("div"));
      const thumbBorder = 2;
      //labelsVisible:指定标签是否应可见。这在getLabel中使用。默认为true。
      tmpGraph.labelsVisible = false;
      //scaleAndTranslate:在调用revalidate和mxGraph.sizeDidChange之前，设置缩放比例和转换并触发缩放和平移事件。
      tmpGraph.view.scaleAndTranslate(1, 0, 0);
      this.instanceGraph(tmpGraph, item, 0, 0, width, height, data);
      const bounds = tmpGraph.getGraphBounds();
      const s =
        Math.floor(
          Math.min(
            (width - 2 * thumbBorder) / bounds.width,
            (height - 2 * thumbBorder) / bounds.height
          ) * 100
        ) / 100;
      //scaleAndTranslate 在调用revalidate和mxGraph.sizeDidChange之前，设置缩放比例和转换并触发缩放和平移事件。
      tmpGraph.view.scaleAndTranslate(
        s,
        Math.floor((width - bounds.width * s) / 2 / s - bounds.x),
        Math.floor((height - bounds.height * s) / 2 / s - bounds.y)
      );
      //添加属性，鼠标滑到工具栏图形界面时，鼠标显示的样式
      const node = tmpGraph.view.getCanvas().ownerSVGElement.cloneNode(true);

      node.style.position = "relative";
      node.style.overflow = "hidden";
      node.style.cursor = "move";
      node.style.width = `${width}px`;
      node.style.height = `${height}px`;
      node.style.left = `${thumbBorder}px`;
      node.style.top = `${thumbBorder}px`;
      node.style.display = "inline-block";
      return node;
    },
    createXML(dom, data) {
      //获取折叠面板上的关于显示图片的标签的内容
      let domArray = dom;
      if (!(domArray instanceof Array) || domArray.length <= 0) {
        return;
      }

      //循环标签，
      domArray.forEach((dom) => {
        //获取dom上的标签的属性
        const shapeIndex = dom.getAttribute("shapeIndex");
        const paletteIndex = dom.getAttribute("paletteIndex");
        //获取的每个标签里面的数据
        const shapeItem = Object.values(data)[paletteIndex]["shapes"][
          shapeIndex
        ];
        //获取宽度、高度
        const width = shapeItem["width"];
        const height = shapeItem["height"];
        const dragHandler = (graph, evt, cell, x, y) => {
          //向画布中添加cell
          this.$nextTick(() => {
            let vertex = this.instanceGraph(
              this.graph,
              shapeItem,
              x,
              y,
              width,
              height,
              data
            );
            graph.setSelectionCell(vertex);
            // let tmp = vertex.style.split(";");
            // if (tmp.includes("shape=line")) {
            //   console.log(vertex);
            //   vertex.edge = true;
            //   vertex.geometry.relative = true;
            //    return tmpCell;
            // }
          });
        };
        //当标签被拖拽时，出现的黑色的虚线的边框,用来显示标签被拖拽的效果
        const createDragPreview = () => {
          const elt = document.createElement("div");
          elt.style.border = "2px dotted black";
          elt.style.width = `${width}px`;
          elt.style.height = `${height}px`;
          // return elt;
        };

        dom.appendChild(this.createThumb(shapeItem, width, height, data));
        mxUtils.makeDraggable(
          dom,
          this.graph,
          dragHandler,
          createDragPreview(),
          0,
          0,
          false,
          true
        );
      });
    },
    instanceGraph(graph, shapeItem, x, y, width, height, data) {
      const parent = graph.getDefaultParent();
      graph.getModel().beginUpdate();
      try {
        this.vertex = graph.insertVertex(
          parent,
          null,
          null,
          x,
          y,
          width,
          height,
          `shape=${shapeItem["name"]};fillColor=${
            "arrows" in data ? "#fff" : "#000"
          };startArrow=none;endArrow=${shapeItem["name"]};strokeColor=#000;`
        );

        // this.vertex.edge = true;

        this.vertex.customer = true;
        return this.vertex;
      } finally {
        graph.getModel().endUpdate();
      }
    },
    //展开收缩
    hangdleOpenShrink() {
      $(".container-right").mousedown((e) => {
        console.log(e);
      });
    },
  },
};
</script>

<style scoped lang="scss">
.app-container {
  position: absolute;
  background: whitesmoke;

  display: flex;
  .container-left {
    width: 95%;
    // height: 100%;
    padding: 10px;
    overflow: auto;
    padding-right: 0;

    // 滚动条样式
    &::-webkit-scrollbar {
      width: 5px; //y轴上的滚动条宽度
      height: 5px; //x轴上滚动条高度
    }
    &::-webkit-scrollbar-track {
      border-radius: 3px; /*滚动条的背景区域的圆角*/
      background-color: #fdf8f5; /*滚动条的背景颜色*/
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 3px; /*滚动条的圆角*/
      background-color: #ccc; /*滚动条的背景颜色*/
    }

    &::-webkit-scrollbar-thumb:hover {
      background-color: #838282;
    }

    &::-webkit-scrollbar-thumb:active {
      background-color: #838282;
      cursor: pointer;
    }
  }

  .container-right {
    width: 5%;
    height: 100%;
    border-left: 1px solid #e0e0e0;
    border-right: 1px solid #e0e0e0;
    background: url("../assets/tool_png/fold.png") center no-repeat;
    background-size: 25px 15px;

    cursor: col-resize;
    &:hover {
      background-color: #e0e0e0;
    }
  }
}

/deep/ .el-collapse-item__header,
/deep/ .el-collapse-item__wrap {
  background-color: #fbfbfb;
  padding-left: 10px;
}

/deep/ .el-collapse-item__wrap {
  img {
    width: 50px;
    vertical-align: middle;
    cursor: move;
    margin: 8px 2px;
    &:hover {
      background-color: rgb(240, 236, 236);
      border-radius: 5px;
    }
  }
  .el-collapse-item__content > a > svg {
    padding: 2px 2px;
    &:hover {
      background-color: rgb(240, 236, 236);
      border-radius: 5px;
    }
  }
}

/deep/ #container {
  .mxToolbarMode {
    padding: 2px 5px;
    width: 20px !important;
  }
}

/deep/ button {
  position: absolute;
  top: 100px;
  left: 300px;
}
</style>