module.exports = {
  // publicPath: '/',
  // outputDir: 'dist',
  lintOnSave: true,
  chainWebpack: config => {
    // config.module
    //   .rule('')
    //   .test(/mxClient\.js$/)
    //   .use('exports-loader')
    //   .loader('exports-loader?mxClient,mxToolbar,mxEdgeStyle,mxConnectionHandler,mxEllipse,mxConnectionConstraint,mxWindow,' +
    //     'mxObjectCodec,mxGraphModel,mxActor,mxPopupMenu,mxShape,mxEventObject,mxGraph,mxPopupMenuHandler,mxPrintPreview,' +
    //     'mxEventSource,mxRectangle,mxVertexHandler,mxMouseEvent,mxGraphView,mxCodecRegistry,mxImage,mxGeometry,mxCellState,' +
    //     'mxRubberband,mxConstraintHandler,mxKeyHandler,mxDragSource,mxGraphModel,mxEvent,mxUtils,mxEvent,mxCodec,mxCell,' +
    //     'mxConstants,mxPoint,mxGraphHandler,mxCylinder,mxCellRenderer,mxEvent,mxUndoManager,mxStencilRegistry,mxStencil')
    //   .end();
  },
  configureWebpack: {
    externals: {
      'AMap': 'AMap', // 高德地图配置
      'AMapUI': 'AMapUI'
    }
  },
  // resolve: {
  //   extensions: ['.js', '.vue', '.json'],
  //   alias: {
  //     'vue$': 'vue/dist/vue.esm.js',
  //     '@': resolve('src'),
  //     'jquery': path.resolve(__dirname, '../node_modules/jquery/src/jquery')
  //   }
  // },
}
