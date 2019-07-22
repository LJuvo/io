import mxgraph from "../index.js";
const { mxCell, mxGeometry, mxEventObject } = mxgraph;

export default graph => {
    graph.addListener("doubleClick", function(sender, evt) {
        if (!evt.properties.cell) {
            const { offsetX, offsetY } = evt.properties.event;
            addText(offsetX, offsetY);
        }
    });

    const addText = (x, y) => {
        // Creates a new edge label with a predefined text
        var label = new mxCell();
        label.value = "Text";
        label.style = "text;html=1;resizable=0;points=[];";
        label.geometry = new mxGeometry(0, 0, 0, 0);
        label.vertex = true;

        label.style +=
            "autosize=1;align=left;verticalAlign=top;spacingTop=4;spacingBottom=4;labelBorderColor=none;labelBackgroundColor=none;";

        var tr = graph.view.translate;
        label.geometry.width = 40;
        label.geometry.height = 20;
        label.geometry.x = Math.round(x / graph.view.scale) - tr.x;
        label.geometry.y = Math.round(y / graph.view.scale) - tr.y;

        graph.getModel().beginUpdate();
        try {
            graph.addCells([label], null);
            graph.fireEvent(new mxEventObject("textInserted", "cells", [label]));
            graph.autoSizeCell(label);
        } finally {
            graph.getModel().endUpdate();
        }

        return label;
    };
};