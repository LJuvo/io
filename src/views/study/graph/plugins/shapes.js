import mxgraph from "../index.js";
const { mxCellRenderer, mxArrowConnector, mxUtils, mxRectangleShape } = mxgraph;

// Link shape
function FixDevice() {
    mxRectangleShape.call(this);
    this.spacing = 0;
    this.fill = "red";
}
mxUtils.extend(FixDevice, mxRectangleShape);
FixDevice.prototype.constraints = null;
// Registers the link shape
mxCellRenderer.registerShape("fixDevice", FixDevice);

// Link shape
function LinkShape() {
    mxArrowConnector.call(this);
    this.spacing = 0;
    this.fill = "red";
}
mxUtils.extend(LinkShape, mxArrowConnector);
LinkShape.prototype.defaultWidth = 8;

LinkShape.prototype.isOpenEnded = function() {
    return true;
};

LinkShape.prototype.getEdgeWidth = function() {
    return (
        mxUtils.getNumber(this.style, "width", this.defaultWidth) +
        Math.max(0, this.strokewidth - 4)
    );
};

LinkShape.prototype.isArrowRounded = function() {
    return this.isRounded;
};

// Registers the link shape
mxCellRenderer.registerShape("link", LinkShape);