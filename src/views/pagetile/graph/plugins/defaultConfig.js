import mxgraph from "../index";
const {
    mxConstants,
    mxGraphHandler,
    mxEdgeHandler,
    mxEvent,
    mxPerimeter,
    mxRubberband,
    mxImage,
    mxVertexHandler,
    mxCellState,
    mxShape,
    mxConstraintHandler,
    mxGraph,
    mxPoint,
    mxConnectionConstraint
} = mxgraph;

const primaryColor = "#0CBABD";

export default graph => {
    // Enables rubberband selection
    new mxRubberband(graph);

    mxGraphHandler.prototype.guidesEnabled = true;
    // // // Defines the guides to be red (default)
    // mxConstants.GUIDE_CpageVisibleOLOR = "#FF0000";
    graph.pageVisible = true;
    graph.pageBreaksVisible = true;
    graph.preferPageSize = true;

    // // // Defines the guides to be 1 pixel (default)
    // mxConstants.GUIDE_STROKEWIDTH = 1;

    // //   mxGraph.prototype.keepEdgesInBackground = true;

    // // Creates the default style for vertices
    // var style = [];
    // style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_RECTANGLE;
    // style[mxConstants.STYLE_PERIMETER] = mxPerimeter.RectanglePerimeter;
    // style[mxConstants.STYLE_STROKECOLOR] = primaryColor;
    // style[mxConstants.STYLE_ROUNDED] = true;
    // style[mxConstants.STYLE_FILLCOLOR] = primaryColor;
    // style[mxConstants.STYLE_GRADIENTCOLOR] = "#efefef";
    // style[mxConstants.STYLE_FONTCOLOR] = "#444";
    // style[mxConstants.STYLE_ALIGN] = mxConstants.ALIGN_CENTER;
    // style[mxConstants.STYLE_VERTICAL_ALIGN] = mxConstants.ALIGN_MIDDLE;
    // style[mxConstants.STYLE_FONTSIZE] = "12";
    // style[mxConstants.STYLE_FONTSTYLE] = 1;

    // graph.getStylesheet().putDefaultVertexStyle(style);

    //   //设备组合样式
    //   style = [];
    //   style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_RECTANGLE;
    //   style[mxConstants.STYLE_PERIMETER] = mxPerimeter.RectanglePerimeter;
    //   style[mxConstants.STYLE_STROKECOLOR] = primaryColor;
    //   style[mxConstants.STYLE_ROUNDED] = false;
    //   style[mxConstants.STYLE_FILLCOLOR] = primaryColor;
    //   style[mxConstants.STYLE_FONTCOLOR] = "#444";
    //   style[mxConstants.STYLE_ALIGN] = mxConstants.ALIGN_CENTER;
    //   style[mxConstants.STYLE_VERTICAL_ALIGN] = mxConstants.ALIGN_MIDDLE;
    //   style[mxConstants.STYLE_FONTSIZE] = "12";
    //   style[mxConstants.STYLE_FONTSTYLE] = 1;
    //   graph.getStylesheet().putCellStyle("devicePort", style);

    //   // // Creates the default style for edges
    //   style = [];
    //   style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_CONNECTOR;
    //   style[mxConstants.STYLE_STROKECOLOR] = primaryColor;
    //   style[mxConstants.STYLE_STROKEWIDTH] = 2;
    //   style[mxConstants.STYLE_GRADIENTCOLOR] = "#efefef";
    //   style[mxConstants.STYLE_ROUNDED] = true;
    //   style[mxConstants.STYLE_ALIGN] = mxConstants.ALIGN_CENTER;
    //   style[mxConstants.STYLE_VERTICAL_ALIGN] = mxConstants.ALIGN_MIDDLE;
    //   style[mxConstants.STYLE_EDGE] = mxConstants.EDGESTYLE_ORTHOGONAL;
    //   style[mxConstants.STYLE_ENDARROW] = mxConstants.ARROW_CLASSIC;
    //   style[mxConstants.STYLE_FONTSIZE] = "12";
    //   style[mxConstants.STYLE_FONTCOLOR] = "#333";
    //   style[mxConstants.STYLE_LABEL_BACKGROUNDCOLOR] = "#b2dfdb";
    //   graph.getStylesheet().putDefaultEdgeStyle(style);

    // graph.setConnectable(true);
    // // 设置拖拽线的过程出现折线，默认为直线
    // graph.connectionHandler.createEdgeState = () => {
    //     const edge = graph.createEdge();
    //     return new mxCellState(graph.view, edge, graph.getCellStyle(edge));
    // };
    // //auto navigate
    // mxEdgeHandler.prototype.snapToTerminals = true;

    // graph.setConnectableEdges(true);
    // graph.setDisconnectOnMove(false);

    // graph.setHtmlLabels(true);

    // //group
    // graph.recursiveResize = true;

    // //拖拽元素时边框样式
    // mxGraphHandler.prototype.previewColor = primaryColor;

    // //缩放从中间开始
    // graph.centerZoom = true;

    //可以拖拽
    graph.setPanning(true);

    //   mxVertexHandler.prototype.livePreview = true;
    //   mxVertexHandler.prototype.rotationEnabled = true;

    //   var touchHandle = new mxImage(
    //     "mxgraph/images/handle-main.png",
    //     17,
    //     17
    //   );
    //   mxVertexHandler.prototype.handleImage = touchHandle;
    //   // mxVertexHandler.prototype.singleSizer = true;
    //   mxVertexHandler.prototype.rotationHandleVSpacing = -20;

    //   //旋转样式
    //   var rotateHandle = new mxImage(
    //     "static/mxgraph/images/handle-rotate.png",
    //     19,
    //     21
    //   );
    //   var vertexHandlerCreateSizerShape =
    //     mxVertexHandler.prototype.createSizerShape;
    //   mxVertexHandler.prototype.createSizerShape = function(
    //     bounds,
    //     index,
    //     fillColor
    //   ) {
    //     this.handleImage =
    //       index == mxEvent.ROTATION_HANDLE
    //         ? rotateHandle
    //         : index == mxEvent.LABEL_HANDLE
    //         ? this.secondaryHandleImage
    //         : this.handleImage;

    //     return vertexHandlerCreateSizerShape.apply(this, arguments);
    //   };

    //   // 禁止从节点中心拖拽出线条
    //   graph.connectionHandler.isConnectableCell = () => false;
    //   mxEdgeHandler.prototype.isConnectableCell = () => false;

    //   // Overridden to define per-shape connection points
    //   mxGraph.prototype.getAllConnectionConstraints = terminal => {
    //     if (terminal != null && terminal.shape != null) {
    //       if (terminal.shape.stencil != null) {
    //         if (terminal.shape.stencil != null) {
    //           return terminal.shape.stencil.constraints;
    //         }
    //       } else if (terminal.shape.constraints != null) {
    //         return terminal.shape.constraints;
    //       }
    //     }

    //     return null;
    //   };

    // Defines the default constraints for all shapes
    mxShape.prototype.constraints = [
        new mxConnectionConstraint(new mxPoint(0, 0), true),
        new mxConnectionConstraint(new mxPoint(0, 1), true),
        new mxConnectionConstraint(new mxPoint(1, 0), true),
        new mxConnectionConstraint(new mxPoint(1, 1), true),
        // new mxConnectionConstraint(new mxPoint(0.25, 0), true),
        new mxConnectionConstraint(new mxPoint(0.5, 0), true),
        // new mxConnectionConstraint(new mxPoint(0.75, 0), true),
        // new mxConnectionConstraint(new mxPoint(0, 0.25), true),
        new mxConnectionConstraint(new mxPoint(0, 0.5), true),
        // new mxConnectionConstraint(new mxPoint(0, 0.75), true),
        // new mxConnectionConstraint(new mxPoint(1, 0.25), true),
        new mxConnectionConstraint(new mxPoint(1, 0.5), true),
        // new mxConnectionConstraint(new mxPoint(1, 0.75), true),
        // new mxConnectionConstraint(new mxPoint(0.25, 1), true),
        new mxConnectionConstraint(new mxPoint(0.5, 1), true)
        // new mxConnectionConstraint(new mxPoint(0.75, 1), true)
    ];

    mxConstraintHandler.prototype.pointImage = new mxImage(
        "mxgraph/images/dot.gif",
        6,
        6
    );
    mxConstraintHandler.prototype.highlightColor = "#00ff00";

    mxVertexHandler.prototype.manageSizers = true;

    // //滚轮缩放
    // mxEvent.addMouseWheelListener(function(evt, up) {
    //     if (up) {
    //         graph.zoomIn();
    //     } else {
    //         graph.zoomOut();
    //     }

    //     mxEvent.consume(evt);
    // });
};