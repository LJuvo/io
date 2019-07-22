import mxgraph from "../index.js";
const { mxDragSource, mxEvent, mxUtils, mxCell, mxGeometry, mxPoint } = mxgraph;

function insert(graph, dom, target, x, y) {
    const label = dom.getAttribute("label");
    const resourceClassId = dom.getAttribute("resourceClassId");
    const keyName = dom.getAttribute("keyName");
    const tableName = dom.getAttribute("tableName");
    const width = Number(dom.getAttribute("width") || 64);
    const height = Number(dom.getAttribute("height") || 64);
    const type = dom.getAttribute("type");
    const isRegion = dom.getAttribute("isRegion");

    // const imgSrc = dom.getAttribute("img") || "static/imgs/graph/default.svg";
    const imgSrc = dom.getAttribute("img");
    let shapeStyle = "rounded=1;whiteSpace=wrap;html=1;";
    if (!isRegion) {
        shapeStyle =
            "shape=image;html=1;verticalLabelPosition=bottom;verticalAlign=top;imageAspect=0;image=" +
            imgSrc;
    }

    const data = {
        label,
        keyName,
        tableName,
        type,
        resourceClassId,
        isExtendClass: true
    };

    const parent = graph.getDefaultParent();

    if (type === "vertex") {
        const vertex = graph.insertVertex(
            parent,
            null,
            label,
            x,
            y,
            width,
            height,
            shapeStyle
        );
        vertex.data = data;
    } else if (type === "edge") {
        let edgeStyle = "strokeWidth=12;endArrow=none;html=1;";
        var cell = new mxCell(
            label,
            new mxGeometry(0, 0, width, height),
            edgeStyle
        );
        cell.geometry.setTerminalPoint(new mxPoint(x, y), true);
        cell.geometry.setTerminalPoint(new mxPoint(x + width, y + height), false);
        cell.geometry.relative = true;
        cell.edge = true;
        cell.data = data;
        graph.addCells([cell]);
    }
}

export default graph => {
    const dropValidate = function(evt) {
        const x = mxEvent.getClientX(evt);
        const y = mxEvent.getClientY(evt);
        // 获取 x,y 所在的元素
        const elt = document.elementFromPoint(x, y);
        // 如果鼠标落在graph容器
        if (mxUtils.isAncestorNode(graph.container, elt)) {
            return graph;
        }
        // 鼠标落在其他地方
        return null;
    };

    // drop成功后新建一个元素
    const dropSuccessCb = function(graph, evt, target, x, y) {
        insert(graph, this.element, target, x, y);
    };

    const eles = document.querySelectorAll(".nav-drag-item");

    Array.from(eles).forEach(ele => {
        const dragElt = document.createElement("div");
        const width = 64;
        const height = 64;
        dragElt.setAttribute(
            "style",
            `border: 1px dashed #0CBABD; width: ${width}px; height: ${height}px;`
        );

        const ds = mxUtils.makeDraggable(
            ele,
            dropValidate,
            dropSuccessCb,
            dragElt,
            0,
            0,
            // -25,
            // -25,
            null,
            true
        );

        // Restores original drag icon while outside of graph
        ds.createDragElement = mxDragSource.prototype.createDragElement;
    });
};