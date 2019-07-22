import mxgraph from "../index.js";
const { mxUndoManager, mxEvent, mxUtils } = mxgraph;

export default graph => {
    var undoMgr = new mxUndoManager();

    const undoListener = function(sender, evt) {
        undoMgr.undoableEditHappened(evt.getProperty("edit"));
    };

    // Installs the command history
    var listener = mxUtils.bind(this, function(sender, evt) {
        undoListener.apply(this, arguments);
    });

    graph.getModel().addListener(mxEvent.UNDO, listener);
    graph.getView().addListener(mxEvent.UNDO, listener);

    // Keeps the selection in sync with the history
    var undoHandler = function(sender, evt) {
        var cand = graph.getSelectionCellsForChanges(
            evt.getProperty("edit").changes
        );
        var model = graph.getModel();
        var cells = [];

        for (var i = 0; i < cand.length; i++) {
            if (graph.view.getState(cand[i]) != null) {
                cells.push(cand[i]);
            }
        }

        graph.setSelectionCells(cells);
    };

    undoMgr.addListener(mxEvent.UNDO, undoHandler);
    undoMgr.addListener(mxEvent.REDO, undoHandler);

    return undoMgr;
};