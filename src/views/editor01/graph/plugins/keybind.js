import mxgraph from "../index";
const { mxEvent, mxUtils, mxKeyHandler } = mxgraph;



let isBind = false;
let keyHandler = null;
//启用方向键移动选中元素
const arrowMove = graph => {
    // if (isBind) return;

    isBind = true;
    var nudge = function(keyCode, ) {
        graph.container.focus();
        if (!graph.isSelectionEmpty()) {
            var dx = 0;
            var dy = 0;

            if (keyCode == 37) {
                dx = -1;
            } else if (keyCode == 38) {
                dy = -1;
            } else if (keyCode == 39) {
                dx = 1;
            } else if (keyCode == 40) {
                dy = 1;
            }

            graph.moveCells(graph.getSelectionCells(), dx, dy);
            graph.refresh()
            console.log("TCL: arrowMove->", dx, dy);
        }
    };

    // Transfer initial focus to graph container for keystroke handling


    // Handles keystroke events
    var keyHandler = new mxKeyHandler(graph);

    // Ignores enter keystroke. Remove this line if you want the
    // enter keystroke to stop editing
    keyHandler.enter = function() {};

    keyHandler.bindKey(37, function() {
        nudge(37);
    });

    keyHandler.bindKey(38, function() {
        nudge(38);
    });

    keyHandler.bindKey(39, function() {
        nudge(39);
    });

    keyHandler.bindKey(40, function() {
        nudge(40);
    });
};

const deleteEnter = graph => {
    const keyBinds = [{ bindType: "bindKey", shortCut: "DELETE", shortCode: 8, func: () => graph.deleteCells() },
        { bindType: "bindKey", shortCut: "ENTER", shortCode: 13, func: () => graph.editCell() }
    ]

    keyBinds.forEach(ele => {
        keyHandler[ele.bindType](ele.shortCode, ele.func);
    })

}

export default graph => {
    if (keyHandler) keyHandler.destroy();
    keyHandler = new mxKeyHandler(graph);
    graph.container.focus();

    arrowMove(graph);
    deleteEnter(graph)
};