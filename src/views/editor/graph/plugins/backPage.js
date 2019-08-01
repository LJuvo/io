import mxgraph from "../index"
const {
    mxPoint,
    mxRectangle,
    mxEvent,
    mxUtils,
    mxConstants,
    mxGraphView
} = mxgraph;

export default graph => {

    // Uses HTML for background pages (to support grid background image)
    mxGraphView.validateBackgroundPage = function() {
        var graph = this.graph;

        if (graph.container != null && !graph.transparentBackground) {
            if (graph.pageVisible) {
                var bounds = this.getBackgroundPageBounds();

                if (this.backgroundPageShape == null) {
                    // Finds first element in graph container
                    var firstChild = graph.container.firstChild;

                    while (firstChild != null && firstChild.nodeType != mxConstants.NODETYPE_ELEMENT) {
                        firstChild = firstChild.nextSibling;
                    }

                    if (firstChild != null) {
                        this.backgroundPageShape = this.createBackgroundPageShape(bounds);
                        this.backgroundPageShape.scale = 1;

                        // Shadow filter causes problems in outline window in quirks mode. IE8 standards
                        // also has known rendering issues inside mxWindow but not using shadow is worse.
                        this.backgroundPageShape.isShadow = !mxClient.IS_QUIRKS;
                        this.backgroundPageShape.dialect = mxConstants.DIALECT_STRICTHTML;
                        this.backgroundPageShape.init(graph.container);

                        // Required for the browser to render the background page in correct order
                        firstChild.style.position = 'absolute';
                        graph.container.insertBefore(this.backgroundPageShape.node, firstChild);
                        this.backgroundPageShape.redraw();

                        this.backgroundPageShape.node.className = 'geBackgroundPage';

                        // Adds listener for double click handling on background
                        mxEvent.addListener(this.backgroundPageShape.node, 'dblclick',
                            mxUtils.bind(this, function(evt) {
                                graph.dblClick(evt);
                            })
                        );

                        // Adds basic listeners for graph event dispatching outside of the
                        // container and finishing the handling of a single gesture
                        mxEvent.addGestureListeners(this.backgroundPageShape.node,
                            mxUtils.bind(this, function(evt) {
                                graph.fireMouseEvent(mxEvent.MOUSE_DOWN, new mxMouseEvent(evt));
                            }),
                            mxUtils.bind(this, function(evt) {
                                // Hides the tooltip if mouse is outside container
                                if (graph.tooltipHandler != null && graph.tooltipHandler.isHideOnHover()) {
                                    graph.tooltipHandler.hide();
                                }

                                if (graph.isMouseDown && !mxEvent.isConsumed(evt)) {
                                    graph.fireMouseEvent(mxEvent.MOUSE_MOVE, new mxMouseEvent(evt));
                                }
                            }),
                            mxUtils.bind(this, function(evt) {
                                graph.fireMouseEvent(mxEvent.MOUSE_UP, new mxMouseEvent(evt));
                            })
                        );
                    }
                } else {
                    this.backgroundPageShape.scale = 1;
                    this.backgroundPageShape.bounds = bounds;
                    this.backgroundPageShape.redraw();
                }
            } else if (this.backgroundPageShape != null) {
                this.backgroundPageShape.destroy();
                this.backgroundPageShape = null;
            }

            this.validateBackgroundStyles();
        }
    };

    // Updates the CSS of the background to draw the grid
    mxGraphView.validateBackgroundStyles = function() {
        var graph = this.graph;
        var color = (graph.background == null || graph.background == mxConstants.NONE) ? graph.defaultPageBackgroundColor : graph.background;
        var gridColor = (color != null && this.gridColor != color.toLowerCase()) ? this.gridColor : '#ffffff';
        var image = 'none';
        var position = '';

        if (graph.isGridEnabled()) {
            var phase = 10;

            if (mxClient.IS_SVG) {
                // Generates the SVG required for drawing the dynamic grid
                image = unescape(encodeURIComponent(this.createSvgGrid(gridColor)));
                image = (window.btoa) ? btoa(image) : Base64.encode(image, true);
                image = 'url(' + 'data:image/svg+xml;base64,' + image + ')'
                phase = graph.gridSize * this.scale * this.gridSteps;
            } else {
                // Fallback to grid wallpaper with fixed size
                image = 'url(' + this.gridImage + ')';
            }

            var x0 = 0;
            var y0 = 0;

            if (graph.view.backgroundPageShape != null) {
                var bds = this.getBackgroundPageBounds();

                x0 = 1 + bds.x;
                y0 = 1 + bds.y;
            }

            // Computes the offset to maintain origin for grid
            position = -Math.round(phase - mxUtils.mod(this.translate.x * this.scale - x0, phase)) + 'px ' +
                -Math.round(phase - mxUtils.mod(this.translate.y * this.scale - y0, phase)) + 'px';
        }

        var canvas = graph.view.canvas;

        if (canvas.ownerSVGElement != null) {
            canvas = canvas.ownerSVGElement;
        }

        if (graph.view.backgroundPageShape != null) {
            graph.view.backgroundPageShape.node.style.backgroundPosition = position;
            graph.view.backgroundPageShape.node.style.backgroundImage = image;
            graph.view.backgroundPageShape.node.style.backgroundColor = color;
            graph.container.className = 'geDiagramContainer geDiagramBackdrop';
            canvas.style.backgroundImage = 'none';
            canvas.style.backgroundColor = '';
        } else {
            graph.container.className = 'geDiagramContainer';
            canvas.style.backgroundPosition = position;
            canvas.style.backgroundColor = color;
            canvas.style.backgroundImage = image;
        }
    };

    // Returns the SVG required for painting the background grid.
    mxGraphView.createSvgGrid = function(color) {
        var tmp = this.graph.gridSize * this.scale;

        while (tmp < this.minGridSize) {
            tmp *= 2;
        }

        var tmp2 = this.gridSteps * tmp;

        // Small grid lines
        var d = [];

        for (var i = 1; i < this.gridSteps; i++) {
            var tmp3 = i * tmp;
            d.push('M 0 ' + tmp3 + ' L ' + tmp2 + ' ' + tmp3 + ' M ' + tmp3 + ' 0 L ' + tmp3 + ' ' + tmp2);
        }

        // KNOWN: Rounding errors for certain scales (eg. 144%, 121% in Chrome, FF and Safari). Workaround
        // in Chrome is to use 100% for the svg size, but this results in blurred grid for large diagrams.
        var size = tmp2;
        var svg = '<svg width="' + size + '" height="' + size + '" xmlns="' + mxConstants.NS_SVG + '">' +
            '<defs><pattern id="grid" width="' + tmp2 + '" height="' + tmp2 + '" patternUnits="userSpaceOnUse">' +
            '<path d="' + d.join(' ') + '" fill="none" stroke="' + color + '" opacity="0.2" stroke-width="1"/>' +
            '<path d="M ' + tmp2 + ' 0 L 0 0 0 ' + tmp2 + '" fill="none" stroke="' + color + '" stroke-width="1"/>' +
            '</pattern></defs><rect width="100%" height="100%" fill="url(#grid)"/></svg>';

        return svg;
    };

    // Adds panning for the grid with no page view and disabled scrollbars
    var mxGraphPanGraph = mxGraph.panGraph;
    mxGraph.panGraph = function(dx, dy) {
        mxGraphPanGraph.apply(this, arguments);

        if (this.shiftPreview1 != null) {
            var canvas = this.view.canvas;

            if (canvas.ownerSVGElement != null) {
                canvas = canvas.ownerSVGElement;
            }

            var phase = this.gridSize * this.view.scale * this.view.gridSteps;
            var position = -Math.round(phase - mxUtils.mod(this.view.translate.x * this.view.scale + dx, phase)) + 'px ' +
                -Math.round(phase - mxUtils.mod(this.view.translate.y * this.view.scale + dy, phase)) + 'px';
            canvas.style.backgroundPosition = position;
        }
    };

    // Draws page breaks only within the page
    mxGraph.updatePageBreaks = function(visible, width, height) {
        var scale = this.view.scale;
        var tr = this.view.translate;
        var fmt = this.pageFormat;
        var ps = scale * this.pageScale;

        var bounds2 = this.view.getBackgroundPageBounds();

        width = bounds2.width;
        height = bounds2.height;
        var bounds = new mxRectangle(scale * tr.x, scale * tr.y, fmt.width * ps, fmt.height * ps);

        // Does not show page breaks if the scale is too small
        visible = visible && Math.min(bounds.width, bounds.height) > this.minPageBreakDist;

        var horizontalCount = (visible) ? Math.ceil(height / bounds.height) - 1 : 0;
        var verticalCount = (visible) ? Math.ceil(width / bounds.width) - 1 : 0;
        var right = bounds2.x + width;
        var bottom = bounds2.y + height;

        if (this.horizontalPageBreaks == null && horizontalCount > 0) {
            this.horizontalPageBreaks = [];
        }

        if (this.verticalPageBreaks == null && verticalCount > 0) {
            this.verticalPageBreaks = [];
        }

        var drawPageBreaks = mxUtils.bind(this, function(breaks) {
            if (breaks != null) {
                var count = (breaks == this.horizontalPageBreaks) ? horizontalCount : verticalCount;

                for (var i = 0; i <= count; i++) {
                    var pts = (breaks == this.horizontalPageBreaks) ? [new mxPoint(Math.round(bounds2.x), Math.round(bounds2.y + (i + 1) * bounds.height)),
                        new mxPoint(Math.round(right), Math.round(bounds2.y + (i + 1) * bounds.height))
                    ] : [new mxPoint(Math.round(bounds2.x + (i + 1) * bounds.width), Math.round(bounds2.y)),
                        new mxPoint(Math.round(bounds2.x + (i + 1) * bounds.width), Math.round(bottom))
                    ];

                    if (breaks[i] != null) {
                        breaks[i].points = pts;
                        breaks[i].redraw();
                    } else {
                        var pageBreak = new mxPolyline(pts, this.pageBreakColor);
                        pageBreak.dialect = this.dialect;
                        pageBreak.isDashed = this.pageBreakDashed;
                        pageBreak.pointerEvents = false;
                        pageBreak.init(this.view.backgroundPane);
                        pageBreak.redraw();

                        breaks[i] = pageBreak;
                    }
                }

                for (var i = count; i < breaks.length; i++) {
                    breaks[i].destroy();
                }

                breaks.splice(count, breaks.length - count);
            }
        });

        drawPageBreaks(this.horizontalPageBreaks);
        drawPageBreaks(this.verticalPageBreaks);
    };

    // Disables removing relative children from parents
    var mxGraphHandlerShouldRemoveCellsFromParent = mxGraphHandler.shouldRemoveCellsFromParent;
    mxGraphHandler.shouldRemoveCellsFromParent = function(parent, cells, evt) {
        for (var i = 0; i < cells.length; i++) {
            if (this.graph.getModel().isVertex(cells[i])) {
                var geo = this.graph.getCellGeometry(cells[i]);

                if (geo != null && geo.relative) {
                    return false;
                }
            }
        }

        return mxGraphHandlerShouldRemoveCellsFromParent.apply(this, arguments);
    };

    // Overrides to ignore hotspot only for target terminal
    var mxConnectionHandlerCreateMarker = mxConnectionHandler.createMarker;
    mxConnectionHandler.createMarker = function() {
        var marker = mxConnectionHandlerCreateMarker.apply(this, arguments);

        marker.intersects = mxUtils.bind(this, function(state, evt) {
            if (this.isConnecting()) {
                return true;
            }

            return mxCellMarker.prototype.intersects.apply(marker, arguments);
        });

        return marker;
    };

    // Creates background page shape
    mxGraphView.createBackgroundPageShape = function(bounds) {
        return new mxRectangleShape(bounds, '#ffffff', this.graph.defaultPageBorderColor);
    };

    // Fits the number of background pages to the graph
    mxGraphView.getBackgroundPageBounds = function() {
        var gb = this.getGraphBounds();

        // Computes unscaled, untranslated graph bounds
        var x = (gb.width > 0) ? gb.x / this.scale - this.translate.x : 0;
        var y = (gb.height > 0) ? gb.y / this.scale - this.translate.y : 0;
        var w = gb.width / this.scale;
        var h = gb.height / this.scale;

        var fmt = this.graph.pageFormat;
        var ps = this.graph.pageScale;

        var pw = fmt.width * ps;
        var ph = fmt.height * ps;

        var x0 = Math.floor(Math.min(0, x) / pw);
        var y0 = Math.floor(Math.min(0, y) / ph);
        var xe = Math.ceil(Math.max(1, x + w) / pw);
        var ye = Math.ceil(Math.max(1, y + h) / ph);

        var rows = xe - x0;
        var cols = ye - y0;

        var bounds = new mxRectangle(this.scale * (this.translate.x + x0 * pw), this.scale *
            (this.translate.y + y0 * ph), this.scale * rows * pw, this.scale * cols * ph);

        return bounds;
    };

    // Add panning for background page in VML
    var graphPanGraph = mxGraph.panGraph;
    mxGraph.panGraph = function(dx, dy) {
        graphPanGraph.apply(this, arguments);

        if ((this.dialect != mxConstants.DIALECT_SVG && this.view.backgroundPageShape != null) &&
            (!this.useScrollbarsForPanning || !mxUtils.hasScrollbars(this.container))) {
            this.view.backgroundPageShape.node.style.marginLeft = dx + 'px';
            this.view.backgroundPageShape.node.style.marginTop = dy + 'px';
        }
    };

    /**
     * Consumes click events for disabled menu items.
     */
    var mxPopupMenuAddItem = mxPopupMenu.addItem;
    mxPopupMenu.addItem = function(title, image, funct, parent, iconCls, enabled) {
        var result = mxPopupMenuAddItem.apply(this, arguments);

        if (enabled != null && !enabled) {
            mxEvent.addListener(result, 'mousedown', function(evt) {
                mxEvent.consume(evt);
            });
        }

        return result;
    };

    // Selects ancestors before descendants
    var graphHandlerGetInitialCellForEvent = mxGraphHandler.getInitialCellForEvent;
    mxGraphHandler.getInitialCellForEvent = function(me) {
        var model = this.graph.getModel();
        var psel = model.getParent(this.graph.getSelectionCell());
        var cell = graphHandlerGetInitialCellForEvent.apply(this, arguments);
        var parent = model.getParent(cell);

        if (psel == null || (psel != cell && psel != parent)) {
            while (!this.graph.isCellSelected(cell) && !this.graph.isCellSelected(parent) &&
                model.isVertex(parent) && !this.graph.isContainer(parent)) {
                cell = parent;
                parent = this.graph.getModel().getParent(cell);
            }
        }

        return cell;
    };

    // Selection is delayed to mouseup if ancestor is selected
    var graphHandlerIsDelayedSelection = mxGraphHandler.isDelayedSelection;
    mxGraphHandler.isDelayedSelection = function(cell, me) {
        var result = graphHandlerIsDelayedSelection.apply(this, arguments);

        if (!result) {
            var model = this.graph.getModel();
            var parent = model.getParent(cell);

            while (parent != null) {
                // Inconsistency for unselected parent swimlane is intended for easier moving
                // of stack layouts where the container title section is too far away
                if (this.graph.isCellSelected(parent) && model.isVertex(parent)) {
                    result = true;
                    break;
                }

                parent = model.getParent(parent);
            }
        }

        return result;
    };

    // Delayed selection of parent group
    mxGraphHandler.selectDelayed = function(me) {
        if (!this.graph.popupMenuHandler.isPopupTrigger(me)) {
            var cell = me.getCell();

            if (cell == null) {
                cell = this.cell;
            }

            // Selects folded cell for hit on folding icon
            var state = this.graph.view.getState(cell)

            if (state != null && me.isSource(state.control)) {
                this.graph.selectCellForEvent(cell, me.getEvent());
            } else {
                var model = this.graph.getModel();
                var parent = model.getParent(cell);

                while (!this.graph.isCellSelected(parent) && model.isVertex(parent)) {
                    cell = parent;
                    parent = model.getParent(cell);
                }

                this.graph.selectCellForEvent(cell, me.getEvent());
            }
        }
    };

    // Returns last selected ancestor
    mxPopupMenuHandler.getCellForPopupEvent = function(me) {
        var cell = me.getCell();
        var model = this.graph.getModel();
        var parent = model.getParent(cell);

        while (model.isVertex(parent) && !this.graph.isContainer(parent)) {
            if (this.graph.isCellSelected(parent)) {
                cell = parent;
            }

            parent = model.getParent(parent);
        }

        return cell;
    };


};