import mxgraph from "../index";
const { mxEvent, mxUtils, mxPoint } = mxgraph;

const isZoomWheelEvent = evt => {
    return (
        mxEvent.isAltDown(evt) ||
        (mxEvent.isMetaDown(evt) && mxgraph.IS_MAC) ||
        (mxEvent.isControlDown(evt) && !mxgraph.IS_MAC)
    );
};

export default graph => {
    mxEvent.addMouseWheelListener(
        mxUtils.bind(this, function(evt, up) {
            // Ctrl+wheel (or pinch on touchpad) is a native browser zoom event is OS X
            // LATER: Add support for zoom via pinch on trackpad for Chrome in OS X
            if (isZoomWheelEvent(evt)) {
                var source = mxEvent.getSource(evt);

                while (source != null) {
                    if (source == graph.container) {
                        if (up) {
                            graph.zoomIn();
                        } else {
                            graph.zoomOut();
                        }
                        mxEvent.consume(evt);

                        return false;
                    }

                    source = source.parentNode;
                }
            }
        }),
        graph.container
    );
};