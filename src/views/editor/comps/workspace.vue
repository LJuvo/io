<template>
  <div class="work-wrapper">
    <div class="workspace"></div>
    <div class="work-btn">
      <Button @click="onEndPoint">结束</Button>
      <span :class="{'point-btn':true,'point-active':createState}"></span>
    </div>
  </div>
</template>

<script>
import Graph from "../graph/EditGraph";
import mxgraph from "../graph/index";
const { mxEvent, mxCell, mxUtils, mxCodecRegistry, mxGraphModel } = mxgraph;
import * as d3 from "d3";
export default {
  data() {
    return {
      graph: null,

      pointArr: [],
      pointCell: [],

      createState: true
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

      graph.addListener("click", this.onGraphClick);

      graph.addListener("addCells", this.onAddCells);

      // Creates a user object that stores the state
      var doc = mxUtils.createXmlDocument();
      var obj = doc.createElement("UserObject");
      obj.setAttribute("label", "Hello, World!");
      obj.setAttribute("checked", "false");

      // Adds optional caching for the HTML label
      var cached = true;

      if (cached) {
        // Ignores cached label in codec
        mxCodecRegistry.getCodec(mxCell).exclude.push("div");

        // Invalidates cached labels
        graph.model.setValue = function(cell, value) {
          cell.div = null;
          mxGraphModel.prototype.setValue.apply(this, arguments);
        };
      }

      // Overrides method to provide a cell label in the display
      graph.convertValueToString = function(cell) {
        if (cached && cell.div != null) {
          // Uses cached label
          return cell.div;
        } else if (
          mxUtils.isNode(cell.value) &&
          cell.value.nodeName.toLowerCase() == "userobject"
        ) {
          // Returns a DOM for the label
          var div = document.createElement("div");
          div.innerHTML = cell.getAttribute("label");
          mxUtils.br(div);

          var checkbox = document.createElement("input");
          checkbox.setAttribute("type", "checkbox");

          if (cell.getAttribute("checked") == "true") {
            checkbox.setAttribute("checked", "checked");
            checkbox.defaultChecked = true;
          }

          div.appendChild(checkbox);

          if (cached) {
            // Caches label
            cell.div = div;
          }

          return div;
        }

        return "";
      };

      // Overrides method to store a cell label in the model
      var cellLabelChanged = graph.cellLabelChanged;
      graph.cellLabelChanged = function(cell, newValue, autoSize) {
        if (
          mxUtils.isNode(cell.value) &&
          cell.value.nodeName.toLowerCase() == "userobject"
        ) {
          // Clones the value for correct undo/redo
          var elt = cell.value.cloneNode(true);
          elt.setAttribute("label", newValue);
          newValue = elt;
        }

        cellLabelChanged.apply(this, arguments);
      };

      // Overrides method to create the editing value
      var getEditingValue = graph.getEditingValue;
      graph.getEditingValue = function(cell) {
        if (
          mxUtils.isNode(cell.value) &&
          cell.value.nodeName.toLowerCase() == "userobject"
        ) {
          return cell.getAttribute("label");
        }
      };

      var parent = graph.getDefaultParent();
      graph.insertVertex(parent, null, obj, 20, 20, 80, 60);
    },
    onGraphClick(sender, evt) {
      if (this.createState) {
        console.log("TCL: onGraphClick -> cell", sender, evt);
        let x = evt.properties.event.layerX;
        let y = evt.properties.event.layerY;
        console.log("x:", x, "  y:", y);
        this.pointArr.push({ x: x, y: y });
        this.onClearCreate();
      }
    },
    onClearCreate() {
      let parent = this.graph.getDefaultParent();
      this.graph.removeCells(parent.children);

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
      });
    },
    onAddCells() {
      console.log("add cells");
    },
    onEndPoint() {
      console.log(this.pointArr);
      this.createState = !this.createState;

      let parent = this.graph.getDefaultParent();
      this.graph.removeCells(parent.children);

      let svgBox = d3.select("svg");
      let eleBox = svgBox.append("g");
      eleBox
        .append("polygon")
        .attr("points", this.pointsArrFac(this.pointArr))
        .attr("fill", "rgba(20,53,77,0.6)")
        .attr("stroke", "#2986b0")
        .attr("stroke-width", 0.5);

      console.log(eleBox);

      // let backSvg =

      let w = 100;
      let h = 100;

      let data = "data:image/svg+xml," + btoa(eleBox);
      this.graph.insertVertex(
        null,
        null,
        "",
        0,
        0,
        w,
        h,
        "shape=image;image=" + data + ";"
      );

      this.pointArr = [];
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
</style>

