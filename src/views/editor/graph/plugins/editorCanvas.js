import mxgraph from "../index"
const {
    mxPoint,
    mxRectangle,
    mxEvent,
    mxUtils
} = mxgraph;

export default graph => {
    graph.timerAutoScroll = true;

    graph.isZoomWheelEvent = function(evt) {
        return mxEvent.isAltDown(evt) || (mxEvent.isMetaDown(evt) && mxClient.IS_MAC) ||
            (mxEvent.isControlDown(evt) && !mxClient.IS_MAC);
    };

    /**
     * Returns the padding for pages in page view with scrollbars.
     */
    graph.getPagePadding = function() {
        return new mxPoint(Math.max(0, Math.round((graph.container.offsetWidth - 34) / graph.view.scale)),
            Math.max(0, Math.round((graph.container.offsetHeight - 34) / graph.view.scale)));
    };

    // Fits the number of background pages to the graph
    graph.view.getBackgroundPageBounds = function() {
        var layout = this.graph.getPageLayout();
        var page = this.graph.getPageSize();

        return new mxRectangle(this.scale * (this.translate.x + layout.x * page.width),
            this.scale * (this.translate.y + layout.y * page.height),
            this.scale * layout.width * page.width,
            this.scale * layout.height * page.height);
    };

    graph.getPreferredPageSize = function(bounds, width, height) {
        var pages = this.getPageLayout();
        var size = this.getPageSize();

        return new mxRectangle(0, 0, pages.width * size.width, pages.height * size.height);
    };

    // Scales pages/graph to fit available size
    var resize = null;
    var ui = this;

    /**
     * Guesses autoTranslate to avoid another repaint (see below).
     * Works if only the scale of the graph changes or if pages
     * are visible and the visible pages do not change.
     */
    var graphViewValidate = graph.view.validate;
    graph.view.validate = function() {
        if (this.graph.container != null && mxUtils.hasScrollbars(this.graph.container)) {
            var pad = this.graph.getPagePadding();
            var size = this.graph.getPageSize();

            // Updating scrollbars here causes flickering in quirks and is not needed
            // if zoom method is always used to set the current scale on the graph.
            var tx = this.translate.x;
            var ty = this.translate.y;
            this.translate.x = pad.x - (this.x0 || 0) * size.width;
            this.translate.y = pad.y - (this.y0 || 0) * size.height;
        }

        graphViewValidate.apply(this, arguments);
    };

    var graphSizeDidChange = graph.sizeDidChange;
    graph.sizeDidChange = function() {
        if (this.container != null && mxUtils.hasScrollbars(this.container)) {
            var pages = this.getPageLayout();
            var pad = this.getPagePadding();
            var size = this.getPageSize();

            // Updates the minimum graph size
            var minw = Math.ceil(2 * pad.x + pages.width * size.width);
            var minh = Math.ceil(2 * pad.y + pages.height * size.height);

            var min = graph.minimumGraphSize;

            // LATER: Fix flicker of scrollbar size in IE quirks mode
            // after delayed call in window.resize event handler
            if (min == null || min.width != minw || min.height != minh) {
                graph.minimumGraphSize = new mxRectangle(0, 0, minw, minh);
            }

            // Updates auto-translate to include padding and graph size
            var dx = pad.x - pages.x * size.width;
            var dy = pad.y - pages.y * size.height;

            if (!this.autoTranslate && (this.view.translate.x != dx || this.view.translate.y != dy)) {
                this.autoTranslate = true;
                this.view.x0 = pages.x;
                this.view.y0 = pages.y;

                // NOTE: THIS INVOKES THIS METHOD AGAIN. UNFORTUNATELY THERE IS NO WAY AROUND THIS SINCE THE
                // BOUNDS ARE KNOWN AFTER THE VALIDATION AND SETTING THE TRANSLATE TRIGGERS A REVALIDATION.
                // SHOULD MOVE TRANSLATE/SCALE TO VIEW.
                var tx = graph.view.translate.x;
                var ty = graph.view.translate.y;
                graph.view.setTranslate(dx, dy);

                // LATER: Fix rounding errors for small zoom
                graph.container.scrollLeft += Math.round((dx - tx) * graph.view.scale);
                graph.container.scrollTop += Math.round((dy - ty) * graph.view.scale);

                this.autoTranslate = false;

                return;
            }

            graphSizeDidChange.apply(this, arguments);
        } else {
            // Fires event but does not invoke superclass
            this.fireEvent(new mxEventObject(mxEvent.SIZE, 'bounds', this.getGraphBounds()));
        }
    };

    // Accumulates the zoom factor while the rendering is taking place
    // so that not the complete sequence of zoom steps must be painted
    graph.updateZoomTimeout = null;
    graph.cumulativeZoomFactor = 1;

    var cursorPosition = null;

    graph.lazyZoom = function(zoomIn) {
        if (this.updateZoomTimeout != null) {
            window.clearTimeout(this.updateZoomTimeout);
        }

        // Switches to 1% zoom steps below 15%
        // Lower bound depdends on rounding below
        if (zoomIn) {
            if (this.view.scale * this.cumulativeZoomFactor < 0.15) {
                this.cumulativeZoomFactor = (this.view.scale + 0.01) / this.view.scale;
            } else {
                // Uses to 5% zoom steps for better grid rendering in webkit
                // and to avoid rounding errors for zoom steps
                this.cumulativeZoomFactor *= this.zoomFactor;
                this.cumulativeZoomFactor = Math.round(this.view.scale * this.cumulativeZoomFactor * 20) / 20 / this.view.scale;
            }
        } else {
            if (this.view.scale * this.cumulativeZoomFactor <= 0.15) {
                this.cumulativeZoomFactor = (this.view.scale - 0.01) / this.view.scale;
            } else {
                // Uses to 5% zoom steps for better grid rendering in webkit
                // and to avoid rounding errors for zoom steps
                this.cumulativeZoomFactor /= this.zoomFactor;
                this.cumulativeZoomFactor = Math.round(this.view.scale * this.cumulativeZoomFactor * 20) / 20 / this.view.scale;
            }
        }

        this.cumulativeZoomFactor = Math.max(0.01, Math.min(this.view.scale * this.cumulativeZoomFactor, 160) / this.view.scale);

        this.updateZoomTimeout = window.setTimeout(mxUtils.bind(this, function() {
            var offset = mxUtils.getOffset(graph.container);
            var dx = 0;
            var dy = 0;

            if (cursorPosition != null) {
                dx = graph.container.offsetWidth / 2 - cursorPosition.x + offset.x;
                dy = graph.container.offsetHeight / 2 - cursorPosition.y + offset.y;
            }

            var prev = this.view.scale;
            this.zoom(this.cumulativeZoomFactor);
            var s = this.view.scale;

            if (s != prev) {
                if (resize != null) {
                    ui.chromelessResize(false, null, dx * (this.cumulativeZoomFactor - 1),
                        dy * (this.cumulativeZoomFactor - 1));
                }

                if (mxUtils.hasScrollbars(graph.container) && (dx != 0 || dy != 0)) {
                    graph.container.scrollLeft -= dx * (this.cumulativeZoomFactor - 1);
                    graph.container.scrollTop -= dy * (this.cumulativeZoomFactor - 1);
                }
            }

            this.cumulativeZoomFactor = 1;
            this.updateZoomTimeout = null;
        }), this.lazyZoomDelay);
    };

    mxEvent.addMouseWheelListener(mxUtils.bind(this, function(evt, up) {
        // Ctrl+wheel (or pinch on touchpad) is a native browser zoom event is OS X
        // LATER: Add support for zoom via pinch on trackpad for Chrome in OS X
        if (graph.isZoomWheelEvent(evt)) {
            var source = mxEvent.getSource(evt);

            while (source != null) {
                if (source == graph.container) {
                    cursorPosition = new mxPoint(mxEvent.getClientX(evt), mxEvent.getClientY(evt));
                    graph.lazyZoom(up);
                    mxEvent.consume(evt);

                    return false;
                }

                source = source.parentNode;
            }
        }
    }), graph.container);



};