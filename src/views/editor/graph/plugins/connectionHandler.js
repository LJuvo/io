import mxgraph from "../index";
const { mxConnectionHandler, mxEdgeHandler } = mxgraph;

export default graph => {
    //连线后创建对象
    mxConnectionHandler.prototype.createTarget = false;

    mxConnectionHandler.prototype.insertEdge = function(
        parent,
        id,
        value,
        source,
        target,
        style
    ) {
        if (this.factoryMethod == null) {
            //连线的parent跟source在同一层，默认线都在默认层。这会导致在其他图层呈现不了连线
            var sameLayerParent = this.graph.model.getParent(source);

            return this.graph.insertEdge(
                sameLayerParent,
                id,
                value,
                source,
                target,
                style
            );
        } else {
            var sameLayerParent = this.graph.model.getParent(source);
            var edge = this.createEdge(value, source, target, style);
            edge = this.graph.addEdge(edge, sameLayerParent, source, target);

            return edge;
        }
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
};