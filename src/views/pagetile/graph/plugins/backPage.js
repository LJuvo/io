import mxgraph from "../index"
const {
    mxPoint,
    mxRectangle,
    mxRectangleShape,
    mxEvent,
    mxUtils,
    mxConstants,
    mxPolyline,
} = mxgraph;

const minGridSize = 4,
    gridSteps = 4,
    gridImage =
    "data:image/gif;base64,R0lGODlhCgAKAJEAAAAAAP///8zMzP///yH5BAEAAAMALAAAAAAKAAoAAAIJ1I6py+0Po2wFADs=",
    gridBasicColor = "#e0e0e0";
export default graph => {

    // Updates the CSS of the background to draw the grid
    graph.view.validateBackgroundStyles = function() {
        var color = (graph.background == null || graph.background == mxConstants.NONE) ? graph.defaultPageBackgroundColor : graph.background;
        var gridColor = (color != null && gridBasicColor != color.toLowerCase()) ? gridBasicColor : '#ffffff';
        var image = 'none';
        var position = '';

        if (graph.isGridEnabled()) {
            var phase = 10;

            if (mxgraph.IS_SVG) {
                // Generates the SVG required for drawing the dynamic grid
                image = unescape(encodeURIComponent(graph.view.createSvgGrid(gridColor)));
                image = (window.btoa) ? btoa(image) : Base64.encode(image, true);
                image = 'url(' + 'data:image/svg+xml;base64,' + image + ')'
                phase = graph.gridSize * graph.view.scale * this.gridSteps;
            } else {
                // Fallback to grid wallpaper with fixed size
                image = 'url(' + gridImage + ')';
            }

            var x0 = 0;
            var y0 = 0;

            if (graph.view.backgroundPageShape != null) {
                var bds = graph.view.getBackgroundPageBounds();

                x0 = 1 + bds.x;
                y0 = 1 + bds.y;
            }

            // Computes the offset to maintain origin for grid
            position = -Math.round(phase - mxUtils.mod(graph.view.translate.x * graph.view.scale - x0, phase)) + 'px ' +
                -Math.round(phase - mxUtils.mod(graph.view.translate.y * graph.view.scale - y0, phase)) + 'px';
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

    // Uses HTML for background pages (to support grid background image)
    graph.view.validateBackgroundPage = function() {
        console.log(graph.pageVisible);
        if (graph.container != null && !graph.transparentBackground) {
            if (graph.pageVisible) {
                var bounds = graph.view.getBackgroundPageBounds();

                if (graph.view.backgroundPageShape == null) {
                    // Finds first element in graph container
                    var firstChild = graph.container.firstChild;

                    while (firstChild != null && firstChild.nodeType != mxConstants.NODETYPE_ELEMENT) {
                        firstChild = firstChild.nextSibling;
                    }

                    if (firstChild != null) {
                        graph.view.backgroundPageShape = graph.view.createBackgroundPageShape(bounds);
                        graph.view.backgroundPageShape.scale = 1;

                        // Shadow filter causes problems in outline window in quirks mode. IE8 standards
                        // also has known rendering issues inside mxWindow but not using shadow is worse.
                        graph.view.backgroundPageShape.isShadow = !mxgraph.IS_QUIRKS;
                        graph.view.backgroundPageShape.dialect = mxConstants.DIALECT_STRICTHTML;
                        graph.view.backgroundPageShape.init(graph.container);

                        // Required for the browser to render the background page in correct order
                        firstChild.style.position = 'absolute';
                        graph.container.insertBefore(graph.view.backgroundPageShape.node, firstChild);
                        graph.view.backgroundPageShape.redraw();

                        graph.view.backgroundPageShape.node.className = 'geBackgroundPage';

                        // Adds listener for double click handling on background
                        mxEvent.addListener(graph.view.backgroundPageShape.node, 'dblclick',
                            mxUtils.bind(this, function(evt) {
                                graph.dblClick(evt);
                            })
                        );

                        // Adds basic listeners for graph event dispatching outside of the
                        // container and finishing the handling of a single gesture
                        mxEvent.addGestureListeners(graph.view.backgroundPageShape.node,
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
                    graph.view.backgroundPageShape.scale = 1;
                    graph.view.backgroundPageShape.bounds = bounds;
                    graph.view.backgroundPageShape.redraw();
                }
            } else if (graph.view.backgroundPageShape != null) {
                graph.view.backgroundPageShape.destroy();
                graph.view.backgroundPageShape = null;
            }

            graph.view.validateBackgroundStyles()
        }
    };


    // Returns the SVG required for painting the background grid.
    graph.view.createSvgGrid = function(color) {
        var tmp = graph.gridSize * graph.view.scale;

        while (tmp < minGridSize) {
            tmp *= 2;
        }

        var tmp2 = gridSteps * tmp;

        // Small grid lines
        var d = [];

        for (var i = 1; i < gridSteps; i++) {
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
    var mxGraphPanGraph = graph.panGraph;
    graph.panGraph = function(dx, dy) {
        mxGraphPanGraph.apply(graph, arguments);

        if (graph.view.shiftPreview1 != null) {
            var canvas = graph.view.canvas;

            if (canvas.ownerSVGElement != null) {
                canvas = canvas.ownerSVGElement;
            }

            var phase = graph.gridSize * graph.view.scale * graph.view.gridSteps;
            var position = -Math.round(phase - mxUtils.mod(graph.view.translate.x * graph.view.scale + dx, phase)) + 'px ' +
                -Math.round(phase - mxUtils.mod(graph.view.translate.y * graph.view.scale + dy, phase)) + 'px';
            canvas.style.backgroundPosition = position;
        }
    };

    // Draws page breaks only within the page
    graph.updatePageBreaks = function(visible, width, height) {
        var scale = graph.view.scale;
        var tr = graph.view.translate;
        var fmt = graph.pageFormat;
        var ps = scale * graph.pageScale;

        var bounds2 = graph.view.getBackgroundPageBounds();

        width = bounds2.width;
        height = bounds2.height;
        var bounds = new mxRectangle(scale * tr.x, scale * tr.y, fmt.width * ps, fmt.height * ps);

        // Does not show page breaks if the scale is too small
        visible = visible && Math.min(bounds.width, bounds.height) > graph.minPageBreakDist;

        var horizontalCount = (visible) ? Math.ceil(height / bounds.height) - 1 : 0;
        var verticalCount = (visible) ? Math.ceil(width / bounds.width) - 1 : 0;
        var right = bounds2.x + width;
        var bottom = bounds2.y + height;

        if (graph.horizontalPageBreaks == null && horizontalCount > 0) {
            graph.horizontalPageBreaks = [];
        }

        if (graph.verticalPageBreaks == null && verticalCount > 0) {
            graph.verticalPageBreaks = [];
        }

        var drawPageBreaks = mxUtils.bind(graph, function(breaks) {
            if (breaks != null) {
                var count = (breaks == graph.horizontalPageBreaks) ? horizontalCount : verticalCount;

                for (var i = 0; i <= count; i++) {
                    var pts = (breaks == graph.horizontalPageBreaks) ? [new mxPoint(Math.round(bounds2.x), Math.round(bounds2.y + (i + 1) * bounds.height)),
                        new mxPoint(Math.round(right), Math.round(bounds2.y + (i + 1) * bounds.height))
                    ] : [new mxPoint(Math.round(bounds2.x + (i + 1) * bounds.width), Math.round(bounds2.y)),
                        new mxPoint(Math.round(bounds2.x + (i + 1) * bounds.width), Math.round(bottom))
                    ];

                    if (breaks[i] != null) {
                        breaks[i].points = pts;
                        breaks[i].redraw();
                    } else {
                        var pageBreak = new mxPolyline(pts, graph.pageBreakColor);
                        pageBreak.dialect = graph.dialect;
                        pageBreak.isDashed = graph.pageBreakDashed;
                        pageBreak.pointerEvents = false;
                        pageBreak.init(graph.view.backgroundPane);
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

        drawPageBreaks(graph.horizontalPageBreaks);
        drawPageBreaks(graph.verticalPageBreaks);
    };

    // // Disables removing relative children from parents
    // var mxGraphHandlerShouldRemoveCellsFromParent = graph.handler.shouldRemoveCellsFromParent;
    // mxGraphHandler.shouldRemoveCellsFromParent = function(parent, cells, evt) {
    //     for (var i = 0; i < cells.length; i++) {
    //         if (graph.getModel().isVertex(cells[i])) {
    //             var geo = graph.getCellGeometry(cells[i]);

    //             if (geo != null && geo.relative) {
    //                 return false;
    //             }
    //         }
    //     }

    //     return mxGraphHandlerShouldRemoveCellsFromParent.apply(this, arguments);
    // };

    // // Overrides to ignore hotspot only for target terminal
    // var mxConnectionHandlerCreateMarker = mxConnectionHandler.createMarker;
    // mxConnectionHandler.createMarker = function() {
    //     var marker = mxConnectionHandlerCreateMarker.apply(this, arguments);

    //     marker.intersects = mxUtils.bind(this, function(state, evt) {
    //         if (this.isConnecting()) {
    //             return true;
    //         }

    //         return mxCellMarker.prototype.intersects.apply(marker, arguments);
    //     });

    //     return marker;
    // };

    // // Creates background page shape
    graph.view.createBackgroundPageShape = function(bounds) {
        return new mxRectangleShape(bounds, '#ffffff', graph.defaultPageBorderColor);
    };

    // Fits the number of background pages to the graph
    graph.view.getBackgroundPageBounds = function() {
        var gb = graph.view.getGraphBounds();

        // Computes unscaled, untranslated graph bounds
        var x = (gb.width > 0) ? gb.x / graph.view.scale - graph.view.translate.x : 0;
        var y = (gb.height > 0) ? gb.y / graph.view.scale - graph.view.translate.y : 0;
        var w = gb.width / graph.view.scale;
        var h = gb.height / graph.view.scale;

        var fmt = graph.pageFormat;
        var ps = graph.pageScale;

        var pw = fmt.width * ps;
        var ph = fmt.height * ps;

        var x0 = Math.floor(Math.min(0, x) / pw);
        var y0 = Math.floor(Math.min(0, y) / ph);
        var xe = Math.ceil(Math.max(1, x + w) / pw);
        var ye = Math.ceil(Math.max(1, y + h) / ph);

        var rows = xe - x0;
        var cols = ye - y0;

        var bounds = new mxRectangle(graph.view.scale * (graph.view.translate.x + x0 * pw), graph.view.scale *
            (graph.view.translate.y + y0 * ph), graph.view.scale * rows * pw, graph.view.scale * cols * ph);

        return bounds;
    };


    // Add panning for background page in VML
    var graphPanGraph = graph.panGraph;
    graph.panGraph = function(dx, dy) {
        graphPanGraph.apply(graph, arguments);

        if ((graph.dialect != mxConstants.DIALECT_SVG && graph.view.backgroundPageShape != null) &&
            (!graph.useScrollbarsForPanning || !mxUtils.hasScrollbars(graph.container))) {
            graph.view.backgroundPageShape.node.style.marginLeft = dx + 'px';
            graph.view.backgroundPageShape.node.style.marginTop = dy + 'px';
        }
    };

    // /**
    //  * Consumes click events for disabled menu items.
    //  */
    // var mxPopupMenuAddItem = mxPopupMenu.addItem;
    // mxPopupMenu.addItem = function(title, image, funct, parent, iconCls, enabled) {
    //     var result = mxPopupMenuAddItem.apply(this, arguments);

    //     if (enabled != null && !enabled) {
    //         mxEvent.addListener(result, 'mousedown', function(evt) {
    //             mxEvent.consume(evt);
    //         });
    //     }

    //     return result;
    // };

    // // Selects ancestors before descendants
    // var graphHandlerGetInitialCellForEvent = mxGraphHandler.getInitialCellForEvent;
    // mxGraphHandler.getInitialCellForEvent = function(me) {
    //     var model = this.graph.getModel();
    //     var psel = model.getParent(this.graph.getSelectionCell());
    //     var cell = graphHandlerGetInitialCellForEvent.apply(this, arguments);
    //     var parent = model.getParent(cell);

    //     if (psel == null || (psel != cell && psel != parent)) {
    //         while (!this.graph.isCellSelected(cell) && !this.graph.isCellSelected(parent) &&
    //             model.isVertex(parent) && !this.graph.isContainer(parent)) {
    //             cell = parent;
    //             parent = this.graph.getModel().getParent(cell);
    //         }
    //     }

    //     return cell;
    // };

    // // Selection is delayed to mouseup if ancestor is selected
    // var graphHandlerIsDelayedSelection = mxGraphHandler.isDelayedSelection;
    // mxGraphHandler.isDelayedSelection = function(cell, me) {
    //     var result = graphHandlerIsDelayedSelection.apply(this, arguments);

    //     if (!result) {
    //         var model = this.graph.getModel();
    //         var parent = model.getParent(cell);

    //         while (parent != null) {
    //             // Inconsistency for unselected parent swimlane is intended for easier moving
    //             // of stack layouts where the container title section is too far away
    //             if (this.graph.isCellSelected(parent) && model.isVertex(parent)) {
    //                 result = true;
    //                 break;
    //             }

    //             parent = model.getParent(parent);
    //         }
    //     }

    //     return result;
    // };

    // // Delayed selection of parent group
    // mxGraphHandler.selectDelayed = function(me) {
    //     if (!this.graph.popupMenuHandler.isPopupTrigger(me)) {
    //         var cell = me.getCell();

    //         if (cell == null) {
    //             cell = this.cell;
    //         }

    //         // Selects folded cell for hit on folding icon
    //         var state = this.graph.view.getState(cell)

    //         if (state != null && me.isSource(state.control)) {
    //             this.graph.selectCellForEvent(cell, me.getEvent());
    //         } else {
    //             var model = this.graph.getModel();
    //             var parent = model.getParent(cell);

    //             while (!this.graph.isCellSelected(parent) && model.isVertex(parent)) {
    //                 cell = parent;
    //                 parent = model.getParent(cell);
    //             }

    //             this.graph.selectCellForEvent(cell, me.getEvent());
    //         }
    //     }
    // };

    // // Returns last selected ancestor
    // mxPopupMenuHandler.getCellForPopupEvent = function(me) {
    //     var cell = me.getCell();
    //     var model = this.graph.getModel();
    //     var parent = model.getParent(cell);

    //     while (model.isVertex(parent) && !this.graph.isContainer(parent)) {
    //         if (this.graph.isCellSelected(parent)) {
    //             cell = parent;
    //         }

    //         parent = model.getParent(parent);
    //     }

    //     return cell;
    // };


};