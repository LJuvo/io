import mxgraph from "./index";
import defaultConfig from "./plugins/defaultConfig"
import contextMenu from "./plugins/contextMenu"
import connectionHandler from "./plugins/connectionHandler"
import keybind from "./plugins/keybind"
import clipboard from './plugins/clipboard';
import undo from "./plugins/undo"
import makeDraggable from "./plugins/makeDraggable"
import editorCanvas from "./plugins/editorCanvas"
import backPage from "./plugins/backPage"

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

export default class EditGraph extends mxGraph {
    constructor(container) {
        super(container);
        this._init();
    }

    _init() {
        defaultConfig(this);
        contextMenu(this, true);
        connectionHandler(this);
        keybind(this)
        clipboard(this)
        backPage(this)

        // editorCanvas(this)
        this.undoManager = undo(this);
    }

    //注册图标使之可以拖拽
    makedraggable() {
        makeDraggable(this);
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

    setBgImg(img) {
        const { clientWidth, clientHeight } = this.container;
        const scale = this.view.scale;
        const width = Math.ceil(clientWidth / scale);
        const height = Math.ceil(clientHeight / scale);
        this.setBackgroundImage(new mxImage(img, width, height));
        this.view.validateBackgroundImage();
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

    resetView() {
        this.view.scaleAndTranslate(1, 0, 0);
    }

    destory() {
        if (!this.destroyed) {
            this.destroyed = true;

            this.container = null;


            mxEvent.removeAllListeners(this)
        }
    }
}