import mx from 'mxgraph';
const mxgraph = mx({
    // mxImageBasePath: './src/images',
    mxBasePath :'javascript/src/',
    // mxBasePath: './src'
});

// decode bug https://github.com/jgraph/mxgraph/issues/49
window.mxGraph = mxgraph.mxGraph;
window.mxConstants = mxgraph.mxConstants;           // 各种全局常量
window.mxPerimeter = mxgraph.mxPerimeter;           // 提供各种周长函数，作为mxConstants.STYLE_PERIMETER的值在样式中使用。矩形、圆形、菱形和三角形的周长可供选择。
window.mxCellTracker = mxgraph.mxCellTracker;       // 构造突出显示单元格的事件处理程序。也就是单元格高亮
window.mxEvent = mxgraph.mxEvent;                   // 跨浏览器DOM事件支持。
window.mxUndoManager = mxgraph.mxUndoManager;       // 撤销的状态管理器
window.mxKeyHandler = mxgraph.mxKeyHandler;         // 键盘事件监听处理
window.mxRubberband = mxgraph.mxRubberband;         // 鼠标左键的拖拽框选
window.mxShape = mxgraph.mxShape;                   // 自定义形状
window.mxPoint = mxgraph.mxPoint;                   // 为可选的x和y坐标构造一个新点。如果没有给出坐标，则使用x和y的默认值。
window.mxPolyline = mxgraph.mxPolyline;             // 构造新的折线形状。
window.mxConnectionConstraint = mxgraph.mxConnectionConstraint; // 为给定的点和布尔参数构造新的连接约束。
window.mxToolbar = mxgraph.mxToolbar;               // 工具栏
window.mxCell = mxgraph.mxCell;                     // 单元格是图模型的元素。它们表示图中组、顶点和边的状态。
window.mxUtils = mxgraph.mxUtils;                   // 提供跨浏览器helper方法的单例类。这是一个全球性的功能。要访问这个类中的函数，使用全局类名加上functionname。
window.mxEventObject = mxgraph.mxEventObject;       // 构造具有指定名称的新事件对象。可以附加一个键、值对的可选序列来定义属性。
window.mxCellState = mxgraph.mxCellState;           // 构造表示指定视图中给定单元格的当前状态的新对象。
window.mxOutline = mxgraph.mxOutline;               // 缩略图
window.mxUtils = mxgraph.mxUtils;                   // 提供跨浏览器辅助方法的单例类。
window.mxStencilRegistry = mxgraph.mxStencilRegistry;// 一个单例类，它提供了模板的注册表以及将这些模板绘制到画布或DOM上的方法。
window.mxStencil = mxgraph.mxStencil;             // 通过为给定的XML节点设置desc并调用parseDescription和parseConstraints来构造一个新的通用形状。
window.mxCodec = mxgraph.mxCodec;                 // 为指定的所有者文档构造XML编码器/解码器。
window.mxClipboard = mxgraph.mxClipboard;         // 为图形单元格实现剪贴板的单例。
window.mxVertexHandler = mxgraph.mxVertexHandler;   // 开启旋转按钮必须的
window.mxConnectionHandler = mxgraph.mxConnectionHandler;   // 创建新连接的图形事件处理程序
window.mxEdgeHandler = mxgraph.mxEdgeHandler;
window.mxGraphModel = mxgraph.mxGraphModel;
window.mxEditor = mxgraph.mxEditor;
window.mxGeometry = mxgraph.mxGeometry;
window.mxDefaultKeyHandler = mxgraph.mxDefaultKeyHandler;
window.mxDefaultPopupMenu = mxgraph.mxDefaultPopupMenu;
window.mxStylesheet = mxgraph.mxStylesheet;
window.mxDefaultToolbar = mxgraph.mxDefaultToolbar;
window.mxEdgeStyle = mxgraph.mxEdgeStyle;
window.mxStencilShape = mxgraph.mxStencilShape;
window.mxStencilRegistry = mxgraph.mxStencilRegistry;
window.mxCellRenderer = mxgraph.mxCellRenderer;
window.mxEllipse = mxgraph.mxEllipse;
window.mxRectangle = mxgraph.mxRectangle;
window.mxRectangleShape  = mxgraph.mxRectangleShape;
window.mxImageShape  = mxgraph.mxImageShape;
window.mxLog = mxgraph.mxLog ;
window.mxConnector = mxgraph.mxConnector ;
window.mxEdgeSegmentHandler = mxgraph.mxEdgeSegmentHandler ;
export default mxgraph;