import mxgraph from "../index.js";
const { mxEvent, mxUtils, mxKeyHandler } = mxgraph;

const keyBinds = {
    删除: { bindType: "bindKey", shortCut: "DELETE", shortCode: 8 },
    编辑: { bindType: "bindKey", shortCut: "ENTER", shortCode: 13 }
};

export default function(graph, enable) {
    // Disables the built-in context menu
    mxEvent.disableContextMenu(graph.container);

    // Configures automatic expand on mouseover
    graph.popupMenuHandler.autoExpand = true;

    const keyHandler = new mxKeyHandler(graph);

    const addItem = (menu, label, func) => {
        const item = menu.addItem(label, null, func);
        const keyBind = keyBinds[label];
        if (keyBind) {
            const td = item.firstChild.nextSibling.nextSibling;
            const span = document.createElement("span");
            span.style.color = "gray";
            mxUtils.write(span, keyBind.shortCut);
            td.appendChild(span);

            keyHandler[keyBind.bindType](keyBind.shortCode, func);
        }
    };

    // Installs context menu
    graph.popupMenuHandler.factoryMethod = function(menu, cell, evt) {
        let cellType = "";
        if (cell) {
            if (cell.edge) {
                cellType = "edge";
            } else if (cell.vertex) {
                cellType = cell.hasOwnProperty("children") ? "group" : "vertex";
            }
        }

        const isLocked = graph.isCellMovable(cell);

        const state = graph.view.getState(cell);
        console.log("TCL: graph.popupMenuHandler.factoryMethod -> state", state);

        switch (cellType) {
            case "edge":
            case "vertex":
            case "group":
                addItem(menu, "删除", () => graph.deleteCells());
                menu.addSeparator();
                addItem(menu, "拷贝", () => graph.copyPaste());

                if (graph.getSelectionCount() == 1) {
                    menu.addSeparator();
                    addItem(menu, "编辑", () => graph.editCell());
                }
                menu.addSeparator();
                addItem(menu, "放置顶层", () => graph.orderCells(false));
                addItem(menu, "放置底层", () => graph.orderCells(true));

                if (graph.getSelectionCount() > 1) {
                    menu.addSeparator();
                    addItem(menu, "组合", () => graph.group());
                } else if (
                    graph.getSelectionCount() == 1 &&
                    !graph.getModel().isEdge(cell) &&
                    !graph.isSwimlane(cell) &&
                    graph.getModel().getChildCount(cell) > 0
                ) {
                    menu.addSeparator();
                    addItem(menu, "解组", () => graph.ungroup());
                }
                menu.addSeparator();
                addItem(menu, isLocked ? "锁定" : "解锁", () => graph.lockUnlock());
                break;
            default:
                if (enable) {
                    addItem(menu, "撤销", () => graph.undo());
                    addItem(menu, "重做", () => graph.redo());

                    menu.addSeparator();
                    addItem(menu, "选中所有节点", () => graph.selectVertices());
                    addItem(menu, "选中所有边", () => graph.selectEdges());
                    addItem(menu, "全选", () => graph.selectAll(null, true));
                }

                break;
        }
    };
}