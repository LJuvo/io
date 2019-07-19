import mxgraph from "../core/index.js";
const {
  mxEvent,
  mxEdgeHandler,
  mxGuide,
  mxConstants,
  mxConnectionHandler,
  mxEdgeSegmentHandler,
  mxConnectionConstraint,
  mxGraph
} = mxgraph;

export default (graph, enable) => {
  console.log("TCL: enable", enable);
  var invert = false;
  var labelBackground = invert ? "#000000" : "#FFFFFF";
  var fontColor = invert ? "#FFFFFF" : "#000000";
  var strokeColor = invert ? "#C0C0C0" : "#000000";
  var fillColor = invert ? "none" : "#FFFFFF";

  var style = graph.getStylesheet().getDefaultEdgeStyle();
  style["strokeColor"] = strokeColor;
  style["labelBackgroundColor"] = labelBackground;
  style["edgeStyle"] = "wireEdgeStyle";
  style["fontColor"] = fontColor;
  style["fillColor"] = "red";
  style["fontSize"] = "9";
  style["movable"] = "0";
  style["strokeWidth"] = strokeWidth;
  style["endArrow"] = "none";
  //style['rounded'] = '1';

  // Sets join node size
  style["startSize"] = joinNodeSize;
  style["endSize"] = joinNodeSize;

  graph.getStylesheet().putDefaultEdgeStyle(style);

  // If connect preview is not moved away then getCellAt is used to detect the cell under
  // the mouse if the mouse is over the preview shape in IE (no event transparency), ie.
  // the built-in hit-detection of the HTML document will not be used in this case.
  mxConnectionHandler.prototype.movePreviewAway = false;
  mxConnectionHandler.prototype.waypointsEnabled = true;
  mxGraph.prototype.resetEdgesOnConnect = false;
  mxConstants.SHADOWCOLOR = "#C0C0C0";
  var joinNodeSize = 7;
  var strokeWidth = 2;

  // Alt disables guides
  mxGuide.prototype.isEnabledForEvent = function(evt) {
    return !mxEvent.isAltDown(evt);
  };

  // Enables snapping waypoints to terminals
  mxEdgeHandler.prototype.snapToTerminals = true;

  // Panning handler consumed right click so this must be
  // disabled if right click should stop connection handler.
  graph.panningHandler.isPopupTrigger = function() {
    return false;
  };

  // Enables return key to stop editing (use shift-enter for newlines)
  graph.setEnterStopsCellEditing(true);

  // Alternative solution for implementing connection points without child cells.
  // This can be extended as shown in portrefs.html example to allow for per-port
  // incoming/outgoing direction.
  graph.getAllConnectionConstraints = function(terminal) {
    var geo = terminal != null ? this.getCellGeometry(terminal.cell) : null;

    if (
      (geo != null ? !geo.relative : false) &&
      this.getModel().isVertex(terminal.cell) &&
      this.getModel().getChildCount(terminal.cell) == 0
    ) {
      return [
        new mxConnectionConstraint(new mxPoint(0, 0.5), false),
        new mxConnectionConstraint(new mxPoint(1, 0.5), false)
      ];
    }

    return null;
  };

  // Makes sure non-relative cells can only be connected via constraints
  graph.connectionHandler.isConnectableCell = function(cell) {
    if (this.graph.getModel().isEdge(cell)) {
      return true;
    } else {
      var geo = cell != null ? this.graph.getCellGeometry(cell) : null;

      return geo != null ? geo.relative : false;
    }
  };
  mxEdgeHandler.prototype.isConnectableCell = function(cell) {
    return graph.connectionHandler.isConnectableCell(cell);
  };

  // Adds a special tooltip for edges
  graph.setTooltips(true);

  var getTooltipForCell = graph.getTooltipForCell;
  graph.getTooltipForCell = function(cell) {
    var tip = "";

    if (cell != null) {
      var src = this.getModel().getTerminal(cell, true);

      if (src != null) {
        tip += this.getTooltipForCell(src) + " ";
      }

      var parent = this.getModel().getParent(cell);

      if (this.getModel().isVertex(parent)) {
        tip += this.getTooltipForCell(parent) + ".";
      }

      tip += getTooltipForCell.apply(this, arguments);

      var trg = this.getModel().getTerminal(cell, false);

      if (trg != null) {
        tip += " " + this.getTooltipForCell(trg);
      }
    }

    return tip;
  };

  // Starts connections on the background in wire-mode
  var connectionHandlerIsStartEvent = graph.connectionHandler.isStartEvent;
  graph.connectionHandler.isStartEvent = function(me) {
    if (enable) {
      return true;
    } else {
      return (
        (this.constraintHandler.currentFocus != null &&
          this.constraintHandler.currentConstraint != null) ||
        (this.previous != null &&
          this.error == null &&
          (this.icons == null || (this.icons != null && this.icon != null)))
      );
    }
  };

  // Sets source terminal point for edge-to-edge connections.
  mxConnectionHandler.prototype.createEdgeState = function(me) {
    var edge = this.graph.createEdge();

    if (this.sourceConstraint != null && this.previous != null) {
      edge.style =
        mxConstants.STYLE_EXIT_X +
        "=" +
        this.sourceConstraint.point.x +
        ";" +
        mxConstants.STYLE_EXIT_Y +
        "=" +
        this.sourceConstraint.point.y +
        ";";
    } else if (this.graph.model.isEdge(me.getCell())) {
      var scale = this.graph.view.scale;
      var tr = this.graph.view.translate;
      var pt = new mxPoint(
        this.graph.snap(me.getGraphX() / scale) - tr.x,
        this.graph.snap(me.getGraphY() / scale) - tr.y
      );
      edge.geometry.setTerminalPoint(pt, true);
    }

    return this.graph.view.createState(edge);
  };

  // 右键完成绘制
  mxConnectionHandler.prototype.isStopEvent = function(me) {
    if (enable) {
      //启用
      return me.getState() != null || mxEvent.isRightMouseButton(me.getEvent());
    } else {
      //取消
      return me.getState() != null;
    }
  };

  // Updates target terminal point for edge-to-edge connections.
  var mxConnectionHandlerUpdateCurrentState =
    mxConnectionHandler.prototype.updateCurrentState;
  mxConnectionHandler.prototype.updateCurrentState = function(me) {
    mxConnectionHandlerUpdateCurrentState.apply(this, arguments);

    if (this.edgeState != null) {
      this.edgeState.cell.geometry.setTerminalPoint(null, false);

      if (
        this.shape != null &&
        this.currentState != null &&
        this.currentState.view.graph.model.isEdge(this.currentState.cell)
      ) {
        var scale = this.graph.view.scale;
        var tr = this.graph.view.translate;
        var pt = new mxPoint(
          this.graph.snap(me.getGraphX() / scale) - tr.x,
          this.graph.snap(me.getGraphY() / scale) - tr.y
        );
        this.edgeState.cell.geometry.setTerminalPoint(pt, false);
      }
    }
  };

  // Updates the terminal and control points in the cloned preview.
  mxEdgeSegmentHandler.prototype.clonePreviewState = function(point, terminal) {
    var clone = mxEdgeHandler.prototype.clonePreviewState.apply(
      this,
      arguments
    );
    clone.cell = clone.cell.clone();

    if (this.isSource || this.isTarget) {
      clone.cell.geometry = clone.cell.geometry.clone();

      // Sets the terminal point of an edge if we're moving one of the endpoints
      if (this.graph.getModel().isEdge(clone.cell)) {
        // TODO: Only set this if the target or source terminal is an edge
        clone.cell.geometry.setTerminalPoint(point, this.isSource);
      } else {
        clone.cell.geometry.setTerminalPoint(null, this.isSource);
      }
    }

    return clone;
  };

  var mxEdgeHandlerConnect = mxEdgeHandler.prototype.connect;
  mxEdgeHandler.prototype.connect = function(
    edge,
    terminal,
    isSource,
    isClone,
    me
  ) {
    var result = null;
    var model = this.graph.getModel();
    var parent = model.getParent(edge);

    model.beginUpdate();
    try {
      result = mxEdgeHandlerConnect.apply(this, arguments);
      var geo = model.getGeometry(result);

      if (geo != null) {
        geo = geo.clone();
        var pt = null;

        if (model.isEdge(terminal)) {
          pt = this.abspoints[this.isSource ? 0 : this.abspoints.length - 1];
          pt.x = pt.x / this.graph.view.scale - this.graph.view.translate.x;
          pt.y = pt.y / this.graph.view.scale - this.graph.view.translate.y;

          var pstate = this.graph
            .getView()
            .getState(this.graph.getModel().getParent(edge));

          if (pstate != null) {
            pt.x -= pstate.origin.x;
            pt.y -= pstate.origin.y;
          }

          pt.x -= this.graph.panDx / this.graph.view.scale;
          pt.y -= this.graph.panDy / this.graph.view.scale;
        }

        geo.setTerminalPoint(pt, isSource);
        model.setGeometry(edge, geo);
      }
    } finally {
      model.endUpdate();
    }

    return result;
  };
};
