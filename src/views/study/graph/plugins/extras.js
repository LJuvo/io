import mxgraph from "../index.js";
const { mxVertexHandler, mxGraph, mxEvent, mxClient, mxUtils } = mxgraph;

/**
 * 定制节点的额外功能
 */
function mxVertexToolHandler(state) {
    mxVertexHandler.apply(this, arguments);
}

mxVertexToolHandler.prototype = new mxVertexHandler();
mxVertexToolHandler.prototype.constructor = mxVertexToolHandler;

mxVertexToolHandler.prototype.domNode = null;

mxVertexToolHandler.prototype.init = function() {
    mxVertexHandler.prototype.init.apply(this, arguments);

    this.domNode = document.createElement("div");
    this.domNode.style.display = "flex";
    this.domNode.style.flexDirection = "row";
    this.domNode.style.maxWidth = "48px";
    this.domNode.style.alignItems = "center";
    this.domNode.style.flexWrap = "wrap";
    this.domNode.style.position = "absolute";
    this.domNode.style.whiteSpace = "nowrap";
    this.domNode.style.backgroundColor = "rgba(255,255,255,0.4)";
    // this.domNode.style.padding = "2px";
    this.domNode.style.borderRadius = "6px";

    function createImage(src) {
        if (mxClient.IS_IE && !mxClient.IS_SVG) {
            var img = document.createElement("div");
            img.style.backgroundImage = "url(" + src + ")";
            img.style.backgroundPosition = "center";
            img.style.backgroundRepeat = "no-repeat";
            img.style.display = mxClient.IS_QUIRKS ? "inline" : "inline-block";

            return img;
        } else {
            return mxUtils.createImage(src);
        }
    }

    this.hasResClass = _.get(this.state.cell, "data.resourceClassId", null);
    this.isBinded = _.get(this.state.cell, "data.bindData", null);
    this.isPort = _.get(this.state.cell, "data.isPort", null);

    if (this.hasResClass) {
        var img = createImage("static/mxgraph/extras/bind.png");
        img.setAttribute("title", "实例绑定");
        img.style.cursor = "pointer";
        img.style.width = "20px";
        img.style.height = "20px";
        img.style.margin = "2px";
        mxEvent.addGestureListeners(
            img,
            mxUtils.bind(this, function(evt) {
                this.graph.bindResourceInstance(this.state.cell);
                mxEvent.consume(evt);
            })
        );
        this.domNode.appendChild(img);
    }

    if (this.isBinded) {
        if (!this.isPort) {
            var kpi = createImage("static/mxgraph/extras/kpi.png");
            kpi.setAttribute("title", "指标设置");
            kpi.style.cursor = "pointer";
            kpi.style.width = "20px";
            kpi.style.height = "20px";
            kpi.style.margin = "2px";
            mxEvent.addGestureListeners(
                kpi,
                mxUtils.bind(this, function(evt) {
                    this.graph.setKpi(this.state.cell);
                    mxEvent.consume(evt);
                })
            );
            this.domNode.appendChild(kpi);

            var drill = createImage("static/mxgraph/extras/drill.png");
            drill.setAttribute("title", "下钻拓扑");
            drill.style.cursor = "pointer";
            drill.style.width = "20px";
            drill.style.height = "20px";
            drill.style.margin = "2px";
            mxEvent.addGestureListeners(
                drill,
                mxUtils.bind(this, function(evt) {
                    this.graph.drillCell(this.state.cell);
                    mxEvent.consume(evt);
                })
            );
            this.domNode.appendChild(drill);
        }

        if (this.isPort) {
            // var port = createImage("static/mxgraph/extras/port.png");
            // port.setAttribute("title", "端子配置");
            // port.style.cursor = "pointer";
            // port.style.width = "20px";
            // port.style.height = "20px";
            // port.style.margin = "2px";
            // mxEvent.addGestureListeners(
            //   port,
            //   mxUtils.bind(this, function(evt) {
            //     this.graph.openPortLayer(this.state.cell);
            //     mxEvent.consume(evt);
            //   })
            // );
            // this.domNode.appendChild(port);
        }
    }

    this.graph.container.appendChild(this.domNode);
    this.redrawTools();
};

mxVertexToolHandler.prototype.redraw = function() {
    mxVertexHandler.prototype.redraw.apply(this);
    this.redrawTools();
};

mxVertexToolHandler.prototype.redrawTools = function() {
    if (this.state != null && this.domNode != null) {
        var dy = mxClient.IS_VML && document.compatMode == "CSS1Compat" ? 20 : 4;
        this.domNode.style.left = this.state.x + this.state.width + 8 + "px";
        this.domNode.style.top = this.state.y + "px";
        // this.domNode.style.left = this.state.x + this.state.width - 56 + "px";
        // this.domNode.style.top = this.state.y + this.state.height + dy + "px";
    }
};

mxVertexToolHandler.prototype.destroy = function(sender, me) {
    mxVertexHandler.prototype.destroy.apply(this, arguments);

    if (this.domNode != null) {
        this.domNode.parentNode.removeChild(this.domNode);
        this.domNode = null;
    }
};

export default graph => {
    graph.createHandler = function(state) {
        if (state != null && this.model.isVertex(state.cell)) {
            return new mxVertexToolHandler(state);
        }

        return mxGraph.prototype.createHandler.apply(this, arguments);
    };
};