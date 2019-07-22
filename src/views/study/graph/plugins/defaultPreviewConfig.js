import mxgraph from "../index.js";
const { mxConstants, mxPerimeter, mxEdgeHandler } = mxgraph;

const primaryColor = "#0CBABD";

export default graph => {
    graph.setPanning(true);
    graph.setCellsMovable(false);
    graph.setCellsResizable(false);
    graph.setCellsDeletable(false);
    graph.setCellsBendable(false);
    graph.setCellsEditable(false);
    graph.setCellsDisconnectable(true);
    graph.setConnectableEdges(false);
    mxGraph.prototype.keepEdgesInBackground = true;
    graph.centerZoom = false;
    graph.panningHandler.useLeftButtonForPanning = true;

    mxConstants.VERTEX_SELECTION_COLOR = "#FF0000";
    mxConstants.VERTEX_SELECTION_STROKEWIDTH = 2;
    mxConstants.EDGE_SELECTION_COLOR = "#FF0000";
    mxConstants.EDGE_SELECTION_STROKEWIDTH = 2;

    // Creates the default style for vertices
    var style = [];
    style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_RECTANGLE;
    style[mxConstants.STYLE_PERIMETER] = mxPerimeter.RectanglePerimeter;
    style[mxConstants.STYLE_STROKECOLOR] = primaryColor;
    style[mxConstants.STYLE_ROUNDED] = true;
    style[mxConstants.STYLE_FILLCOLOR] = primaryColor;
    style[mxConstants.STYLE_GRADIENTCOLOR] = "#efefef";
    style[mxConstants.STYLE_FONTCOLOR] = "#444";
    style[mxConstants.STYLE_ALIGN] = mxConstants.ALIGN_CENTER;
    style[mxConstants.STYLE_VERTICAL_ALIGN] = mxConstants.ALIGN_MIDDLE;
    style[mxConstants.STYLE_FONTSIZE] = "12";
    style[mxConstants.STYLE_FONTSTYLE] = 1;
    style[mxConstants.STYLE_ROTATABLE] = 0; //禁止旋转

    graph.getStylesheet().putDefaultVertexStyle(style);

    // Creates the default style for edges
    style = [];
    style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_CONNECTOR;
    style[mxConstants.STYLE_STROKECOLOR] = primaryColor;
    style[mxConstants.STYLE_STROKEWIDTH] = 2;
    style[mxConstants.STYLE_ROUNDED] = true;
    style[mxConstants.STYLE_ALIGN] = mxConstants.ALIGN_CENTER;
    style[mxConstants.STYLE_VERTICAL_ALIGN] = mxConstants.ALIGN_MIDDLE;
    style[mxConstants.STYLE_EDGE] = mxConstants.EDGESTYLE_ORTHOGONAL;
    style[mxConstants.STYLE_ENDARROW] = mxConstants.ARROW_CLASSIC;
    style[mxConstants.STYLE_FONTSIZE] = "12";
    style[mxConstants.STYLE_FONTCOLOR] = "#333";
    style[mxConstants.STYLE_LABEL_BACKGROUNDCOLOR] = "#b2dfdb";
    graph.getStylesheet().putDefaultEdgeStyle(style);

    // mxEvent.addMouseWheelListener(function(evt, up) {
    //   console.log("TCL: evt", evt);
    //   if (
    //     evt.target.localName === "svg" ||
    //     evt.target.parentElement.localName === "g"
    //   ) {
    //     if (up) {
    //       graph.zoomIn();
    //     } else {
    //       graph.zoomOut();
    //     }

    //     mxEvent.consume(evt);
    //   }
    // });
};