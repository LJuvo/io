<template>
  <div class="basic-pane">
    <div class="graphbox"></div>
  </div>
</template>
<script>
import {
  mxGraph,
  mxVertexHandler,
  mxConstants,
  mxCellState
} from "mxgraph/javascript/mxClient";
// import mxgraph from "./graph";
// const { mxGraph, mxVertexHandler, mxConstants, mxCellState } = mxgraph;
export default {
  props: {},
  components: {},
  data() {
    return {};
  },
  mounted() {
    const container = document.querySelector(".graphbox");
    var graph = new mxGraph(container);

    var parent = graph.getDefaultParent();

    // Adds cells to the model in a single step
    graph.getModel().beginUpdate();
    try {
      let v1 = graph.insertVertex(parent, null, "Hello,", 20, 20, 80, 30);
      let v2 = graph.insertVertex(parent, null, "World!", 200, 150, 80, 30);
      let v3 = graph.insertVertex(parent, null, "World!", 20, 150, 180, 30);

      graph.insertEdge(parent, null, "", v1, v2, v3);
    } finally {
      // Updates the display
      graph.getModel().endUpdate();
    }

    mxGraph.prototype.insertVertex = function(
      parent,
      id,
      value,
      x,
      y,
      width,
      height,
      style,
      relative
    ) {
      // 设置 Cell 尺寸及位置信息
      var geometry = new mxGeometry(x, y, width, height);
      geometry.relative = relative != null ? relative : false;

      // 创建一个 Cell
      var vertex = new mxCell(value, geometry, style);
      // ...
      // 标识这个 Cell 是一个节点
      vertex.setVertex(true);
      // ...

      // 在画布上添加这个 Cell
      return this.addCell(vertex, parent);
    };
  },
  methods: {}
};
</script>
<style lang='less' scoped>
.basic-pane {
  width: 100%;
  height: 100%;
  background: #ffffff;
  overflow: hidden;
  overflow-y: auto;
}
</style>