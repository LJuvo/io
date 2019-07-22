<template>
  <div class="basic-pane">
    <graph-preview>
      <template slot="previewBox">
        <div class="graphbox"></div>
      </template>
    </graph-preview>
  </div>
</template>
<script>
import Graph from "../../components/graph/comps/core/EditGraph";
import mxgraph from "../../components/graph/comps/core/index.js";
const {
  mxOutline,
  mxUtils,
  mxConstants,
  mxRubberband,
  mxUndoManager,
  mxGraphModel
} = mxgraph;
export default {
  props: {},
  components: {
    GraphPreview: () => import("../../components/graph/index")
  },
  data() {
    return {};
  },
  mounted() {
    // const container = document.querySelector(".graphbox");
    // var graph = new Graph(container);
    // var parent = graph.getDefaultParent();
    // // Adds cells to the model in a single step
    // graph.getModel().beginUpdate();
    // try {
    //   let v1 = graph.insertVertex(parent, null, "Hello,", 20, 20, 80, 30);
    //   let v2 = graph.insertVertex(parent, null, "World!", 200, 150, 80, 30);
    //   let v3 = graph.insertVertex(parent, null, "World!", 20, 150, 180, 30);
    //   graph.insertEdge(parent, "", "", v1, v2, v3);
    // } finally {
    //   // Updates the display
    //   graph.getModel().endUpdate();
    // }
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