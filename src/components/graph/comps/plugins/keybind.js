import mxgraph from "../core/index.js";
const { mxEvent, mxUtils, mxKeyHandler } = mxgraph;

const keyBinds = [
  { bindType: "bindKey", shortCut: "DELETE", shortCode: 8 },
  { bindType: "bindKey", shortCut: "ENTER", shortCode: 13 }
];

let isBind = false;
//启用方向键移动选中元素
const arrowMove = graph => {
  // if (isBind) return;
  console.log("TCL: arrowMove");
  isBind = true;
  var nudge = function(keyCode) {
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
    }
  };

  // Transfer initial focus to graph container for keystroke handling
  graph.container.focus();

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

export default graph => {
  arrowMove(graph);
};
