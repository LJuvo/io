import mxgraph from "./index";
import defaultConfig from "../plugins/defaultPreviewConfig";

const {
  mxGraph,
  mxImage,
  mxCodec,
  mxUtils,
  mxPoint,
  mxCellHighlight,
  mxCellOverlay,
  mxConstants
} = mxgraph;

/**
 * 纯查看Graph类
 */
export default class EditGraph extends mxGraph {
  constructor(container) {
    super(container);
    this._init();
  }

  _init() {
    defaultConfig(this);
    // connectionHandler(this);
    // extras(this);
  }

  deleteCells() {
    const cells = this.getDeletableCells(this.getSelectionCells());
    if (cells != null && cells.length > 0) {
      this.removeCells(cells);
    }
  }

  editCell() {
    if (this.isEnabled()) {
      this.startEditingAtCell();
    }
  }

  highlightCells(cells) {
    this.highlight = new mxCellHighlight(this, "#ff0000", 2);
    cells.forEach(cell => this.highlight.highlight(this.view.getState(cell)));
  }

  clearHighlightCells(cells) {
    this.highlight = new mxCellHighlight(this, "#000000", 2);
    cells.forEach(cell => this.highlight.highlight(this.view.getState(cell)));
  }

  loadXML(xml) {
    this.clear();
    this.getModel().beginUpdate();
    try {
      const doc = mxUtils.parseXml(xml);
      const root = doc.documentElement;
      const dec = new mxCodec(root.ownerDocument);
      dec.decode(root, this.getModel());

      var bgColor = root.getAttribute("backgroundColor");
      if (bgColor) {
        this.container.style.backgroundColor = bgColor;
      } else {
        this.container.style.backgroundColor = "#fff";
      }

      // Sets background image
      var bgImg = root.getAttribute("backgroundImage");
      if (bgImg) {
        bgImg = JSON.parse(bgImg);

        const bgWidth = bgImg.width;
        const bgHeight = bgImg.height;
        const ratio = bgWidth / bgHeight;

        const margin = 0;
        const cw = this.container.clientWidth - margin;
        const ch = this.container.clientHeight - margin;
        const cwRatio = cw / ch;

        const scaleW = cw / bgWidth;
        const scaleH = ch / bgHeight;
        let scale = Math.min(scaleW, scaleH);

        const dx = (margin + cw - bgWidth * scale) / 2;
        const dy = (margin + ch - bgHeight * scale) / 2;

        console.log(
          "TCL: EditGraph -> loadXML -> scale",
          scaleW,
          scaleH,
          dx,
          dy,
          bgWidth,
          bgHeight,
          cw,
          ch
        );

        this.view.scaleAndTranslate(scale, dx, dy);
        // // this.setBackgroundImage(new mxImage(bgImg.src, bgWidth, bgHeight));
        this.setBackgroundImage(new mxImage(bgImg.src, cw, ch));
        this.refresh();

        Object.values(this.getModel().cells).forEach(cell => {
          if (cell) {
            let geo = this.getCellGeometry(cell);
            if (geo) {
              geo = geo.clone();
              if (geo.relative && geo.offset) {
                geo.offset.x = dx;
                geo.offset.y = dy;
              }
              // geo.scale(scaleW, scaleH, true);

              geo.x = parseFloat(geo.x) * scale + dx;
              geo.y = parseFloat(geo.y) * scale + dy;

              geo.width = parseFloat(geo.width) * scale;
              geo.height = parseFloat(geo.height) * scale;

              // Translates the source point
              if (geo.sourcePoint != null) {
                geo.sourcePoint.x = parseFloat(geo.sourcePoint.x) * scale + dx;
                geo.sourcePoint.y = parseFloat(geo.sourcePoint.y) * scale + dy;
              }

              // Translates the target point
              if (geo.targetPoint != null) {
                geo.targetPoint.x = parseFloat(geo.targetPoint.x) * scale + dx;
                geo.targetPoint.y = parseFloat(geo.targetPoint.y) * scale + dy;
              }

              // Translate the control points
              if (geo.points != null) {
                for (var i = 0; i < geo.points.length; i++) {
                  if (geo.points[i] != null) {
                    geo.points[i].x = parseFloat(geo.points[i].x) * scale + dx;
                    geo.points[i].y = parseFloat(geo.points[i].y) * scale + dy;
                  }
                }
              }

              if (cell.edge) {
                const style = this.getCellStyle(cell);
                const strokeWidth = mxUtils.getValue(
                  style,
                  mxConstants.STYLE_STROKEWIDTH,
                  1
                );
                this.setCellStyles(
                  mxConstants.STYLE_STROKEWIDTH,
                  strokeWidth * scale,
                  [cell]
                );
              }

              this.getModel().setGeometry(cell, geo);
            }
          }
        });
      } else {
        this.backgroundImage = "none";
      }
    } finally {
      this.getModel().endUpdate();
    }
    Object.values(this.getModel().cells).forEach(cell => {
      if (cell.data) {
        cell.data = JSON.parse(cell.data);
        if (cell.edge) {
          this.model.setValue(cell, "");
          if (cell.data.type === "edge" && cell.data.bindData) {
            this.setEdgeFlow(cell);
          }
        }

        //添加下钻标识
        const canDrill = _.get(cell, "data.canDrill", false);
        if (canDrill) {
          this.addCanDrill(cell);
        }
      }
    });
  }

  setEdgeFlow(cell) {
    var state = this.view.getState(cell);
    const path0 = state.shape.node.getElementsByTagName("path")[0];
    if (path0) {
      path0.removeAttribute("visibility");
      path0.setAttribute("stroke-width", "12");
      path0.setAttribute("stroke", "lightGray");
    }

    const path1 = state.shape.node.getElementsByTagName("path")[1];
    if (path1) {
      path1.setAttribute("class", "flow");
    }
  }

  addCanDrill(cell) {
    const img = new mxImage(`static/mxgraph/images/state/drill.svg`, 16, 16);
    const alarmOverlay = new mxCellOverlay(
      img,
      "",
      null,
      null,
      null,
      "default"
    );

    // alarmOverlay.addListener(mxEvent.CLICK, function(sender, evt) {
    //   mxUtils.alert("\nLast update: " + new Date());
    // });
    this.addCellOverlay(cell, alarmOverlay);
  }

  //设置告警
  addAlarm(alarm) {
    const resId = _.get(alarm, "resourceId", 0);
    const severity = _.get(alarm, "severity", 0);
    const cell = this.getModel().getCell(resId);
    if (!cell) return;

    const img = new mxImage(
      `static/mxgraph/images/alarm/lv${severity}.gif`,
      16,
      16
    );

    const { width, height } = cell.geometry;
    const offset = new mxPoint(-width, -height);
    const alarmOverlay = new mxCellOverlay(
      img,
      "告警级别" + severity,
      null,
      null,
      offset,
      "pointer"
    );

    // alarmOverlay.addListener(mxEvent.CLICK, function(sender, evt) {
    //   mxUtils.alert("\nLast update: " + new Date());
    // });
    this.addCellOverlay(cell, alarmOverlay);
  }

  clearAlarm(alarm) {
    const resId = _.get(alarm, "resourceId", 0);
    const cell = this.getModel().getCell(resId);
    this.removeCellOverlays(cell);
  }

  clear() {
    this.getModel().clear();
  }

  getXML() {
    const model = _.cloneDeep(this.getModel());
    Object.values(model.cells).forEach(cell => {
      if (cell.data) {
        cell.data = JSON.stringify(cell.data);
      }
    });
    const enc = new mxCodec(mxUtils.createXmlDocument());
    const node = enc.encode(model);

    if (this.view.translate.x != 0 || this.view.translate.y != 0) {
      node.setAttribute("dx", Math.round(this.view.translate.x * 100) / 100);
      node.setAttribute("dy", Math.round(this.view.translate.y * 100) / 100);
    }

    if (this.container.style.backgroundColor) {
      node.setAttribute(
        "backgroundColor",
        this.container.style.backgroundColor
      );
    }

    if (this.backgroundImage != null) {
      node.setAttribute(
        "backgroundImage",
        JSON.stringify(this.backgroundImage)
      );
    }

    return mxUtils.getPrettyXml(node);
  }

  logXml() {
    console.log("XML is:", this.getXML());
  }
}
