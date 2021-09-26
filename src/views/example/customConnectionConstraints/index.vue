<template>
<div class="customShapeContainer">
    <div class="graphContainer" ref="container"></div>
</div>
</template>

<script>
import {
    mxGraph as mxGraph,
    mxPoint as mxPoint,
    mxImage as mxImage,
    mxEllipse as mxEllipse,
    mxRubberband as mxRubberband,
    mxConnectionConstraint as mxConnectionConstraint
} from 'mxgraph/javascript/mxClient'

export default {
    name: 'customShape',
    data() {
        return {
            graph: null,
            rubberBand: null
        }
    },
    methods: {
        createGraph() {
            this.graph = new mxGraph(this.$refs.container)
            this.$refs.container.style.background = 'url("./mxgraph/images/grid.gif")'
        },
        initGraph() {
            if (this.R.isNil(this.graph)) {
                return
            }
            this.graph.setConnectable(true)
			//mxRubberband:构造一个事件处理程序，该事件处理程序使用橡皮筋选择来选择图形中的矩形区域。
            this.rubberBand = new mxRubberband(this.graph)
            const pointImg = require('@/assets/point.gif')
			//pointImage:mxImage用作固定连接点的图像。
			//mxImage:构造一个新图像
            this.graph.connectionHandler.constraintHandler.pointImage = new mxImage(pointImg, 10, 10)
			//重画
			//将焦点转移到给定的状态，作为源终端或目标终端。如果未启用处理程序，则将绘制轮廓，但忽略约束。
            this.graph.connectionHandler.constraintHandler.createHighlightShape = function () {
				//mxEllipse:构造一个新的椭圆形状。
                return new mxEllipse(null, this.highlightColor, this.highlightColor, 2)
            }
			//getAllConnectionConstraints:返回给定终端的所有mxConnectionConstraints的数组。如果给定终端的形状为<mxStencilShape>，则返回相应mxStencil的约束。
            this.graph.getAllConnectionConstraints = function (terminal) {
                if (terminal !== null && terminal.shape !== null) {
                    const cell = terminal['cell']
                    const constraints = cell['constraints']

                    if (constraints instanceof Array && constraints.length > 0) {

                        return constraints.map((constraint) => {
                            return new mxConnectionConstraint(new mxPoint(constraint['x'], constraint['y']), constraint['perimeter'])
                        })
                    } else {
                        if (terminal.shape.stencil) {
                            return terminal.shape.stencil.constraints
                        } else if (terminal.shape.constraints) {
                            return terminal.shape.constraints
                        }
                    }
                }
                return null
            }
            this.graph.connectionHandler.isConnectableCell = function () {
                return false
            }
        },
		//鼠标滑过时，出现的描点的位置
        addCell() {
            const parent = this.graph.getDefaultParent()

            this.graph.getModel().beginUpdate()
            try {
                const cell = this.graph.insertVertex(parent, null, null, 500, 10, 200, 200, 'shape=rect')

                cell['constraints'] = [{
                        x: -0.5,
                        y: 0.25,
                        perimeter: true
                    },
                    {
                        x: -0.5,
                        y: 0.25,
                        perimeter: false
                    },
                    {
                        x: -0.5,
                        y: 0.75,
                        perimeter: true
                    },
                    {
                        x: -0.5,
                        y: 0.75,
                        perimeter: false
                    },
                    {
                        x: 1,
                        y: 0.25,
                        perimeter: false
                    },
                    {
                        x: 1,
                        y: 0.75,
                        perimeter: false
                    }
                ]
            } finally {
                this.graph.getModel().endUpdate()
            }
        }
    },
    mounted() {
        this.createGraph()
        this.initGraph()
        this.addCell()
    }
}
</script>

<style lang="scss">
.customShapeContainer {
    width: 100%;
    height: 100%;
    position: relative;

    .graphContainer {
        width: 100%;
        height: 100%;
    }
}
</style>
