import mxgraph from "../index.js";
const { mxEvent, mxUtils, mxRectangle } = mxgraph;

class mxIconSet {
    constructor(state) {
        this.images = [];
        const graph = state.view.graph;

        const arrowTop = mxUtils.createImage("static/mxgraph/images/arrow-top.png");
        arrowTop.setAttribute("title", "NewEdge");
        arrowTop.style.position = "absolute";
        arrowTop.style.cursor = "pointer";
        arrowTop.style.width = "20px";
        arrowTop.style.height = "20px";
        arrowTop.style.left = state.x + state.width / 2 - 10 + "px";
        arrowTop.style.top = state.y - 10 + "px";
        console.log("TCL: mxIconSet -> constructor -> state", state);
        mxUtils.setOpacity(arrowTop, 50);
        mxEvent.addGestureListeners(
            arrowTop,
            mxUtils.bind(this, function(evt) {
                const pt = mxUtils.convertPoint(
                    graph.container,
                    mxEvent.getClientX(evt),
                    mxEvent.getClientY(evt)
                );
                graph.connectionHandler.start(state, pt.x, pt.y);
                graph.isMouseDown = true;
                graph.isMouseTrigger = mxEvent.isMouseEvent(evt);
                mxEvent.consume(evt);
            })
        );
        state.view.graph.container.appendChild(arrowTop);
        this.images.push(arrowTop);
    }

    destroy() {
        this.images.forEach(img => {
            img.parentNode.removeChild(img);
        });
        this.images = null;
    }
}

export default graph => {
    // 悬浮热区大小
    const iconTolerance = 40;
    // Shows icons if the mouse is over a cell
    graph.addMouseListener({
        currentState: null,
        currentIconSet: null,
        mouseDown(sender, me) {
            // Hides icons on mouse down
            if (this.currentState != null) {
                this.dragLeave(me.getEvent(), this.currentState);
                this.currentState = null;
            }
        },
        mouseMove(sender, me) {
            if (
                this.currentState != null &&
                (me.getState() == this.currentState || me.getState() == null)
            ) {
                var tol = iconTolerance;
                var tmp = new mxRectangle(
                    me.getGraphX() - tol,
                    me.getGraphY() - tol,
                    2 * tol,
                    2 * tol
                );

                if (mxUtils.intersects(tmp, this.currentState)) {
                    return;
                }
            }

            var tmp = graph.view.getState(me.getCell());

            // Ignores everything but vertices
            if (
                graph.isMouseDown ||
                (tmp != null && !graph.getModel().isVertex(tmp.cell))
            ) {
                tmp = null;
            }

            if (tmp != this.currentState) {
                if (this.currentState != null) {
                    this.dragLeave(me.getEvent(), this.currentState);
                }

                this.currentState = tmp;

                if (this.currentState != null) {
                    this.dragEnter(me.getEvent(), this.currentState);
                }
            }
        },
        mouseUp(sender, me) {},
        dragEnter(evt, state) {
            if (this.currentIconSet == null) {
                this.currentIconSet = new mxIconSet(state);
            }
        },
        dragLeave(evt, state) {
            if (this.currentIconSet != null) {
                this.currentIconSet.destroy();
                this.currentIconSet = null;
            }
        }
    });
};