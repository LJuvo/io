import mxgraph from "./index";
import FileSaver from "file-saver";
import defaultConfig from "../plugins/defaultConfig";
import contextmenu from "../plugins/contextmenu";
import keybind from "../plugins/keybind";
import hover from "../plugins/hover";
import draw from "../plugins/draw";
// import dblClickAddText from "../plugins/dblClickAddText";
import "../plugins/shapes";
import undo from "../plugins/undo";
import extras from "../plugins/extras";
import connectionHandler from "../plugins/connectionHandler";
import makedraggable from "../plugins/makedraggable";

const {
    mxGraph,
    mxCell,
    mxImage,
    mxShape,
    mxPoint,
    mxVertexHandler,
    mxCodec,
    mxUtils,
    mxConstants,
    mxEventObject,
    mxCellHighlight,
    mxCellOverlay,
    mxEvent,
} = mxgraph;

/**
 * 可编辑Graph类
 */
export default class EditGraph extends mxGraph {
    constructor(container) {
        super(container);
        this._init();
    }

    _init() {
        defaultConfig(this);
        contextmenu(this, true);
        connectionHandler(this);
        keybind(this);
        // hover(this);
        // dblClickAddText(this);
        extras(this);
        this.undoManager = undo(this);
    }

    //注册图标使之可以拖拽
    makedraggable() {
        makedraggable(this);
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

    group() {
        if (this.getSelectionCount() == 1) {
            this.setCellStyles("container", "1");
        } else {
            this.setSelectionCell(this.groupCells(null, 0));
        }
    }

    ungroup() {
        const graph = this;
        if (
            graph.getSelectionCount() == 1 &&
            graph.getModel().getChildCount(graph.getSelectionCell()) == 0
        ) {
            graph.setCellStyles("container", "0");
        } else {
            graph.setSelectionCells(graph.ungroupCells());
        }
    }

    redo() {
        try {
            var graph = this;
            if (graph.isEditing()) {
                document.execCommand("redo", false, null);
            } else {
                this.undoManager.redo();
            }
        } catch (e) {
            // ignore all errors
        }
    }

    undo() {
        try {
            var graph = this;
            if (graph.isEditing()) {
                // Stops editing and executes undo on graph if native undo
                // does not affect current editing value
                var value = graph.cellEditor.textarea.innerHTML;
                document.execCommand("undo", false, null);

                if (value == graph.cellEditor.textarea.innerHTML) {
                    graph.stopEditing(true);
                    this.undoManager.undo();
                }
            } else {
                this.undoManager.undo();
            }
        } catch (e) {
            // ignore all errors
        }
    }

    lockUnlock() {
        if (!this.isSelectionEmpty()) {
            this.getModel().beginUpdate();
            try {
                var defaultValue = this.isCellMovable(this.getSelectionCell()) ? 1 : 0;
                this.dolock(defaultValue, this.getSelectionCells());
            } finally {
                this.getModel().endUpdate();
            }
        }
    }

    dolock(flag, cells) {
        this.toggleCellStyles(mxConstants.STYLE_MOVABLE, flag, cells);
        this.toggleCellStyles(mxConstants.STYLE_RESIZABLE, flag, cells);
        this.toggleCellStyles(mxConstants.STYLE_ROTATABLE, flag, cells);
        this.toggleCellStyles(mxConstants.STYLE_DELETABLE, flag, cells);
        this.toggleCellStyles(mxConstants.STYLE_EDITABLE, flag, cells);
        this.toggleCellStyles("connectable", flag, cells);
    }

    changeStyle(isVertex, keys, values, setToDefault) {
        this.getModel().beginUpdate();
        try {
            const style = isVertex ?
                this.stylesheet.getDefaultVertexStyle() :
                this.stylesheet.getDefaultEdgeStyle();
            keys.forEach((key, i) => {
                // if (values[i] == null) {
                //   delete style[key];
                // } else {
                this.setCellStyles(key, values[i]);
                // }
                if (setToDefault) {
                    style[key] = values[i];
                }
            });
        } finally {
            this.getModel().endUpdate();
        }
    }

    isDefaultLayerShow() {
        return this.model.isVisible(this.getDefaultParent());
    }

    copyPaste() {
        const s = this.gridSize;
        this.setSelectionCells(
            this.moveCells(this.getSelectionCells(), s, s, true)
        );
    }

    //递归删除图层下的子元素
    //由于事务的原因，不能简单的forEach里直接remove。
    removeCellChildren(cell) {
        if (cell.children.length > 0) {
            this.model.remove(cell.children[0]);
            this.removeCellChildren(cell);
        }
    }

    backDefaultLayer() {
        if (this.devicePortLayer) {
            this.removeCellChildren(this.devicePortLayer);
            //该方法未生效，原因未知。
            // this.removeCells(this.devicePortLayer.children, true);
            this.getModel().setVisible(this.devicePortLayer, false);

            if (this.bakBackgroundImage) {
                //缓存背景图
                this.backgroundImage = this.bakBackgroundImage;
                this.bakBackgroundImage = null;
            }
        }
        defaultConfig(this);
        this.getModel().setVisible(this.getDefaultParent(), true);
    }

    //打开端子图层
    openPortLayer(from, to) {
        this.fireEvent(new mxEventObject("openPortLayer"));

        //关闭默认图层
        this.getModel().setVisible(this.getDefaultParent(), false);

        this.getModel().beginUpdate();
        try {
            if (!this.devicePortLayer) {
                this.addDevicePortLayer();
            }

            this.getModel().setVisible(this.devicePortLayer, true);
            this.foldingEnabled = false;
            this.setConnectableEdges(false);
            // mxVertexHandler.prototype.rotationEnabled = false;
            mxShape.prototype.constraints = [];

            const { cell: fromCell, values: fromData } = from;
            const { cell: toCell, values: toData } = to;

            let fromGroupData = [];
            const prck = _.get(fromData, "[0].parent_resource_class_keyname", null);
            //如果是端子类则需要分组
            if (prck === "terminals") {
                //to的数据分组一下
                const groupd = _.groupBy(fromData, "terminal_type");

                const keys = _.keys(groupd);
                keys.forEach(key => {
                    const vNode = {
                        name: key,
                        resource_class_id: fromCell.resource_class_id,
                        children: groupd[key]
                    };
                    fromGroupData.push(vNode);
                });
            } else {
                fromGroupData = fromData;
            }

            //to的数据分组一下
            const groupd = _.groupBy(toData, "terminal_type");

            const keys = _.keys(groupd);
            let toGroupData = [];
            keys.forEach(key => {
                const vNode = {
                    name: key,
                    resource_class_id: toCell.resource_class_id,
                    children: groupd[key]
                };
                toGroupData.push(vNode);
            });

            const { clientWidth, clientHeight } = this.container;
            const scale = this.view.scale;
            const width = Math.ceil(clientWidth / scale);
            const height = Math.ceil(clientHeight / scale);

            this.addDevicePort(
                fromCell,
                fromGroupData,
                (1 / 4) * width,
                (1 / 4) * height
            );
            this.addDevicePort(
                toCell,
                toGroupData,
                (2 / 4) * width,
                (1 / 4) * height,
                true
            );
            if (this.backgroundImage) {
                //缓存背景图
                this.bakBackgroundImage = this.backgroundImage;
            }
            this.backgroundImage = "none";
        } finally {
            this.getModel().endUpdate();
        }
    }

    addDevicePort(cell, data, x, y, leftFirst) {
        const baseW = 100;
        const baseH = 25;

        let totalH = 0;
        data.forEach(item => {
            totalH += baseH * Math.max(1, item.children.length);
        });

        const style =
            "rounded=0;whiteSpace=wrap;html=1;editable=0;resizable=0;movable=0;rotatable=0;cloneable=0;deletable=0;";

        var v1 = this.insertVertex(
            this.devicePortLayer,
            cell.id,
            cell.name,
            x,
            y,
            baseW,
            totalH,
            `devicePort;verticalLabelPosition=top;labelPosition=center;align=center;verticalAlign=bottom;${style};movable=1;`
        );
        v1.setConnectable(true);
        let preH = 0;
        let relations = [];
        data.forEach((item, i) => {
            const childNum = item.children.length;
            const h = baseH * Math.max(1, childNum);
            const sub = this.insertVertex(
                v1,
                item.id,
                item.name,
                0,
                preH,
                baseW,
                h,
                style
            );
            preH += h;
            item.children.forEach((tom, j) => {
                let x = leftFirst ? 0 : 1;
                const port = this.insertVertex(
                    sub,
                    tom.id,
                    "",
                    x,
                    (1 / (childNum + 1)) * (j + 1),
                    10,
                    10,
                    `devicePort;portConstraint=${
            x === 0 ? "west" : "east"
          };shape=circle;direction=${
            x === 0 ? "west" : "east"
          };perimeter=none;" +
              "routingCenterX=0.5;routingCenterY=0;${style}`,
                    true
                );
                port.data = { bindData: tom, parent: item, isPort: true };
                if (leftFirst) {
                    port.geometry.offset = new mxPoint(-10, -5);
                } else {
                    port.geometry.offset = new mxPoint(0, -5);
                }
                port.setConnectable(true);

                //如果端子已有关系
                if (tom.relations) {
                    relations = [...relations, ...tom.relations];
                }
            });
        });

        //初始化连接关系
        relations.forEach(relation => {
            const { mainResourceId, passiveResourceId } = relation;
            const source = this.model.getCell(mainResourceId);
            const target = this.model.getCell(passiveResourceId);
            if (source && target) {
                this.insertEdge(
                    this.devicePortLayer,
                    null,
                    "连接",
                    source,
                    target,
                    style
                );
            }
        });
    }

    //添加设备端子层，用于端子关系连接
    addDevicePortLayer() {
        this.devicePortLayer = new mxCell();
        this.devicePortLayer.setId("devicePortLayer");
        this.getModel().add(this.model.root, this.devicePortLayer);
    }

    toggleDevicePortLayer() {
        this.getModel().setVisible(this.devicePortLayer, true);
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

    loadXML(xml) {
        this.clear();

        if (xml) {
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
                    this.container.style.backgroundColor = "white";
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
                                    geo.sourcePoint.x =
                                        parseFloat(geo.sourcePoint.x) * scale + dx;
                                    geo.sourcePoint.y =
                                        parseFloat(geo.sourcePoint.y) * scale + dy;
                                }

                                // Translates the target point
                                if (geo.targetPoint != null) {
                                    geo.targetPoint.x =
                                        parseFloat(geo.targetPoint.x) * scale + dx;
                                    geo.targetPoint.y =
                                        parseFloat(geo.targetPoint.y) * scale + dy;
                                }

                                // Translate the control points
                                if (geo.points != null) {
                                    for (var i = 0; i < geo.points.length; i++) {
                                        if (geo.points[i] != null) {
                                            geo.points[i].x =
                                                parseFloat(geo.points[i].x) * scale + dx;
                                            geo.points[i].y =
                                                parseFloat(geo.points[i].y) * scale + dy;
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
                                        strokeWidth * scale, [cell]
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
                Object.values(this.getModel().cells).forEach(cell => {
                    if (cell.data && _.isString(cell.data)) {
                        cell.data = JSON.parse(cell.data);
                    }

                    //添加下钻标识
                    const canDrill = _.get(cell, "data.canDrill", false);
                    if (canDrill) {
                        this.addCanDrill(cell);
                    }
                });
            }
        } else {
            this.backgroundImage = "none";
        }
    }

    setBgImg(img) {
        const { clientWidth, clientHeight } = this.container;
        const scale = this.view.scale;
        const width = Math.ceil(clientWidth / scale);
        const height = Math.ceil(clientHeight / scale);
        this.setBackgroundImage(new mxImage(img, width, height));
        this.view.validateBackgroundImage();
    }

    setEdgeFlow(cell) {
        var state = this.view.getState(cell);
        state.shape.node
            .getElementsByTagName("path")[0]
            .removeAttribute("visibility");
        state.shape.node
            .getElementsByTagName("path")[0]
            .setAttribute("stroke-width", "12");
        state.shape.node
            .getElementsByTagName("path")[0]
            .setAttribute("stroke", "lightGray");
        state.shape.node
            .getElementsByTagName("path")[1]
            .setAttribute("class", "flow");
    }

    markDrill() {
        this.getModel().beginUpdate();
        try {
            const cell = this.getSelectionCell();
            if (cell) {
                cell.data.canDrill = true;
            }
        } finally {
            this.getModel().endUpdate();
        }
    }

    export () {
        const xml = this.getXML();
        const blob = new Blob([xml], { type: "text/plain;charset=utf-8" });
        FileSaver.saveAs(blob, "graph.xml");
    }

    import (file) {
        const reader = new FileReader();
        reader.onload = e => {
            const txt = e.target.result;
            this.loadXML(txt);
        };
        reader.readAsText(file);
    }

    clear() {
        this.getModel().clear();
    }

    /**
     * 绑定资源实例
     */
    bindResourceInstance(cell) {
        this.fireEvent(new mxEventObject("bindResourceInstance", "cell", cell));
    }

    /**
     * 为实例设置指标
     */
    setKpi(cell) {
        this.fireEvent(new mxEventObject("setKpi", "cell", cell));
    }

    /**
     * 下钻
     */
    drillCell(cell) {
        this.fireEvent(new mxEventObject("drillCell", "cell", cell));
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

    toggleDraw(v) {
        draw(this, v);
        contextmenu(this, !v);
    }

    destory() {
        if (!this.destroyed) {
            this.destroyed = true;

            if (this.tooltipHandler != null) {
                this.tooltipHandler.destroy();
            }

            if (this.selectionCellsHandler != null) {
                this.selectionCellsHandler.destroy();
            }

            if (this.panningHandler != null) {
                this.panningHandler.destroy();
            }

            if (this.popupMenuHandler != null) {
                this.popupMenuHandler.destroy();
            }

            if (this.connectionHandler != null) {
                this.connectionHandler.destroy();
            }

            if (this.graphHandler != null) {
                this.graphHandler.destroy();
            }

            if (this.cellEditor != null) {
                this.cellEditor.destroy();
            }

            if (this.view != null) {
                this.view.destroy();
            }

            if (this.model != null && this.graphModelChangeListener != null) {
                this.model.removeListener(this.graphModelChangeListener);
                this.graphModelChangeListener = null;
            }

            this.container = null;
        }
    }
}