<template>
  <div class="work-wrapper">
    <div class="workspace"></div>
    <div class="work-btn">
      <Button @click="onEndPoint">结束</Button>
      <span :class="{'point-btn':true,'point-active':createState}"></span>
      <div class="svgspace"></div>
    </div>
    <div class="work-property">
      <span>属性设置</span>
      <span>{{ checkedCell.style}}</span>
    </div>
  </div>
</template>

<script>
import Graph from "../graph/EditGraph";
import mxgraph from "../graph/index";
const {
  mxEvent,
  mxCell,
  mxUtils,
  mxCodecRegistry,
  mxGraphModel,
  mxConstants
} = mxgraph;
import * as d3 from "d3";
export default {
  data() {
    return {
      graph: null,

      pointArr: [],
      pointCell: [],

      createState: true,
      firstCell: null,
      checkedCell: null
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    getGraph() {
      return this.graph;
    },
    init() {
      const container = document.querySelector(".workspace");
      const graph = (this.graph = new Graph(container));

      this.$nextTick(() => graph.setBgImg("imgs/25F.svg"));

      function updateStyle(state, hover) {
        if (hover) {
          state.style[mxConstants.STYLE_FILLCOLOR] = "#ff0000";
        }

        state.style[mxConstants.STYLE_ROUNDED] = hover ? "1" : "0";
        state.style[mxConstants.STYLE_STROKEWIDTH] = hover ? "4" : "1";
        state.style[mxConstants.STYLE_FONTSTYLE] = hover
          ? mxConstants.FONT_BOLD
          : "0";
      }

      // Changes fill color to red on mouseover
      graph.addMouseListener({
        currentState: null,
        previousStyle: null,
        mouseDown: function(sender, me) {
          // console.log("mousedown");
          if (this.currentState != null) {
            this.dragLeave(me.getEvent(), this.currentState);
            this.currentState = null;
          }
        },
        mouseMove: function(sender, me) {
          if (this.currentState != null && me.getState() == this.currentState) {
            return;
          }

          var tmp = graph.view.getState(me.getCell());

          // console.log("mouseMove->", me.getCell());

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
        mouseUp: function(sender, me) {
          // console.log("mouseUp->", me.getCell());
        },
        dragEnter: function(evt, state) {
          if (state != null) {
            this.previousStyle = state.style;
            state.style = mxUtils.clone(state.style);
            updateStyle(state, true);
            state.shape.apply(state);
            state.shape.redraw();

            if (state.text != null) {
              state.text.apply(state);
              state.text.redraw();
            }
          }
        },
        dragLeave: function(evt, state) {
          if (state != null) {
            state.style = this.previousStyle;
            updateStyle(state, false);
            state.shape.apply(state);
            state.shape.redraw();

            if (state.text != null) {
              state.text.apply(state);
              state.text.redraw();
            }
          }
        }
      });

      graph.addListener("click", this.onGraphClick);

      graph.addListener("addCells", this.onAddCells);

      // // Creates a user object that stores the state
      // var doc = mxUtils.createXmlDocument();
      // var obj = doc.createElement("UserObject");
      // obj.setAttribute("label", "Hello, World!");
      // obj.setAttribute("checked", "false");

      // // Adds optional caching for the HTML label
      // var cached = true;

      // if (cached) {
      //   // Ignores cached label in codec
      //   mxCodecRegistry.getCodec(mxCell).exclude.push("div");

      //   // Invalidates cached labels
      //   graph.model.setValue = function(cell, value) {
      //     cell.div = null;
      //     mxGraphModel.prototype.setValue.apply(this, arguments);
      //   };
      // }

      // // Overrides method to provide a cell label in the display
      // graph.convertValueToString = function(cell) {
      //   if (cached && cell.div != null) {
      //     // Uses cached label
      //     return cell.div;
      //   } else if (
      //     mxUtils.isNode(cell.value) &&
      //     cell.value.nodeName.toLowerCase() == "userobject"
      //   ) {
      //     // Returns a DOM for the label
      //     var div = document.createElement("div");
      //     div.innerHTML = cell.getAttribute("label");
      //     mxUtils.br(div);

      //     var checkbox = document.createElement("input");
      //     checkbox.setAttribute("type", "checkbox");

      //     if (cell.getAttribute("checked") == "true") {
      //       checkbox.setAttribute("checked", "checked");
      //       checkbox.defaultChecked = true;
      //     }

      //     div.appendChild(checkbox);

      //     if (cached) {
      //       // Caches label
      //       cell.div = div;
      //     }

      //     return div;
      //   }

      //   return "";
      // };

      // // Overrides method to store a cell label in the model
      // var cellLabelChanged = graph.cellLabelChanged;
      // graph.cellLabelChanged = function(cell, newValue, autoSize) {
      //   if (
      //     mxUtils.isNode(cell.value) &&
      //     cell.value.nodeName.toLowerCase() == "userobject"
      //   ) {
      //     // Clones the value for correct undo/redo
      //     var elt = cell.value.cloneNode(true);
      //     elt.setAttribute("label", newValue);
      //     newValue = elt;
      //   }

      //   cellLabelChanged.apply(this, arguments);
      // };

      // // Overrides method to create the editing value
      // var getEditingValue = graph.getEditingValue;
      // graph.getEditingValue = function(cell) {
      //   if (
      //     mxUtils.isNode(cell.value) &&
      //     cell.value.nodeName.toLowerCase() == "userobject"
      //   ) {
      //     return cell.getAttribute("label");
      //   }
      // };

      // var parent = graph.getDefaultParent();
      // graph.insertVertex(parent, null, obj, 20, 20, 80, 60);
    },
    onGraphClick(sender, evt) {
      const cell = evt.getProperty("cell");
      // console.log("TCL: onGraphClick -> cell", cell);
      if (!cell) {
        if (this.createState) {
          this.graph.resetView();
          let x = evt.properties.event.layerX;
          let y = evt.properties.event.layerY;
          this.pointArr.push({ x: x, y: y });
          this.onClearCreate();
        }
      } else {
        // console.log(
        //   "finish ??? ->",
        //   cell.mxObjectId,
        //   this.firstCell.mxObjectId
        // );
        if (
          cell.mxObjectId == this.firstCell.mxObjectId &&
          this.pointArr.length > 2
        )
          this.onEndPoint();

        if (cell.svgState) {
          this.checkedCell = cell;
          console.log(this.checkedCell);
        }
      }
    },
    onClearCreate() {
      let parent = this.graph.getDefaultParent();
      this.graph.removeCells(parent.children);
      this.firstCell = null;

      let lastCell = null;
      this.pointArr.forEach(ele => {
        let layer = parent.insert(new mxCell());
        let currentCell = this.graph.insertVertex(
          layer,
          null,
          "",
          ele.x,
          ele.y,
          5,
          5,
          "border-radius:10px;"
        );
        if (lastCell)
          this.graph.insertEdge(
            layer,
            null,
            "",
            lastCell,
            currentCell,
            "strokeColor=#ff0000"
          );
        lastCell = currentCell;
        if (!this.firstCell) this.firstCell = lastCell;
      });
    },
    onAddCells() {
      // console.log("add cells");
    },
    onEndPoint() {
      let parr = _.cloneDeep(this.pointArr);
      this.createState = !this.createState;

      let parent = this.graph.getDefaultParent();
      this.graph.removeCells(parent.children);

      let minX = _.minBy(parr, "x");
      let maxX = _.maxBy(parr, "x");
      let minY = _.minBy(parr, "y");
      let maxY = _.maxBy(parr, "y");

      parr.push(parr[0]);
      let data = this.createSvgImg(minX.x, maxX.x, minY.y, maxY.y, parr);

      let cell = this.graph.insertVertex(
        null,
        null,
        "",
        minX.x,
        minY.y,
        maxX.x - minX.x,
        maxY.y - minY.y,
        "shape=image;image=" + data + ";"
      );
      cell.svgState = true;

      this.pointArr = [];
      this.clearPaintSpace();
    },
    createSvgImg(minx, maxx, miny, maxy, pointarr) {
      let svgBox = d3
        .select(".svgspace")
        .append("svg")
        .attr("version", 1.1)
        .attr("xmlns", "http://www.w3.org/2000/svg")
        .attr("xmlns:xlink", "http://www.w3.org/1999/xlink")
        .attr("width", maxx - minx + "px")
        .attr("height", maxy - miny + "px")
        .attr("id", "basicsvg");
      let pointTxt = this.pointsArrFac(this.pointCutEmpty(pointarr));
      svgBox
        .append("g")
        .append("polygon")
        .attr("points", pointTxt)
        .attr("fill", "rgba(20,53,77,0.6)")
        .attr("stroke", "#2986b0")
        .attr("stroke-width", 0.5);
      console.log(btoa(mxUtils.getXml(document.getElementById("basicsvg"))));

      let data =
        "data:image/svg+xml," +
        mxUtils.getXml(document.getElementById("basicsvg"));

      return data;
    },
    pointCutEmpty(arr) {
      let minTmpX = _.minBy(arr, "x");
      let minTmpY = _.minBy(arr, "y");
      let tmp = [];
      for (let i = 0; i < arr.length; i++) {
        tmp.push({
          x: arr[i].x - minTmpX.x,
          y: arr[i].y - minTmpY.y
        });
      }
      return tmp;
    },
    clearPaintSpace() {
      d3.select(".svgspace")
        .selectAll("svg")
        .remove();
    },
    pointsArrFac(arr) {
      let txt = "";
      arr.forEach(ele => {
        let { x, y } = ele;
        txt += x + "," + y + " ";
      });
      return txt;
    }
  }
};
</script>

<style lang="less" scoped>
.work-wrapper {
  width: 100%;
  height: 100%;
  padding: 20px;
  overflow: hidden;
}
.workspace {
  width: 100%;
  height: 100%;
  border: 1px solid #efefef;
  background: url("./grid.gif");
}
.work-btn {
  position: absolute;
  top: 0;
  left: 0;
}
.point {
  &-btn {
    display: block;
    width: 10px;
    height: 10px;
    border-radius: 20px;
    background: #cccccc;
  }
  &-active {
    background: #48ff00;
  }
}
.work-property {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 200px;
  padding: 10px;
  background: rgba(0, 0, 0, 0.4);
}
</style>

